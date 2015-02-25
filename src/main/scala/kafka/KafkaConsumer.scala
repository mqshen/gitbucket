package kafka

import app.EventPusher
import kafka.consumer.{Whitelist, Consumer, ConsumerConfig}
import kafka.message._
import kafka.serializer._
import kafka.utils._
import java.util.Properties
import kafka.utils.Logging
import scala.collection.JavaConversions._

/**
 * Created by goldratio on 2/14/15.
 */
class KafkaConsumer(topic: String,
                    groupId: String,
                    zookeeperConnect: String,
                    readFromStartOfStream: Boolean = true)extends Logging {
  val props = new Properties()
  props.put("group.id", groupId)
  props.put("zookeeper.connect", zookeeperConnect)
  props.put("auto.offset.reset", if(readFromStartOfStream) "smallest" else "largest")

  val config = new ConsumerConfig(props)
  val connector = Consumer.create(config)

  val filterSpec = new Whitelist(topic)

  info("setup:start topic=%s for zk=%s and groupId=%s".format(topic,zookeeperConnect,groupId))
  val stream = connector.createMessageStreamsByFilter(filterSpec, 1, new DefaultDecoder(), new DefaultDecoder()).get(0)
  info("setup:complete topic=%s for zk=%s and groupId=%s".format(topic,zookeeperConnect,groupId))

  def read(write: (Array[Byte])=>Unit) = {
    info("reading on stream now")
    for(messageAndTopic <- stream) {
      try {
        info("writing from stream")
        write(messageAndTopic.message)
        info("written to stream")
      } catch {
        case e: Throwable =>
          if (true) { //this is objective even how to conditionalize on it
            error("Error processing message, skipping this message: ", e)
          } else {
            throw e
          }
      }
    }
  }


  def close() {
    connector.shutdown()
  }

}
