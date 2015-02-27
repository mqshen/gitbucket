package app


import java.io.{PrintWriter, IOException, StringReader, BufferedReader}
import java.nio.charset.Charset
import java.util.{UUID, Date}
import java.util.concurrent.{ScheduledExecutorService, Executors, TimeUnit}
import javax.servlet._
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
import service.{EventConsumerActor, IssueConsumerActor, RepositoryConsumerActor, Event}
import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext
import scala.collection.mutable
import org.json4s.jackson.Serialization

/**
 * Created by goldratio on 2/13/15.
 */
//object IssuesConsumerActor {
//  def props() = Props(classOf[IssuesConsumerActor])
//}

//class IssuesConsumerActor extends Actor {
//
//  def readIssuesNotification(binaryObject: Array[Byte]) = {
//    val message = new String(binaryObject)
//    println(message)
//  }
//
//  GitbucketConsumer.readIssues(readIssuesNotification)
//
//  override def receive: Receive = {
//    case e: String =>
//      println(e)
//  }
//}

class EventPusher(val subscribe: String, writer: PrintWriter, ac: AsyncContext, eventConsumerActor: EventConsumerActor) extends Runnable {
  var closed: Boolean = false

  def scheduleHeartBeat() {
    if (!closed) {
      writer.write(":keepalive\n\n")
      writer.flush()
      Thread.sleep(TimeUnit.MINUTES.toMillis(1))
      scheduleHeartBeat()
      //scheduler.schedule(this, 60, TimeUnit.SECONDS)
    }
  }

  def close(): Unit = {
    eventConsumerActor.unregisterSubscribe(this)
    ac.complete()
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
        close()
        println(x)
    }
    //complete async
    //ac.complete()
  }

  def push(event: Event) = {
    writer.write(s"""data:["${subscribe}",{${event.toString()}}]\n\n""")
    writer.flush()
  }

}

class SocketController extends ScalatraServlet with ClientSideValidationFormSupport with ApiFormats
  with JacksonJsonSupport with I18nSupport with ScalatraAsyncSupport {

//  val scheduler = Executors.newSingleThreadScheduledExecutor()
  val executor = ExecutionContext.Implicits.global

  val repositoryConsumer = new RepositoryConsumerActor
  executor.execute(repositoryConsumer)

  val issueConsumer = new IssueConsumerActor
  executor.execute(issueConsumer)

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
        println("socket for subscribe" + subscribe)
        if (!request.isAsyncStarted) {
          val ac = request.startAsync(request, response)

          ac.setTimeout(0)
          val writer = response.getWriter()
          respond(request, response)
          val subscribes = subscribe.split(":")
          if(subscribes.length == 3) {
            subscribes(1) match {
              case "post-receive" =>
                val pusher = new EventPusher(subscribe, writer, ac, repositoryConsumer)
                repositoryConsumer.registerSubscribe(pusher)
                ac.start(pusher)
              case "issue" =>
                val pusher = new EventPusher(subscribe, writer, ac, issueConsumer)
                issueConsumer.registerSubscribe(pusher)
                ac.start(pusher)
            }
          }
        }
//        if(request.getDispatcherType == DispatcherType.ERROR) {
//          request.getAttribute("ASYNC_CONTEXT") match {
//            case ac : AsyncContext =>
//              ac.complete()
//          }
//        }
      }
    }
    ""
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