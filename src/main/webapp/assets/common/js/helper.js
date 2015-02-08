(function () {
    $.fn.onFocusedInput = function (t, e) {
        var n;
        return n = "focusInput" + Math.floor(1e3 * Math.random()), this.focused(t)["in"](function () {
            var t;
            return (t = e.call(this, n)) ? $(this).on("input." + n, t) : void 0
        }).out(function () {
            return $(this).off("." + n)
        }), this
    }
    $.fn.focused = function(e) {
        var t, n, r;
        return n = [], r = [], t = e ? this.find(e).filter(document.activeElement)[0] : this.filter(document.activeElement)[0], this.on("focusin", e, function() {
            var e, r, i;
            if (!t)
                for (t = this, r = 0, i = n.length; i > r; r++) e = n[r], e.call(this)
        }), this.on("focusout", e, function() {
            var e, n, i;
            if (t)
                for (t = null, n = 0, i = r.length; i > n; n++) e = r[n], e.call(this)
        }), {
            "in": function(e) {
                return n.push(e), t && e.call(t), this
            },
            out: function(e) {
                return r.push(e), this
            }
        }
    }
}).call(jQuery),
(function() {
    $.hidden = function() {
        return this.offsetWidth <= 0 && this.offsetHeight <= 0
    },
    $.visible = function() {
        return !$.hidden.call(this)
    },
    $.fn.hidden = function() {
        return this.filter($.hidden)
    },
    $.fn.visible = function() {
        return this.filter($.visible)
    }
}).call(this),
(function() {
     var e, t, n, r, i, o, a;
     a = function() {
         var e;
         return e = document.querySelector('meta[name="csrf-token"]'), null != e ? e.getAttribute("content") : void 0
     }, n = function(e) {
         var t;
         return t = (null != e ? e.method : void 0) || "get", "get" === t.toLowerCase()
     }, i = function(e) {
         var t, n;
         return 200 <= (n = e.status) && 300 > n ? Promise.resolve(e) : (t = new Error(e.statusText || e.status), t.response = e, Promise.reject(t))
     }, t = function(e) {
         var t;
         return null == e && (e = {}), e.headers || (e.headers = {}), !n(e) && (t = a()) && (e.headers["X-CSRF-Token"] = t), e.headers["X-Requested-With"] = "XMLHttpRequest", e
     }, e = function(e) {
         return null == e && (e = {}), null == e.credentials && (e.credentials = "same-origin"), e
     }, r = function(e) {
         return e.json()
     }, o = function(e) {
         return e.text()
     }, $.fetch = function(n, r) {
         return r = t(e(r)), fetch(n, r).then(i)
     }, $.fetchText = function(n, r) {
         return r = t(e(r)), fetch(n, r).then(i).then(o)
     }, $.fetchJSON = function(n, o) {
         return o = t(e(o)), o.headers.Accept = "application/json", fetch(n, o).then(i).then(r)
    }
}).call(this),
(function () {
    $.fn.onFocusedKeydown = function (t, e) {
        var n;
        return n = "focusKeydown" + Math.floor(1e3 * Math.random()), this.focused(t)["in"](function () {
            var t;
            return (t = e.call(this, n)) ? $(this).on("keydown." + n, t) : void 0
        }).out(function () {
            return $(this).off("." + n)
        }), this
    },
    $.fn.fire = function(e) {
        var t, n, r, i, o;
        return (t = arguments[1]) && ($.isPlainObject(t) ? i = t : $.isFunction(t) && (n = t)), (t = arguments[2]) && $.isFunction(t) && (n = t), r = this[0], null == i && (i = {}), null == i.cancelable && (i.cancelable = !!n), null == i.bubbles && (i.bubbles = !0), o = function() {
            var t;
            return t = $.Event(e, i), $.event.trigger(t, [], r, !t.bubbles), n && !t.isDefaultPrevented() && n.call(r, t), t
        }, i.async ? (delete i.async, void setImmediate(o)) : o()
    }
}).call(jQuery),
(function() {
    var e;
    e = /complete|loaded|interactive/, $.readyQueue = function(t) {
        var n, r, i, o, a, s, c;
        return r = [], o = 0, c = !1, s = function() {
            var e;
            c = !1, e = o, o = r.length, t(r.slice(e))
        }, a = function() {
            s(), document.removeEventListener("DOMContentLoaded", a, !1)
        }, i = function(t) {
            t && r.push(t), c || (e.test(document.readyState) ? setImmediate(s) : document.addEventListener("DOMContentLoaded", a, !1), c = !0)
        }, n = function() {
            r.length = o = 0, c = !1
        }, {
            handlers: r,
            push: i,
            clear: n
        }
    }
}).call(this),
(function() {
    var e, t, n, r;
    n = $.readyQueue(function(e) {
        r(e, null, window.location.href)
    }), $.hashChange = n.push, e = window.location.href, $(window).on("popstate", function() {
        return e = window.location.href
    }), $(window).on("hashchange", function(t) {
        var i, o, a;
        o = null != (a = t.originalEvent.oldURL) ? a : e, i = window.location.href, r(n.handlers, o, i), e = i
    }), t = null, $(document).on("pjax:start", function() {
        return t = window.location.href
    }), $(document).on("pjax:end", function() {
        var e;
        return e = window.location.href, r(n.handlers, t, e)
    }), r = function(e, t, n) {
        var r, i, o, a, s, c;
        for ((o = window.location.hash.slice(1)) && (a = document.getElementById(o)), null == a && (a = window), r = {
                oldURL: t,
                newURL: n,
                target: a
            }, s = 0, c = e.length; c > s; s++) i = e[s], i.call(a, r)
    }, $.hashChange.clear = function() {
        return n.clear()
    }
}).call(this),
(function() {
    var e, t;
    t = function() {}, window.SlidingPromiseQueue = e = function() {
        function e() {
            this.previousReceiver = new Object
        }
        return e.prototype.push = function(e) {
            return this.previousReceiver.resolve = this.previousReceiver.reject = t, new Promise(function(t) {
                return function(n, r) {
                    var i, o, a;
                    return t.previousReceiver = a = {
                        resolve: n,
                        reject: r
                    }, i = function() {
                        return a.resolve.apply(this, arguments)
                    }, o = function() {
                        return a.reject.apply(this, arguments)
                    }, e.then(i, o)
                }
            }(this))
        }, e
    }()
}).call(this);