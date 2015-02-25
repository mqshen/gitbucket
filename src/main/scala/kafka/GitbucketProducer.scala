package kafka

import java.util.Date

/**
 * Created by goldratio on 2/14/15.
 */
//case class IssueMessage(userName: String, repositoryName: String, issueId: String) {
//
//  override def toString = {
//  }
//
//}

object GitbucketProducer {
  //val repositoryProducer = KafkaProducer("repository", "dev1:9092")
  val issuesProducer = KafkaProducer("issues", "dev1:9092")
  val repositoryProducer = KafkaProducer("repository", "dev1:9092")

  def produceIssues(userName: String, repositoryName: String, issueId: Int) = {
    val issueMessage = s"""{userName: "$userName", repositoryName: "${repositoryName}", issueId: "${issueId}"}"""

    issuesProducer.send(issueMessage)
  }

  def produceRepository(userName: String, ownerName: String, repositoryName: String, timestamp: Date) = {
    val repositoryMessage = s"""{userName: "$userName", ownerName: "$ownerName", repositoryName: "${repositoryName}", timestamp: "${timestamp}"}"""

    repositoryProducer.send(repositoryMessage)
  }
}

object GitbucketConsumer {
  val issuesConsumer = new KafkaConsumer("issues", "1", "dev1:2181")

  val repositoryConsumer = new KafkaConsumer("repository", "1", "dev1:2181")

  def readIssues(write: (Array[Byte])=>Unit) = {
    issuesConsumer.read(write)
  }

  def readRepository(write: (Array[Byte])=>Unit) = {
    repositoryConsumer.read(write)
  }
}