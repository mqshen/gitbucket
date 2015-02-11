package compare

import scala.collection.mutable.ListBuffer

/**
 * Created by goldratio on 2/11/15.
 */

case class ExpandableRange(start: Int, end: Int)

object DiffUtil {
  val diff = new MyersDiff
  val split = "\\r?\\n"
  val redundancy = 3


  def diffString(t1: Option[String], t2: Option[String]): Option[(Seq[String], Int, Int, Seq[(AnyRef, Int, Int)])] = {
    val textLines1: Seq[String] = t1.map(_.split(split).toSeq).getOrElse( Seq.empty )
    val textLines2: Seq[String] = t2.map(_.split(split).toSeq).getOrElse( Seq.empty )
    var index = 0
    var next = 0
    var insertCount = 0
    var deleteCount = 0
    diff.diff(textLines1, textLines2).map { patch =>
      val deltas = new scala.collection.mutable.ArrayBuffer[(AnyRef, Int, Int)]()
      patch.deltas.reverse.foldLeft(0){ case (lastPosition, delta) =>
        val topStart = delta.original.position - redundancy
        if(topStart < lastPosition) {
          deltas.append(((lastPosition until delta.original.position), index, next))
        }
        else {
          deltas.append((ExpandableRange(lastPosition, topStart), index, next))
          deltas.append(((topStart until delta.original.position), index, next))
        }
        delta match {
          case delta : DeleteDelta =>
            next = index - delta.original.lines.size
            next = math.max(index, 0)
            deltas.append((delta, index, next))
            deleteCount = deleteCount + delta.original.lines.size
          case delta : InsertDelta =>
            next = index + delta.revised.lines.size
            deltas.append((delta, index, next))
            insertCount = insertCount + delta.revised.lines.size
          case delta: Delta =>
            insertCount = insertCount + delta.revised.lines.size
            deleteCount = deleteCount + delta.original.lines.size
            deltas.append((delta, index, index))
        }
        val bottomStart = delta.original.position + delta.original.lines.size
        val end = if(bottomStart > textLines1.size - redundancy) {
          deltas.append(((bottomStart until textLines1.size), index, next))
          textLines1.size
        }
        else {
          val end =  bottomStart + redundancy
          deltas.append(((bottomStart until end), index, next))
          end
        }
        index = next
        end
      }


      (textLines1, insertCount, deleteCount, deltas)
    }
  }

}
