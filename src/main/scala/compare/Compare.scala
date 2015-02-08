package compare

import scala.annotation.tailrec

/**
 * Created by goldratio on 2/5/15.
 */
object Compare {
  val split = "\\r?\\n"

  def compare(t1: Option[String], t2: Option[String]) = {
    t1.map { text1 =>
      t2.map { text2 =>
        val textLine1 = text1.split(split)
        val textLine2 = text2.split(split)
        compareLines(textLine1, textLine2)
      }.getOrElse {
        val diffs = scala.collection.mutable.ListBuffer[Diff]()
        text1.split(split).zipWithIndex.map { case (text, index) =>
          diffs += new DeleteDiff(index, text)
        }
        diffs
      }
    }.getOrElse {
      val diffs = scala.collection.mutable.ListBuffer[Diff]()
      t2.map { text2 =>
        text2.split(split).zipWithIndex.map { case (text, index) =>
          diffs += new InsertDiff(index, text)
        }
      }
      diffs
    }
  }

  def compareLines(textLine1: Array[String], textLine2: Array[String], left: Int = 1, right: Int = 1): scala.collection.mutable.ListBuffer[Diff]  = {
    val diffs = scala.collection.mutable.ListBuffer[Diff]()
    val commonLength = commonPrefix(textLine1, textLine2, 0)
    (0 until commonLength).map { index =>
      val diff = new EqualDiff(index + left, index + right, textLine1(index))
      diffs += diff
    }
    if((commonLength + 1) >= math.max(textLine1.size, textLine2.size)) {
      diffs
    }
    else {
      val line1 = textLine1.slice(commonLength, textLine1.size )
      val line2 = textLine2.slice(commonLength, textLine2.size )
      val commonSuffixLength = commonSuffix(line1, line2, 0)
      if((commonSuffixLength + 1) >= math.max(line1.size, line2.size)) {
        (0 until commonSuffixLength).map { index =>
          val diff = new EqualDiff(line1.size - index + left, line2.size - index + right, line1(line1.size - index - 1))
          diffs.insert(commonLength, diff)
        }
        diffs
      }
      else {
        val line3 = line1.slice(0, line1.size - commonSuffixLength)
        val line4 = line2.slice(0, line2.size - commonSuffixLength)
        diffs ++= compute(line3, line4, commonLength + 1, commonLength + 1)
        val position = diffs.size
        (0 until commonSuffixLength).map { index =>
          val diff = new EqualDiff(line1.size - index + left, line2.size - index + right, line1(line1.size - index - 1))
          diffs.insert(position, diff)
        }
        diffs
      }
    }
  }

  def compute(textLine1: Array[String], textLine2: Array[String], left: Int = 1, right: Int = 1) = {
    val diffs = scala.collection.mutable.ListBuffer[Diff]()
    if (textLine1.length == 0) {
      textLine2.zipWithIndex.map { case (text, index) =>
        diffs += new InsertDiff(index + right, text)
      }
      diffs
    }
    else {
      if (textLine2.length == 0) {
        textLine1.zipWithIndex.map { case (text, index) =>
          diffs += new DeleteDiff(index + left, text)
        }
        diffs
      }
      else {
        val (longLines, shortLines, position)  = if (textLine1.length > textLine2.length) (textLine1, textLine2, left) else (textLine2, textLine1, right)
        val i = longLines.indexOf(shortLines)
        if( i > -1 )  {
          // Shorter text is inside the longer text (speedup).
          val op = (textLine1.size > textLine2.size)
          (0 until i).map { j =>
            if(op) {
              diffs += new DeleteDiff(position + j, longLines(j))
            }
            else {
              diffs += new InsertDiff(position + j, longLines(j))
            }
          }
          shortLines.map { line =>
            diffs += new EqualDiff(left + i, right + i, line)
          }
          (i + shortLines.size until longLines.size).map { j =>
            if(op) {
              diffs += new DeleteDiff(position + j, longLines(j))
            }
            else {
              diffs += new InsertDiff(position + j, longLines(j))
            }
          }
          diffs
        }
        else {
          if (textLine2.size == 1) {
            // Single character string.
            // After the previous speedup, the character can't be an equality.
            textLine1.zipWithIndex.map { case (text, index) =>
              diffs += new DeleteDiff(left + index, text)
            }
            textLine2.zipWithIndex.map { case (text, index)  =>
              diffs += new InsertDiff(right + index, text)
            }
            diffs
          }
          else {
            halfMatch(textLine1, textLine2).map { hm =>

              val diffs_a = compareLines(hm._1, hm._3, left, right)
              val diffs_b = compareLines(hm._2, hm._4, hm._1.size + left, hm._3.size + right)
              // Merge the results.
              diffs ++= diffs_a
              hm._5.zipWithIndex.map { case (commons, index) =>
                diffs += new EqualDiff(hm._1.size + left + index, hm._3.size + right + index, commons)
              }
              diffs ++= diffs_b
            }.getOrElse {
              textLine1.zipWithIndex.map { case (text, index) =>
                diffs += new DeleteDiff(left + index, text)
              }
              textLine2.zipWithIndex.map { case (text, index) =>
                diffs += new InsertDiff(right + index, text)
              }
            }
            diffs
          }
        }
      }
    }

  }

  @tailrec
  private def commonPrefix(line1: Array[String], line2: Array[String], index: Int): Int = {
    if(line1.size <= (index + 1) || line2.size <= (index + 1)) {
      index
    }
    else {
      if(line1(index ) != line2(index )) {
        index
      }
      else {
        commonPrefix(line1, line2, index + 1)
      }
    }
  }

  @tailrec
  private def commonSuffix(line1: Array[String], line2: Array[String], index: Int): Int = {
    if(line1.size <= (index + 1) || line2.size <= (index + 1)) {
      index
    }
    else {
      if(line1(line1.size - index - 1) != line2(line2.size - index - 1)) {
        index
      }
      else {
        commonSuffix(line1, line2, index + 1)
      }
    }
  }

  def halfMatch(lines1: Array[String], lines2: Array[String]): Option[(Array[String], Array[String], Array[String], Array[String], Array[String])] = {
    val (longLines, shortLines)  = if (lines1.length > lines2.length) (lines1, lines2) else (lines2, lines1)
    if (longLines.size < 4 || shortLines.length * 2 < longLines.length) {
      None
    }
    else {
      val hm: Option[(Array[String], Array[String], Array[String], Array[String], Array[String])] = halfMatchI(longLines, shortLines, (longLines.size + 3) / 4).map { hm1 =>
        halfMatchI(longLines, shortLines, (longLines.length + 1) / 2).map { hm2 =>
          if (hm1._4.size> hm2._4.size) hm1 else hm2
        }.getOrElse(hm1)
      }
      if (lines1.length > lines2.length) {
        hm
      }
      else {
        hm.map { e =>
          (e._3, e._4, e._1, e._2, e._5)
        }
      }
    }
  }

  //TODO change it to function style
  def halfMatchI(longLines: Array[String], shortLines: Array[String], index: Int): Option[(Array[String], Array[String], Array[String], Array[String], Array[String])] = {
    val seed = longLines.slice(index, index + longLines.size / 4)
    var j = -1
    var bestCommon = Array[String]()
    var bestLongLines1 = Array[String]()
    var bestLongLines2 = Array[String]()
    var bestShortLines1 = Array[String]()
    var bestShortLines2 = Array[String]()
    while((j = shortLines.indexOf(seed, j + 1)) != -1) {
      val prefixLength: Int = commonPrefix(longLines.slice(index, longLines.size), shortLines.slice(j, shortLines.size), 0)
      val suffixLength: Int = commonSuffix(longLines.slice(0, index), shortLines.slice(0, j), 0)
      if (bestCommon.length < suffixLength + prefixLength) {
        bestCommon = shortLines.slice(j - suffixLength, j) ++ shortLines.slice(j, j + prefixLength)
        bestLongLines1 = longLines.slice(0, index - suffixLength)
        bestLongLines2 = longLines.slice(index + prefixLength, longLines.size)
        bestShortLines1 = shortLines.slice(0, j - suffixLength)
        bestShortLines2 = shortLines.slice(j + prefixLength, shortLines.size)
      }
    }

    if (bestCommon.length * 2 >= longLines.length) {
      Some((bestLongLines1, bestLongLines2, bestShortLines1, bestShortLines2, bestCommon))
    }
    else {
      None
    }
  }
}
