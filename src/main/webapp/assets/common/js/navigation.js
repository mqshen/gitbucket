(function() {
     var e, t, n, r, i, o, a, s, c, l, u, f, d, h, p, m, v, g, y, b, w, x, T, E, _, C, k, S;
     i = navigator.userAgent.match(/Macintosh/), v = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl", c = !1, g = {
         x: 0,
         y: 0
     }, t = function(e) {
         e.addEventListener("mousemove", y, !1), e.addEventListener("mouseover", b, !1)
     }, S = function(e) {
         e.removeEventListener("mousemove", y, !1), e.removeEventListener("mouseover", b, !1)
     }, $.observe(".js-navigation-container", {
         add: t,
         remove: S
     }), y = function(e) {
         (g.x !== e.clientX || g.y !== e.clientY) && (c = !1), g = {
             x: e.clientX,
             y: e.clientY
         }
     }, b = function(e) {
         c || $(e.target).trigger("navigation:mouseover")
     }, $(document).on("keydown", function(e) {
         var t, n, r;
         (e.target === document.body || e.target.classList.contains("js-navigation-enable")) && (t = d()) && (c = !0, r = $(t).find(".js-navigation-item.navigation-focus")[0] || t, n = $(r).fire("navigation:keydown", {
             originalEvent: e,
             hotkey: e.hotkey,
             relatedTarget: t
         }), n.isDefaultPrevented() && e.preventDefault())
     }), $(document).on("navigation:keydown", ".js-active-navigation-container", function(e) {
         var t, n, r;
         if (t = this, n = $(e.originalEvent.target).is("input, textarea"), $(e.target).is(".js-navigation-item"))
             if (r = e.target, n) {
                 if (i) switch (e.hotkey) {
                     case "ctrl+n":
                         o(r, t);
                         break;
                     case "ctrl+p":
                         a(r, t)
                 }
                 switch (e.hotkey) {
                     case "up":
                         a(r, t);
                         break;
                     case "down":
                         o(r, t);
                         break;
                     case "enter":
                         m(r);
                         break;
                     case "" + v + "+enter":
                         m(r, !0)
                 }
             } else {
                 if (i) switch (e.hotkey) {
                     case "ctrl+n":
                         o(r, t);
                         break;
                     case "ctrl+p":
                         a(r, t);
                         break;
                     case "alt+v":
                         x(r, t);
                         break;
                     case "ctrl+v":
                         w(r, t)
                 }
                 switch (e.hotkey) {
                     case "j":
                         o(r, t);
                         break;
                     case "k":
                         a(r, t);
                         break;
                     case "o":
                     case "enter":
                         m(r);
                         break;
                     case "" + v + "+enter":
                         m(r, !0)
                 }
             } else if (r = h(t)[0])
             if (n) {
                 if (i) switch (e.hotkey) {
                     case "ctrl+n":
                         f(r, t)
                 }
                 switch (e.hotkey) {
                     case "down":
                         f(r, t)
                 }
             } else {
                 if (i) switch (e.hotkey) {
                     case "ctrl+n":
                     case "ctrl+v":
                         f(r, t)
                 }
                 switch (e.hotkey) {
                     case "j":
                         f(r, t)
                 }
             }
         if (n) {
             if (i) switch (e.hotkey) {
                 case "ctrl+n":
                 case "ctrl+p":
                     e.preventDefault()
             }
             switch (e.hotkey) {
                 case "up":
                 case "down":
                     e.preventDefault();
                     break;
                 case "enter":
                 case "" + v + "+enter":
                     e.preventDefault()
             }
         } else {
             if (i) switch (e.hotkey) {
                 case "ctrl+n":
                 case "ctrl+p":
                 case "alt+v":
                 case "ctrl+v":
                     e.preventDefault()
             }
             switch (e.hotkey) {
                 case "j":
                 case "k":
                     e.preventDefault();
                     break;
                 case "o":
                 case "enter":
                 case "" + v + "+enter":
                     e.preventDefault()
             }
         }
     }), $(document).on("navigation:mouseover", ".js-active-navigation-container .js-navigation-item", function(e) {
         var t;
         t = $(e.currentTarget).closest(".js-navigation-container")[0], f(e.currentTarget, t)
     }), l = function(e) {
         var t, n, r;
         r = e.currentTarget, n = e.modifierKey || e.altKey || e.ctrlKey || e.metaKey, t = $(r).fire("navigation:open", {
             modifierKey: n
         }), t.isDefaultPrevented() && e.preventDefault()
     }, $(document).on("click", ".js-active-navigation-container .js-navigation-item", function(e) {
         l(e)
     }), $(document).on("navigation:keyopen", ".js-active-navigation-container .js-navigation-item", function(e) {
         var t;
         (t = $(this).filter(".js-navigation-open")[0] || $(this).find(".js-navigation-open")[0]) ? (e.modifierKey ? (window.open(t.href, "_blank"), window.focus()) : $(t).click(), e.preventDefault()) : l(e)
     }), e = function(e) {
         var t;
         return t = d(), e !== t ? $(e).fire("navigation:activate", function() {
             return function() {
                 return t && t.classList.remove("js-active-navigation-container"), e.classList.add("js-active-navigation-container"), $(e).fire("navigation:activated", {
                     async: !0
                 })
             }
         }(this)) : void 0
     }, s = function(e) {
         return $(e).fire("navigation:deactivate", function() {
             return function() {
                 return e.classList.remove("js-active-navigation-container"), $(e).fire("navigation:deactivated", {
                     async: !0
                 })
             }
         }(this))
     }, r = [], E = function(t) {
         var n;
         (n = d()) && r.push(n), e(t)
     }, T = function(t) {
         var i;
         s(t), n(t), (i = r.pop()) && e(i)
     }, u = function(t, n) {
         var r, i, o;
         if (r = h(n)[0], o = $(t).closest(".js-navigation-item")[0] || r, e(n), o) {
             if (i = f(o, n)) return;
             k($(o).overflowParent()[0], o)
         }
     }, n = function(e) {
         $(e).find(".navigation-focus.js-navigation-item").removeClass("navigation-focus")
     }, _ = function(e, t) {
         n(t), u(e, t)
     }, a = function(e, t) {
         var n, r, i, o, a;
         if (i = h(t), r = $.inArray(e, i), a = i[r - 1]) {
             if (n = f(a, t)) return;
             o = $(a).overflowParent()[0], "page" === p(t) ? k(o, a) : C(o, a)
         }
     }, o = function(e, t) {
         var n, r, i, o, a;
         if (i = h(t), r = $.inArray(e, i), o = i[r + 1]) {
             if (n = f(o, t)) return;
             a = $(o).overflowParent()[0], "page" === p(t) ? k(a, o) : C(a, o)
         }
     }, x = function(e, t) {
         var n, r, i, o, a;
         for (i = h(t), r = $.inArray(e, i), o = $(e).overflowParent()[0];
             (a = i[r - 1]) && $(a).overflowOffset(o).top >= 0;) r--;
         if (a) {
             if (n = f(a, t)) return;
             k(o, a)
         }
     }, w = function(e, t) {
         var n, r, i, o, a;
         for (i = h(t), r = $.inArray(e, i), a = $(e).overflowParent()[0];
             (o = i[r + 1]) && $(o).overflowOffset(a).bottom >= 0;) r++;
         if (o) {
             if (n = f(o, t)) return;
             k(a, o)
         }
     }, m = function(e, t) {
         null == t && (t = !1), $(e).fire("navigation:keyopen", {
             modifierKey: t
         })
     }, f = function(e, t) {
         var r;
         return r = $(e).fire("navigation:focus", function() {
             return n(t), e.classList.add("navigation-focus"), $(e).fire("navigation:focused", {
                 async: !0
             })
         }), r.isDefaultPrevented()
     }, d = function() {
         return $(".js-active-navigation-container")[0]
     }, h = function(e) {
         return $(e).find(".js-navigation-item").visible()
     }, p = function(e) {
         var t;
         return null != (t = $(e).attr("data-navigation-scroll")) ? t : "item"
     }, k = function(e, t) {
         var n, r, i, o;
         return r = $(t).positionedOffset(e), n = $(t).overflowOffset(e), n.bottom <= 0 ? $(e).scrollTo({
             top: r.top - 30,
             duration: 200
         }) : n.top <= 0 ? (i = null != e.offsetParent ? e.scrollHeight : $(document).height(), o = i - (r.bottom + n.height), $(e).scrollTo({
             top: o + 30,
             duration: 200
         })) : void 0
     }, C = function(e, t) {
         var n, r, i, o;
         return r = $(t).positionedOffset(e), n = $(t).overflowOffset(e), n.bottom <= 0 ? (i = null != e.offsetParent ? e.scrollHeight : $(document).height(), o = i - (r.bottom + n.height), $(e).scrollTo({
             top: o
         })) : n.top <= 0 ? $(e).scrollTo({
             top: r.top
         }) : void 0
     }, $.fn.navigation = function(t) {
         var r, i;
         if ("active" === t) return d();
         if (r = $(this).closest(".js-navigation-container")[0]) return i = {
             activate: function() {
                 return function() {
                     return e(r)
                 }
             }(this),
             deactivate: function() {
                 return function() {
                     return s(r)
                 }
             }(this),
             push: function() {
                 return function() {
                     return E(r)
                 }
             }(this),
             pop: function() {
                 return function() {
                     return T(r)
                 }
             }(this),
             focus: function(e) {
                 return function() {
                     return u(e, r)
                 }
             }(this),
             clear: function() {
                 return function() {
                     return n(r)
                 }
             }(this),
             refocus: function(e) {
                 return function() {
                     return _(e, r)
                 }
             }(this)
         }, "function" == typeof i[t] ? i[t]() : void 0
     }
 }).call(this);