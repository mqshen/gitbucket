package service

import app.EventPusher
import kafka.GitbucketConsumer
import org.json4s.{ShortTypeHints, Formats}
import org.json4s.jackson.Serialization

import scala.collection.mutable

/**
 * Created by goldratio on 2/26/15.
 */

case class RepositoryEvent(userName: String, owner: String, repositoryName: String, timestamp: String) extends Event {

  def reason: String = {
    s""""repository '$owner/$repositoryName' was pushed to by '$userName'"}"""
  }

}

class RepositoryConsumerActor extends Runnable with EventConsumerActor{
  implicit protected def jsonFormats: Formats = Serialization.formats(ShortTypeHints(List(classOf[RepositoryEvent])))

  val subscribes = mutable.HashMap[String, mutable.ArrayBuffer[EventPusher]]()

  def readRepositoryNotification(binaryObject: Array[Byte]): Unit = {
    val message = new String(binaryObject)
    println(message)
    try {
      val repositoryEvent = Serialization.read[RepositoryEvent](message)
      subscribes.get(s"${repositoryEvent.owner}/${repositoryEvent.repositoryName}").map{ eventPushers =>
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

  def getTitle(eventPusher: EventPusher): String = {
    val subscribes = eventPusher.subscribe.split(":")
    if(subscribes.length == 3) {
      subscribes(0)
    }
    else {
      ""
    }

  }

  override def registerSubscribe(eventPusher: EventPusher): Unit = {
    val title = getTitle(eventPusher)
    subscribes.get(title).map(_ += eventPusher).getOrElse{
      val list = new mutable.ArrayBuffer[EventPusher]()
      list += eventPusher
      subscribes.put(title, list)
    }
  }

  override def unregisterSubscribe(eventPusher: EventPusher): Unit = {
    val title = getTitle(eventPusher)
    subscribes.get(title).map(_ -= eventPusher)
  }

}
