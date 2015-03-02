package model

trait WebHookComponent extends TemplateComponent { self: Profile =>
  import profile.simple._

  lazy val WebHooks = TableQuery[WebHooks]

  class WebHooks(tag: Tag) extends Table[WebHook](tag, "WEB_HOOK") with BasicTemplate {
    val hookId = column[Int]("HOOK_ID", O AutoInc)
    val url = column[String]("URL")
    val authUrl = column[Option[String]]("AUTH_URL")
    def * = (userName, repositoryName, authUrl, url, hookId) <> (WebHook.tupled, WebHook.unapply)

    def byPrimaryKey(owner: String, repository: String, url: String) = byRepository(owner, repository) && (this.url === url.bind)
  }
}

case class WebHook(
  userName: String,
  repositoryName: String,
  authUrl: Option[String],
  url: String,
  hookId: Int  = 0
)
