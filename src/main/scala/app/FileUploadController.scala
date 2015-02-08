package app

import java.security.SignatureException
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

import org.json4s.{DefaultFormats, Formats}
import util.{StringUtil, Keys, FileUtil}
import org.scalatra._
import org.scalatra.servlet.{HasMultipartConfig, MultipartConfig, FileUploadSupport, FileItem}

/**
 * Provides Ajax based file upload functionality.
 *
 * This servlet saves uploaded file.
 */
class FileUploadController extends ScalatraServlet with ApiFormats with FileUploadSupport {

  implicit def jsonFormats: Formats = DefaultFormats

  configureMultipartHandling(MultipartConfig(maxFileSize = Some(3 * 1024 * 1024)))

//  private def isMultipartContent(req: HttpServletRequest) = {
//    val isPostOrPut = Set("POST", "PUT").contains(req.getMethod)
//
//    isPostOrPut && (req.contentType match {
//      case Some(contentType) => contentType.startsWith(FileUploadBase.MULTIPART)
//      case _ => false
//    })
//  }
//
//  private val FILENAME_KEY: String = "filename="
//  private val CONTENT_DISPOSITION: String = "content-disposition"
//
//  private def extractFilename(contentDisposition: String): String = {
//    if (contentDisposition == null) {
//      return null
//    }
//    val startIndex: Int = contentDisposition.indexOf(FILENAME_KEY)
//    if (startIndex == -1) {
//      return null
//    }
//    val filename: String = contentDisposition.substring(startIndex + FILENAME_KEY.length)
//    if (filename.startsWith("\"")) {
//      val endIndex: Int = filename.indexOf("\"", 1)
//      if (endIndex != -1) {
//        return filename.substring(1, endIndex)
//      }
//    }
//    else {
//      val endIndex: Int = filename.indexOf(";")
//      if (endIndex != -1) {
//        return filename.substring(0, endIndex)
//      }
//    }
//    return filename
//  }
//
//  override def handle(req: HttpServletRequest, resp: HttpServletResponse) {
//    val req2 = try {
//      if (isMultipartContent(req)) {
//        val upload = new ServletFileUpload()
//        // Parse the request
//        resp.writer.print("""{"status" : 422}""")
//        resp.flushBuffer()
//        resp.writer.flush()
//        try {
//          req.getParts.toList.map { test =>
//            val filename: String = extractFilename(test.getHeader(CONTENT_DISPOSITION))
//            if (filename != null) {
//              println(s"filename: $filename")
//            }
//            else {
//              println(s"parameterName: ${test.getName}")
//            }
//          }
//        }
//        catch {
//          case e: Throwable =>
//            e.printStackTrace()
//        }
////        val iter = upload.getItemIterator(req)
////        while (iter.hasNext()) {
////          val item = iter.next()
////          val name = item.getFieldName()
////          val stream = item.openStream()
////          if (item.isFormField()) {
////            System.out.println("Form field " + name + " with value " + Streams.asString(stream) + " detected.")
////          }
////          else {
////            System.out.println("File field " + name + " with file name " + item.getName() + " detected.")
////          }
////        }
//        req
//      } else req
//    } catch {
//      case e: FileUploadException => {
//        req.setAttribute(ScalatraBase.PrehandleExceptionKey, e)
//        req
//      }
//    }
//    super.handle(req2, resp)
//  }

  post("/policies/avatars") {
    val current = System.currentTimeMillis()
    val expire = (current / 1000) + 10 * 365 * 24 * 3600
    val id = StringUtil.md5(s"${session.getId}${current}")
    val fileName = s"${id}_${current}"
    val entity = QiNiuEntity(s"mqshen:${fileName}", expire, """{"url":$(key),"size": $(fsize),"width":$(imageInfo.width),"height": $(imageInfo.height),"hash":$(etag)}""")
    val entityString = org.json4s.jackson.Serialization.write(entity)
    val encodedPutPolicy = StringUtil.urlSafeBase64Encode(entityString)
    println(encodedPutPolicy)
    val encodedSign = hmac(encodedPutPolicy)
    println(encodedSign)
    val uploadToken = s"iuVNU8hS-LI4lZIOHNI_gHDZaa_JWr8Whh7ySoGY:$encodedSign:$encodedPutPolicy"
    contentType = formats("json")
    val result = org.json4s.jackson.Serialization.write(Map("status" -> 422,
      "upload_url" -> "https://up.qbox.me",
      "key" -> fileName,
      "token" -> uploadToken
    ))
    Created(result)
  }

  case class QiNiuEntity(scope: String, deadline: Long, returnBody: String)

  def hmac(data: String) = {
    val key = "_vajoiKTqA1UWK8sss-jBgicJ6343pecYYbLZNrh"
    val HMAC_SHA1_ALGORITHM = "HmacSHA1"
    try {
      val signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM)

      val mac = Mac.getInstance(HMAC_SHA1_ALGORITHM)
      mac.init(signingKey)

      val rawHmac = mac.doFinal(data.getBytes())

      StringUtil.urlSafeBase64Encode(rawHmac)
    }
    catch {
      case e: Exception =>
        throw new SignatureException("Failed to generate HMAC : " + e.getMessage())
    }
  }






}
