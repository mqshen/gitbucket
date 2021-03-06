package app

import _root_.util.JGitUtil.CommitInfo
import org.apache.http.HttpEntity
import org.apache.http.client.methods.{HttpGet, CloseableHttpResponse}
import org.apache.http.impl.client.{HttpClients, CloseableHttpClient}
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager
import org.apache.http.protocol.{BasicHttpContext, HttpContext}
import org.apache.http.util.EntityUtils
import org.scalatra.i18n.Messages
import org.scalatra.servlet.ScalatraAsyncSupport
import play.twirl.api.Html
import syntax.SyntaxUtil
import util.Directory._
import util.Implicits._
import _root_.util.ControlUtil._
import _root_.util._
import service._
import org.scalatra._
import java.io.{ByteArrayOutputStream, InputStream, File}

import org.eclipse.jgit.api.{ArchiveCommand, Git}
import org.eclipse.jgit.archive.{TgzFormat, ZipFormat}
import org.eclipse.jgit.lib._
import org.apache.commons.io.FileUtils
import org.eclipse.jgit.treewalk._
import jp.sf.amateras.scalatra.forms._
import org.eclipse.jgit.dircache.DirCache
import org.eclipse.jgit.revwalk.RevCommit
import service.WebHookService.WebHookPayload

class RepositoryViewerController extends RepositoryViewerControllerBase
  with RepositoryService with AccountService with ActivityService with IssuesService with WebHookService with CommitsService
  with ReadableUsersAuthenticator with ReferrerAuthenticator with CollaboratorsAuthenticator with ScalatraAsyncSupport


/**
 * The repository viewer.
 */
trait RepositoryViewerControllerBase extends ControllerBase {
  self: RepositoryService with AccountService with ActivityService with IssuesService with WebHookService with CommitsService
    with ReadableUsersAuthenticator with ReferrerAuthenticator with CollaboratorsAuthenticator =>

  ArchiveCommand.registerFormat("zip", new ZipFormat)
  ArchiveCommand.registerFormat("tar.gz", new TgzFormat)

  case class EditorForm(
    branch: String,
    path: String,
    content: String,
    message: Option[String],
    charset: String,
    lineSeparator: String,
    newFileName: String,
    oldFileName: Option[String]
  )

  case class DeleteForm(
    branch: String,
    path: String,
    message: Option[String],
    fileName: String
  )

  case class CommentForm(
    fileName: Option[String],
    oldLineNumber: Option[Int],
    newLineNumber: Option[Int],
    content: String,
    issueId: Option[Int]
  )


  val editorForm = mapping(
    "branch"        -> trim(label("Branch", text(required))),
    "path"          -> trim(label("Path", text())),
    "content"       -> trim(label("Content", text(required))),
    "message"       -> trim(label("Message", optional(text()))),
    "charset"       -> trim(label("Charset", text(required))),
    "lineSeparator" -> trim(label("Line Separator", text(required))),
    "newFileName"   -> trim(label("Filename", text(required))),
    "oldFileName"   -> trim(label("Old filename", optional(text())))
  )(EditorForm.apply)

  val deleteForm = mapping(
    "branch"   -> trim(label("Branch", text(required))),
    "path"     -> trim(label("Path", text())),
    "message"  -> trim(label("Message", optional(text()))),
    "fileName" -> trim(label("Filename", text(required)))
  )(DeleteForm.apply)

  val commentForm = mapping(
    "fileName"      -> trim(label("Filename", optional(text()))),
    "oldLineNumber" -> trim(label("Old line number", optional(number()))),
    "newLineNumber" -> trim(label("New line number", optional(number()))),
    "content"       -> trim(label("Content", text(required))),
    "issueId"       -> trim(label("Issue Id", optional(number())))
  )(CommentForm.apply)

  /**
   * Returns converted HTML from Markdown for preview.
   */
  post("/:owner/:repository/_preview")(referrersOnly { repository =>
    contentType = "text/html"
    view.helpers.markdown(params("content"), repository,
      params("enableWikiLink").toBoolean,
      params("enableRefsLink").toBoolean,
      params("enableTaskList").toBoolean,
      hasWritePermission(repository.owner, repository.name, context.loginAccount))
  })

  /**
   * Displays the file list of the repository root and the default branch.
   */
  get("/:owner/:repository")(referrersOnly {
    fileList(_)
  })

  get("/:owner/:repository/issues/counts"){
    contentType = formats("json")
    org.json4s.jackson.Serialization.write(
      Map("count" ->  1
      ))
  }

  val cm = new PoolingHttpClientConnectionManager

  get("/:owner/:repository/build/lastSuccessful")(referrersOnly { repository =>
    repository.repository.jenkins.map { url =>
      val client = HttpClients.custom.setConnectionManager(cm).build
      var response: CloseableHttpResponse = null
      try {
        val httpGet = new HttpGet(s"$url/lastSuccessfulBuild/api/json")
        httpGet.addHeader("Connection", "close")
        val context: HttpContext = new BasicHttpContext
        response = client.execute(httpGet, context)
        val entity = response.getEntity
        if (entity != null) {
          val baos = new ByteArrayOutputStream()
          def readString(in: InputStream): Unit = {
            val read = in.read()
            if (read != -1) {
              baos.write(read)
              readString(in)
            }
          }
          readString(entity.getContent)
          println(baos.toString())
          html.json(baos.toString())
        } else {
          ""
        }
      } finally {
        if(response != null)
          response.close()
      }
    }.getOrElse("")
  })

  /**
   * Displays the file list of the specified path and branch.
   */
  get("/:owner/:repository/tree/*")(referrersOnly { repository =>
    val (id, path) = splitPath(repository, multiParams("splat").head)
    if(path.isEmpty){
      fileList(repository, id)
    } else {
      fileList(repository, id, path)
    }
  })

  /**
   * Displays the commit list of the specified resource.
   */
  get("/:owner/:repository/commits/*")(referrersOnly { repository =>
    val (branchName, path) = splitPath(repository, multiParams("splat").head)
    val page = params.get("page").flatMap(_.toIntOpt).getOrElse(1)

    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      JGitUtil.getCommitLog(git, branchName, page, 30, path) match {
        case Right((logs, hasNext)) =>
          repo.html.commits(if(path.isEmpty) Nil else path.split("/").toList, branchName, repository,
            logs.splitWith{ (commit1, commit2) =>
              view.helpers.date(commit1.commitTime) == view.helpers.date(commit2.commitTime)
            }, page, hasNext, hasWritePermission(repository.owner, repository.name, context.loginAccount))
        case Left(_) => NotFound
      }
    }
  })

  get("/:owner/:repository/new/*")(collaboratorsOnly { repository =>
    val (branch, path) = splitPath(repository, multiParams("splat").head)
    repo.html.editor(branch, repository, if(path.length == 0) Nil else path.split("/").toList,
      None, JGitUtil.ContentInfo("text", None, Some("UTF-8")))
  })

  get("/:owner/:repository/show_partial")(referrersOnly { repository =>
    params("partial") match {
      case "recently_touched_branches_list" =>
        repo.html.partial(repository, "recently_touched_branches_list")
    }
  })

  get("/:owner/:repository/edit/*")(collaboratorsOnly { repository =>
    val (branch, path) = splitPath(repository, multiParams("splat").head)

    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      val revCommit = JGitUtil.getRevCommitFromId(git, git.getRepository.resolve(branch))

      getPathObjectId(git, path, revCommit).map { objectId =>
        val paths = path.split("/")
        repo.html.editor(branch, repository, paths.take(paths.size - 1).toList, Some(paths.last),
          JGitUtil.getContentInfo(git, path, objectId))
      } getOrElse NotFound
    }
  })

  get("/:owner/:repository/remove/*")(collaboratorsOnly { repository =>
    val (branch, path) = splitPath(repository, multiParams("splat").head)
    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      val revCommit = JGitUtil.getRevCommitFromId(git, git.getRepository.resolve(branch))

      getPathObjectId(git, path, revCommit).map { objectId =>
        val paths = path.split("/")
        repo.html.delete(branch, repository, paths.take(paths.size - 1).toList, paths.last,
          JGitUtil.getContentInfo(git, path, objectId))
      } getOrElse NotFound
    }
  })

  post("/:owner/:repository/create", editorForm)(collaboratorsOnly { (form, repository) =>
    commitFile(repository, form.branch, form.path, Some(form.newFileName), None,
      StringUtil.convertLineSeparator(form.content, form.lineSeparator), form.charset,
      form.message.getOrElse(s"Create ${form.newFileName}"))

    redirect(s"/${repository.owner}/${repository.name}/blob/${form.branch}/${
      if(form.path.length == 0) form.newFileName else s"${form.path}/${form.newFileName}"
    }")
  })

  post("/:owner/:repository/update", editorForm)(collaboratorsOnly { (form, repository) =>
    commitFile(repository, form.branch, form.path, Some(form.newFileName), form.oldFileName,
      StringUtil.convertLineSeparator(form.content, form.lineSeparator), form.charset,
      if(form.oldFileName.exists(_ == form.newFileName)){
        form.message.getOrElse(s"Update ${form.newFileName}")
      } else {
        form.message.getOrElse(s"Rename ${form.oldFileName.get} to ${form.newFileName}")
      })

    redirect(s"/${repository.owner}/${repository.name}/blob/${form.branch}/${
      if(form.path.length == 0) form.newFileName else s"${form.path}/${form.newFileName}"
    }")
  })

  post("/:owner/:repository/remove", deleteForm)(collaboratorsOnly { (form, repository) =>
    commitFile(repository, form.branch, form.path, None, Some(form.fileName), "", "",
      form.message.getOrElse(s"Delete ${form.fileName}"))

    redirect(s"/${repository.owner}/${repository.name}/tree/${form.branch}${if(form.path.length == 0) "" else form.path}")
  })

  /**
   * Displays the file content of the specified branch or commit.
   */
  get("/:owner/:repository/blob/*")(referrersOnly { repository =>
    val (id, path) = splitPath(repository, multiParams("splat").head)
    val raw = params.get("raw").getOrElse("false").toBoolean

    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      val revCommit = JGitUtil.getRevCommitFromId(git, git.getRepository.resolve(id))
      val lastModifiedCommit = JGitUtil.getLastModifiedCommit(git, revCommit, path)
      getPathObjectId(git, path, revCommit).map { objectId =>
        if(raw){
          // Download
          defining(JGitUtil.getContentFromId(git, objectId, false).get){ bytes =>
            contentType = FileUtil.getContentType(path, bytes)
            bytes
          }
        } else {
          val content = JGitUtil.getContentInfo(git, path, objectId)
          val contentLines = content.content.getOrElse("")
          val formattedContent = SyntaxUtil.getSyntax(path, contentLines)
          repo.html.blob(id, repository, path.split("/").toList, content, formattedContent,
            new JGitUtil.CommitInfo(lastModifiedCommit), hasWritePermission(repository.owner, repository.name, context.loginAccount))
        }
      } getOrElse NotFound
    }
  })

  /**
   * Displays details of the specified commit.
   */
  get("/:owner/:repository/commit/:id")(referrersOnly { repository =>
    val id = params("id")

    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      defining(JGitUtil.getRevCommitFromId(git, git.getRepository.resolve(id))){ revCommit =>
        JGitUtil.getDiffs(git, id) match { case (diffs, oldCommitId) =>
          repo.html.commit(id, new JGitUtil.CommitInfo(revCommit),
            JGitUtil.getBranchesOfCommit(git, revCommit.getName),
            JGitUtil.getTagsOfCommit(git, revCommit.getName),
            getCommitComments(repository.owner, repository.name, id, false),
            repository, diffs, oldCommitId, hasWritePermission(repository.owner, repository.name, context.loginAccount))
        }
      }
    }
  })

  post("/:owner/:repository/commit/:id/comment/new", commentForm)(readableUsersOnly { (form, repository) =>
    val id = params("id")
    createCommitComment(repository.owner, repository.name, id, context.loginAccount.get.userName, form.content,
      form.fileName, form.oldLineNumber, form.newLineNumber, form.issueId.isDefined)
    form.issueId match {
      case Some(issueId) => recordCommentPullRequestActivity(repository.owner, repository.name, context.loginAccount.get.userName, issueId, form.content)
      case None => recordCommentCommitActivity(repository.owner, repository.name, context.loginAccount.get.userName, id, form.content)
    }
    redirect(s"/${repository.owner}/${repository.name}/commit/${id}")
  })

  ajaxGet("/:owner/:repository/commit/:id/comment/_form")(readableUsersOnly { repository =>
    val id            = params("id")
    val fileName      = params.get("fileName")
    val oldLineNumber = params.get("oldLineNumber") map (_.toInt)
    val newLineNumber = params.get("newLineNumber") map (_.toInt)
    val issueId   = params.get("issueId") map (_.toInt)
    repo.html.commentform(
      commitId = id,
      fileName, oldLineNumber, newLineNumber, issueId,
      hasWritePermission = hasWritePermission(repository.owner, repository.name, context.loginAccount),
      repository = repository
    )
  })

  ajaxPost("/:owner/:repository/commit/:id/comment/_data/new", commentForm)(readableUsersOnly { (form, repository) =>
    val id = params("id")
    val commentId = createCommitComment(repository.owner, repository.name, id, context.loginAccount.get.userName,
      form.content, form.fileName, form.oldLineNumber, form.newLineNumber, form.issueId.isDefined)
    form.issueId match {
      case Some(issueId) => recordCommentPullRequestActivity(repository.owner, repository.name, context.loginAccount.get.userName, issueId, form.content)
      case None => recordCommentCommitActivity(repository.owner, repository.name, context.loginAccount.get.userName, id, form.content)
    }
    helper.html.commitcomment(getCommitComment(repository.owner, repository.name, commentId.toString).get,
      hasWritePermission(repository.owner, repository.name, context.loginAccount), repository)
  })

  ajaxGet("/:owner/:repository/commit_comments/_data/:id")(readableUsersOnly { repository =>
    getCommitComment(repository.owner, repository.name, params("id")) map { x =>
      if(isEditable(x.userName, x.repositoryName, x.commentedUserName)){
        params.get("dataType") collect {
          case t if t == "html" => repo.html.editcomment(
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

  ajaxPost("/:owner/:repository/commit_comments/edit/:id", commentForm)(readableUsersOnly { (form, repository) =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getCommitComment(owner, name, params("id")).map { comment =>
        if(isEditable(owner, name, comment.commentedUserName)){
          updateCommitComment(comment.commentId, form.content)
          redirect(s"/${owner}/${name}/commit_comments/_data/${comment.commentId}")
        } else Unauthorized
      } getOrElse NotFound
    }
  })

  ajaxPost("/:owner/:repository/commit_comments/delete/:id")(readableUsersOnly { repository =>
    defining(repository.owner, repository.name){ case (owner, name) =>
      getCommitComment(owner, name, params("id")).map { comment =>
        if(isEditable(owner, name, comment.commentedUserName)){
          Ok(deleteCommitComment(comment.commentId))
        } else Unauthorized
      } getOrElse NotFound
    }
  })

  /**
   * Displays branches.
   */
  get("/:owner/:repository/branches")(referrersOnly { repository =>
    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      // retrieve latest update date of each branch
      val branchInfo = repository.branchList.map { branchName =>
        val revCommit = git.log.add(git.getRepository.resolve(branchName)).setMaxCount(1).call.iterator.next
        val committerIdent = revCommit.getCommitterIdent
        (branchName, committerIdent.getWhen, committerIdent.getName)
      }
      repo.html.branches(branchInfo, hasWritePermission(repository.owner, repository.name, context.loginAccount), repository)
    }
  })

  /**
   * Creates a branch.
   */
  post("/:owner/:repository/branches")(collaboratorsOnly { repository =>
    val newBranchName = params.getOrElse("new", halt(400))
    val fromBranchName = params.getOrElse("from", halt(400))
    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      JGitUtil.createBranch(git, fromBranchName, newBranchName)
    } match {
      case Right(message) =>
        flash += "info" -> message
        redirect(s"/${repository.owner}/${repository.name}/tree/${StringUtil.urlEncode(newBranchName).replace("%2F", "/")}")
      case Left(message) =>
        flash += "error" -> message
        redirect(s"/${repository.owner}/${repository.name}/tree/${fromBranchName}")
    }
  })

  /**
   * Deletes branch.
   */
  get("/:owner/:repository/delete/*")(collaboratorsOnly { repository =>
    val branchName = multiParams("splat").head
    val userName   = context.loginAccount.get.userName
    if(repository.repository.defaultBranch != branchName){
      using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
        git.branchDelete().setForce(true).setBranchNames(branchName).call()
        recordDeleteBranchActivity(repository.owner, repository.name, userName, branchName)
      }
    }
    redirect(s"/${repository.owner}/${repository.name}/branches")
  })

  /**
   * Displays tags.
   */
  get("/:owner/:repository/tags")(referrersOnly {
    repo.html.tags(_)
  })

  /**
   * Download repository contents as an archive.
   */
  get("/:owner/:repository/archive/*")(referrersOnly { repository =>
    multiParams("splat").head match {
      case name if name.endsWith(".zip") =>
        archiveRepository(name, ".zip", repository)
      case name if name.endsWith(".tar.gz") =>
        archiveRepository(name, ".tar.gz", repository)
      case _ => BadRequest
    }
  })

  get("/:owner/:repository/network/members")(referrersOnly { repository =>
    repo.html.forked(
      getRepository(
        repository.repository.originUserName.getOrElse(repository.owner),
        repository.repository.originRepositoryName.getOrElse(repository.name),
        context.baseUrl),
      getForkedRepositories(
        repository.repository.originUserName.getOrElse(repository.owner),
        repository.repository.originRepositoryName.getOrElse(repository.name)),
      repository)
  })

  private def splitPath(repository: service.RepositoryService.RepositoryInfo, path: String): (String, String) = {
    val id = repository.branchList.collectFirst {
      case branch if(path == branch || path.startsWith(branch + "/")) => branch
    } orElse repository.tags.collectFirst {
      case tag if(path == tag.name || path.startsWith(tag.name + "/")) => tag.name
    } getOrElse path.split("/")(0)

    (id, path.substring(id.length).stripPrefix("/"))
  }


  private val readmeFiles = view.helpers.renderableSuffixes.map(suffix => s"readme${suffix}") ++ Seq("readme.txt", "readme")

  /**
   * Provides HTML of the file list.
   *
   * @param repository the repository information
   * @param revstr the branch name or commit id(optional)
   * @param path the directory path (optional)
   * @return HTML of the file list
   */
  private def fileList(repository: RepositoryService.RepositoryInfo, revstr: String = "", path: String = ".") = {
    if(repository.commitCount == 0){
      repo.html.guide(repository, hasWritePermission(repository.owner, repository.name, context.loginAccount))
    } else {
      using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
        // get specified commit
        JGitUtil.getDefaultBranch(git, repository, revstr).map { case (objectId, revision) =>
          defining(JGitUtil.getRevCommitFromId(git, objectId)) { revCommit =>
            val lastModifiedCommit = if(path == ".") revCommit else JGitUtil.getLastModifiedCommit(git, revCommit, path)
            // get files
            val files = JGitUtil.getFileList(git, revision, path)
            val parentPath = if (path == ".") Nil else path.split("/").toList
            // process README.md or README.markdown
            val readme = files.find { file =>
              readmeFiles.contains(file.name.toLowerCase)
            }.map { file =>
              val path = (file.name :: parentPath.reverse).reverse
              path -> StringUtil.convertFromByteArray(JGitUtil.getContentFromId(
                Git.open(getRepositoryDir(repository.owner, repository.name)), file.id, true).get)
            }

            repo.html.files(revision, repository,
              if(path == ".") Nil else path.split("/").toList, // current path
              context.loginAccount match {
                case None => List()
                case account: Option[model.Account] => getGroupsByUserName(account.get.userName)
              }, // groups of current user
              new JGitUtil.CommitInfo(lastModifiedCommit), // last modified commit
              files, readme, hasWritePermission(repository.owner, repository.name, context.loginAccount),
              flash.get("info"), flash.get("error"))
          }
        } getOrElse NotFound
      }
    }
  }

  private def commitFile(repository: service.RepositoryService.RepositoryInfo,
                         branch: String, path: String, newFileName: Option[String], oldFileName: Option[String],
                         content: String, charset: String, message: String) = {

    val newPath = newFileName.map { newFileName => if(path.length == 0) newFileName else s"${path}/${newFileName}" }
    val oldPath = oldFileName.map { oldFileName => if(path.length == 0) oldFileName else s"${path}/${oldFileName}" }

    LockUtil.lock(s"${repository.owner}/${repository.name}"){
      using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
        val loginAccount = context.loginAccount.get
        val builder  = DirCache.newInCore.builder()
        val inserter = git.getRepository.newObjectInserter()
        val headName = s"refs/heads/${branch}"
        val headTip  = git.getRepository.resolve(headName)

        JGitUtil.processTree(git, headTip){ (path, tree) =>
          if(!newPath.exists(_ == path) && !oldPath.exists(_ == path)){
            builder.add(JGitUtil.createDirCacheEntry(path, tree.getEntryFileMode, tree.getEntryObjectId))
          }
        }

        newPath.foreach { newPath =>
          builder.add(JGitUtil.createDirCacheEntry(newPath, FileMode.REGULAR_FILE,
            inserter.insert(Constants.OBJ_BLOB, content.getBytes(charset))))
        }
        builder.finish()

        val commitId = JGitUtil.createNewCommit(git, inserter, headTip, builder.getDirCache.writeTree(inserter),
          headName, loginAccount.fullName, loginAccount.mailAddress, message)

        inserter.flush()
        inserter.release()

        // update refs
        val refUpdate = git.getRepository.updateRef(headName)
        refUpdate.setNewObjectId(commitId)
        refUpdate.setForceUpdate(false)
        refUpdate.setRefLogIdent(new PersonIdent(loginAccount.fullName, loginAccount.mailAddress))
        //refUpdate.setRefLogMessage("merged", true)
        refUpdate.update()

        // record activity
        recordPushActivity(repository.owner, repository.name, loginAccount.userName, branch,
          List(new CommitInfo(JGitUtil.getRevCommitFromId(git, commitId))))

        // close issue by commit message
        closeIssuesFromMessage(message, loginAccount.userName, repository.owner, repository.name, "")

        // call web hook
        val commit = new JGitUtil.CommitInfo(JGitUtil.getRevCommitFromId(git, commitId))
        getWebHookURLs(repository.owner, repository.name) match {
          case webHookURLs if(webHookURLs.nonEmpty) =>
            for(ownerAccount <- getAccountByUserName(repository.owner)){
              callWebHook(repository.owner, repository.name, webHookURLs,
                WebHookPayload(git, loginAccount, headName, repository, List(commit), ownerAccount))
            }
          case _ =>
        }
      }
    }
  }

  private def getPathObjectId(git: Git, path: String, revCommit: RevCommit): Option[ObjectId] = {
    @scala.annotation.tailrec
    def _getPathObjectId(path: String, walk: TreeWalk): Option[ObjectId] = walk.next match {
      case true if(walk.getPathString == path) => Some(walk.getObjectId(0))
      case true  => _getPathObjectId(path, walk)
      case false => None
    }

    using(new TreeWalk(git.getRepository)){ treeWalk =>
      treeWalk.addTree(revCommit.getTree)
      treeWalk.setRecursive(true)
      _getPathObjectId(path, treeWalk)
    }
  }

  private def archiveRepository(name: String, suffix: String, repository: RepositoryService.RepositoryInfo): Unit = {
    val revision = name.stripSuffix(suffix)
    val workDir = getDownloadWorkDir(repository.owner, repository.name, session.getId)
    if(workDir.exists) {
      FileUtils.deleteDirectory(workDir)
    }
    workDir.mkdirs

    val filename = repository.name + "-" +
      (if(revision.length == 40) revision.substring(0, 10) else revision).replace('/', '_') + suffix

    using(Git.open(getRepositoryDir(repository.owner, repository.name))){ git =>
      val revCommit = JGitUtil.getRevCommitFromId(git, git.getRepository.resolve(revision))

      contentType = "application/octet-stream"
      response.setHeader("Content-Disposition", s"attachment; filename=${filename}")
      response.setBufferSize(1024 * 1024);

      git.archive
         .setFormat(suffix.tail)
         .setTree(revCommit.getTree)
         .setOutputStream(response.getOutputStream)
         .call()

      Unit
    }
  }

  private def isEditable(owner: String, repository: String, author: String)(implicit context: app.Context): Boolean =
    hasWritePermission(owner, repository, context.loginAccount) || author == context.loginAccount.get.userName





}
