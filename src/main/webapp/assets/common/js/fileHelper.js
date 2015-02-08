(function() {
    "use strict";

    function e(t) {
        this.map = {};
        var n = this;
        t instanceof e ? t.forEach(function(e, t) {
            t.forEach(function(t) {
                n.append(e, t)
            })
        }) : t && Object.getOwnPropertyNames(t).forEach(function(e) {
            n.append(e, t[e])
        })
    }

    function t(e) {
        return e.bodyUsed ? Promise.reject(new TypeError("Already read")) : void(e.bodyUsed = !0)
    }

    function n(e) {
        return new Promise(function(t, n) {
            e.onload = function() {
                t(e.result)
            }, e.onerror = function() {
                n(e.error)
            }
        })
    }

    function r(e) {
        var t = new FileReader;
        return t.readAsArrayBuffer(e), n(t)
    }

    function i(e) {
        var t = new FileReader;
        return t.readAsText(e), n(t)
    }

    function o() {
        return this.bodyUsed = !1, f ? (this.blob = function() {
            var e = t(this);
            return e ? e : Promise.resolve(this._bodyBlob)
        }, this.arrayBuffer = function() {
            return this.blob().then(r)
        }, this.text = function() {
            return this.blob().then(i)
        }) : this.text = function() {
            var e = t(this);
            return e ? e : Promise.resolve(this._bodyText)
        }, "FormData" in self && (this.formData = function() {
            return this.text().then(c)
        }), this.json = function() {
            return this.text().then(JSON.parse)
        }, this
    }

    function a(e) {
        var t = e.toUpperCase();
        return d.indexOf(t) > -1 ? t : e
    }

    function s(t, n) {
        n = n || {}, this.url = t, this._body = n.body, this.credentials = n.credentials || "omit", this.headers = new e(n.headers), this.method = a(n.method || "GET"), this.mode = n.mode || null, this.referrer = null
    }

    function c(e) {
        var t = new FormData;
        return e.trim().split("&").forEach(function(e) {
            if (e) {
                var n = e.split("="),
                    r = n.shift().replace(/\+/g, " "),
                    i = n.join("=").replace(/\+/g, " ");
                t.append(decodeURIComponent(r), decodeURIComponent(i))
            }
        }), t
    }

    function l(t) {
        var n = new e,
            r = t.getAllResponseHeaders().trim().split("\n");
        return r.forEach(function(e) {
            var t = e.trim().split(":"),
                r = t.shift().trim(),
                i = t.join(":").trim();
            n.append(r, i)
        }), n
    }

    function u(e, t) {
        t || (t = {}), f ? this._bodyBlob = "string" == typeof e ? new Blob([e]) : e : this._bodyText = e, this.type = "default", this.url = null, this.status = t.status, this.statusText = t.statusText, this.headers = t.headers, this.url = t.url || ""
    }
    if (!self.fetch) {
        e.prototype.append = function(e, t) {
            e = e.toLowerCase();
            var n = this.map[e];
            n || (n = [], this.map[e] = n), n.push(t)
        }, e.prototype["delete"] = function(e) {
            delete this.map[e.toLowerCase()]
        }, e.prototype.get = function(e) {
            var t = this.map[e.toLowerCase()];
            return t ? t[0] : null
        }, e.prototype.getAll = function(e) {
            return this.map[e.toLowerCase()] || []
        }, e.prototype.has = function(e) {
            return this.map.hasOwnProperty(e.toLowerCase())
        }, e.prototype.set = function(e, t) {
            this.map[e.toLowerCase()] = [t]
        }, e.prototype.forEach = function(e) {
            var t = this;
            Object.getOwnPropertyNames(this.map).forEach(function(n) {
                e(n, t.map[n])
            })
        };
        var f = "FileReader" in self && "Blob" in self && function() {
                try {
                    return new Blob, !0
                } catch (e) {
                    return !1
                }
            }(),
            d = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        s.prototype.fetch = function() {
            var e = this;
            return new Promise(function(t, n) {
                function r() {
                    return "responseURL" in i ? i.responseURL : /^X-Request-URL:/m.test(i.getAllResponseHeaders()) ? i.getResponseHeader("X-Request-URL") : void 0
                }
                var i = new XMLHttpRequest;
                i.onload = function() {
                    var e = 1223 === i.status ? 204 : i.status;
                    if (100 > e || e > 599) return void n(new TypeError("Network request failed"));
                    var o = {
                            status: e,
                            statusText: i.statusText,
                            headers: l(i),
                            url: r()
                        },
                        a = "response" in i ? i.response : i.responseText;
                    t(new u(a, o))
                }, i.onerror = function() {
                    n(new TypeError("Network request failed"))
                }, i.open(e.method, e.url), "responseType" in i && f && (i.responseType = "blob"), e.headers.forEach(function(e, t) {
                    t.forEach(function(t) {
                        i.setRequestHeader(e, t)
                    })
                }), i.send(void 0 === e._body ? null : e._body)
            })
        }, o.call(s.prototype), o.call(u.prototype), self.Headers = e, self.Request = s, self.Response = u, self.fetch = function(e, t) {
            return new s(e, t).fetch()
        }, self.fetch.polyfill = !0
    }
})();