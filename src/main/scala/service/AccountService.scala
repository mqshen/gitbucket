package service

import com.redis.RedisClient
import model.Profile._
import org.json4s.{DefaultFormats, Formats}
import profile.simple._
import model.{Issue, Account, GroupMember}
import servlet.RedisClientPool

// TODO [Slick 2.0]NOT import directly?
import model.Profile.dateColumnType
import service.SystemSettingsService.SystemSettings
import util.StringUtil._
import util.LDAPUtil
import org.slf4j.LoggerFactory

trait AccountService {

  private val logger = LoggerFactory.getLogger(classOf[AccountService])

  def authenticate(settings: SystemSettings, userName: String, password: String)(implicit s: Session): Option[Account] =
    if(settings.ldapAuthentication){
      ldapAuthentication(settings, userName, password)
    } else {
      defaultAuthentication(userName, password)
    }

  /**
   * Authenticate by internal database.
   */
  private def defaultAuthentication(userName: String, password: String)(implicit s: Session) = {
    getAccountByUserName(userName).collect {
      case account if(!account.isGroupAccount && account.password == sha1(password)) => Some(account)
    } getOrElse None
  }

  /**
   * Authenticate by LDAP.
   */
  private def ldapAuthentication(settings: SystemSettings, userName: String, password: String)
                                (implicit s: Session): Option[Account] = {
    LDAPUtil.authenticate(settings.ldap.get, userName, password) match {
      case Right(ldapUserInfo) => {
        // Create or update account by LDAP information
        getAccountByUserName(ldapUserInfo.userName, true) match {
          case Some(x) if(!x.isRemoved) => {
            if(settings.ldap.get.mailAttribute.getOrElse("").isEmpty) {
              updateAccount(x.copy(fullName = ldapUserInfo.fullName))
            } else {
              updateAccount(x.copy(mailAddress = ldapUserInfo.mailAddress, fullName = ldapUserInfo.fullName))
            }
            getAccountByUserName(ldapUserInfo.userName)
          }
          case Some(x) if(x.isRemoved)  => {
            logger.info("LDAP Authentication Failed: Account is already registered but disabled.")
            defaultAuthentication(userName, password)
          }
          case None => getAccountByMailAddress(ldapUserInfo.mailAddress, true) match {
            case Some(x) if(!x.isRemoved) => {
              updateAccount(x.copy(fullName = ldapUserInfo.fullName))
              getAccountByUserName(ldapUserInfo.userName)
            }
            case Some(x) if(x.isRemoved)  => {
              logger.info("LDAP Authentication Failed: Account is already registered but disabled.")
              defaultAuthentication(userName, password)
            }
            case None => {
              createAccount(ldapUserInfo.userName, "", ldapUserInfo.fullName, ldapUserInfo.mailAddress, false, None)
              getAccountByUserName(ldapUserInfo.userName)
            }
          }
        }
      }
      case Left(errorMessage) => {
        logger.info(s"LDAP Authentication Failed: ${errorMessage}")
        defaultAuthentication(userName, password)
      }
    }
  }

  def getAccountByUserName(userName: String, includeRemoved: Boolean = false)(implicit s: Session): Option[Account] =
    Accounts filter(t => (t.userName === userName.bind) && (t.removed === false.bind, !includeRemoved)) firstOption

  def getAccountByMailAddress(mailAddress: String, includeRemoved: Boolean = false)(implicit s: Session): Option[Account] =
    Accounts filter(t => (t.mailAddress.toLowerCase === mailAddress.toLowerCase.bind) && (t.removed === false.bind, !includeRemoved)) firstOption

  def getAllUsers(includeRemoved: Boolean = true)(implicit s: Session): List[Account] =
    if(includeRemoved){
      Accounts sortBy(_.userName) list
    } else {
      Accounts filter (_.removed === false.bind) sortBy(_.userName) list
    }

  def createAccount(userName: String, password: String, fullName: String, mailAddress: String, isAdmin: Boolean, url: Option[String])
                   (implicit s: Session): Unit =
    Accounts insert Account(
      userName       = userName,
      password       = password,
      fullName       = fullName,
      mailAddress    = mailAddress,
      isAdmin        = isAdmin,
      url            = url,
      registeredDate = currentDate,
      updatedDate    = currentDate,
      lastLoginDate  = None,
      image          = None,
      isGroupAccount = false,
      isRemoved      = false)

  def updateAccount(account: Account)(implicit s: Session): Unit = {

    Accounts
      .filter { a =>  a.userName === account.userName.bind }
      .map    { a => (a.password, a.fullName, a.mailAddress, a.isAdmin, a.url.?, a.registeredDate, a.updatedDate, a.lastLoginDate.?, a.removed) }
      .update (
        account.password,
        account.fullName,
        account.mailAddress,
        account.isAdmin,
        account.url,
        account.registeredDate,
        currentDate,
        account.lastLoginDate,
        account.isRemoved)

    updateAccountRedis(account.userName)
  }

  def updateAvatarImage(userName: String, image: Option[String])(implicit s: Session): Unit = {
    Accounts.filter(_.userName === userName.bind).map(_.image.?).update(image)
    updateAccountRedis(userName)
  }


  def updateLastLoginDate(userName: String)(implicit s: Session): Unit =
    Accounts.filter(_.userName === userName.bind).map(_.lastLoginDate).update(currentDate)

  def createGroup(groupName: String, url: Option[String])(implicit s: Session): Unit =
    Accounts insert Account(
      userName       = groupName,
      password       = "",
      fullName       = groupName,
      mailAddress    = groupName + "@devnull",
      isAdmin        = false,
      url            = url,
      registeredDate = currentDate,
      updatedDate    = currentDate,
      lastLoginDate  = None,
      image          = None,
      isGroupAccount = true,
      isRemoved      = false)

  def updateGroup(groupName: String, url: Option[String], removed: Boolean)(implicit s: Session): Unit =
    Accounts.filter(_.userName === groupName.bind).map(t => t.url.? -> t.removed).update(url, removed)

  def updateGroupMembers(groupName: String, members: List[(String, Boolean)])(implicit s: Session): Unit = {
    GroupMembers.filter(_.groupName === groupName.bind).delete
    members.foreach { case (userName, isManager) =>
      GroupMembers insert GroupMember (groupName, userName, isManager)
    }
  }

  def getGroupMembers(groupName: String)(implicit s: Session): List[GroupMember] =
    GroupMembers
      .filter(_.groupName === groupName.bind)
      .sortBy(_.userName)
      .list

  def getGroupUserMembers(groupName: String)(implicit s: Session): List[(Account, GroupMember)] =
    Accounts.innerJoin(GroupMembers).on((t1, t2) => t1.userName === t2.userName)
      .filter {case (t1, t2) => t2.groupName === groupName.bind }
      .list



  def getGroupsByUserName(userName: String)(implicit s: Session): List[String] =
    GroupMembers
      .filter(_.userName === userName.bind)
      .sortBy(_.groupName)
      .map(_.groupName)
      .list

  def removeUserRelatedData(userName: String)(implicit s: Session): Unit = {
    GroupMembers.filter(_.userName === userName.bind).delete
    Collaborators.filter(_.collaboratorName === userName.bind).delete
    Repositories.filter(_.userName === userName.bind).delete
  }

  def getGroupNames(userName: String)(implicit s: Session): List[String] = {
    List(userName) ++
      Collaborators.filter(_.collaboratorName === userName.bind).sortBy(_.userName).map(_.userName).list
  }

  def getAccountRedisByName(userName: String)(implicit client: RedisClient) = {
    val key = s"account.name.${userName}"
    client.get(key).map { value =>
      implicit val jsonFormats: Formats = DefaultFormats
      Some(org.json4s.jackson.Serialization.read[Account](value))
    }
  }

  def setAccountRedis(account: Account)(implicit client: RedisClient) = {
    implicit val jsonFormats: Formats = DefaultFormats
    val value = org.json4s.jackson.Serialization.write(account)
    val key = s"account.name.${account.userName}"
    val mailKey = s"account.mail.${account.mailAddress}"
    client.set(key, value)
    client.set(mailKey, account.userName)
  }

  def getAccountRedisByMail(mailAdress: String)(implicit client: RedisClient) = {
    val key = s"account.mail.${mailAdress}"
    client.get(key).map { value =>
      getAccountRedisByName(value)
    }.getOrElse(None)
  }


  def updateAccountRedis(userName: String)(implicit s: Session) = {
    getAccountByUserName(userName).map { account =>
      RedisClientPool.clients.withClient { implicit client =>
        setAccountRedis(account)
      }
    }
  }

}

object AccountService extends AccountService
