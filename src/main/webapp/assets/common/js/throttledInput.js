(function() {
    var e, t;
    e = function() {
        var e, t, n, r, i;
        return n = !1, t = !1, i = null, e = 100, r = function(n) {
            return function(r) {
                i && clearTimeout(i), i = setTimeout(function() {
                    var e;
                    i = null, t = !1, e = new $.Event("throttled:input", {
                        target: r
                    }), $.event.trigger(e, null, n, !0)
                }, e)
            }
        }(this), $(this).on("keydown.throttledInput", function() {
            n = !0, i && clearTimeout(i)
        }), $(this).on("keyup.throttledInput", function(e) {
            n = !1, t && r(e.target)
        }), $(this).on("input.throttledInput", function(e) {
            t = !0, n || r(e.target)
        })
    }, t = function() {
        return $(this).off("keydown.throttledInput"), $(this).off("keyup.throttledInput"), $(this).off("input.throttledInput")
    }, $.event.special["throttled:input"] = {
        setup: e,
        teardown: t
    }
}).call(this);