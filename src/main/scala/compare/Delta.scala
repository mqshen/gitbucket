package compare

/**
 * Created by goldratio on 2/10/15.
 */
class Chunk(val position: Int, val size: Int) {
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
    "[ChangeDelta, position: " + original.position + ", size: " + original.size + " to " + revised.size + "]"
  }
}

class DeleteDelta(val original: Chunk, val revised: Chunk) extends Delta {
  val opType = Type.Delete

  override def toString: String = {
    "[DeleteDelta, position: " + original.position + ", lines: " + original.size + "]"
  }
}

class InsertDelta(val original: Chunk, val revised: Chunk) extends Delta {
  val opType = Type.Insert

  override def toString: String = {
    "[InsertDelta, position: " + original.position + ", lines: " + revised.size + "]"
  }
}

class Patch {
  val deltas = new scala.collection.mutable.ListBuffer[Delta]()

  def addDelta (delta: Delta) {
    deltas += delta
  }
}
