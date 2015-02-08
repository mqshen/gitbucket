package servlet

import java.io.{InputStreamReader, BufferedReader, File}
import java.sql._
import org.apache.commons.io.FileUtils
import javax.servlet.{ServletContext, ServletContextListener, ServletContextEvent}
import org.apache.commons.io.IOUtils
import org.apache.ibatis.jdbc.ScriptRunner
import org.slf4j.LoggerFactory
import util.Directory._
import util.ControlUtil._
import util.JDBCUtil._
import org.eclipse.jgit.api.Git
import util.Directory

object AutoUpdate {

  implicit class ExtendedConnection(connection: Connection) {
    def withStatement[T](sql: String)(f: PreparedStatement => T) = {
      var ok= false
      val s = connection.prepareStatement(sql)
      try {
        val res = f(s)
        ok = true
        res
      }
      finally {
        if(ok) s.close() // Let exceptions propagate normally
        else {
          // f(s) threw an exception, so don't replace it with an Exception from close()
          try s.close() catch { case _: Throwable => }
        }
      }
    }
  }

  implicit class ExtendedStatement(statement: PreparedStatement) {
    def withResult[T](f: ResultSet => T) = {
      var ok= false
      val rs = statement.executeQuery
      try {
        val res = f(rs)
        ok = true
        res
      }
      finally {
        if(ok) rs.close() // Let exceptions propagate normally
        else {
          // f(s) threw an exception, so don't replace it with an Exception from close()
          try rs.close() catch { case _: Throwable => }
        }
      }
    }
  }
  /**
   * Version of GitBucket
   * 
   * @param majorVersion the major version
   * @param minorVersion the minor version
   */
  case class Version(majorVersion: Int, minorVersion: Int){
    
    private val logger = LoggerFactory.getLogger(classOf[servlet.AutoUpdate.Version])
    
    /**
     * Execute update/MAJOR_MINOR.sql to update schema to this version.
     * If corresponding SQL file does not exist, this method do nothing.
     */
    def update(conn: Connection): Unit = {
      val sqlPath = s"update/${majorVersion}_${minorVersion}.sql"
      logger.debug(s"start execute sql: $sqlPath")
      using(Thread.currentThread.getContextClassLoader.getResourceAsStream(sqlPath)){ in =>
        if(in != null){
          val reader = new BufferedReader(new InputStreamReader(in, "UTF-8"))
          val scriptRunner = new ScriptRunner(conn)
          scriptRunner.runScript(reader)
        }
      }
    }
    
    /**
     * MAJOR.MINOR
     */
    val versionString = s"${majorVersion}.${minorVersion}"
  }

  /**
   * The history of versions. A head of this sequence is the current BitBucket version.
   */
  val versions = Seq(
    new Version(2, 8),
    new Version(2, 7) {
      override def update(conn: Connection): Unit = {
        super.update(conn)
        conn.select("SELECT * FROM REPOSITORY"){ rs =>
          // Rename attached files directory from /issues to /comments
          val userName = rs.getString("USER_NAME")
          val repoName = rs.getString("REPOSITORY_NAME")
          defining(Directory.getAttachedDir(userName, repoName)){ newDir =>
            val oldDir = new File(newDir.getParentFile, "issues")
            if(oldDir.exists && oldDir.isDirectory){
              oldDir.renameTo(newDir)
            }
          }
          // Update ORIGIN_USER_NAME and ORIGIN_REPOSITORY_NAME if it does not exist
          val originalUserName = rs.getString("ORIGIN_USER_NAME")
          val originalRepoName = rs.getString("ORIGIN_REPOSITORY_NAME")
          if(originalUserName != null && originalRepoName != null){
            if(conn.selectInt("SELECT COUNT(*) FROM REPOSITORY WHERE USER_NAME = ? AND REPOSITORY_NAME = ?",
                originalUserName, originalRepoName) == 0){
              conn.update("UPDATE REPOSITORY SET ORIGIN_USER_NAME = NULL, ORIGIN_REPOSITORY_NAME = NULL " +
                  "WHERE USER_NAME = ? AND REPOSITORY_NAME = ?", userName, repoName)
            }
          }
          // Update PARENT_USER_NAME and PARENT_REPOSITORY_NAME if it does not exist
          val parentUserName = rs.getString("PARENT_USER_NAME")
          val parentRepoName = rs.getString("PARENT_REPOSITORY_NAME")
          if(parentUserName != null && parentRepoName != null){
            if(conn.selectInt("SELECT COUNT(*) FROM REPOSITORY WHERE USER_NAME = ? AND REPOSITORY_NAME = ?",
                parentUserName, parentRepoName) == 0){
              conn.update("UPDATE REPOSITORY SET PARENT_USER_NAME = NULL, PARENT_REPOSITORY_NAME = NULL " +
                  "WHERE USER_NAME = ? AND REPOSITORY_NAME = ?", userName, repoName)
            }
          }
        }
      }
    },
    new Version(2, 6),
    new Version(2, 5),
    new Version(2, 4),
    new Version(2, 3) {
      override def update(conn: Connection): Unit = {
        super.update(conn)
        conn.select("SELECT ACTIVITY_ID, ADDITIONAL_INFO FROM ACTIVITY WHERE ACTIVITY_TYPE='push'"){ rs =>
          val curInfo = rs.getString("ADDITIONAL_INFO")
          val newInfo = curInfo.split("\n").filter(_ matches "^[0-9a-z]{40}:.*").mkString("\n")
          if (curInfo != newInfo) {
            conn.update("UPDATE ACTIVITY SET ADDITIONAL_INFO = ? WHERE ACTIVITY_ID = ?", newInfo, rs.getInt("ACTIVITY_ID"))
          }
        }
        FileUtils.deleteDirectory(Directory.getPluginCacheDir())
        FileUtils.deleteDirectory(new File(Directory.PluginHome))
      }
    },
    new Version(2, 2),
    new Version(2, 1),
    new Version(2, 0){
      override def update(conn: Connection): Unit = {
        import eu.medsea.mimeutil.{MimeUtil2, MimeType}

        val mimeUtil = new MimeUtil2()
        mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector")

        super.update(conn)
        conn.select("SELECT USER_NAME, REPOSITORY_NAME FROM REPOSITORY"){ rs =>
          defining(Directory.getAttachedDir(rs.getString("USER_NAME"), rs.getString("REPOSITORY_NAME"))){ dir =>
            if(dir.exists && dir.isDirectory){
              dir.listFiles.foreach { file =>
                if(file.getName.indexOf('.') < 0){
                  val mimeType = MimeUtil2.getMostSpecificMimeType(mimeUtil.getMimeTypes(file, new MimeType("application/octet-stream"))).toString
                  if(mimeType.startsWith("image/")){
                    file.renameTo(new File(file.getParent, file.getName + "." + mimeType.split("/")(1)))
                  }
                }
              }
            }
          }
        }
      }
    },
    Version(1, 13),
    Version(1, 12),
    Version(1, 11),
    Version(1, 10),
    Version(1, 9),
    Version(1, 8),
    Version(1, 7),
    Version(1, 6),
    Version(1, 5),
    Version(1, 4),
    new Version(1, 3){
      override def update(conn: Connection): Unit = {
        super.update(conn)
        // Fix wiki repository configuration
        conn.select("SELECT USER_NAME, REPOSITORY_NAME FROM REPOSITORY"){ rs =>
          using(Git.open(getWikiRepositoryDir(rs.getString("USER_NAME"), rs.getString("REPOSITORY_NAME")))){ git =>
            defining(git.getRepository.getConfig){ config =>
              if(!config.getBoolean("http", "receivepack", false)){
                config.setBoolean("http", null, "receivepack", true)
                config.save
              }
            }
          }
        }
      }
    },
    Version(1, 2),
    Version(1, 1),
    Version(1, 0),
    Version(0, 0)
  )
  
  /**
   * The head version of BitBucket.
   */
  val headVersion = versions.head
  
  /**
   * The version file (GITBUCKET_HOME/version).
   */
  //lazy val versionFile = new File(GitBucketHome, "version")
  
  /**
   * Returns the current version from the version file.
   */
  def getCurrentVersion(conn: Connection): Version = {
    conn.withStatement("SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = 'GITBUCKET'  and TABLE_NAME = 'VERSIONS' LIMIT 1") { statement =>
      statement.withResult { rs =>
        if(rs.next()) {
          conn.withStatement("SELECT MAJOR, MINOR FROM VERSIONS ORDER BY MAJOR, MINOR LIMIT 1") { st =>
            st.withResult { resultSet =>
              if(resultSet.next()) {
                val major = resultSet.getInt(1)
                val minor = resultSet.getInt(2)
                Version(major, minor)
              }
              else {
                Version(0, 0)
              }
            }
          }
        }
        else {
          Version(0, 0)
        }
      }
    }
  }

  def updateVersion(conn: Connection, version: Version) = {
    conn.withStatement("INSERT INTO VERSIONS(MAJOR, MINOR, UPDATED) VALUES(?, ?, ?)") { statement =>
      statement.setInt(1, version.majorVersion)
      statement.setInt(2, version.minorVersion)
      val currentTimestamp = System.currentTimeMillis()
      statement.setTimestamp(3, new Timestamp(currentTimestamp))
      statement.executeUpdate()
    }
  }
  
}

/**
 * Update database schema automatically in the context initializing.
 */
class AutoUpdateListener extends ServletContextListener {
  import AutoUpdate._

  private val logger = LoggerFactory.getLogger(classOf[AutoUpdateListener])
//  private val scheduler = StdSchedulerFactory.getDefaultScheduler
  
  override def contextInitialized(event: ServletContextEvent): Unit = {
    val dataDir = event.getServletContext.getInitParameter("gitbucket.home")
    if(dataDir != null){
      System.setProperty("gitbucket.home", dataDir)
    }
    //org.h2.Driver.load()
    //Class.forName("com.mysql.jdbc.Driver"

    val context = event.getServletContext
    //context.setInitParameter("db.url", s"jdbc:h2:${DatabaseHome};MVCC=true")
    //context.setInitParameter("db.url", s"jdbc:mysql://dev1:3306/gitbucket?characterEncoding=utf8")

    defining(getConnection(event.getServletContext)){ conn =>
      logger.debug("Start schema update")
      try {
        defining(getCurrentVersion(conn)){ currentVersion =>
          if(currentVersion == headVersion){
            logger.debug("No update")
          } else if(!versions.contains(currentVersion)){
            logger.warn(s"Skip migration because ${currentVersion.versionString} is illegal version.")
          }
          else {
            logger.debug("start update database!")
            versions.takeWhile(_ != currentVersion).reverse.foreach(_.update(conn))
            //FileUtils.writeStringToFile(versionFile, headVersion.versionString, "UTF-8")
            updateVersion(conn, headVersion)
            logger.debug(s"Updated from ${currentVersion.versionString} to ${headVersion.versionString}")
          }
        }
      } catch {
        case ex: Throwable => {
          logger.error("Failed to schema update", ex)
          ex.printStackTrace()
          conn.rollback()
        }
      }
      logger.debug("End schema update")
    }
  }

  def contextDestroyed(sce: ServletContextEvent): Unit = {
  }

  private def getConnection(servletContext: ServletContext): Connection =
    DriverManager.getConnection(
      servletContext.getInitParameter("db.url"),
      servletContext.getInitParameter("db.user"),
      servletContext.getInitParameter("db.password"))

  private def getDatabase(servletContext: ServletContext): scala.slick.jdbc.JdbcBackend.Database =
    slick.jdbc.JdbcBackend.Database.forURL(
      servletContext.getInitParameter("db.url"),
      servletContext.getInitParameter("db.user"),
      servletContext.getInitParameter("db.password"))

}
