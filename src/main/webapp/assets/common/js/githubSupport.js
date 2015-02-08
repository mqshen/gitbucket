(function() {
    var e, t, n, r, i;
    null == window.GitHub && (window.GitHub = {}), e = document.createElement("input"), t = document.createElement("textarea"), window.GitHub.support = {
        emoji: function() {
            var e, t, n;
            return n = document.createElement("canvas"), e = n.getContext("2d"), e.fillStyle = "#f00", e.textBaseline = "top", e.font = "32px Arial", t = String.fromCharCode(55357) + String.fromCharCode(56360), e.fillText(t, 0, 0), 0 !== e.getImageData(16, 16, 1, 1).data[0]
        }(),
        registerElement: "registerElement" in document,
        requestAnimationFrame: "requestAnimationFrame" in window,
        setImmediate: "setImmediate" in window,
        Promise: "Promise" in window,
        URL: "URL" in window,
        WeakMap: "WeakMap" in window,
        placeholder_input: "placeholder" in e,
        placeholder_textarea: "placeholder" in t,
        closest: "function" == typeof e.closest,
        matches: "function" == typeof e.matches,
        performanceNow: !!(null != (n = window.performance) ? n.now : void 0),
        performanceMark: !!(null != (r = window.performance) ? r.mark : void 0),
        performanceGetEntries: !!(null != (i = window.performance) ? i.getEntries : void 0)
    }, GitHub.support.classList = "classList" in e, GitHub.support.classListMultiArg = GitHub.support.classList && function() {
        return e.classList.add("a", "b"), e.classList.contains("b")
    }(), GitHub.performanceEnabled = function() {
        var e, t, n, r, i, o, a, s;
        return null != (null != (t = window.performance) ? t.now : void 0) && null != (null != (n = window.performance) ? n.timing : void 0) && null != (null != (r = window.performance) ? r.clearMarks : void 0) && null != (null != (i = window.performance) ? i.clearMeasures : void 0) && null != (null != (o = window.performance) ? o.mark : void 0) && null != (null != (a = window.performance) ? a.measure : void 0) && null != (null != (s = window.performance) ? s.getEntriesByName : void 0) && null != (null != (e = window.performance) ? e.getEntriesByType : void 0)
    }
}).call(this);