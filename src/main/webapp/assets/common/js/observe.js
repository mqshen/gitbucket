(function() {
    var e, t, n, r, i, o, a, s, c, l, u, f, d, h, p, m, v, g, y, b, w, x, T, E, _;
        h = function() {
            var e, t, n;
            return e = document.createElement("div"), t = document.createElement("div"), n = document.createElement("div"), e.appendChild(t), t.appendChild(n), e.innerHTML = "", n.parentNode !== t
        }(), _ = 0, s = [], T = new SelectorSet, T.querySelectorAll = $.find, T.matchesSelector = $.find.matchesSelector, f = new WeakMap, n = new WeakMap, d = new WeakMap, b = function(e, t) {
            var n, r;
            (n = f.get(e)) || (n = [], f.set(e, n)), -1 === n.indexOf(t.id) && (null != t.initialize && (r = t.initialize.call(e, e)), d.set(e, r), n.push(t.id))
        }, y = function(e, t) {
            var r, i, o, a;
            (r = n.get(e)) || (r = [], n.set(e, r)), -1 === r.indexOf(t.id) && (t.elements.push(e), (i = d.get(e)) && ("length" in i || null != (o = i.add) && o.call(e, e)), null != (a = t.add) && a.call(e, e), r.push(t.id))
        }, w = function(e, t) {
            var r, i, o, a, c, l, u, f, h, p, m;
            if (r = n.get(e))
                if (t) o = t.elements.indexOf(e), -1 !== o && t.elements.splice(o, 1), o = r.indexOf(t.id), -1 !== o && ((a = d.get(e)) && ("length" in a || null != (u = a.remove) && u.call(e, e)), null != (f = t.remove) && f.call(e, e), r.splice(o, 1)), 0 === r.length && n["delete"](e);
                else {
                    for (h = r.slice(0), c = 0, l = h.length; l > c; c++) i = h[c], t = s[i], t && (o = t.elements.indexOf(e), -1 !== o && t.elements.splice(o, 1), (a = d.get(e)) && null != (p = a.remove) && p.call(e, e), null != (m = t.remove) && m.call(e, e));
                    n["delete"](e)
                }
        }, r = function(e, t) {
            var n, r, i, o, a, s, c, l, u, f, d, h, p, m, v;
            for (a = 0, u = t.length; u > a; a++)
                if (i = t[a], i.nodeType === Node.ELEMENT_NODE) {
                    for (p = T.matches(i), s = 0, f = p.length; f > s; s++) n = p[s].data, e.push(["add", i, n]);
                    for (m = T.queryAll(i), c = 0, d = m.length; d > c; c++)
                        for (v = m[c], n = v.data, o = v.elements, l = 0, h = o.length; h > l; l++) r = o[l], e.push(["add", r, n])
                }
        }, p = function(e, t) {
            var n, r, i, o, a, s, c;
            for (i = 0, a = t.length; a > i; i++)
                if (r = t[i], r.nodeType === Node.ELEMENT_NODE)
                    for (e.push(["remove", r]), c = r.getElementsByTagName("*"), o = 0, s = c.length; s > o; o++) n = c[o], e.push(["remove", n])
        }, g = function(e) {
            var t, n, r, i, o, a, c;
            for (r = 0, o = s.length; o > r; r++)
                if (n = s[r])
                    for (c = n.elements, i = 0, a = c.length; a > i; i++) t = c[i], t.parentNode || e.push(["remove", t])
        }, v = function(e, t) {
            var r, i, o, a, c, l, u, f, d;
            if (t.nodeType === Node.ELEMENT_NODE) {
                for (d = T.matches(t), c = 0, u = d.length; u > c; c++) r = d[c].data, e.push(["add", t, r]);
                if (o = n.get(t))
                    for (l = 0, f = o.length; f > l; l++) i = o[l], (a = s[i]) && (T.matchesSelector(t, a.selector) || e.push(["remove", t, a]))
            }
        }, m = function(e, t) {
            var n, r, i, o;
            if (t.nodeType === Node.ELEMENT_NODE)
                for (v(e, t), o = t.getElementsByTagName("*"), r = 0, i = o.length; i > r; r++) n = o[r], v(e, n)
        }, i = function(e) {
            var t, n, r, i, o, a;
            for (i = 0, o = e.length; o > i; i++) a = e[i], r = a[0], t = a[1], n = a[2], "add" === r ? (b(t, n), y(t, n)) : "remove" === r && w(t, n)
        }, E = function(e) {
            var t, n, r, i;
            for (i = e.elements, n = 0, r = i.length; r > n; n++) t = i[n], w(t, e);
            T.remove(e.selector, e), delete s[e.id], $.observe.count--
        }, $.observe = function(e, t) {
            var n;
            return null != t.call && (t = {
                initialize: t
            }), n = {
                id: _++,
                selector: e,
                initialize: t.initialize || t.init,
                add: t.add,
                remove: t.remove,
                elements: [],
                stop: function() {
                    return E(n)
                }
            }, T.add(e, n), s[n.id] = n, x(), $.observe.count++, n
        }, t = !1, x = function() {
            return t ? void 0 : (setImmediate(e), t = !0)
        }, e = function() {
            var e;
            return e = [], r(e, [document.documentElement]), i(e), t = !1
        }, $.observe.count = 0, $(document).on("observe:dirty", function(e) {
            var t;
            t = [], m(t, e.target), i(t)
        }), o = [], c = function() {
            var e, t, n, r, a, s, c, l, u;
            for (e = [], a = o, o = [], s = 0, l = a.length; l > s; s++)
                for (r = a[s], n = r.form ? r.form.elements : r.ownerDocument.getElementsByTagName("input"), c = 0, u = n.length; u > c; c++) t = n[c], v(e, t);
            i(e)
        }, l = function(e) {
            o.push(e.target), setImmediate(c)
        }, document.addEventListener("change", l, !1), $(document).on("change", l), u = function(e) {
            var t, n, o, a;
            for (t = [], o = 0, a = e.length; a > o; o++) n = e[o], "childList" === n.type ? (r(t, n.addedNodes), p(t, n.removedNodes)) : "attributes" === n.type && v(t, n.target);
            h && g(t), i(t)
        }, a = new MutationObserver(u), $(function() {
            var e;
            return a.observe(document, {
                childList: !0,
                attributes: !0,
                subtree: !0
            }), e = [], r(e, [document.documentElement]), i(e)
        }, !1)
}).call(jQuery);