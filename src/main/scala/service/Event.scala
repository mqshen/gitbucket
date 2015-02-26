package service

/**
 * Created by goldratio on 2/26/15.
 */
trait Event {
  def timestamp: String
  def reason: String

  override def toString(): String = {
    s""""timestamp":"$timestamp","reason":$reason"""
  }

}
