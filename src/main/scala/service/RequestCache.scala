package service

import model.{Account, Issue, Session}
import org.json4s.{DefaultFormats, Formats}
import servlet.RedisClientPool
import util.Implicits.request2Session

/**
 * This service is used for a view helper mainly.
 *
 * It may be called many times in one request, so each method stores
 * its result into the cache which available during a request.
 */
trait RequestCache extends SystemSettingsService with AccountService with IssuesService {
  implicit protected def jsonFormats: Formats = DefaultFormats

  private implicit def context2Session(implicit context: app.Context): Session =
    request2Session(context.request)

  def getIssue(userName: String, repositoryName: String, issueId: String)
              (implicit context: app.Context): Option[Issue] = {
    RedisClientPool.clients.withClient { client =>
      val key = s"issue.${userName}/${repositoryName}#${issueId}"
      client.get(key).map { value =>
        Some(org.json4s.jackson.Serialization.read[Issue](value))
      }.getOrElse {
        val issue = super.getIssue(userName, repositoryName, issueId)
        issue.map { issue =>
          val value = org.json4s.jackson.Serialization.write(issue)
          client.set(key, value)
        }
        issue
      }
    }
  }

  def getAccountByUserName(userName: String)
                          (implicit context: app.Context): Option[Account] = {
    RedisClientPool.clients.withClient { implicit client =>
      getAccountRedisByName(userName).getOrElse {
        val account = super.getAccountByUserName(userName)
        account.map { account =>
          setAccountRedis(account)
        }
        account
      }
    }
  }

  def getAccountByMailAddress(mailAddress: String)
                             (implicit context: app.Context): Option[Account] = {

    RedisClientPool.clients.withClient { implicit client =>
      getAccountRedisByMail(mailAddress).getOrElse {
        val account = super.getAccountByUserName(mailAddress)
        account.map { account =>
          setAccountRedis(account)
        }
        account
      }
    }
  }

}
