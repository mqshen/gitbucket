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
        response.setHeader("Content-Security-Policy", "default-src *; base-uri 'self'; block-all-mixed-content; child-src 'self' 101.251.195.186:18090; connect-src 'self' 101.251.195.186:18090; font-src assets-cdn.github.com; form-action 'self' 101.251.195.186:18090; frame-src 'self' 101.251.195.186:18090; img-src 'self' mqshen.qiniudn.com; media-src 'none'; lugin-types application/x-shockwave-flash; script-src 'self' 101.251.195.186:18090; style-src 'self' 'unsafe-inline'")
      case _ =>
    }
    chain.doFilter(req, res)
  }

}

