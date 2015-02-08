package compare

/**
 * Created by goldratio on 2/5/15.
 */
object CompareTest {

  def main(args: Array[String]): Unit = {
    Compare.compare(Some("this is a message line;\n this is a message line;\n this is a message line;\n this is a message line;\n this is a message line;\n this is a message line;\n this is a message line;\n this is a message line;"), None).map {
      case e: compare.EqualDiff => {
        println(s"equal; ${e.left}, ${e.right}, ${e.leftText}")
      }
      case e: compare.DeleteDiff => {
        println(s"delete; ${e.left}, ${e.leftText}")
      }
      case e: compare.InsertDiff => {
        println(s"insert; ${e.right}, ${e.rightText}")
      }
    }


  }

}
