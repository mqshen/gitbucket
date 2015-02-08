package compare

/**
 * Created by goldratio on 2/5/15.
 */
class InsertDiff(val right: Int, val rightText: String) extends Diff {

  def left = 0

  override def leftText: String = ""

}
