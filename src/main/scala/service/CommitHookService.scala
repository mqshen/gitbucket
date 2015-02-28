package service

import model.Profile._
import profile.simple._
import model.{WebHook, Account}
import org.slf4j.LoggerFactory
import service.RepositoryService.RepositoryInfo
import util.JGitUtil
import org.eclipse.jgit.diff.DiffEntry
import util.JGitUtil.CommitInfo
import org.eclipse.jgit.api.Git
import org.apache.http.message.BasicNameValuePair
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.NameValuePair

/**
 * Created by goldratio on 2/28/15.
 */
trait CommitHook {

  def doHook(owner: String, repository: String, newCommits: List[CommitInfo])(implicit s: Session): Unit = {

  }

}

class FixCommitHook extends CommitHook with IssuesService{

  override def doHook(owner: String, repository: String, commits: List[CommitInfo])(implicit s: Session): Unit = {
    commits.foreach { commit =>
      val regex = """fix(ed)? #([0-9]*)""".r.unanchored
      commit.fullMessage match {
        case regex(ed, issue) =>
          val issueId = issue.toInt
          updateClosed(owner, repository, issueId, true)
          createComment(owner, repository, commit.committerName, issueId, commit.fullMessage, "close_comment")
        case _ =>
      }
        //      regex(commit.fullMessage)
//      if(commit.fullMessage.con)
//      updateClosed(owner, repository, )

    }

  }

}

trait CommitHookService {

  def getCommitHook()(implicit s: Session): List[CommitHook] = List(new FixCommitHook)

}


