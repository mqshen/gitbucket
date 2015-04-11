package service

import view.helpers._

import scala.slick.jdbc.{StaticQuery => Q}
import Q.interpolation

import model.Profile._
import profile.simple._
import model.{Account, Commit, CommitComment}
import util.Implicits._
import util.StringUtil._


trait CommitsService {

  def getCommitComments(owner: String, repository: String, commitId: String, pullRequest: Boolean)(implicit s: Session) =
    CommitComments filter {
      t => t.byCommit(owner, repository, commitId) && (t.pullRequest === pullRequest || pullRequest)
    } list

  def getCommitComment(owner: String, repository: String, commentId: String)(implicit s: Session) =
    if (commentId forall (_.isDigit))
      CommitComments filter { t =>
        t.byPrimaryKey(commentId.toInt) && t.byRepository(owner, repository)
      } firstOption
    else
      None

  def createCommitComment(owner: String, repository: String, commitId: String, loginUser: String,
    content: String, fileName: Option[String], oldLine: Option[Int], newLine: Option[Int], pullRequest: Boolean)(implicit s: Session): Int =
    CommitComments.autoInc insert CommitComment(
      userName          = owner,
      repositoryName    = repository,
      commitId          = commitId,
      commentedUserName = loginUser,
      content           = content,
      fileName          = fileName,
      oldLine           = oldLine,
      newLine           = newLine,
      registeredDate    = currentDate,
      updatedDate       = currentDate,
      pullRequest       = pullRequest)

  def updateCommitComment(commentId: Int, content: String)(implicit s: Session) =
    CommitComments
      .filter (_.byPrimaryKey(commentId))
      .map { t =>
      t.content -> t.updatedDate
    }.update (content, currentDate)

  def deleteCommitComment(commentId: Int)(implicit s: Session) =
    CommitComments filter (_.byPrimaryKey(commentId)) delete

}

trait CommitNameService {

  private implicit def context2Session(implicit context: app.Context): Session =
    request2Session(context.request)

  def getCommitRealUser(owner: String, repository: String, commitId: String)(implicit context: app.Context): Option[Commit] = {
    (Commits filter (_.byPrimaryKey(owner, repository, commitId)) ).firstOption
  }

  def getCommitAccount(owner: String, repository: String, commitId: String)(implicit context: app.Context): Option[Account] = {
    getCommitRealUser(owner, repository, commitId).map { commit =>
      getAccountByUserName(commit.commitName)
    }.getOrElse(None)
  }

  def getCommitName(owner: String, repository: String, commitId: String, defaultName: String)(implicit context: app.Context): String = {
    getCommitRealUser(owner, repository, commitId).map { commit =>
      getAccountByUserName(commit.commitName).map(_.userName).getOrElse(defaultName)
    }.getOrElse(defaultName)
  }

  def createCommitName(owner: String, repository: String, commitId: String, commitName: String)(implicit s: Session) = {
    Commits insert Commit(owner, repository, commitId, commitName)
  }

}
