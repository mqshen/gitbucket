package syntax

import play.twirl.api.Html
import pyments.{Pygments, LexerOptions, Lexer}
import pyments.lexer._
import util.StringUtil

/**
 * Created by goldratio on 2/12/15.
 */
object DefaultLexerOptions extends LexerOptions(true, false, true, 0, "UTF-8", Nil)

object  SyntaxUtil {
  val (lexerMap, defaultLexer) = {
    val map = new scala.collection.mutable.HashMap[String, Lexer]()

    def addToMap(lexer: Lexer) = {
      lexer.fileNames.foreach { extension =>
        map.put(extension, lexer)
      }
    }

    val textLexer = new TextLexer(DefaultLexerOptions)
    addToMap(textLexer)

    val javaLexer = new JavaLexer(DefaultLexerOptions)
    addToMap(javaLexer)

    val scalaLexer= new ScalaLexer(DefaultLexerOptions)
    addToMap(scalaLexer)

    val javaScriptLexer = new JavascriptLexer(DefaultLexerOptions)
    addToMap(javaScriptLexer)

    val cssLexer= new CssLexer(DefaultLexerOptions)
    addToMap(cssLexer)

    val javascriptLexer = new ScalaLexer(DefaultLexerOptions)
    addToMap(javascriptLexer)

    (map, textLexer)
  }

  val formate = new pyments.formatters.HtmlFormatter(needWrap = false, lineSeparator = "", lineAnchors = "", lineOS =  true)

  def getSyntax(fileName: String, code: String) = {
    val fileExtension = StringUtil.getFileExtension(fileName)
    val lexer = lexerMap.get("*" + fileExtension).getOrElse(defaultLexer)
    Pygments.highlight(code, lexer,  formate).map(Html(_))
  }
}
