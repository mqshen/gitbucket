package compare

import java.util.List


/**
 * Created by goldratio on 2/10/15.
 */

trait PathNode {
  def i: Int
  def j: Int
  def prev: Option[PathNode]

  def isSnake: Boolean

  def isBootstrap(): Boolean = {
    i < 0 || j < 0
  }

  def previousSnake(): Option[PathNode] = {
    if (isBootstrap()) {
      None
    }
    else if(!isSnake) {
      prev.map(_.previousSnake()).getOrElse(Some(this))
    }
    else {
      Some(this)
    }
  }

  override def toString() = {
      val buf: StringBuffer = new StringBuffer("[")
      buf.append("(")
      buf.append(Integer.toString(i))
      buf.append(",")
      buf.append(Integer.toString(j))
      buf.append(")")
      prev.map{ node =>
        buf.append(node.toString)
      }
      buf.append("]")
      buf.toString
  }
}

object DiffNode {
  def apply(i: Int, j: Int, prev: Option[PathNode]) = {
    new DiffNode(i, j, prev.map(_.previousSnake()).getOrElse(None))
  }
}
class DiffNode(val i: Int, val j: Int, val prev: Option[PathNode])
  extends PathNode {
  override def isSnake: Boolean = false
}

case class Snake(val i: Int, val j: Int, val prev: Option[PathNode])
  extends PathNode{
  override def isSnake: Boolean = true
}

class MyersDiff {

  def diff (original: Seq[String], revised: Seq[String]):  Option[Patch] = {
    if (original == null) {
      throw new IllegalArgumentException("original list must not be null")
    }
    if (revised == null) {
      throw new IllegalArgumentException("revised list must not be null")
    }
    buildPath(original, revised).map { path =>
      buildRevision(path, original, revised)
    }
  }

  def buildRevision(path: PathNode, orig: Seq[String], rev: Seq[String]): Patch = {
    val patch = new Patch

    def build(currentPath: PathNode): Unit = {
      if (currentPath.isSnake) {
        build(currentPath.prev.get)
      }
      else {
        if (currentPath != null && currentPath.prev.isDefined && currentPath.prev.get.j >= 0) {
          val i: Int = currentPath.i
          val j: Int = currentPath.j
          val nextPath = currentPath.prev.get
          val iAnchor: Int = nextPath.i
          val jAnchor: Int = nextPath.j
          val original = new Chunk(iAnchor, i - iAnchor)
          val revised = new Chunk(jAnchor, j - jAnchor)
          var delta: Delta = null
          if (original.size == 0 && revised.size != 0) {
            delta = new InsertDelta(original, revised)
          }
          else if (original.size > 0 && revised.size == 0) {
            delta = new DeleteDelta(original, revised)
          }
          else {
            delta = new ChangeDelta(original, revised)
          }
          patch.addDelta(delta)
          if (nextPath.isSnake) {
            nextPath.prev.map(build(_))
          }
          else {
            build(nextPath)
          }
        }
      }
    }
    build(path)
    patch
  }



  def buildPath(orig: Seq[String], rev: Seq[String]) = {
    val N = orig.size
    val M = rev.size

    val MAX = N + M + 1
    val size = 2 * MAX + 1
    val middle = size / 2
    val diagonal = new Array[PathNode](size)

    diagonal(middle + 1) = Snake(0, -1, None)


    def buildPath( d: Int): Option[PathNode ]= {
      val result = buildTrace(d, -d)
      if(result.isDefined) {
        result
      }
      else {
        if(d + 1 < MAX) {
          buildPath(d + 1)
        }
        else {
          None
        }
      }
    }

    def buildTrace( d: Int, k: Int): Option[PathNode] = {
      val kMiddle: Int = middle + k
      val kPlus: Int = kMiddle + 1
      val kMinus: Int = kMiddle - 1

      val (i, prev) =  if ((k == -d) || (k != d && diagonal(kMinus).i < diagonal(kPlus).i)) {
        (diagonal(kPlus).i, diagonal(kPlus))
      }
      else {
        (diagonal(kMinus).i + 1, diagonal(kMinus))
      }

      diagonal(kMinus) = null

      val j = i - k

      val node = DiffNode(i, j, Some(prev))

      def getEqualObject(i: Int, j: Int): (Int, Int) = {
        if(i >= N || j >= M) {
          (i, j)
        }
        else {
          if(orig(i) != rev(j)) {
            (i, j)
          }
          else {
            getEqualObject(i + 1, j + 1)
          }
        }
      }

      val (p, q) = getEqualObject(i, j)

      if (p > node.i) {
        diagonal(kMiddle) = new Snake(p, q, Some(node))
      }
      else {
        diagonal(kMiddle) = node
      }
      if (p >= N && q >= M) {
        Some(diagonal(kMiddle))
      }
      else {
        val nextK = k + 2
        if(nextK > d) {
          None
        }
        else {
          buildTrace(d, k + 2)
        }
      }
    }

    buildPath(0)
  }



}
