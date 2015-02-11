package compare

/**
 * Created by goldratio on 2/10/15.
 */
class Chunk(val position: Int, val lines: Seq[String]) {
  def size = lines.size
}

object Type extends Enumeration {
  type Type = Value
  val Change, Delete, Insert = Value
}


trait Delta {
  def original: Chunk
  def revised: Chunk
  def opType : Type.Type
}

class ChangeDelta(val original: Chunk, val revised: Chunk) extends Delta {
  val opType = Type.Change

  override def toString: String = {
    return "[ChangeDelta, position: " + original.position + ", lines: " + original.lines + " to " + revised.lines + "]"
  }
}

class DeleteDelta(val original: Chunk, val revised: Chunk) extends Delta {
  val opType = Type.Delete

  override def toString: String = {
    return "[DeleteDelta, position: " + original.position + ", lines: " + original.lines + "]"
  }
}

class InsertDelta(val original: Chunk, val revised: Chunk) extends Delta {
  val opType = Type.Insert

  override def toString: String = {
    return "[InsertDelta, position: " + original.position + ", lines: " + revised.lines + "]"
  }
}

class Patch {
  val deltas = new scala.collection.mutable.ListBuffer[Delta]()

  def addDelta (delta: Delta) {
    deltas += delta
  }
}