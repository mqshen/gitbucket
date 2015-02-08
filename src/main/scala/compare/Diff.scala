package compare

/**
 * Created by goldratio on 2/5/15.
 */
trait Diff {
  def left: Int
  def right: Int
  def leftText: String
  def rightText: String
}
