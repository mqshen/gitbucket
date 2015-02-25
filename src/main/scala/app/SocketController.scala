package app


import java.io.{PrintWriter, IOException, StringReader, BufferedReader}
import java.nio.charset.Charset
import java.util.{UUID, Date}
import java.util.concurrent.{ScheduledExecutorService, Executors, TimeUnit}
import javax.servlet.{ServletRequest, ServletConfig, ServletOutputStream}
import javax.servlet.http.{HttpServletResponse, HttpServletRequest}

import _root_.servlet.RedisClientPool
import akka.actor.{ Props, Actor}
import jp.sf.amateras.scalatra.forms._
import org.apache.catalina
import org.apache.catalina.CometProcessor
import org.jboss.servlet.http.{HttpEvent, HttpEventServlet}
import org.scalatra.i18n.{I18nSupport, Messages}
import org.scalatra.json.JacksonJsonSupport
import org.scalatra.servlet.ScalatraAsyncSupport
import kafka.GitbucketConsumer
import org.json4s._
import org.scalatra._
import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext
import scala.collection.mutable
import org.json4s.jackson.Serialization

/**
 * Created by goldratio on 2/13/15.
 */
object IssuesConsumerActor {
  def props() = Props(classOf[IssuesConsumerActor])
}

class IssuesConsumerActor extends Actor {

  def readIssuesNotification(binaryObject: Array[Byte]) = {
    val message = new String(binaryObject)
    println(message)
  }

  GitbucketConsumer.readIssues(readIssuesNotification)

  override def receive: Receive = {
    case e: String =>
      println(e)
  }
}

case class RepositoryEvent(userName: String, ownerName: String, repositoryName: String, timestamp: String) extends Event {

  def reason: String = {
    s""""repository '$ownerName/$repositoryName' was pushed to by '$userName'"}"""
  }

}

class RepositoryConsumerActor extends Runnable{
  implicit protected def jsonFormats: Formats = Serialization.formats(ShortTypeHints(List(classOf[RepositoryEvent])))

  val subscribes = mutable.HashMap[String, mutable.ArrayBuffer[EventPusher]]()

  def readRepositoryNotification(binaryObject: Array[Byte]): Unit = {
    val message = new String(binaryObject)
    println(message)
    try {
      val repositoryEvent = Serialization.read[RepositoryEvent](message)
      subscribes.get(s"${repositoryEvent.ownerName}/${repositoryEvent.repositoryName}").map{ eventPushers =>
        eventPushers.foreach(_.push(repositoryEvent))
      }
    }
    catch {
      case e: Throwable =>
        e.printStackTrace()
    }
  }

  override def run(): Unit = {
    GitbucketConsumer.readRepository(readRepositoryNotification)
  }


  def registerSubscribe(title: String, eventPusher: EventPusher): Unit = {

    subscribes.get(title).map(_ += eventPusher).getOrElse{
      val list = new mutable.ArrayBuffer[EventPusher]()
      list += eventPusher
      subscribes.put(title, list)
    }

  }

}

trait Event {
  def timestamp: String
  def reason: String

  override def toString(): String = {
    s""""timestamp":"$timestamp","reason":$reason"""
  }

}

class EventPusher(subscribe: String, writer: PrintWriter, scheduler: ScheduledExecutorService) extends Runnable {
  var closed: Boolean = false

  def scheduleHeartBeat() {
    if (!closed) {
      writer.write(":keepalive\n\n")
      writer.flush()
      scheduler.schedule(this, 2, TimeUnit.SECONDS)
    }
  }

  def close(): Unit = {
    closed = true
    writer.close()
  }

  override def run() = {
    try {
      //writer.write("data: " + "[\"root/ttt:post-receive:root\",{\"timestamp\":\"2015-02-22T23:39:48-08:00\",\"reason\":\"repository 'root/ttt' was pushed to by 'root'\"}]\n\n")
      //writer.flush()
      scheduleHeartBeat()
    }
    catch {
      case x: IOException =>
        println(x)
    }
    //complete async
    //ac.complete()
  }

  def push(event: Event) = {
    writer.write(s"""data:["${subscribe}",{${event.toString()}]\n\n""")
    writer.flush()
  }

}

class SocketController extends ScalatraServlet with ClientSideValidationFormSupport
  with Handler with CometProcessor with HttpEventServlet with ApiFormats
  with JacksonJsonSupport with I18nSupport with ScalatraAsyncSupport {

  val scheduler = Executors.newSingleThreadScheduledExecutor()
  val executor = ExecutionContext.Implicits.global

  val repositoryConsumer = new RepositoryConsumerActor
  executor.execute(repositoryConsumer)

  override implicit protected def jsonFormats: Formats = DefaultFormats

  override def render(value: JValue)(implicit formats: Formats): JValue = {
    JString("test")
  }

  case class Message(subscribe : String)

  def subscribe = new ValueType[Message] {
    override def convert(name: String, params: Map[String, String], messages: Messages): Message = {
      params.get("subscribe").map(Message(_)).getOrElse(Message(""))
    }
    override def validate(name: String, params: Map[String, String], messages: Messages): Seq[(String, String)] = Seq.empty
  }

  case class MessageForm(messages: List[Message])

  val messageForm = mapping(
    "message"            -> list(subscribe)
  )(MessageForm.apply)

  post("/_sockets", messageForm) { form =>
    val sid = UUID.randomUUID().toString
    form.messages.map { message =>
      println(s"message: ${message}" )
      RedisClientPool.clients.withClient { client =>
        client.set(sid, message.subscribe)
      }
    }

    val urls = Map("pollUrl" -> s"/socket/_sockets/$sid", "messageUrl" -> s"/socket/_sockets/$sid/message")
    contentType = formats("json")
    org.json4s.jackson.Serialization.write( urls )

  }

  get("/_sockets/:sid") {
    //request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true)
    val sid = params("sid")
    RedisClientPool.clients.withClient { client =>
      client.get(sid).map { subscribe =>
        val ac = request.startAsync(request, response)
        val writer = response.getWriter()
        respond(request, response)
        val pusher = new EventPusher(subscribe, writer, scheduler)
        val index = subscribe.indexOf(":")
        val repositoryUrl  = subscribe.substring(0, index)
        repositoryConsumer.registerSubscribe(repositoryUrl, pusher)
        // submit the runnable to managedExecutorService
        executor.execute(pusher)
      }
    }
  }

  def open(eventSource: EventSource , emitter: Emitter ) {
    eventSource.onOpen(emitter)
  }


  def respond(request: HttpServletRequest ,response: HttpServletResponse ) {
      response.setStatus(HttpServletResponse.SC_OK)
      response.setCharacterEncoding(Charset.forName("UTF-8").name())
      response.setContentType("text/event-stream")
      // By adding this header, and not closing the connection,
      // we disable HTTP chunking, and we can use write()+flush()
      // to send data in the text/event-stream protocol
      response.addHeader("Connection", "close")
      //response.flushBuffer()
    }

  def newEventSource(request: HttpServletRequest ): EventSource = {
    new EventSource() {

      def onOpen(emitter: Emitter ) {
        emitter.sendData("event: server-time\r\n")  //take note of the 2 \n 's, also on the next line.
        emitter.sendData("data: 1234\r\n")
        emitter.sendData("\u20AC")
      }

      def onClose(): Unit = {
        println("close")
      }

    }
  }

  class EventSourceEmitter(eventSource: EventSource, output: ServletOutputStream) extends Emitter with Runnable {
    val closed: Boolean = false


    override def sendEvent(name: String , data: String ) {
        output.print("event: ")
        output.print(name)
        output.print("\r\n")
      sendData(data)
    }

    override def sendData(data: String ) {
      val reader = new BufferedReader(new StringReader(data))
      Stream.continually(reader.readLine()).takeWhile(_ != null).foreach { line =>
        output.print("data: ")
        output.print(line)
        output.print("\r\n")
      }
      flush()
    }

    override def sendComment(comment: String )  {
        output.print(": ")
        output.print(comment)
        output.print("\r\n")
        output.print("\r\n")
        flush()
    }

    override def run() {
      // If the other peer closes the connection, the first
      // flush() should generate a TCP reset that is detected
      // on the second flush()
      try {
        output.write('\r')
        flush()
        output.write('\n')
        flush()
        scheduleHeartBeat()
      }
      catch {
        case x: IOException =>
          println(x)
      }
    }

    def flush()  {
      //continuation.getServletResponse().flushBuffer()
      output.flush()
    }

    override def close() {
      output.flush()
      output.close()
    }

    def scheduleHeartBeat() {
      if (!closed) {
        println("heartbeat")
        val heartBeat = scheduler.schedule(this, 10, TimeUnit.SECONDS)
        println(heartBeat)
      }
    }
  }


  override def event(cometEvent: catalina.CometEvent): Unit = {
    println("comment catalina")

  }

  override def event(httpEvent: HttpEvent): Unit = {
    println("comment http")

  }


}

trait Emitter {

  def sendEvent(name: String , data: String )

  def sendData(data: String )

  def sendComment(comment: String )

  def close()
}

trait EventSource {

  def onOpen(emitter: Emitter )

  def onClose()


}