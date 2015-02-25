package app

import org.scalatra.servlet.ScalatraAsyncSupport
import service._
import util.AdminAuthenticator
import util.StringUtil._
import util.ControlUtil._
import util.Directory._
import util.Implicits._
import jp.sf.amateras.scalatra.forms._
import org.scalatra.i18n.Messages
import org.apache.commons.io.FileUtils

class UserManagementController extends UserManagementControllerBase
  with AccountService with RepositoryService with AdminAuthenticator with ScalatraAsyncSupport

trait UserManagementControllerBase extends AccountManagementControllerBase {
  self: AccountService with RepositoryService with AdminAuthenticator =>
  
  case class NewUserForm(userName: String, password: String, fullName: String,
                         mailAddress: String, isAdmin: Boolean,
                         url: Option[String], fileId: Option[String])

  case class EditUserForm(password: Option[String], fullName: String,
                          mailAddress: String, isAdmin: Boolean, url: Option[String],
                          fileId: Option[String], clearImage: Boolean, isRemoved: Boolean)

  case class NewGroupForm(groupName: String, url: Option[String], fileId: Option[String],
                          members: List[String], memberTypes: List[Boolean])

  case class EditGroupForm(url: Option[String], fileId: Option[String],
                           members: List[String], memberTypes: List[Boolean], clearImage: Boolean, isRemoved: Boolean)

  val newUserForm = mapping(
    "userName"    -> trim(label("Username"     ,text(required, maxlength(100), identifier, uniqueUserName))),
    "password"    -> trim(label("Password"     ,text(required, maxlength(20)))),
    "fullName"    -> trim(label("Full Name"    ,text(required, maxlength(100)))),
    "mailAddress" -> trim(label("Mail Address" ,text(required, maxlength(100), uniqueMailAddress()))),
    "isAdmin"     -> trim(label("User Type"    ,boolean())),
    "url"         -> trim(label("URL"          ,optional(text(maxlength(200))))),
    "fileId"      -> trim(label("File ID"      ,optional(text())))
  )(NewUserForm.apply)

  val editUserForm = mapping(
    "password"    -> trim(label("Password"     ,optional(text(maxlength(20))))),
    "fullName"    -> trim(label("Full Name"    ,text(required, maxlength(100)))),
    "mailAddress" -> trim(label("Mail Address" ,text(required, maxlength(100), uniqueMailAddress("userName")))),
    "isAdmin"     -> trim(label("User Type"    ,boolean())),
    "url"         -> trim(label("URL"          ,optional(text(maxlength(200))))),
    "fileId"      -> trim(label("File ID"      ,optional(text()))),
    "clearImage"  -> trim(label("Clear image"  ,boolean())),
    "removed"     -> trim(label("Disable"      ,boolean(disableByNotYourself("userName"))))
  )(EditUserForm.apply)

  val newGroupForm = mapping(
    "groupName" -> trim(label("Group name" ,text(required, maxlength(100), identifier, uniqueUserName))),
    "url"       -> trim(label("URL"        ,optional(text(maxlength(200))))),
    "fileId"    -> trim(label("File ID"    ,optional(text()))),
    "members"   -> list(text()),
    "memberTypes"   -> list(boolean())
  )(NewGroupForm.apply)

  val editGroupForm = mapping(
    "url"        -> trim(label("URL"         ,optional(text(maxlength(200))))),
    "fileId"     -> trim(label("File ID"     ,optional(text()))),
    "members"   -> list(text()),
    "memberTypes"   -> list(boolean()),
    "clearImage" -> trim(label("Clear image" ,boolean())),
    "removed"    -> trim(label("Disable"     ,boolean()))
  )(EditGroupForm.apply)

  get("/admin/users")(adminOnly {
    val includeRemoved = params.get("includeRemoved").map(_.toBoolean).getOrElse(false)
    val users          = getAllUsers(includeRemoved)
    val members        = users.collect { case account if(account.isGroupAccount) =>
      account.userName -> getGroupMembers(account.userName).map(_.userName)
    }.toMap

    admin.users.html.list(users, members, includeRemoved)
  })
  
  get("/admin/users/_newuser")(adminOnly {
    admin.users.html.user(None)
  })
  
  post("/admin/users/_newuser", newUserForm)(adminOnly { form =>
    createAccount(form.userName, sha1(form.password), form.fullName, form.mailAddress, form.isAdmin, form.url)
    updateImage(form.userName, form.fileId, false)
    redirect("/admin/users")
  })
  
  get("/admin/users/:userName/_edituser")(adminOnly {
    val userName = params("userName")
    admin.users.html.user(getAccountByUserName(userName, true))
  })

  get("/admin/users/suggestions")(adminOnly {
    val userName = params("q")
    val users = getAllUsers().filter(!_.isGroupAccount).filter(_.userName.contains(userName))
    admin.users.html.suggestions(users)
  })

  post("/admin/users/:userName/_edituser", editUserForm)(adminOnly { form =>
    val userName = params("userName")
    getAccountByUserName(userName, true).map { account =>

      if(form.isRemoved){
        // Remove repositories
        getRepositoryNamesOfUser(userName).foreach { repositoryName =>
          deleteRepository(userName, repositoryName)
          FileUtils.deleteDirectory(getRepositoryDir(userName, repositoryName))
          FileUtils.deleteDirectory(getWikiRepositoryDir(userName, repositoryName))
          FileUtils.deleteDirectory(getTemporaryDir(userName, repositoryName))
        }
        // Remove from GROUP_MEMBER, COLLABORATOR and REPOSITORY
        removeUserRelatedData(userName)
      }

      updateAccount(account.copy(
        password     = form.password.map(sha1).getOrElse(account.password),
        fullName     = form.fullName,
        mailAddress  = form.mailAddress,
        isAdmin      = form.isAdmin,
        url          = form.url,
        isRemoved    = form.isRemoved))

      updateImage(userName, form.fileId, form.clearImage)
      redirect("/admin/users")

    } getOrElse NotFound
  })

  get("/admin/users/_newgroup")(adminOnly {
    admin.users.html.group(None, Nil)
  })

  post("/admin/users/_newgroup", newGroupForm)(adminOnly { form =>
    createGroup(form.groupName, form.url)
    val members = form.members.zip(form.memberTypes)
    updateGroupMembers(form.groupName, members)
    updateImage(form.groupName, form.fileId, false)
    redirect("/admin/users")
  })

  get("/admin/users/:groupName/_editgroup")(adminOnly {
    defining(params("groupName")){ groupName =>
      admin.users.html.group(getAccountByUserName(groupName, true), getGroupMembers(groupName))
    }
  })

  post("/admin/users/:groupName/_editgroup", editGroupForm)(adminOnly { form =>
    val members = form.members.zip(form.memberTypes)
    println(s"memebers: $members")
    val groupName = params("groupName")
      getAccountByUserName(groupName, true).map { account =>
      updateGroup(groupName, form.url, form.isRemoved)

      if(form.isRemoved){
        // Remove from GROUP_MEMBER
        updateGroupMembers(groupName, Nil)
        // Remove repositories
        getRepositoryNamesOfUser(groupName).foreach { repositoryName =>
          deleteRepository(groupName, repositoryName)
          FileUtils.deleteDirectory(getRepositoryDir(groupName, repositoryName))
          FileUtils.deleteDirectory(getWikiRepositoryDir(groupName, repositoryName))
          FileUtils.deleteDirectory(getTemporaryDir(groupName, repositoryName))
        }
      } else {
        // Update GROUP_MEMBER
        updateGroupMembers(groupName, members)
        // Update COLLABORATOR for group repositories
        getRepositoryNamesOfUser(groupName).foreach { repositoryName =>
          removeCollaborators(groupName, repositoryName)
          members.foreach { case (userName, isManager) =>
            addCollaborator(groupName, repositoryName, userName)
          }
        }
      }

      updateImage(groupName, form.fileId, form.clearImage)
      redirect("/admin/users")
    }
  })

  private def members: Constraint = new Constraint(){
    override def validate(name: String, value: String, messages: Messages): Option[String] = {
      if(value.split(",").exists {
        _.split(":") match { case Array(userName, isManager) => isManager.toBoolean }
      }) None else Some("Must select one manager at least.")
    }
  }

  protected def disableByNotYourself(paramName: String): Constraint = new Constraint() {
    override def validate(name: String, value: String, messages: Messages): Option[String] = {
      params.get(paramName).flatMap { userName =>
        if(userName == context.loginAccount.get.userName)
          Some("You can't disable your account yourself")
        else
          None
      }
    }
  }
}
