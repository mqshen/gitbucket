(function() {
    var e, t, n;
    t = "ontransitionend" in window, $.fn.performTransition = function(r) {
        var i, o, a, s, c, l, u, f;
        if (!t) return void r.apply(this);
        for (a = this.find(".js-transitionable"), a = a.add(this.filter(".js-transitionable")), c = 0, u = a.length; u > c; c++) o = a[c], i = $(o), s = e(o), i.one("transitionend", function() {
            return o.style.display = null, o.style.visibility = null, s ? n(o, function() {
                return o.style.height = null
            }) : void 0
        }), o.style.display = "block", o.style.visibility = "visible", s && n(o, function() {
            return o.style.height = "" + i.height() + "px"
        }), o.offsetHeight;
        for (r.apply(this), l = 0, f = a.length; f > l; l++) o = a[l], e(o) && (o.style.height = 0 === $(o).height() ? "" + o.scrollHeight + "px" : "0px");
        return this
    }, e = function(e) {
        return "height" === $(e).css("transitionProperty")
    }, n = function(e, t) {
        e.style.transition = "none", t(e), e.offsetHeight, e.style.transition = null
    }
}).call(this);