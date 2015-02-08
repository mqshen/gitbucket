package compare

/**
 * Created by goldratio on 2/5/15.
 */
class DeleteDiff(val left: Int, val leftText: String) extends Diff {

  def right = 0

  override def rightText: String = ""

}
