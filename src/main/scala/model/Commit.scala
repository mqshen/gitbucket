package model

/**
 * Created by goldratio on 4/11/15.
 */
trait CommitComponent extends TemplateComponent { self: Profile =>
  import profile.simple._
  import self._

  lazy val Commits = TableQuery[Commits]

  class Commits(tag: Tag) extends Table[Commit](tag, "COMMIT") with BasicTemplate {
    val commitId = column[String]("COMMIT_ID")
    val commitName = column[String]("COMMIT_USER_NAME")
    def * = (userName, repositoryName, commitId, commitName) <> (Commit.tupled, Commit.unapply)

    def byPrimaryKey(owner: String, repository: String, commitId: String) =
      byRepository(owner, repository) && (this.commitId === commitId.bind)
  }
}

case class Commit(
  userName: String,
  repositoryName: String,
  commitId: String,
  commitName: String
)
