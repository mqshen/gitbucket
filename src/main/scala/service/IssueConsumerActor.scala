package service

import app.EventPusher
import kafka.GitbucketConsumer
import org.json4s.{ShortTypeHints, Formats}
import org.json4s.jackson.Serialization

import scala.collection.mutable

/**
 * Created by goldratio on 2/26/15.
 */


case class IssueEvent(owner: String, repositoryName: String, issueId: String, timestamp: String) extends Event {

  def reason: String = {
    s""""issue #${issueId} updated""""
  }

}

class IssueConsumerActor extends Runnable with EventConsumerActor {
  implicit protected def jsonFormats: Formats = Serialization.formats(ShortTypeHints(List(classOf[IssueEvent])))

  val subscribes = mutable.HashMap[String, mutable.ArrayBuffer[EventPusher]]()

  def readIssueNotification(binaryObject: Array[Byte]): Unit = {
    val message = new String(binaryObject)
    println(message)
    try {
      val issueEvent = Serialization.read[IssueEvent](message)
      subscribes.get(s"${issueEvent.owner}/${issueEvent.repositoryName}:issue:${issueEvent.issueId}").map{ eventPushers =>
        eventPushers.foreach(_.push(issueEvent))
      }
    }
    catch {
      case e: Throwable =>
        e.printStackTrace()
    }
  }

  override def run(): Unit = {
    GitbucketConsumer.readIssues(readIssueNotification)
  }


  override def registerSubscribe(eventPusher: EventPusher): Unit = {

    subscribes.get(eventPusher.subscribe).map(_ += eventPusher).getOrElse{
      val list = new mutable.ArrayBuffer[EventPusher]()
      list += eventPusher
      subscribes.put(eventPusher.subscribe, list)
    }

  }


  override def unregisterSubscribe(eventPusher: EventPusher): Unit = {
    subscribes.get(eventPusher.subscribe).map(_ -= eventPusher)
  }
}
