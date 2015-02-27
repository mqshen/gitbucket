package service

import app.EventPusher

/**
 * Created by goldratio on 2/27/15.
 */
trait EventConsumerActor {

  def registerSubscribe(eventPusher: EventPusher)

  def unregisterSubscribe(eventPusher: EventPusher)

}
