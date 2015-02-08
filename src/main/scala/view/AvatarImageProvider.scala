package view

import service.RequestCache
import play.twirl.api.Html
import util.StringUtil

trait AvatarImageProvider { self: RequestCache =>

  /**
   * Returns &lt;img&gt; which displays the avatar icon.
   * Looks up Gravatar if avatar icon has not been configured in user settings.
   */
  protected def getAvatarImageHtml(userName: String, size: Int,
                                   mailAddress: String = "", tooltip: Boolean = false, avatarClass: String = "avatar")(implicit context: app.Context): Html = {

    val src = if(mailAddress.isEmpty){
      // by user name
      getAccountByUserName(userName).map { account =>
        if(account.image.isEmpty && context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(account.mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""http://mqshen.qiniudn.com/${account.image.get}"""
        }
      } getOrElse {
        s"""${context.path}/_unknown/_avatar"""
      }
    } else {
      // by mail address
      getAccountByMailAddress(mailAddress).map { account =>
        if(account.image.isEmpty && context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(account.mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""${context.path}/${account.userName}/_avatar"""
        }
      } getOrElse {
        if(context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""${context.path}/_unknown/_avatar"""
        }
      }
    }

    if(tooltip){
      Html(s"""<img src="${src}" class="${avatarClass}" style="width: ${size}px; height: ${size}px;" data-toggle="tooltip" title="${userName}"/>""")
    } else {
      Html(s"""<img src="${src}" class="${avatarClass}" style="width: ${size}px; height: ${size}px;" />""")
    }
  }

  protected def getAvatarImageHtmlWithHref(userName: String, size: Int,
                                           mailAddress: String = "", tooltip: Boolean = false)(implicit context: app.Context): Html = {

    val src = if(mailAddress.isEmpty){
      // by user name
      getAccountByUserName(userName).map { account =>
        if(account.image.isEmpty && context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(account.mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""http://mqshen.qiniudn.com/${account.image.get}"""
        }
      } getOrElse {
        s"""${context.path}/_unknown/_avatar"""
      }
    } else {
      // by mail address
      getAccountByMailAddress(mailAddress).map { account =>
        if(account.image.isEmpty && context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(account.mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""http://mqshen.qiniudn.com/${account.image.get}"""
        }
      } getOrElse {
        if(context.settings.gravatar){
          s"""https://secure.gravatar.com/avatar/${StringUtil.md5(mailAddress.toLowerCase)}?s=${size}&d=retro&r=g"""
        } else {
          s"""${context.path}/_unknown/_avatar"""
        }
      }
    }

    if(tooltip){
      Html(s"""<a href="${context.path}/${userName}"><img src="${src}" class="${if(size > 20){"gravatar"} else {"avatar-mini"}}" style="width: ${size}px; height: ${size}px;" data-toggle="tooltip" title="${userName}"/></a>""")
    } else {
      Html(s"""<a href="${context.path}/${userName}"><img src="${src}" class="${if(size > 20){"gravatar"} else {"avatar-mini"}}" style="width: ${size}px; height: ${size}px;" /></a>""")
    }
  }
}