package servlet

import javax.servlet._
import javax.servlet.http.{HttpServletResponse, HttpServletRequest}

/**
 * Created by goldratio on 3/5/16.
 */
class SecurityPolicyFilter extends Filter {
  def init(config: FilterConfig) = {}

  def destroy(): Unit = {}

  def doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain): Unit = {
    res match {
      case response: HttpServletResponse  =>
        println("=====================")
        println("start security-policy")
        response.setHeader("Access-Control-Allow-Origin", "*")
      case _ =>
    }
    chain.doFilter(req, res)
  }

}

