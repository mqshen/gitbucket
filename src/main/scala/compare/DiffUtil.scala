package compare

import play.twirl.api.Html
import syntax.SyntaxUtil
import util.StringUtil

/**
 * Created by goldratio on 2/11/15.
 */

class DiffBlock(val position: Int, val lines: Seq[Html]) {
  def size = lines.size
}

trait DiffOperation {
  def original: DiffBlock
  def revised: DiffBlock
  def opType : Type.Type
}


class ChangeDiffOperation(val original: DiffBlock, val revised: DiffBlock) extends DiffOperation {
  val opType = Type.Change

  override def toString: String = {
    "[ChangeDelta, position: " + original.position + ", size: " + original.size + " to " + revised.size + "]"
  }
}

class DeleteDiffOperation(val original: DiffBlock, val revised: DiffBlock) extends DiffOperation {
  val opType = Type.Delete

  override def toString: String = {
    "[DeleteDelta, position: " + original.position + ", lines: " + original.size + "]"
  }
}

class InsertDiffOperation(val original: DiffBlock, val revised: DiffBlock) extends DiffOperation {
  val opType = Type.Insert

  override def toString: String = {
    "[InsertDelta, position: " + original.position + ", lines: " + revised.size + "]"
  }
}

case class ExpandableRange(start: Int, end: Int)


object DiffUtil {
  val diff = new MyersDiff
  val split = "\\r?\\n"
  val redundancy = 3


  def diffString(fileName: String, t1: Option[String], t2: Option[String]): Option[(Seq[Html], Int, Int, Seq[(AnyRef, Int, Int)])] = {
    val textLines1: Seq[String] = t1.map(_.split(split).toSeq).getOrElse( Seq.empty )
    val textLines2: Seq[String] = t2.map(_.split(split).toSeq).getOrElse( Seq.empty )
    var index = 0
    var next = 0
    var insertCount = 0
    var deleteCount = 0
    diff.diff(textLines1, textLines2).map { patch =>
      val deltas = new scala.collection.mutable.ArrayBuffer[(AnyRef, Int, Int)]()

      val textHighLight1 = SyntaxUtil.getSyntax(fileName, t1.getOrElse(""))
      val textHighLight2 = SyntaxUtil.getSyntax(fileName, t2.getOrElse(""))

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
            next = index - delta.original.size
            next = math.max(index, 0)

            val original = new DiffBlock(delta.original.position, copyOfRange(textHighLight1, delta.original.position, delta.original.position + delta.original.size))
            val revised = new DiffBlock(delta.revised.position, copyOfRange(textHighLight2, delta.revised.position, delta.revised.position + delta.revised.size))
            val diffOperation = new DeleteDiffOperation(original, revised)

            deltas.append((diffOperation, index, next))
            deleteCount = deleteCount + delta.original.size
          case delta : InsertDelta =>
            next = index + delta.revised.size

            val original = new DiffBlock(delta.original.position, copyOfRange(textHighLight1, delta.original.position, delta.original.position + delta.original.size))
            val revised = new DiffBlock(delta.revised.position, copyOfRange(textHighLight2, delta.revised.position, delta.revised.position + delta.revised.size))
            val diffOperation = new InsertDiffOperation(original, revised)

            deltas.append((diffOperation, index, next))
            insertCount = insertCount + delta.revised.size
          case delta: Delta =>
            insertCount = insertCount + delta.revised.size
            deleteCount = deleteCount + delta.original.size

            val original = new DiffBlock(delta.original.position, copyOfRange(textHighLight1, delta.original.position, delta.original.position + delta.original.size))
            val revised = new DiffBlock(delta.revised.position, copyOfRange(textHighLight2, delta.revised.position, delta.revised.position + delta.revised.size))
            val diffOperation = new ChangeDiffOperation(original, revised)

            deltas.append((diffOperation, index, index))
        }
        val bottomStart = delta.original.position + delta.original.size
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


      (textHighLight1, insertCount, deleteCount, deltas)
    }
  }



  def copyOfRange (original: Seq[Html], fromIndex: Int, to: Int) = {
    original.slice(fromIndex, to)
  }
}
