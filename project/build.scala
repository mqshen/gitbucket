import com.typesafe.sbteclipse.plugin.EclipsePlugin.EclipseKeys
import play.twirl.sbt.SbtTwirl
import sbt.Keys._
import sbt._

object MyBuild extends Build {
  val Organization = "jp.sf.amateras"
  val Name = "gitbucket"
  val Version = "0.0.1"
  val ScalaVersion = "2.11.2"
  //val ScalatraVersion = "2.3.0"
  val ScalatraVersion = "2.4.0-SNAPSHOT"


//  import java.io.File
//  import com.yahoo.platform.yui.compressor.YUICompressor
//
//  val assetsPath = "src/main/webapp/assets/"
//  val libPath = assetsPath + "vendors/"
//  val sourceJS = Array("jquery/dist/jquery.js", "WeakMap/weakmap.js", "MutationObservers/MutationObserver.js")
//  val sourcePaths = sourceJS.map { js =>
//    new File(libPath, js).getPath
//  }
//  val dest = new File(assetsPath, "script-min.js")
//  YUICompressor.main(Array("-o", dest.getPath) ++ sourcePaths)

  lazy val project = Project (
    "gitbucket",
    file(".")
  )
  .settings(
    sourcesInBase := false,
    organization := Organization,
    name := Name,
    version := Version,
    scalaVersion := ScalaVersion,
    resolvers ++= Seq(
      "Local Maven Repository" at "file://"+ Path.userHome.absolutePath + "/.m2/repository",
      "Sonatype OSS Releases" at "https://oss.sonatype.org/content/repositories/releases",
      "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots",
      Classpaths.typesafeReleases,
      "amateras-repo" at "http://amateras.sourceforge.jp/mvn/"
    ),
    scalacOptions := Seq("-deprecation", "-language:postfixOps"),
    libraryDependencies ++= Seq(
      "org.eclipse.jgit" % "org.eclipse.jgit.http.server" % "3.4.1.201406201815-r",
      "org.eclipse.jgit" % "org.eclipse.jgit.archive" % "3.4.1.201406201815-r",
      "org.scalatra" %% "scalatra" % ScalatraVersion,
      "org.scalatra" %% "scalatra-scalate" % ScalatraVersion,
      "org.scalatra" %% "scalatra-atmosphere" % ScalatraVersion,
      "org.scalatra" %% "scalatra-specs2" % ScalatraVersion % "test",
      "org.scalatra" %% "scalatra-json" % ScalatraVersion,
      "org.json4s" %% "json4s-jackson" % "3.2.10",
      "jp.sf.amateras" %% "scalatra-forms" % "0.1.0-SNAPSHOT",
      "commons-io" % "commons-io" % "2.4",
      "org.pegdown" % "pegdown" % "1.4.1",
      "org.apache.commons" % "commons-compress" % "1.5",
      "org.apache.commons" % "commons-email" % "1.3.1",
      "commons-fileupload" % "commons-fileupload" % "1.3.1",
      "org.apache.httpcomponents" % "httpclient" % "4.3",
      "org.apache.sshd" % "apache-sshd" % "0.11.0",
      "mysql" % "mysql-connector-java" % "5.1.29",
      "net.debasishg" %% "redisclient" % "2.13",
      "com.typesafe.slick" %% "slick" % "2.1.0",
      "com.novell.ldap" % "jldap" % "2009-10-07",
      "org.quartz-scheduler" % "quartz" % "2.2.1",
      "com.h2database" % "h2" % "1.4.180",
      "com.github.mqshen" %% "scala-pygments" % "0.1.0-SNAPSHOT",
      "ch.qos.logback" % "logback-classic" % "1.0.13" % "runtime",
      "org.eclipse.jetty" % "jetty-webapp" % "9.3.0-SNAPSHOT" % "container;provided",
      "org.eclipse.jetty" % "jetty-plus" % "9.3.0-SNAPSHOT" % "container;provided",
      "org.eclipse.jetty.orbit" % "javax.servlet" % "3.0.0.v201112011016" % "container;provided;test" artifacts Artifact("javax.servlet", "jar", "jar"),
      "junit" % "junit" % "4.11" % "test",
      "com.typesafe.play" %% "twirl-compiler" % "1.0.2",
      "org.apache.kafka" %% "kafka" % "0.8.2.0"
    ),
    EclipseKeys.withSource := true,
    javacOptions in compile ++= Seq("-target", "6", "-source", "6"),
    testOptions in Test += Tests.Argument(TestFrameworks.Specs2, "junitxml", "console"),
    packageOptions += Package.MainClass("JettyLauncher"),
    dependencyClasspath in Runtime ++= {
      val base = baseDirectory.value
      val baseDirectories = (base / "embed-jetty")
      val customJars = (baseDirectories ** "*.jar")
      customJars.classpath
    },
    unmanagedResourceDirectories in Compile := List(file("src/main/webapp"), file("src/main/resources"))
    ).enablePlugins(SbtTwirl)
}

