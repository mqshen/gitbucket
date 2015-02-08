(function() {
     var e, t, n, r, i, o = [].indexOf || function(e) {
         for (var t = 0, n = this.length; n > t; t++)
             if (t in this && this[t] === e) return t;
         return -1
     };
     t = null, e = function(e) {
         t && n(t), $(e).fire("menu:activate", function() {
             return $(document).on("keydown.menu", i), $(document).on("click.menu", r), t = e, $(e).performTransition(function() {
                 return document.body.classList.add("menu-active"), e.classList.add("active"), $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "false")
             }), $(e).fire("menu:activated", {
                 async: !0
             })
         })
     }, n = function(e) {
         $(e).fire("menu:deactivate", function() {
             return $(document).off(".menu"), t = null, $(e).performTransition(function() {
                 return document.body.classList.remove("menu-active"), e.classList.remove("active"), $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "true")
             }), $(e).fire("menu:deactivated", {
                 async: !0
             })
         })
     }, r = function(e) {
         t && ($(e.target).closest(t)[0] || (e.preventDefault(), n(t)))
     }, i = function(e) {
         t && "esc" === e.hotkey && (o.call($(document.activeElement).parents(), t) >= 0 && document.activeElement.blur(), e.preventDefault(), n(t))
     }, $(document).on("click", ".js-menu-container", function(r) {
         var i, o, a;
         i = this, (a = $(r.target).closest(".js-menu-target")[0]) ? (r.preventDefault(), i === t ? n(i) : e(i)) : (o = $(r.target).closest(".js-menu-content")[0]) || i === t && (r.preventDefault(), n(i))
     }), $(document).on("click", ".js-menu-container .js-menu-close", function(e) {
         n($(this).closest(".js-menu-container")[0]), e.preventDefault()
     }), $.fn.menu = function(t) {
         var r, i;
         return (r = $(this).closest(".js-menu-container")[0]) ? (i = {
             activate: function() {
                 return function() {
                     return e(r)
                 }
             }(this),
             deactivate: function() {
                 return function() {
                     return n(r)
                 }
             }(this)
         }, "function" == typeof i[t] ? i[t]() : void 0) : void 0
     }
 }).call(jQuery);