package compare

/**
 * Created by goldratio on 2/5/15.
 */
class EqualDiff(val left: Int, val right: Int, text: String) extends Diff {

  override def leftText: String = text

  override def rightText: String = text

}
