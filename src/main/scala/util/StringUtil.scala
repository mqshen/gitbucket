package util

import java.net.{URLDecoder, URLEncoder}
import org.mozilla.universalchardet.UniversalDetector
import util.ControlUtil._
import org.apache.commons.io.input.BOMInputStream
import org.apache.commons.io.IOUtils

object StringUtil {
  val hexDigit = Seq('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')
  val UrlSafeBase64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  val Base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

  def sha1(value: String): String =
    defining(java.security.MessageDigest.getInstance("SHA-1")){ md =>
      md.update(value.getBytes)
      md.digest.map(b => "%02x".format(b)).mkString
    }

  def md5(value: String): String = {
    val md = java.security.MessageDigest.getInstance("MD5")
    md.update(value.getBytes)
    md.digest.map(b => "%02x".format(b)).mkString
  }

  def urlEncode(value: String): String = URLEncoder.encode(value, "UTF-8")

  def urlDecode(value: String): String = URLDecoder.decode(value, "UTF-8")

  def splitWords(value: String): Array[String] = value.split("[ \\t　]+")

  def base64Encode(data: Array[Byte]): String = {
    base64EncodeGeneric(Base64Digits, data)
  }

  def urlSafeBase64Encode(data: Array[Byte]) = {
    base64EncodeGeneric(UrlSafeBase64Digits, data)
  }

  def urlSafeBase64Encode(data: String) = {
    base64EncodeGeneric(UrlSafeBase64Digits, data.getBytes())
  }

  def jq (value: String) = {
    javaQuotedLiteral(value)
  }

  def javaQuotedLiteral (value: String) = {
    val b: StringBuilder = new StringBuilder(value.length * 2)
    b.append('"')
    value.map {
      case '"' =>
        b.append("\\\"")
      case '\\' =>
        b.append("\\\\")
      case '\n' =>
        b.append("\\n")
      case '\r' =>
        b.append("\\t")
      case '\t' =>
        b.append("\\r")
      case '\0' =>
        b.append("\\000")
      case c =>
        if (c >= 0x20 && c <= 0x7e) {
          b.append(c)
        }
        else {
          val h1: Int = (c >> 12) & 0xf
          val h2: Int = (c >> 8) & 0xf
          val h3: Int = (c >> 4) & 0xf
          val h4: Int = c & 0xf
          b.append("\\u")
          b.append(hexDigit(h1))
          b.append(hexDigit(h2))
          b.append(hexDigit(h3))
          b.append(hexDigit(h4))
        }
    }
    b.append('"')
    b.toString
  }

  def base64EncodeGeneric(digits: String, data: Array[Byte]): String = {
    if (data == null) throw new IllegalArgumentException("'data' can't be null")
    if (digits == null) throw new IllegalArgumentException("'digits' can't be null")
    if (digits.length != 64) throw new IllegalArgumentException("'digits' must be 64 characters long: " + jq(digits))
    val numGroupsOfThreeInputBytes: Int = (data.length + 2) / 3
    val numOutputChars: Int = numGroupsOfThreeInputBytes * 4
    val buf: StringBuilder = new StringBuilder(numOutputChars)
    var i: Int = 0
    while ((i + 3) <= data.length) {
      val b1: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val b2: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val b3: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val d1: Int = b1 >>> 2
      val d2: Int = ((b1 & 0x3) << 4) | (b2 >>> 4)
      val d3: Int = ((b2 & 0xf) << 2) | (b3 >>> 6)
      val d4: Int = b3 & 0x3f
      buf.append(digits.charAt(d1))
      buf.append(digits.charAt(d2))
      buf.append(digits.charAt(d3))
      buf.append(digits.charAt(d4))
    }
    val remaining: Int = data.length - i
    if (remaining == 0) {
    }
    else if (remaining == 1) {
      val b1: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val d1: Int = b1 >>> 2
      val d2: Int = (b1 & 0x3) << 4
      buf.append(digits.charAt(d1))
      buf.append(digits.charAt(d2))
      buf.append("==")
    }
    else if (remaining == 2) {
      val b1: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val b2: Int = (data(({
        i += 1; i - 1
      })).toInt) & 0xff
      val d1: Int = b1 >>> 2
      val d2: Int = ((b1 & 0x3) << 4) | (b2 >>> 4)
      val d3: Int = ((b2 & 0xf) << 2)
      buf.append(digits.charAt(d1))
      buf.append(digits.charAt(d2))
      buf.append(digits.charAt(d3))
      buf.append('=')
    }
    else {
      throw new AssertionError("data.length: " + data.length + ", i: " + i)
    }
    return buf.toString
  }
  def escapeHtml(value: String): String =
    value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")

  /**
   * Make string from byte array. Character encoding is detected automatically by [[util.StringUtil.detectEncoding]].
   * And if given bytes contains UTF-8 BOM, it's removed from returned string.
   */
  def convertFromByteArray(content: Array[Byte]): String =
    IOUtils.toString(new BOMInputStream(new java.io.ByteArrayInputStream(content)), detectEncoding(content))

  def detectEncoding(content: Array[Byte]): String =
    defining(new UniversalDetector(null)){ detector =>
      detector.handleData(content, 0, content.length)
      detector.dataEnd()
      detector.getDetectedCharset match {
        case null => "UTF-8"
        case e    => e
      }
    }

  /**
   * Converts line separator in the given content.
   *
   * @param content the content
   * @param lineSeparator "LF" or "CRLF"
   * @return the converted content
   */
  def convertLineSeparator(content: String, lineSeparator: String): String = {
    val lf = content.replace("\r\n", "\n").replace("\r", "\n")
    if(lineSeparator == "CRLF"){
      lf.replace("\n", "\r\n")
    } else {
      lf
    }
  }

  /**
   * Extract issue id like ```#issueId``` from the given message.
   *
   *@param message the message which may contains issue id
   * @return the iterator of issue id
   */
  def extractIssueId(message: String): Iterator[String] =
    "(^|\\W)#(\\d+)(\\W|$)".r.findAllIn(message).matchData.map(_.group(2))

  /**
   * Extract close issue id like ```close #issueId ``` from the given message.
   *
   * @param message the message which may contains close command
   * @return the iterator of issue id
   */
  def extractCloseId(message: String): Iterator[String] =
    "(?i)(?<!\\w)(?:fix(?:e[sd])?|resolve[sd]?|close[sd]?)\\s+#(\\d+)(?!\\w)".r.findAllIn(message).matchData.map(_.group(1))

}
