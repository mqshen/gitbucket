package app

import java.util.Date

import jp.sf.amateras.scalatra.forms._
import kafka.GitbucketProducer
import org.scalatra.servlet.ScalatraAsyncSupport

import service._
import IssuesService._
import util._
import util.Implicits._
import util.ControlUtil._
import org.scalatra.Ok
import model.Issue
import view.helpers

class IssuesController extends IssuesControllerBase
  with IssuesService with RepositoryService with AccountService with LabelsService with MilestonesService with ActivityService
  with ReadableUsersAuthenticator with ReferrerAuthenticator with CollaboratorsAuthenticator with ScalatraAsyncSupport

trait IssuesControllerBase extends ControllerBase {
  self: IssuesService with RepositoryService with AccountService with LabelsService with MilestonesService with ActivityService
    with ReadableUsersAuthenticator with ReferrerAuthenticator with CollaboratorsAuthenticator =>

  case class IssueCreateForm(title: String, content: Option[String],
    assignedUserName: Option[String], milestoneId: Option[Int], labelNames: List[String])
  case class CommentForm(issueId: Int, content: Option[String], operation: Option[String])
  case class IssueStateForm(issueId: Int, content: Option[String])
  case class AssignForm(issueId: Int, labels: List[Int])
  case class MilestoneForm(issueId: Int, milestoneId: Int)
  case class AssigneeForm(assignee: Option[String])
  case class CommentEditForm(content: Option[String])
  case class FilterForm(partial: String, q: String)

  val issueCreateForm = mapping(
      "title"            -> trim(label("Title", text(required))),
      "content"          -> trim(optional(text())),
      "assignedUserName" -> trim(optional(text())),
      "milestoneId"      -> trim(optional(number())),
      "labelNames"       -> list(trim(text()))
    )(IssueCreateForm.apply)

  val issueTitleEditForm = mapping(
    "title" -> trim(label("Title", text(required)))
    )(x => x)

  val issueEditForm = mapping(
    "content" -> trim(optional(text()))
    )(x => x)

  val commentForm = mapping(
      "issueId" -> label("Issue Id", number()),
      "content" -> trim(optional(text())),
      "operation" -> trim(optional(text()))
    )(CommentForm.apply)

  val commentEditForm = mapping(
    "content" -> trim(optional(text()))
  )(CommentEditForm.apply)

  val assignForm = mapping(
    "issueId" -> number(),
    "labels" -> list(number())
  )(AssignForm.apply)

  val milestoneForm = mapping(
    "issueId" -> number(),
    "milestoneId" -> number()
  )(MilestoneForm.apply)

  val assigneeForm = mapping(
    "assignee" -> trim(optional(text()))
  )(AssigneeForm.apply)

  val filterForm = mapping(
    "partial" -> trim(text()),
    "q" -> trim(text())
  )(FilterForm.apply)

  val issueStateForm = mapping(
      "issueId" -> label("Issue Id", number()),
      "content" -> trim(optional(text()))
    )(IssueStateForm.apply)

  get("/:owner/:repository/issues")(referrersOnly { repository =>
    val q = request.getParameter("q")
    if(Option(q).exists(_.contains("is:pr"))){
      redirect(s"/${repository.owner}/${repository.name}/pulls?q=" + StringUtil.urlEncode(q))
    } else {
      searchIssues(repository)
    }
  })

  get("/:owner/:repository/issues/:id")(referrersOnly { repository =>
    defining(repository.owner, repository.name, params("id")){ case (owner, name, issueId) =>
      getIssue(owner, name, issueId) map {
        issues.html.issue(
          _,
          getComments(owner, name, issueId.toInt),
          getIssueLabels(owner, name, issueId.toInt),
          (getCollaborators(owner, name) ::: (if(getAccountByUserName(owner).get.isGroupAccount) Nil else List(owner))).sorted,
          getMilestonesWithIssueCount(owner, name),
          getLabels(owner, name),
          hasWritePermission(owner, name, context.loginAccount),
          repository)
      } getOrElse NotFound
    }
  })


  get("/:owner/:repository/issues/:id/show_partial")(referrersOnly { repository =>
    defining(repository.owner, repository.name, params("id")){ case (owner, name, issueId) =>
      getIssue(owner, name, issueId) map { issue =>
        contentType = formats("html")
        params("partial") match {
          case "title" =>
            val count = getCommentsCount(owner, name, issueId.toInt)
            issues.html.issueTitle(issue, count, repository)
          case "discussion_stats" =>
            helpers.dataChannel("partial-discussion-stats", issue, repository)
          case "timeline_marker" =>
            val sinceLong = params("since").toLong
            val since = new Date(sinceLong)
            issues.html.commentListSince(issue, getCommentsSince(owner, name, issueId.toInt, since), sinceLong, hasWritePermission(owner, name, context.loginAccount), repository)
          case "participants" =>
            issues.html.participants(issue, getComments(owner, name, issueId.toInt), repository)

        }
//        issues.html.issue(
//          _,
//          getComments(owner, name, issueId.toInt),
//          getIssueLabels(owner, name, issueId.toInt),
//          (getCollaborators(owner, name) ::: (if(getAccountByUserName(owner).get.isGroupAccount) Nil else List(owner))).sorted,
//          getMilestonesWithIssueCount(owner, name),
//          getLabels(owner, name),
//          hasWritePermission(owner, name, context.loginAccount),
//          repository)
      } getOrElse NotFound
    }
  })

  get("/:owner/:repository/issues/new")(readableUsersOnly { repository =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      issues.html.create(
        (getCollaborators(owner, name) ::: (if(getAccountByUserName(owner).get.isGroupAccount) Nil else List(owner))).sorted,
          getMilestones(owner, name),
          getLabels(owner, name),
          hasWritePermission(owner, name, context.loginAccount),
          repository)
    }
  })

  post("/:owner/:repository/issues/new", issueCreateForm)(readableUsersOnly { (form, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      val writable = hasWritePermission(owner, name, context.loginAccount)
      val userName = context.loginAccount.get.userName

      // insert issue
      val issueId = createIssue(owner, name, userName, form.title, form.content,
        if(writable) form.assignedUserName else None,
        if(writable) form.milestoneId else None)

      // insert labels
      if(writable){
        val labels = getLabels(owner, name)
        form.labelNames.map { labelName =>
            labels.find(_.labelName == labelName).map { label =>
              registerIssueLabel(owner, name, issueId, label.labelId)
            }
        }
      }

      // record activity
      recordCreateIssueActivity(owner, name, userName, issueId, form.title)

      // extract references and create refer comment
      getIssue(owner, name, issueId.toString).foreach { issue =>
        createReferComment(owner, name, issue, form.title + " " + form.content.getOrElse(""))
      }

      // notifications
      Notifier().toNotify(repository, issueId, form.content.getOrElse("")){
        Notifier.msgIssue(s"${context.baseUrl}/${owner}/${name}/issues/${issueId}")
      }

      redirect(s"/${owner}/${name}/issues/${issueId}")
    }
  })

  ajaxPost("/:owner/:repository/issues/edit_title/:id", issueTitleEditForm)(readableUsersOnly { (title, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getIssue(owner, name, params("id")).map { issue =>
        if(isEditable(owner, name, issue.openedUserName)){
          // update issue
          updateIssue(owner, name, issue.issueId, title, issue.content)
          // extract references and create refer comment
          createReferComment(owner, name, issue.copy(title = title), title)

          redirect(s"/${owner}/${name}/issues/_data/${issue.issueId}")
        } else Unauthorized
      } getOrElse NotFound
    }
  })

  ajaxPost("/:owner/:repository/issues/edit/:id", issueEditForm)(readableUsersOnly { (content, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getIssue(owner, name, params("id")).map { issue =>
        if(isEditable(owner, name, issue.openedUserName)){
          // update issue
          updateIssue(owner, name, issue.issueId, issue.title, content)
          // extract references and create refer comment
          createReferComment(owner, name, issue, content.getOrElse(""))

          redirect(s"/${owner}/${name}/issues/_data/${issue.issueId}")
        } else Unauthorized
      } getOrElse NotFound
    }
  })

  ajaxPost("/:owner/:repository/issue_comments", commentForm)(readableUsersOnly { (form, repository) =>
    handleComment(form.issueId, form.content, repository)() map { case (oldIssue, (id, issueComment, operation)) =>
      val lastUpdateTime = oldIssue.updatedDate
      getIssue(repository.owner, repository.name, oldIssue.issueId.toString).map { issue =>

        val timestamp = new Date()
        //GitbucketProducer.produceIssues(repository.owner, repository.name, form.issueId, timestamp)

        contentType = formats("json")
        val hasWrite = hasWritePermission(repository.owner, repository.name, context.loginAccount)
        val item = issues.html.commentItem(issue, issueComment, hasWrite, repository, None, true)
        val participants = issues.html.participants(issue, getComments(repository.owner, repository.name, issue.issueId), repository)
        val buttons = issues.html.commentButton(issue, true, hasWrite, repository)
        val content = Map(s"#partial-timeline-marker[data-last-modified='${lastUpdateTime}']" -> item.toString,
          "#partial-users-participants" -> participants.toString,
          "#partial-discussion-stats" -> view.helpers.dataChannel("partial-discussion-stats", issue, repository).toString,
          "#partial-new-comment-form-actions" -> buttons.toString
        )
        org.json4s.jackson.Serialization.write(
          Map("updateContent" -> content
          ))
      } getOrElse NotFound
    } getOrElse NotFound
  })

  post("/:owner/:repository/issue_comments/new", commentForm)(readableUsersOnly { (form, repository) =>
    handleComment(form.issueId, form.content, repository)() map { case (issue, id) =>
      redirect(s"/${repository.owner}/${repository.name}/${
        if(issue.isPullRequest) "pull" else "issues"}/${form.issueId}#comment-${id}")
    } getOrElse NotFound
  })

  post("/:owner/:repository/issue_comments/state", issueStateForm)(readableUsersOnly { (form, repository) =>
    handleComment(form.issueId, form.content, repository)() map { case (issue, id) =>
      redirect(s"/${repository.owner}/${repository.name}/${
        if(issue.isPullRequest) "pull" else "issues"}/${form.issueId}#comment-${id}")
    } getOrElse NotFound
  })

  ajaxPost("/:owner/:repository/issue_comments/:id", commentEditForm)(readableUsersOnly { (form, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getComment(owner, name, params("id")).map { comment =>
        if(isEditable(owner, name, comment.commentedUserName)){
          form.content.map(updateComment(comment.commentId, _))
          contentType = formats("json")
          org.json4s.jackson.Serialization.write(
            Map("body" -> view.Markdown.toHtml(form.content.getOrElse(""), repository, false, true, true, false),
            "newBodyVersion" -> comment.updatedDate
            )
          )
        } else Unauthorized
      } getOrElse NotFound
    }
  })

  ajaxPost("/:owner/:repository/issue_comments/delete/:id")(readableUsersOnly { repository =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getComment(owner, name, params("id")).map { comment =>
        if(isEditable(owner, name, comment.commentedUserName)){
          Ok(deleteComment(comment.commentId))
        } else Unauthorized
      } getOrElse NotFound
    }
  })


  ajaxGet("/:owner/:repository/issues/show_menu_content", filterForm)(referrersOnly { (form, repository) =>
    contentType = formats("html")
    form.partial match {
      case "filters/authors_content" =>
        val users = getCollaborators(repository.owner, repository.name) :+ repository.owner
        issues.html.userFilter(users, form.q, None, repository)
      case "filters/labels_content" =>
        val labels = getLabels(repository.owner, repository.name)
        issues.html.labelFilter(labels, form.q, repository)
      case "filters/milestones_content" =>
        val milestones = getMilestones(repository.owner, repository.name)
        issues.html.milestoneFilter(milestones, form.q, repository)
      case "filters/assigns_content" =>
        val users = getCollaborators(repository.owner, repository.name) :+ repository.owner
        issues.html.assigneeFilter(users, form.q, None, repository)

    }
  })

  ajaxGet("/:owner/:repository/issues/_data/:id")(readableUsersOnly { repository =>
    getIssue(repository.owner, repository.name, params("id")) map { x =>
      if(isEditable(x.userName, x.repositoryName, x.openedUserName)){
        params.get("dataType") collect {
          case t if t == "html" => issues.html.editissue(
              x.content, x.issueId, x.userName, x.repositoryName)
        } getOrElse {
          contentType = formats("json")
          org.json4s.jackson.Serialization.write(
              Map("title"   -> x.title,
                  "content" -> view.Markdown.toHtml(x.content getOrElse "No description given.",
                      repository, false, true, true, isEditable(x.userName, x.repositoryName, x.openedUserName))
              ))
        }
      } else Unauthorized
    } getOrElse NotFound
  })

  ajaxGet("/:owner/:repository/issue_comments/_data/:id")(readableUsersOnly { repository =>
    getComment(repository.owner, repository.name, params("id")) map { x =>
      if(isEditable(x.userName, x.repositoryName, x.commentedUserName)){
        params.get("dataType") collect {
          case t if t == "html" => issues.html.editcomment(
              x.content, x.commentId, x.userName, x.repositoryName)
        } getOrElse {
          contentType = formats("json")
          org.json4s.jackson.Serialization.write(
              Map("content" -> view.Markdown.toHtml(x.content,
                  repository, false, true, true, isEditable(x.userName, x.repositoryName, x.commentedUserName))
              ))
        }
      } else Unauthorized
    } getOrElse NotFound
  })

  ajaxPost("/:owner/:repository/issues/:id/label/new")(collaboratorsOnly { repository =>
    defining(params("id").toInt){ issueId =>
      registerIssueLabel(repository.owner, repository.name, issueId, params("labelId").toInt)
      issues.html.labellist(getIssueLabels(repository.owner, repository.name, issueId))
    }
  })

  def labelHtml(labels: List[model.Label], repository: RepositoryService.RepositoryInfo) = {
    labels.foldLeft("") { case (html, label) =>
      html + s"""<a href="${view.helpers.url(repository)}/labels/${label.labelName}" class="label css-truncate-target linked-labelstyle-${label.color}" title="${label.labelName}">${label.labelName}</a>"""
    }
  }

  ajaxPut("/:owner/:repository/issues/labels/modify_assignment", assignForm)(collaboratorsOnly { (form, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      form.labels.map { labelId =>
        registerIssueLabel(repository.owner, repository.name, form.issueId, labelId)
      }
      val labels = getIssueLabels(repository.owner, repository.name, form.issueId)
      contentType = formats("json")
      org.json4s.jackson.Serialization.write(
        Map(
          "labels" -> labelHtml(labels, repository)
        ))
    }
  })

  ajaxDelete("/:owner/:repository/issues/labels/modify_assignment", assignForm)(collaboratorsOnly { (form, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      form.labels.map { labelId =>
        deleteIssueLabel(repository.owner, repository.name, form.issueId, labelId)
      }
      val labels = getIssueLabels(repository.owner, repository.name, form.issueId)
      contentType = formats("json")
      org.json4s.jackson.Serialization.write(
        Map(
          "labels" -> labelHtml(labels, repository)
        ))
    }
  })

  ajaxPost("/:owner/:repository/milestone", milestoneForm)(collaboratorsOnly { (form, repository) =>
    val milestoneId = if(form.milestoneId == 0) None else Some(form.milestoneId)
    updateMilestoneId(repository.owner, repository.name, form.issueId, milestoneId)
    val milestones = getMilestonesWithIssueCount(repository.owner, repository.name)
    val progress = milestones.find(_._1.milestoneId == form.milestoneId).map { case (milestone, openCount, closeCount) =>
      issues.milestones.html.item(milestone, openCount + closeCount, closeCount, repository)
    } getOrElse("No milestone")
    val list = issues.milestones.html.selector(milestones, form.milestoneId)
    contentType = formats("json")
    org.json4s.jackson.Serialization.write(
      Map(
        "infobar_body" -> progress.toString(),
        "select_menu_body" -> list.toString()
      )
    )
  })

  ajaxPost("/:owner/:repository/issues/:id/assignee", assigneeForm)(collaboratorsOnly { (form, repository) =>
    updateAssignedUserName(repository.owner, repository.name, params("id").toInt, form.assignee)
    contentType = formats("json")
    org.json4s.jackson.Serialization.write(
      Map(
        "re" -> ""
      )
    )
  })

  ajaxPost("/:owner/:repository/issues/:id/label/delete")(collaboratorsOnly { repository =>
    defining(params("id").toInt){ issueId =>
      deleteIssueLabel(repository.owner, repository.name, issueId, params("labelId").toInt)
      issues.html.labellist(getIssueLabels(repository.owner, repository.name, issueId))
    }
  })

  ajaxPost("/:owner/:repository/issues/:id/assign")(collaboratorsOnly { repository =>
    updateAssignedUserName(repository.owner, repository.name, params("id").toInt, assignedUserName("assignedUserName"))
    Ok("updated")
  })

  ajaxPost("/:owner/:repository/issues/:id/milestone")(collaboratorsOnly { repository =>
    updateMilestoneId(repository.owner, repository.name, params("id").toInt, milestoneId("milestoneId"))
    milestoneId("milestoneId").map { milestoneId =>
      getMilestonesWithIssueCount(repository.owner, repository.name)
          .find(_._1.milestoneId == milestoneId).map { case (_, openCount, closeCount) =>
        issues.milestones.html.progress(openCount + closeCount, closeCount)
      } getOrElse NotFound
    } getOrElse Ok()
  })

  post("/:owner/:repository/issues/batchedit/state")(collaboratorsOnly { repository =>
    defining(params.get("value")){ action =>
      action match {
        case Some("open")  => executeBatch(repository) { handleComment(_, None, repository)( _ => Some("reopen")) }
        case Some("close") => executeBatch(repository) { handleComment(_, None, repository)( _ => Some("close"))  }
        case _ => // TODO BadRequest
      }
    }
  })

  post("/:owner/:repository/issues/batchedit/label")(collaboratorsOnly { repository =>
    params("value").toIntOpt.map{ labelId =>
      executeBatch(repository) { issueId =>
        getIssueLabel(repository.owner, repository.name, issueId, labelId) getOrElse {
          registerIssueLabel(repository.owner, repository.name, issueId, labelId)
        }
      }
    } getOrElse NotFound
  })

  post("/:owner/:repository/issues/batchedit/assign")(collaboratorsOnly { repository =>
    defining(assignedUserName("value")){ value =>
      executeBatch(repository) {
        updateAssignedUserName(repository.owner, repository.name, _, value)
      }
    }
  })

  post("/:owner/:repository/issues/batchedit/milestone")(collaboratorsOnly { repository =>
    defining(milestoneId("value")){ value =>
      executeBatch(repository) {
        updateMilestoneId(repository.owner, repository.name, _, value)
      }
    }
  })

  get("/:owner/:repository/_attached/:file")(referrersOnly { repository =>
    (Directory.getAttachedDir(repository.owner, repository.name) match {
      case dir if(dir.exists && dir.isDirectory) =>
        dir.listFiles.find(_.getName.startsWith(params("file") + ".")).map { file =>
          contentType = FileUtil.getMimeType(file.getName)
          file
        }
      case _ => None
    }) getOrElse NotFound
  })

  val assignedUserName = (key: String) => params.get(key) filter (_.trim != "")
  val milestoneId: String => Option[Int] = (key: String) => params.get(key).flatMap(_.toIntOpt)

  private def isEditable(owner: String, repository: String, author: String)(implicit context: app.Context): Boolean =
    hasWritePermission(owner, repository, context.loginAccount) || author == context.loginAccount.get.userName

  private def executeBatch(repository: RepositoryService.RepositoryInfo)(execute: Int => Unit) = {
    params("checked").split(',') map(_.toInt) foreach execute
    params("from") match {
      case "issues" => redirect(s"/${repository.owner}/${repository.name}/issues")
      case "pulls"  => redirect(s"/${repository.owner}/${repository.name}/pulls")
    }
  }

  private def createReferComment(owner: String, repository: String, fromIssue: Issue, message: String) = {
    StringUtil.extractIssueId(message).foreach { issueId =>
      if(getIssue(owner, repository, issueId).isDefined){
        createComment(owner, repository, context.loginAccount.get.userName, issueId.toInt,
                      fromIssue.issueId + ":" + fromIssue.title, "refer")
      }
    }
  }

  /**
   * @see [[https://github.com/takezoe/gitbucket/wiki/CommentAction]]
   */
  private def handleComment(issueId: Int, content: Option[String], repository: RepositoryService.RepositoryInfo)
      (getAction: model.Issue => Option[String] =
           p1 => params.get("operation").filter(_ => isEditable(p1.userName, p1.repositoryName, p1.openedUserName))) = {

    defining(repository.owner, repository.name){ case (owner, name) =>
      val userName = context.loginAccount.get.userName

      getIssue(owner, name, issueId.toString) map { issue =>
        val (action, recordActivity) =
          getAction(issue)
            .collect {
              case "Close" if(!issue.closed) => 2 ->
                (Some("close")  -> Some(if(issue.isPullRequest) recordClosePullRequestActivity _ else recordCloseIssueActivity _))
              case "Reopen" if(!issue.open) => 0 ->
                (Some("reopen") -> Some(recordReopenIssueActivity _))
              case "Fixed" if(!issue.closed) => 1 ->
                (Some("fixed") -> Some(recordFixedIssueActivity _))
            }
            .map { case (closed, t) =>
              updateClosed(owner, name, issueId, closed)
              t
            }
            .getOrElse(None -> None)

        val (commentId, issueComment) = content
          .map       ( _ -> action.map( _ + "_comment" ).getOrElse("comment") )
          .getOrElse ( action.get.capitalize -> action.get )
        match {
          case (content, action) => createComment(owner, name, userName, issueId, content, action)
        }

        // record comment activity if comment is entered
        content foreach {
          (if(issue.isPullRequest) recordCommentPullRequestActivity _ else recordCommentIssueActivity _)
          (owner, name, userName, issueId, _)
        }
        recordActivity foreach ( _ (owner, name, userName, issueId, issue.title) )

        // extract references and create refer comment
        content.map { content =>
          createReferComment(owner, name, issue, content)
        }

        // notifications
        Notifier() match {
          case f =>
            content foreach {
              f.toNotify(repository, issueId, _){
                Notifier.msgComment(s"${context.baseUrl}/${owner}/${name}/${
                  if(issue.isPullRequest) "pull" else "issues"}/${issueId}#comment-${commentId}")
              }
            }
            action foreach {
              f.toNotify(repository, issueId, _){
                Notifier.msgStatus(s"${context.baseUrl}/${owner}/${name}/issues/${issueId}")
              }
            }
        }

        issue -> (commentId, issueComment, action)
      }
    }
  }

  private def searchIssues(repository: RepositoryService.RepositoryInfo) = {
    defining(repository.owner, repository.name){ case (owner, repoName) =>
      val page       = IssueSearchCondition.page(request)
      val sessionKey = Keys.Session.Issues(owner, repoName)

      // retrieve search condition
      val condition = session.putAndGet(sessionKey,
        if(request.hasQueryString){
          val q = request.getParameter("q")
          if(q == null){
            IssueSearchCondition(request)
          } else {
            IssueSearchCondition(q, getMilestones(owner, repoName).map(x => (x.title, x.milestoneId)).toMap)
          }
        } else session.getAs[IssueSearchCondition](sessionKey).getOrElse(IssueSearchCondition())
      )
      val issuest = searchIssue(condition, false, (page - 1) * IssueLimit, IssueLimit, owner -> repoName)

      issues.html.list(
          "issues",
          searchIssue(condition, false, (page - 1) * IssueLimit, IssueLimit, owner -> repoName),
          page,
          (getCollaborators(owner, repoName) :+ owner).sorted,
          getMilestones(owner, repoName),
          getLabels(owner, repoName),
          countIssue(condition.copy(state = "open"  ), false, owner -> repoName),
          countIssue(condition.copy(state = "fixed"), false, owner -> repoName),
          countIssue(condition.copy(state = "closed"), false, owner -> repoName),
          condition,
          repository,
          hasWritePermission(owner, repoName, context.loginAccount))
    }
  }

}
