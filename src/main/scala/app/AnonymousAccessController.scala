package app

import org.scalatra.servlet.ScalatraAsyncSupport

class AnonymousAccessController extends AnonymousAccessControllerBase with ScalatraAsyncSupport

trait AnonymousAccessControllerBase extends ControllerBase {
  get(!context.settings.allowAnonymousAccess, context.loginAccount.isEmpty) {
    if(!context.currentPath.startsWith("/assets") && !context.currentPath.startsWith("/signin") &&
      !context.currentPath.startsWith("/register")) {
      Unauthorized()
    } else {
      pass()
    }
  }
}
