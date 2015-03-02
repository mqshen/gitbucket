package service

import org.apache.http.NameValuePair
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.{HttpGet, HttpPost}
import org.apache.http.client.utils.URIBuilder
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.message.BasicNameValuePair

/**
 * Created by goldratio on 3/2/15.
 */
object WebHookServiceSpec extends App {

  val httpClient = HttpClientBuilder.create.build
  val loginBuilder = new URIBuilder("authUrl")
  val loginRequest = new HttpPost(loginBuilder.build())
  httpClient.execute(loginRequest)
  loginRequest.releaseConnection()

  val builder = new URIBuilder("buildUrl")
  val request = new HttpGet(builder.build())

  httpClient.execute(request)
  request.releaseConnection()

}
