(function() {
    top !== window && (alert("For security reasons, framing is not allowed."), top.location.replace(document.location))
}).call(this),
    function() {
        var t, e, n;
        e = function() {
            var t;
            return document.getElementById("js-sudo-prompt") ? Promise.resolve() : (t = document.querySelector("link[rel=sudo-modal]")) ? $.fetch(t.href).then(function(t) {
                return t.text()
            }).then(function(t) {
                return document.body.insertAdjacentHTML("beforeend", t)
            }) : Promise.reject()
        }, t = function() {
            return $.fetch("/sessions/in_sudo.json").then(function(t) {
                return t.json()
            })
        }, n = function() {
            return e().then(function() {
                return $.facebox({
                    div: "#js-sudo-prompt"
                }, "sudo")
            }).then(function(t) {
                return new Promise(function(e, n) {
                    var i, s;
                    return s = null, i = $(t).find(".js-sudo-form"), i.find(".js-sudo-login, .js-sudo-password").first().focus(), i.on("ajaxSuccess", function() {
                        return s = !0, $(document).trigger("close.facebox")
                    }), i.on("ajaxError", function() {
                        return s = !1, $(this).find(".js-sudo-error").text("Incorrect Password.").show(), $(this).find(".js-sudo-password").val(""), !1
                    }), $(document).one("afterClose.facebox", function() {
                        return s ? e(!0) : n(new Error("sudo prompt canceled"))
                    })
                })
            })
        }, $.sudo = function() {
            return t().then(function(t) {
                return t || n()
            })
        }, $(document).on("click", "a.js-sudo-required", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return location.href = t.href
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        null == window.GitHub && (window.GitHub = {})
    }.call(this),
    function(t) {
        t.fn.caret = function(t) {
            return "undefined" == typeof t ? this[0].selectionStart : (this[0].focus(), this[0].setSelectionRange(t, t))
        }, t.fn.caretSelection = function(t, e) {
            return "undefined" == typeof t && "undefined" == typeof e ? [this[0].selectionStart, this[0].selectionEnd] : (this[0].focus(), this[0].setSelectionRange(t, e))
        }
    }(jQuery), DateInput = function(t) {
                       function e(n, i) {
                           "object" != typeof i && (i = {}), t.extend(this, e.DEFAULT_OPTS, i), this.input = t(n), this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate"), this.build(), this.selectDate(), this.show(), this.input.hide(), this.input.data("datePicker", this)
                       }
                       return e.DEFAULT_OPTS = {
                           month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                           short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                           short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                           start_of_week: 1
                       }, e.prototype = {
                           build: function() {
                               var e = t('<p class="month_nav"><span class="date-button prev" title="[Page-Up]">\u25c0</span> <span class="js-month-name"></span> <span class="date-button next" title="[Page-Down]">\u25b6</span></p>');
                               this.monthNameSpan = t(".js-month-name", e), t(".prev", e).click(this.bindToObj(function() {
                                   this.moveMonthBy(-1)
                               })), t(".next", e).click(this.bindToObj(function() {
                                   this.moveMonthBy(1)
                               }));
                               var n = t('<p class="year_nav"><span class="date-button prev" title="[Ctrl+Page-Up]">\u25c0</span> <span class="js-year-name"></span> <span class="date-button next" title="[Ctrl+Page-Down]">\u25b6</span></p>');
                               this.yearNameSpan = t(".js-year-name", n), t(".prev", n).click(this.bindToObj(function() {
                                   this.moveMonthBy(-12)
                               })), t(".next", n).click(this.bindToObj(function() {
                                   this.moveMonthBy(12)
                               }));
                               var i = t("<div></div>").append(e, n),
                                   s = "<table><thead><tr>";
                               t(this.adjustDays(this.short_day_names)).each(function() {
                                   s += "<th>" + this + "</th>"
                               }), s += "</tr></thead><tbody></tbody></table>", this.dateSelector = this.rootLayers = t('<div class="date_selector"></div>').append(i, s).insertAfter(this.input), this.tbody = t("tbody", this.dateSelector), this.input.change(this.bindToObj(function() {
                                   this.selectDate()
                               })), this.selectDate()
                           },
                           selectMonth: function(e) {
                               var n = new Date(e.getFullYear(), e.getMonth(), 1);
                               if (!this.currentMonth || this.currentMonth.getFullYear() != n.getFullYear() || this.currentMonth.getMonth() != n.getMonth()) {
                                   this.currentMonth = n;
                                   for (var i = this.rangeStart(e), s = this.rangeEnd(e), a = this.daysBetween(i, s), r = "", o = 0; a >= o; o++) {
                                       var c = new Date(i.getFullYear(), i.getMonth(), i.getDate() + o, 12, 0);
                                       this.isFirstDayOfWeek(c) && (r += "<tr>"), r += c.getMonth() == e.getMonth() ? '<td class="selectable_day" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>" : '<td class="unselected_month" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>", this.isLastDayOfWeek(c) && (r += "</tr>")
                                   }
                                   this.tbody.empty().append(r), this.monthNameSpan.empty().append(this.monthName(e)), this.yearNameSpan.empty().append(this.currentMonth.getFullYear()), t(".selectable_day", this.tbody).mousedown(this.bindToObj(function(e) {
                                       this.changeInput(t(e.target).attr("date"))
                                   })), t("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today"), t("td.selectable_day", this.tbody).mouseover(function() {
                                       t(this).addClass("hover")
                                   }), t("td.selectable_day", this.tbody).mouseout(function() {
                                       t(this).removeClass("hover")
                                   })
                               }
                               t(".selected", this.tbody).removeClass("selected"),
                                   t('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected");
                           },
                           selectDate: function(t) {
                               "undefined" == typeof t && (t = this.stringToDate(this.input.val())), t || (t = new Date), this.selectedDate = t, this.selectedDateString = this.dateToString(this.selectedDate), this.selectMonth(this.selectedDate)
                           },
                           resetDate: function() {
                               t(".selected", this.tbody).removeClass("selected"), this.changeInput("")
                           },
                           changeInput: function(t) {
                               this.input.val(t).change(), this.hide()
                           },
                           show: function() {
                               this.rootLayers.css("display", "block"), t([window, document.body]).click(this.hideIfClickOutside), this.input.unbind("focus", this.show), this.rootLayers.keydown(this.keydownHandler), this.setPosition()
                           },
                           hide: function() {},
                           hideIfClickOutside: function(t) {
                               t.target == this.input[0] || this.insideSelector(t) || this.hide()
                           },
                           insideSelector: function(e) {
                               return $target = t(e.target), $target.parents(".date_selector").length || $target.is(".date_selector")
                           },
                           keydownHandler: function(t) {
                               switch (t.keyCode) {
                                   case 9:
                                   case 27:
                                       return void this.hide();
                                   case 13:
                                       this.changeInput(this.selectedDateString);
                                       break;
                                   case 33:
                                       this.moveDateMonthBy(t.ctrlKey ? -12 : -1);
                                       break;
                                   case 34:
                                       this.moveDateMonthBy(t.ctrlKey ? 12 : 1);
                                       break;
                                   case 38:
                                       this.moveDateBy(-7);
                                       break;
                                   case 40:
                                       this.moveDateBy(7);
                                       break;
                                   case 37:
                                       this.moveDateBy(-1);
                                       break;
                                   case 39:
                                       this.moveDateBy(1);
                                       break;
                                   default:
                                       return
                               }
                               t.preventDefault()
                           },
                           stringToDate: function(t) {
                               var e;
                               return (e = t.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) ? new Date(e[1], (e[2] - 1), e[3], 12, 0) : null
                           },
                           dateToString: function(t) {
                               return t.getFullYear() + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + ("0" + t.getDate()).slice(-2)
                           },
                           setPosition: function() {
                               var t = this.input.offset();
                               this.rootLayers.css({
                                   top: t.top + this.input.outerHeight(),
                                   left: t.left
                               }), this.ieframe && this.ieframe.css({
                                   width: this.dateSelector.outerWidth(),
                                   height: this.dateSelector.outerHeight()
                               })
                           },
                           moveDateBy: function(t) {
                               var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + t);
                               this.selectDate(e)
                           },
                           moveDateMonthBy: function(t) {
                               var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + t, this.selectedDate.getDate());
                               e.getMonth() == this.selectedDate.getMonth() + t + 1 && e.setDate(0), this.selectDate(e)
                           },
                           moveMonthBy: function(t) {
                               var e = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + t, this.currentMonth.getDate());
                               this.selectMonth(e)
                           },
                           monthName: function(t) {
                               return this.month_names[t.getMonth()]
                           },
                           bindToObj: function(t) {
                               var e = this;
                               return function() {
                                   return t.apply(e, arguments)
                               }
                           },
                           bindMethodsToObj: function() {
                               for (var t = 0; t < arguments.length; t++) this[arguments[t]] = this.bindToObj(this[arguments[t]])
                           },
                           indexFor: function(t, e) {
                               for (var n = 0; n < t.length; n++)
                                   if (e == t[n]) return n
                           },
                           monthNum: function(t) {
                               return this.indexFor(this.month_names, t)
                           },
                           shortMonthNum: function(t) {
                               return this.indexFor(this.short_month_names, t)
                           },
                           shortDayNum: function(t) {
                               return this.indexFor(this.short_day_names, t)
                           },
                           daysBetween: function(t, e) {
                               return t = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), e = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()), (e - t) / 864e5
                           },
                           changeDayTo: function(t, e, n) {
                               var i = n * (Math.abs(e.getDay() - t - 7 * n) % 7);
                               return new Date(e.getFullYear(), e.getMonth(), e.getDate() + i)
                           },
                           rangeStart: function(t) {
                               return this.changeDayTo(this.start_of_week, new Date(t.getFullYear(), t.getMonth()), -1)
                           },
                           rangeEnd: function(t) {
                               return this.changeDayTo((this.start_of_week - 1) % 7, new Date(t.getFullYear(), t.getMonth() + 1, 0), 1)
                           },
                           isFirstDayOfWeek: function(t) {
                               return t.getDay() == this.start_of_week
                           },
                           isLastDayOfWeek: function(t) {
                               return t.getDay() == (this.start_of_week - 1) % 7
                           },
                           adjustDays: function(t) {
                               for (var e = [], n = 0; n < t.length; n++) e[n] = t[(n + this.start_of_week) % 7];
                               return e
                           }
                       }, e
                   }(jQuery) ,
    function(t) {
        t.fn.errorify = function(e, n) {
            t.extend({}, t.fn.errorify.defaults, n);
            return this.each(function() {
                var n = t(this);
                n.removeClass("warn"), n.addClass("errored"), n.find("p.note").hide(), n.find("dd.error").remove(), n.find("dd.warning").remove();
                var i = t("<dd>").addClass("error").text(e);
                n.append(i)
            })
        }, t.fn.errorify.defaults = {}, t.fn.unErrorify = function(e) {
            t.extend({}, t.fn.unErrorify.defaults, e);
            return this.each(function() {
                var e = t(this);
                e.removeClass("errored warn"), e.find("p.note").show(), e.find("dd.error").remove(), e.find("dd.warning").remove()
            })
        }, t.fn.unErrorify.defaults = {}
    }(jQuery),
    function() {
        var t, e;
        t = function(t) {
            return Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.name = "DataRemoteError", this.message = t
        }, t.prototype = new Error, t.prototype.constructor = t, e = function() {
            return $("#ajax-error-message").show(function() {
                return $(this).addClass("visible")
            })
        }, $(document).on("ajaxError", "[data-remote]", function(n, i, s, r) {
            var a, o, c, l, u, d, h;
            if (this === n.target && "abort" !== r) {
                if (o = "." + this.className.split(" ").sort().join("."), a = new t("" + r + " (" + i.status + ") from " + o), a.failbotContext = {
                        dataRemote: {
                            target: $(this).inspect(),
                            method: null != (c = null != (l = this.getAttribute("data-method")) ? l : this.getAttribute("method")) ? c : "GET",
                            url: null != (u = null != (d = this.href) ? d : this.action) ? u : window.location.href,
                            dataType: null != (h = this.getAttribute("data-type")) ? h : "intelligent guess"
                        }
                    }, /<html/.test(i.responseText)) throw e(), n.stopImmediatePropagation(), a;
                return setTimeout(function() {
                    if (!n.isDefaultPrevented()) throw e(), a
                }, 0)
            }
        }), $(document).on("ajaxBeforeSend", "[data-remote]", function() {
            return $("#ajax-error-message").hide().removeClass("visible")
        }), $(document).on("click", ".js-ajax-error-dismiss", function() {
            return $("#ajax-error-message").hide().removeClass("visible"), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", "[data-remote]", function(t) {
            return this !== t.target || t.isDefaultPrevented() ? void 0 : $(this).addClass("loading")
        }), $(document).on("ajaxComplete", "[data-remote]", function(t) {
            return this === t.target ? $(this).removeClass("loading") : void 0
        })
    }.call(this),
    function() {
        var t, e, n, i;
        i = new WeakMap, n = new WeakMap, e = function(t, e, n) {
            var s, r;
            return (s = i.get(t)) && (s.abort(), i["delete"](t)), n.value.trim() ? (r = $.ajax({
                url: e,
                data: n,
                type: "POST"
            }), i.set(t, r), Promise.resolve(r)) : Promise.reject({
                statusText: "empty"
            })
        }, t = function(t) {
            var i, s, r, a, o, c, l, u, d;
            return i = $(t), d = t.getAttribute("data-autocheck-url"), r = {
                value: t.value
            }, c = $.Event("autocheck:send"), i.trigger(c, r), c.isDefaultPrevented() || (a = $.param(r).split("&").sort().join("&"), a === n.get(t)) ? void 0 : (n.set(t, a), i.closest("dl.form").removeClass("errored successed"), t.classList.remove("is-autocheck-successful", "is-autocheck-errored"), u = function(e) {
                return t.classList.toggle("is-autocheck-loading", e), i.closest("dl.form").toggleClass("is-loading", e)
            }, s = function() {
                return u(!1), i.trigger("autocheck:complete")
            }, o = function(e) {
                return t.classList.add("is-autocheck-successful"), i.closest("dl.form").unErrorify().addClass("successed"), i.trigger("autocheck:success", [e]), s()
            }, l = function(e) {
                var n;
                if ("abort" !== e.statusText) return "empty" === e.statusText ? i.closest("dl.form").unErrorify() : i.is($.visible) && (t.classList.add("is-autocheck-errored"), n = e.responseText, /<html/.test(n) && (n = "Something went wrong."), i.closest("dl.form").errorify(n), i.trigger("autocheck:error")), s()
            }, u(!0), e(t, d, r).then(o, l))
        }, $(document).on("change", "input[data-autocheck-url]", function() {
            t(this)
        }), $(document).onFocusedInput("input[data-autocheck-url]", function(e) {
            return $(this).on("throttled:input." + e, function() {
                t(this)
            }), !1
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        new(t = function() {
            function t() {
                this.onNavigationOpen = e(this.onNavigationOpen, this), this.onNavigationKeyDown = e(this.onNavigationKeyDown, this), this.onInputChange = e(this.onInputChange, this), this.onResultsMouseDown = e(this.onResultsMouseDown, this), this.onInputBlur = e(this.onInputBlur, this), this.onInputFocus = e(this.onInputFocus, this);
                var t;
                this.focusedInput = this.focusedResults = null, this.mouseDown = !1, this.fetchQueue = new SlidingPromiseQueue, t = this, $(document).focused(".js-autocomplete-field")["in"](function() {
                    return t.onInputFocus(this)
                })
            }
            return t.prototype.bindEvents = function(t, e) {
                return $(t).on("blur", this.onInputBlur), $(t).on("throttled:input", this.onInputChange), $(e).on("mousedown", this.onResultsMouseDown), $(e).on("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).on("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
            }, t.prototype.unbindEvents = function(t, e) {
                return $(t).off("blur", this.onInputBlur), $(t).off("throttled:input", this.onInputChange), $(e).off("mousedown", this.onResultsMouseDown), $(e).off("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).off("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
            }, t.prototype.onInputFocus = function(t) {
                var e, n;
                e = $(t).closest(".js-autocomplete-container"), n = e.find(".js-autocomplete")[0], this.focusedInput = t, this.focusedResults = n, this.bindEvents(t, n), $(t).attr("autocomplete", "off"), $(t).trigger("autocomplete:focus"), this.fetchResults(t.value)
            }, t.prototype.onInputBlur = function() {
                var t, e;
                t = this.focusedInput, e = this.focusedResults, this.mouseDown || (this.hideResults(), this.inputValue = null, this.focusedInput = this.focusedResults = null, this.unbindEvents(t, e), $(t).trigger("autocomplete:blur"))
            }, t.prototype.onResultsMouseDown = function() {
                var t;
                this.mouseDown = !0, t = function(e) {
                    return function() {
                        return e.mouseDown = !1, $(document).off("mouseup", t)
                    }
                }(this), $(document).on("mouseup", t)
            }, t.prototype.onInputChange = function(t) {
                var e;
                e = t.currentTarget, this.inputValue !== e.value && ($(e).removeAttr("data-autocompleted"), $(e).trigger("autocomplete:autocompleted:changed")), this.fetchResults(e.value)
            }, t.prototype.fetchResults = function(t) {
                var e, n, i, s;
                return (s = this.focusedResults.getAttribute("data-search-url")) ? (e = $(this.focusedInput).closest(".js-autocomplete-container"), i = t.trim() ? (s += ~s.indexOf("?") ? "&" : "?", s += "q=" + encodeURIComponent(t), e.addClass("is-sending"), $.fetchText(s)) : Promise.resolve(""), n = function() {
                    return e.removeClass("is-sending")
                }, this.fetchQueue.push(i).then(function(e) {
                    return function(n) {
                        return $(e.focusedResults).find(".js-autocomplete-results").html(n), e.onResultsChange(t)
                    }
                }(this)).then(n, n)) : void 0
            }, t.prototype.onResultsChange = function(t) {
                var e;
                e = $(this.focusedResults).find("[data-autocomplete-value]"), 0 === e.length ? this.hideResults() : this.inputValue !== t && (this.inputValue = t, this.showResults(), $(this.focusedInput).is("[data-autocomplete-autofocus]") && $(this.focusedResults).find(".js-navigation-container").navigation("focus"))
            }, t.prototype.onNavigationKeyDown = function(t) {
                switch (t.hotkey) {
                    case "tab":
                        return this.onNavigationOpen(t), !1;
                    case "esc":
                        return this.hideResults(), !1
                }
            }, t.prototype.onNavigationOpen = function(t) {
                var e, n;
                e = t.currentTarget, n = $(e).attr("data-autocomplete-value"), this.inputValue = n, $(this.focusedInput).val(n), $(this.focusedInput).attr("data-autocompleted", n), $(this.focusedInput).trigger("autocomplete:autocompleted:changed", [n]), $(this.focusedInput).trigger("autocomplete:result", [n]), $(e).removeClass("active"), this.focusedInput === document.activeElement ? this.hideResults() : this.onInputBlur()
            }, t.prototype.showResults = function(t, e) {
                var n, i, s, r, a;
                return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is($.visible) ? void 0 : (a = $(t).offset(), s = a.top, i = a.left, n = s + $(t).innerHeight(), r = $(t).innerWidth(), $(e).css({
                    display: "block",
                    position: "absolute",
                    width: r + 2
                }), $(e).offset({
                    top: n + 5,
                    left: i + 1
                }), $(t).addClass("js-navigation-enable"), $(e).find(".js-navigation-container").navigation("push"), $(e).show())
            }, t.prototype.hideResults = function(t, e) {
                return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is($.visible) ? ($(t).removeClass("js-navigation-enable"), $(e).find(".js-navigation-container").navigation("pop"), $(e).hide()) : void 0
            }, t
        }())
    }.call(this),
    function() {
        $(document).focused(".js-autosearch-field")["in"](function() {
            var t, e, n;
            return t = $(this), e = t.closest("form"), n = $("#" + e.attr("data-results-container")), t.on("throttled:input.autosearch_form", function() {
                var t, i;
                return e.addClass("is-sending"), t = e.prop("action"), i = $.ajax({
                    url: t,
                    data: e.serializeArray(),
                    context: e
                }), i.always(function() {
                    return e.removeClass("is-sending")
                }), i.done(function(t) {
                    return $.support.pjax && window.history.replaceState(null, "", "?" + e.serialize()), n.html(t)
                })
            })
        }).out(function() {
            return $(this).off(".autosearch_form")
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-braintree-encrypt", function() {
            var t;
            t = Braintree.create($(this).attr("data-braintree-key")), t.encryptForm(this)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, $, b = [].slice,
            j = [].indexOf || function(t) {
                for (var e = 0, n = this.length; n > e; e++)
                    if (e in this && this[e] === t) return e;
                return -1
            };
        t = jQuery, t.payment = {}, t.payment.fn = {}, t.fn.payment = function() {
            var e, n;
            return n = arguments[0], e = 2 <= arguments.length ? b.call(arguments, 1) : [], t.payment.fn[n].apply(this, e)
        }, s = /(\d{1,4})/g, i = [{
            type: "maestro",
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            format: s,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "dinersclub",
            pattern: /^(36|38|30[0-5])/,
            format: s,
            length: [14],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "laser",
            pattern: /^(6706|6771|6709)/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "jcb",
            pattern: /^35/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "unionpay",
            pattern: /^62/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !1
        }, {
            type: "discover",
            pattern: /^(6011|65|64[4-9]|622)/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "mastercard",
            pattern: /^5[1-5]/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: !0
        }, {
            type: "visa",
            pattern: /^4/,
            format: s,
            length: [13, 14, 15, 16],
            cvcLength: [3],
            luhn: !0
        }], e = function(t) {
            var e, n, s;
            for (t = (t + "").replace(/\D/g, ""), n = 0, s = i.length; s > n; n++)
                if (e = i[n], e.pattern.test(t)) return e
        }, n = function(t) {
            var e, n, s;
            for (n = 0, s = i.length; s > n; n++)
                if (e = i[n], e.type === t) return e
        }, h = function(t) {
            var e, n, i, s, r, a;
            for (i = !0, s = 0, n = (t + "").split("").reverse(), r = 0, a = n.length; a > r; r++) e = n[r], e = parseInt(e, 10), (i = !i) && (e *= 2), e > 9 && (e -= 9), s += e;
            return s % 10 === 0
        }, d = function(t) {
            var e;
            return null != t.prop("selectionStart") && t.prop("selectionStart") !== t.prop("selectionEnd") ? !0 : ("undefined" != typeof document && null !== document && null != (e = document.selection) && "function" == typeof e.createRange ? e.createRange().text : void 0) ? !0 : !1
        }, f = function(e) {
            return setTimeout(function() {
                var n, i;
                return n = t(e.currentTarget), i = n.val(), i = t.payment.formatCardNumber(i), n.val(i)
            })
        }, o = function(n) {
            var i, s, r, a, o, c, l;
            return r = String.fromCharCode(n.which), !/^\d+$/.test(r) || (i = t(n.currentTarget), l = i.val(), s = e(l + r), a = (l.replace(/\D/g, "") + r).length, c = 16, s && (c = s.length[s.length.length - 1]), a >= c || null != i.prop("selectionStart") && i.prop("selectionStart") !== l.length) ? void 0 : (o = s && "amex" === s.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/, o.test(l) ? (n.preventDefault(), i.val(l + " " + r)) : o.test(l + r) ? (n.preventDefault(), i.val(l + r + " ")) : void 0)
        }, r = function(e) {
            var n, i;
            return n = t(e.currentTarget), i = n.val(), e.meta || 8 !== e.which || null != n.prop("selectionStart") && n.prop("selectionStart") !== i.length ? void 0 : /\d\s$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\d\s$/, ""))) : /\s\d?$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\s\d?$/, ""))) : void 0
        }, c = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (n = t(e.currentTarget), s = n.val() + i, /^\d$/.test(s) && "0" !== s && "1" !== s ? (e.preventDefault(), n.val("0" + s + " / ")) : /^\d\d$/.test(s) ? (e.preventDefault(), n.val("" + s + " / ")) : void 0) : void 0
        }, l = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (n = t(e.currentTarget), s = n.val(), /^\d\d$/.test(s) ? n.val("" + s + " / ") : void 0) : void 0
        }, u = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), "/" === i ? (n = t(e.currentTarget), s = n.val(), /^\d$/.test(s) && "0" !== s ? n.val("0" + s + " / ") : void 0) : void 0
        }, a = function(e) {
            var n, i;
            if (!e.meta && (n = t(e.currentTarget), i = n.val(), 8 === e.which && (null == n.prop("selectionStart") || n.prop("selectionStart") === i.length))) return /\d(\s|\/)+$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\d(\s|\/)*$/, ""))) : /\s\/\s?\d?$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\s\/\s?\d?$/, ""))) : void 0
        }, v = function(t) {
            var e;
            return t.metaKey || t.ctrlKey ? !0 : 32 === t.which ? !1 : 0 === t.which ? !0 : t.which < 33 ? !0 : (e = String.fromCharCode(t.which), !!/[\d\s]/.test(e))
        }, p = function(n) {
            var i, s, r, a;
            return i = t(n.currentTarget), r = String.fromCharCode(n.which), /^\d+$/.test(r) && !d(i) ? (a = (i.val() + r).replace(/\D/g, ""), s = e(a), s ? a.length <= s.length[s.length.length - 1] : a.length <= 16) : void 0
        }, g = function(e) {
            var n, i, s;
            return n = t(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) && !d(n) ? (s = n.val() + i, s = s.replace(/\D/g, ""), s.length > 6 ? !1 : void 0) : void 0
        }, m = function(e) {
            var n, i, s;
            return n = t(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (s = n.val() + i, s.length <= 4) : void 0
        }, $ = function(e) {
            var n, s, r, a, o;
            return n = t(e.currentTarget), o = n.val(), a = t.payment.cardType(o) || "unknown", n.hasClass(a) ? void 0 : (s = function() {
                var t, e, n;
                for (n = [], t = 0, e = i.length; e > t; t++) r = i[t], n.push(r.type);
                return n
            }(), n.removeClass("unknown"), n.removeClass(s.join(" ")), n.addClass(a), n.toggleClass("identified", "unknown" !== a), n.trigger("payment.cardType", a))
        }, t.payment.fn.formatCardCVC = function() {
            return this.payment("restrictNumeric"), this.on("keypress", m), this
        }, t.payment.fn.formatCardExpiry = function() {
            return this.payment("restrictNumeric"), this.on("keypress", g), this.on("keypress", c), this.on("keypress", u), this.on("keypress", l), this.on("keydown", a), this
        }, t.payment.fn.formatCardNumber = function() {
            return this.payment("restrictNumeric"), this.on("keypress", p), this.on("keypress", o), this.on("keydown", r), this.on("keyup", $), this.on("paste", f), this
        }, t.payment.fn.restrictNumeric = function() {
            return this.on("keypress", v), this
        }, t.payment.fn.cardExpiryVal = function() {
            return t.payment.cardExpiryVal(t(this).val())
        }, t.payment.cardExpiryVal = function(t) {
            var e, n, i, s;
            return t = t.replace(/\s/g, ""), s = t.split("/", 2), e = s[0], i = s[1], 2 === (null != i ? i.length : void 0) && /^\d+$/.test(i) && (n = (new Date).getFullYear(), n = n.toString().slice(0, 2), i = n + i), e = parseInt(e, 10), i = parseInt(i, 10), {
                month: e,
                year: i
            }
        }, t.payment.validateCardNumber = function(t) {
            var n, i;
            return t = (t + "").replace(/\s+|-/g, ""), /^\d+$/.test(t) ? (n = e(t), n ? (i = t.length, j.call(n.length, i) >= 0 && (n.luhn === !1 || h(t))) : !1) : !1
        }, t.payment.validateCardExpiry = function(e, n) {
            var i, s, r, a;
            return "object" == typeof e && "month" in e && (a = e, e = a.month, n = a.year), e && n ? (e = t.trim(e), n = t.trim(n), /^\d+$/.test(e) && /^\d+$/.test(n) && parseInt(e, 10) <= 12 ? (2 === n.length && (r = (new Date).getFullYear(), r = r.toString().slice(0, 2), n = r + n), s = new Date(n, e), i = new Date, s.setMonth(s.getMonth() - 1), s.setMonth(s.getMonth() + 1, 1), s > i) : !1) : !1
        }, t.payment.validateCardCVC = function(e, i) {
            var s, r;
            return e = t.trim(e), /^\d+$/.test(e) ? i ? (s = e.length, j.call(null != (r = n(i)) ? r.cvcLength : void 0, s) >= 0) : e.length >= 3 && e.length <= 4 : !1
        }, t.payment.cardType = function(t) {
            var n;
            return t ? (null != (n = e(t)) ? n.type : void 0) || null : null
        }, t.payment.formatCardNumber = function(t) {
            var n, i, s, r;
            return (n = e(t)) ? (s = n.length[n.length.length - 1], t = t.replace(/\D/g, ""), t = t.slice(0, +s + 1 || 9e9), n.format.global ? null != (r = t.match(n.format)) ? r.join(" ") : void 0 : (i = n.format.exec(t), null != i && i.shift(), null != i ? i.join(" ") : void 0)) : t
        }
    }.call(this),
    function() {
        var t, e = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        $.observe(".js-card-select-number-field", function() {
            $(this).payment("formatCardNumber")
        }), $.observe(".js-card-cvv", function() {
            $(this).payment("formatCardCVC")
        }), $.observe(".js-card-select-number-field", function() {
            var t, e, n;
            e = $(this).closest("form"), t = e.find(".js-card"), n = e.find(".js-card-select-type-field"), $(this).on("input", function() {
                var e, i, s, r, a;
                if (s = $(this).val(), i = $.payment.cardType(s))
                    for (r = 0, a = t.length; a > r; r++) e = t[r], $(e).toggleClass("enabled", $(e).attr("data-name") === i), $(e).toggleClass("disabled", $(e).attr("data-name") !== i);
                else t.removeClass("enabled disabled");
                n.val(i)
            })
        }), $(document).on("blur", ".js-card-select-number-field", function() {
            return $(this).val($.payment.formatCardNumber($(this).val()))
        }), $(document).on("click", ".js-card", function() {
            var t, e;
            return t = $(this).closest("form"), e = t.find(".js-card-select-number-field"), e.focus()
        }), $(document).on("click", ".js-enter-new-card", function(t) {
            var e, n;
            return e = $(this).closest(".js-setup-creditcard"), n = e.find(".js-card-select-number-field"), e.removeClass("has-credit-card"), n.attr("required", "required"), n.attr("data-encrypted-name", "billing[credit_card][number]"), t.preventDefault()
        }), $(document).on("click", ".js-cancel-enter-new-card", function(t) {
            var e, n;
            return e = $(this).closest(".js-setup-creditcard"), n = e.find(".js-card-select-number-field"), e.addClass("has-credit-card"), n.removeAttr("required"), n.removeAttr("data-encrypted-name"), t.preventDefault()
        }), t = function(t) {
            var n, i, s, r, a, o;
            return i = t.find("option:selected").text(), r = {
                Austria: "ATU000000000",
                Belgium: "BE0000000000",
                Bulgaria: "BG000000000...",
                Croatia: "",
                Cyprus: "CY000000000X",
                "Czech Republic": "CZ00000000...",
                Denmark: "DK00 00 00 00",
                Estonia: "EE000000000",
                Finland: "FI00000000",
                France: "FRXX 000000000",
                Germany: "DE000000000",
                Greece: "EL000000000",
                Hungary: "HU00000000",
                Iceland: "",
                Ireland: "IE...",
                Italy: "IT00000000000",
                Latvia: "LV00000000000",
                Lithuania: "LT000000000...",
                Luxembourg: "LU00000000",
                Malta: "MT00000000",
                Netherlands: "NL000000000B00",
                Norway: "",
                Poland: "PL0000000000",
                Portugal: "PT000000000",
                Romania: "RO...",
                Slovakia: "SK0000000000",
                Slovenia: "",
                Spain: "ES...",
                Sweden: "SE000000000000",
                Switzerland: "",
                "United Kingdom": "GB..."
            }, s = ["Angola", "Antigua and Barbuda", "Aruba", "Bahamas", "Belize", "Benin", "Botswana", "Cameroon", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Cook Islands", "C\xf4te d'Ivoire", "Djibouti", "Dominica", "Fiji", "French Southern Lands", "Ghana", "Guyana", "Hong Kong", "Ireland", "Kiribati", "Korea, North", "Malawi", "Maritania", "Mauritius", "Montserrat", "Nauru", "Niue", "Qatar", "Saint Kitts and Nevis", "Saint Lucia", "Sao Tome and Principe", "Seychelles", "Sierra Leone", "Sint Maarten (Dutch part)", "Solomon Islands", "Somalia", "Suriname", "Syria", "Togo", "Tokelau", "Tonga", "United Arab Emirates", "Vanuatu", "Yemen", "Zimbabwe"], a = r[i], $(".js-setup-creditcard").toggleClass("is-vat-country", null != a), o = null != a ? "(" + a + ")" : "", n = t.parents(".js-setup-creditcard").find(".js-vat-help-text"), n.html(o), "United States of America" !== i ? ($(".js-setup-creditcard").addClass("is-international"), $(".js-select-state").removeAttr("required").val("")) : ($(".js-setup-creditcard").removeClass("is-international"), $(".js-select-state").attr("required", "required")), e.call(s, i) >= 0 ? ($(".js-postal-code-form").hide(), $(".js-postal-code-field").removeAttr("required").val("")) : ($(".js-postal-code-form").show(), $(".js-postal-code-field").attr("required", "required"))
        }, $(document).on("change", ".js-select-country", function() {
            return t($(this))
        }), $.observe(".js-select-country", function() {
            t($(this))
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-payment-methods .js-payment-method", function() {
            var t, e;
            return t = $(this).closest(".js-payment-methods"), e = $(this).attr("data-selected-tab"), t.find(".js-selected-payment-method").removeClass("active"), t.find("." + e).addClass("active")
        }), $.observe(".js-selected-payment-method:not(.active)", {
            add: function() {
                return $(this).addClass("has-removed-contents")
            },
            remove: function() {
                return $(this).removeClass("has-removed-contents")
            }
        }), $.observe(".js-billing-payment-methods", function() {
            return $(this).removeClass("disabled")
        })
    }.call(this),
    function() {
        var t, e, n = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        t = ["paypal-loading", "paypal-logged-in", "paypal-logged-out", "paypal-down"], e = function(e) {
            var i, s, r, a, o;
            i = $(e), s = i.closest(".js-payment-methods"), i.find("#braintree-paypal-button").length > 0 || (o = function(e) {
                return s.removeClass(t.join(" ")), n.call(t, e) >= 0 ? s.addClass(e) : void 0
            }, s.data("token") || o("paypal-loading"), a = function() {
                return o("paypal-down")
            }, r = function() {
                return Promise.resolve(s.data("token") || $.ajax("/account/billing/client_token"))
            }, r().then(function(t) {
                var e;
                return s.data("token") || s.data("token", t), e = new Promise(function(e) {
                    var n;
                    return n = i.find(i.attr("data-nonce-field")), braintree.setup(t, "paypal", {
                        displayName: "GitHub",
                        container: i,
                        paymentMethodNonceInputField: n,
                        onSuccess: function() {
                            return o("paypal-logged-in"), e()
                        }
                    })
                }), o("paypal-logged-out"), e.then(function() {
                    return i.find("#bt-pp-cancel").on("click", function() {
                        return o("paypal-logged-out")
                    })
                }, a)
            }, a))
        }, $.observe(".js-paypal-container", e)
    }.call(this),
    function() {
        var t;
        $(document).on("selectmenu:selected", ".js-choose-repo-plan", function() {
            var e, n, i, s, r;
            return e = $(this).closest(".js-plan-chooser"), r = $(this).attr("data-name"), n = "free" === r, s = 0 === Number($(this).attr("data-cost")), e.find(".js-price-label-monthly").html($(this).find(".js-price-monthly").clone()), e.find(".js-price-label-yearly").html($(this).find(".js-price-yearly").clone()), e.find(".js-chosen-plan").val(r), e.toggleClass("on-free", n), t(r), i = $(".js-billing-section").hasClass("has-billing"), $(".js-billing-section").toggleClass("has-removed-contents", s || i)
        }), t = function(t) {
            return $(".js-plan-change-message").addClass("is-hidden"), $(".js-plan-change-message").filter(function() {
                return this.getAttribute("data-name") === t
            }).removeClass("is-hidden")
        }, $.observe(".js-plan-chooser", function() {
            return $(".js-choose-repo-plan.selected").trigger("selectmenu:selected")
        })
    }.call(this),
    function() {
        var t, e;
        e = null, t = function() {
            var t, n, i;
            return e && e.abort(), t = Math.max(0, parseInt(this.value) || 0), n = t > 300, $(".js-purchase-button").prop("disabled", 0 === t || n), e = $.ajax({
                url: $(this).attr("data-url"),
                data: {
                    seats: t
                }
            }), i = function(t) {
                var e, i, s;
                $(".js-contact-us").toggleClass("hidden", !n), $(".js-payment-summary").toggleClass("hidden", n), s = t.selectors;
                for (e in s) i = s[e], $(e).text(i);
                return window.history.replaceState($.pjax.state, null, t.url)
            }, e.then(i)
        }, $.observe(".js-seats-field", function() {
            return $(this).on("throttled:input", t), t.call($(".js-seats-field")[0])
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r;
        t = 500, r = null, s = null, i = [], e = new Promise(function(t) {
            return $(window).on("load", function() {
                return t()
            })
        }), GitHub.stats = function(r) {
            return i.push(r), e.then(function() {
                return null != s ? s : s = setTimeout(n, t)
            })
        }, n = function() {
            return null == r && (r = $("meta[name=browser-stats-url]").prop("content")), r ? (s = null, $.ajax({
                url: r,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(i)
            }), i = []) : void 0
        }
    }.call(this),
    function() {
        GitHub.stats({
            browserfeatures: {
                classlist: GitHub.support.classList,
                classlist_multi_arg: GitHub.support.classListMultiArg,
                custom_elements: GitHub.support.registerElement,
                emoji: GitHub.support.emoji,
                promise: GitHub.support.Promise,
                request_animation_frame: GitHub.support.requestAnimationFrame,
                setimmediate: GitHub.support.setImmediate,
                url: GitHub.support.URL,
                weakmap: GitHub.support.WeakMap,
                placeholder_input: GitHub.support.placeholder_input,
                placeholder_textarea: GitHub.support.placeholder_textarea,
                closest: GitHub.support.closest,
                matches: GitHub.support.matches,
                performance_now: GitHub.support.performanceNow,
                performance_mark: GitHub.support.performanceMark,
                performance_getentries: GitHub.support.performanceGetEntries
            }
        })
    }.call(this),
    function() {
        var t, e;
        e = function() {
            var e, n, i, s, r, a;
            (i = function() {
                try {
                    return localStorage.getItem("bundle-urls")
                } catch (t) {}
            }()) && (s = function() {
                try {
                    return JSON.parse(i)
                } catch (t) {}
            }()), null == s && (s = {}), a = t();
            try {
                localStorage.setItem("bundle-urls", JSON.stringify(a))
            } catch (o) {}
            return n = function() {
                var t;
                t = [];
                for (e in a) r = a[e], s[e] !== r && t.push(e);
                return t
            }(), n.length ? GitHub.stats({
                downloadedbundles: n
            }) : void 0
        }, t = function() {
            var t, e, n, i, s, r, a, o, c, l, u;
            for (s = {}, l = $("script"), r = 0, o = l.length; o > r; r++) i = l[r], n = i.src.match(/\/([\w-]+)-[0-9a-f]{64}\.js$/), null != n && (t = n[1], s["" + t + ".js"] = i.src);
            for (u = $("link[rel=stylesheet]"), a = 0, c = u.length; c > a; a++) e = u[a], n = e.href.match(/\/([\w-]+)-[0-9a-f]{64}\.css$/), null != n && (t = n[1], s["" + t + ".css"] = e.href);
            return s
        }, $(window).on("load", e)
    }.call(this),
    function() {
        $(document).on("click:prepare", ".minibutton.disabled, .button.disabled", function(t) {
            t.preventDefault(), t.stopPropagation()
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function(t) {
            return $(t).closest(".js-check-all-container")[0] || document.body
        }, e = function(t, e, n) {
            e.checked !== n && (e.checked = n, $(e).fire("change", {
                relatedTarget: t,
                async: !0
            }))
        }, $(document).on("change", "input.js-check-all", function(n) {
            var i, s, r, a, o;
            if (!$(n.relatedTarget).is("input.js-check-all-item")) {
                for (i = $(t(this)), s = i.find("input.js-check-all-item"), a = 0, o = s.length; o > a; a++) r = s[a], e(this, r, this.checked);
                s.removeClass("is-last-changed")
            }
        }), n = null, $(document).on("mousedown", "input.js-check-all-item", function(t) {
            n = t.shiftKey
        }), $(document).on("change", "input.js-check-all-item", function(i) {
            var s, r, a, o, c, l, u, d, h, f, m, p, g, v;
            if (!$(i.relatedTarget).is("input.js-check-all, input.js-check-all-item")) {
                if (s = $(t(this)), a = s.find("input.js-check-all")[0], r = s.find("input.js-check-all-item"), n && (d = r.filter(".is-last-changed")[0]))
                    for (o = r.toArray(), g = [o.indexOf(d), o.indexOf(this)].sort(), h = g[0], l = g[1], v = o.slice(h, +l + 1 || 9e9), m = 0, p = v.length; p > m; m++) u = v[m], e(this, u, this.checked);
                n = null, r.removeClass("is-last-changed"), $(this).addClass("is-last-changed"), f = r.length, c = function() {
                    var t, e, n;
                    for (n = [], t = 0, e = r.length; e > t; t++) u = r[t], u.checked && n.push(u);
                    return n
                }().length, e(this, a, c === f)
            }
        }), $(document).on("change", "input.js-check-all-item", function() {
            var e, n, i;
            e = $(t(this)), n = e.find(".js-check-all-count"), n.length && (i = e.find("input.js-check-all-item:checked").length, n.text(i))
        })
    }.call(this),
    function() {
        var t;
        null == window.GitHub && (window.GitHub = {}), window.GitHub.assetHostUrl = null != (t = $("link[rel=assets]").prop("href")) ? t : "/"
    }.call(this),
    function() {
        var t, e, n;
        e = function(t) {
            return "INPUT" === t.nodeName || "TEXTAREA" === t.nodeName
        }, ZeroClipboard.config({
            swfPath: "" + GitHub.assetHostUrl + "assets/flash/ZeroClipboard.v" + ZeroClipboard.version + ".swf",
            trustedOrigins: [location.hostname],
            flashLoadTimeout: 1e4,
            cacheBust: null != (n = /MSIE/.test(navigator.userAgent) || /Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/.test(navigator.userAgent)) ? n : {
                "true": !1
            }
        }), $.observe("button.js-zeroclipboard", t = function(t) {
            var n, i, s;
            s = new ZeroClipboard(t), s.on("copy", function(t) {
                var n, i, s, r, a;
                return n = t.target, null == n.getAttribute("data-clipboard-text") && null == n.getAttribute("data-clipboard-target") ? (r = $(n).closest(".js-zeroclipboard-container").find(".js-zeroclipboard-target")[0], r ? (a = e(r) ? r.value : r.textContent, i = t.clipboardData, i.setData("text/plain", a.trim())) : (s = new Error("source of clipboard text not found"), s.failbotContext = {
                    eventType: "copy",
                    eventTarget: n
                }, setImmediate(function() {
                    throw s
                }))) : void 0
            }), s.on("aftercopy", function() {
                var t;
                return t = $(this).attr("data-copied-hint"), $("#global-zeroclipboard-html-bridge").attr("aria-label", t || "Copied!")
            }), s.on("error", function() {
                return $("#global-zeroclipboard-html-bridge, .js-zeroclipboard").remove()
            }), i = function() {
                var t;
                return t = $(this).attr("aria-label"), $("#global-zeroclipboard-html-bridge").addClass("tooltipped tooltipped-s").attr("aria-label", t || "Copy to clipboard.")
            }, n = function() {
                return $("#global-zeroclipboard-html-bridge").removeClass("tooltipped tooltipped-s")
            }, $(t).hover(i, n)
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", ".js-new-comment-form", function(t) {
            return this === t.target && $(this).data("remote-xhr") ? !1 : void 0
        }), $(document).on("ajaxSend", ".js-new-comment-form", function(t) {
            return this === t.target ? $(this).find(".js-comment-form-error").hide() : void 0
        }), $(document).on("ajaxSuccess", ".js-new-comment-form", function(t, e, n, i) {
            var s, r, a, o;
            if (this === t.target) {
                this.reset(), $(this).find(".js-comment-field").trigger("validation:field:change"), $(this).find(".js-write-tab").click(), o = i.updateContent;
                for (a in o) r = o[a], s = $(a), s[0] || console.warn("couldn't find " + a + " for immediate update"), s.updateContent(r)
            }
        }), $(document).on("ajaxError", ".js-new-comment-form", function(t, e) {
            var n, i;
            if (this === t.target) return i = "Sorry! We couldn't save your comment", 422 === e.status && (n = JSON.parse(e.responseText), n.errors && (i += " \u2014 your comment ", i += " " + n.errors.join(", "))), i += ". ", i += "Please try again.", $(this).find(".js-comment-form-error").show().text(i), !1
        })
    }.call(this),
    function() {
        var t, e, n;
        t = new WeakMap, e = function(e) {
            var n, i, s, r;
            for (r = [], i = 0, s = e.length; s > i; i++) n = e[i], r.push(t.get(n) ? void 0 : t.set(n, $(n).text()));
            return r
        }, n = function(e, n) {
            return e.text(function() {
                return n.value.trim() ? this.getAttribute("data-comment-text") : t.get(this)
            })
        }, $(document).onFocusedInput(".js-comment-field", function() {
            var t;
            return t = $(this).closest("form").find(".js-comment-and-button"), t.length ? (e(t), function() {
                n(t, this)
            }) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-comment-edit-button", function() {
            var t;
            return t = $(this).closest(".js-comment"), t.addClass("is-comment-editing"), t.find(".js-comment-field").focus().trigger("change"), !1
        }), $(document).on("click", ".js-comment-cancel-button", function() {
            var t;
            return t = $(this).closest("form"), t.hasDirtyFields() && !confirm($(this).attr("data-confirm-text")) ? !1 : (t[0].reset(), $(this).closest(".js-comment").removeClass("is-comment-editing"), !1)
        }), $(document).on("ajaxSend", ".js-comment-delete, .js-comment-update, .js-issue-update", function(t, e) {
            var n, i;
            return i = $(this).closest(".js-comment"), i.addClass("is-comment-loading"), i.find(".minibutton").addClass("disabled"), (n = i.attr("data-body-version")) ? e.setRequestHeader("X-Body-Version", n) : void 0
        }), $(document).on("ajaxError", ".js-comment-update", function(t, e, n, i) {
            var s, r, a, o;
            if (console.error("ajaxError for js-comment-update", i), 422 === e.status) try {
                if (r = JSON.parse(e.responseText), s = $(this).closest(".js-comment"), r.stale) return e.stale = !0, s.addClass("is-comment-stale"), s.find(".minibutton").addClass("disabled"), t.preventDefault();
                if (r.errors) return a = "There was an error posting your comment: " + r.errors.join(", "), s.find(".js-comment-update-error").text(a).show(), t.preventDefault()
            } catch (o) {
                return o = o, console.error("Error trying to handle ajaxError for js-comment-update: " + o)
            }
        }), $(document).on("ajaxComplete", ".js-comment-delete, .js-comment-update", function(t, e) {
            var n;
            return n = $(this).closest(".js-comment"), n.removeClass("is-comment-loading"), n.find(".minibutton").removeClass("disabled"), e.stale ? n.find(".form-actions button[type=submit].minibutton").addClass("disabled") : void 0
        }), $(document).on("ajaxSuccess", ".js-comment-delete", function() {
            var t, e;
            return t = $(this).closest(".js-comment"), e = $(this).closest(".js-comment-container"), 1 !== e.find(".js-comment").length && (e = t), e.fadeOut(function() {
                return t.remove()
            })
        }), $(document).on("ajaxSuccess", ".js-comment-update", function(t, e, n, i) {
            var s, r, a, o, c, l;
            for (s = $(this).closest(".js-comment"), r = $(this).closest(".js-comment-container"), r.length || (r = s), s.find(".js-comment-body").html(i.body), s.find(".js-comment-update-error").hide(), s.attr("data-body-version", i.newBodyVersion), l = s.find("input, textarea"), o = 0, c = l.length; c > o; o++) a = l[o], a.defaultValue = a.value;
            return s.removeClass("is-comment-editing")
        }), $(document).on("ajaxSuccess", ".js-issue-update", function(t, e, n, i) {
            var s, r, a, o, c, l, u, d;
            for (a = this, s = a.closest(".js-details-container"), s.classList.remove("open"), null != i.issue_title && (s.querySelector(".js-issue-title").textContent = i.issue_title, o = s.closest(".js-issues-results"), c = o.querySelector(".js-merge-pull-request textarea"), c && c.value === c.defaultValue && (c.value = c.defaultValue = i.issue_title)), document.title = i.page_title, d = a.elements, l = 0, u = d.length; u > l; l++) r = d[l], r.defaultValue = r.value
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-write-bucket", function() {
            return $(this).addClass("focused")
        }), $(document).on("focusout", ".js-write-bucket", function() {
            return $(this).removeClass("focused")
        })
    }.call(this),
    function() {
        $(document).onFocusedKeydown(".js-comment-field", function() {
            return function(t) {
                return "ctrl+L" === t.hotkey || "meta+L" === t.hotkey ? (window.location = "#fullscreen_" + this.id, !1) : void 0
            }
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("click", ".js-write-tab", function() {
            var t;
            return t = $(this).closest(".js-previewable-comment-form"), t.addClass("write-selected").removeClass("preview-selected"), t.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), !1
        }), $(document).on("click", ".js-preview-tab", function() {
            var n;
            return n = $(this).closest(".js-previewable-comment-form"), n.addClass("preview-selected").removeClass("write-selected"), n.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), t(n), e(n), !1
        }), e = function(t) {
            var e;
            return e = t.find(".comment-body"), e.html("<p>Loading preview&hellip;</p>"), $.ajax({
                context: t[0],
                type: "POST",
                url: t.attr("data-preview-url"),
                data: {
                    text: t.find(".js-comment-field").val()
                },
                success: function(t) {
                    return e.html(t || "<p>Nothing to preview</p>")
                }
            })
        }, $(document).onFocusedKeydown(".js-comment-field", function() {
            return function(t) {
                var e;
                return "ctrl+P" !== t.hotkey && "meta+P" !== t.hotkey || (e = $(this).closest(".js-previewable-comment-form"), !e.hasClass("write-selected")) ? void 0 : ($(this).blur(), e.find(".preview-tab").click(), t.stopImmediatePropagation(), !1)
            }
        }), t = function(t) {
            return $(document).off("keydown.unpreview"), $(document).on("keydown.unpreview", function(e) {
                return "ctrl+P" === e.hotkey || "meta+P" === e.hotkey ? (t.find(".js-write-tab").click(), t.find(".js-comment-field").focus(), $(document).off("keydown.unpreview"), !1) : void 0
            })
        }
    }.call(this),
    function() {
        $(document).on("pjax:send", ".context-loader-container", function() {
            var t;
            return t = $(this).find(".context-loader").first(), t.length ? t.addClass("is-context-loading") : $(".page-context-loader").addClass("is-context-loading")
        }), $(document).on("pjax:complete", ".context-loader-container", function(t) {
            return $(t.target).find(".context-loader").first().removeClass("is-context-loading"), $(".page-context-loader").removeClass("is-context-loading"), $(document.body).removeClass("disables-context-loader")
        }), $(document).on("pjax:timeout", ".context-loader-container", function() {
            return !1
        })
    }.call(this),
    function() {
        $.hashChange(function(t) {
            var e;
            return e = window.location.hash.slice(1), e && /\/(issues|pulls?)\/\d+/.test(t.newURL) ? GitHub.stats({
                conversation_anchor: {
                    anchor: e,
                    matches_element: t.target !== window
                }
            }) : void 0
        })
    }.call(this),
    /**
     * jquery.Jcrop.js v0.9.12
     * jQuery Image Cropping Plugin - released under MIT License
     * Author: Kelly Hallman <khallman@gmail.com>
     * http://github.com/tapmodo/Jcrop
     * Copyright (c) 2008-2013 Tapmodo Interactive LLC {{{
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     *
     * }}}
     */
    function(t) {
        t.Jcrop = function(e, n) {
            function i(t) {
                return Math.round(t) + "px"
            }

            function s(t) {
                return M.baseClass + "-" + t
            }

            function r() {
                return t.fx.step.hasOwnProperty("backgroundColor")
            }

            function a(e) {
                var n = t(e).offset();
                return [n.left, n.top]
            }

            function o(t) {
                return [t.pageX - E[0], t.pageY - E[1]]
            }

            function c(e) {
                "object" != typeof e && (e = {}), M = t.extend(M, e), t.each(["onChange", "onSelect", "onRelease", "onDblClick"], function(t, e) {
                    "function" != typeof M[e] && (M[e] = function() {})
                })
            }

            function l(t, e, n) {
                if (E = a(z), me.setCursor("move" === t ? t : t + "-resize"), "move" === t) return me.activateHandlers(d(e), g, n);
                var i = de.getFixed(),
                    s = h(t),
                    r = de.getCorner(h(s));
                de.setPressed(de.getCorner(s)), de.setCurrent(r), me.activateHandlers(u(t, i), g, n)
            }

            function u(t, e) {
                return function(n) {
                    if (M.aspectRatio) switch (t) {
                        case "e":
                            n[1] = e.y + 1;
                            break;
                        case "w":
                            n[1] = e.y + 1;
                            break;
                        case "n":
                            n[0] = e.x + 1;
                            break;
                        case "s":
                            n[0] = e.x + 1
                    } else switch (t) {
                        case "e":
                            n[1] = e.y2;
                            break;
                        case "w":
                            n[1] = e.y2;
                            break;
                        case "n":
                            n[0] = e.x2;
                            break;
                        case "s":
                            n[0] = e.x2
                    }
                    de.setCurrent(n), fe.update()
                }
            }

            function d(t) {
                var e = t;
                return pe.watchKeys(),
                    function(t) {
                        de.moveOffset([t[0] - e[0], t[1] - e[1]]), e = t, fe.update()
                    }
            }

            function h(t) {
                switch (t) {
                    case "n":
                        return "sw";
                    case "s":
                        return "nw";
                    case "e":
                        return "nw";
                    case "w":
                        return "ne";
                    case "ne":
                        return "sw";
                    case "nw":
                        return "se";
                    case "se":
                        return "nw";
                    case "sw":
                        return "ne"
                }
            }

            function f(t) {
                return function(e) {
                    return M.disabled ? !1 : "move" !== t || M.allowMove ? (E = a(z), ie = !0, l(t, o(e)), e.stopPropagation(), e.preventDefault(), !1) : !1
                }
            }

            function m(t, e, n) {
                var i = t.width(),
                    s = t.height();
                i > e && e > 0 && (i = e, s = e / t.width() * t.height()), s > n && n > 0 && (s = n, i = n / t.height() * t.width()), ee = t.width() / i, ne = t.height() / s, t.width(i).height(s)
            }

            function p(t) {
                return {
                    x: t.x * ee,
                    y: t.y * ne,
                    x2: t.x2 * ee,
                    y2: t.y2 * ne,
                    w: t.w * ee,
                    h: t.h * ne
                }
            }

            function g() {
                var t = de.getFixed();
                t.w > M.minSelect[0] && t.h > M.minSelect[1] ? (fe.enableHandles(), fe.done()) : fe.release(), me.setCursor(M.allowSelect ? "crosshair" : "default")
            }

            function v(t) {
                if (M.disabled) return !1;
                if (!M.allowSelect) return !1;
                ie = !0, E = a(z), fe.disableHandles(), me.setCursor("crosshair");
                var e = o(t);
                return de.setPressed(e), fe.update(), me.activateHandlers($, g, "touch" === t.type.substring(0, 5)), pe.watchKeys(), t.stopPropagation(), t.preventDefault(), !1
            }

            function $(t) {
                de.setCurrent(t), fe.update()
            }

            function b() {
                var e = t("<div></div>").addClass(s("tracker"));
                return O && e.css({
                    opacity: 0,
                    backgroundColor: "white"
                }), e
            }

            function j(t) {
                Y.removeClass().addClass(s("holder")).addClass(t)
            }

            function y(t, e) {
                function n() {
                    window.setTimeout($, d)
                }
                var i = t[0] / ee,
                    s = t[1] / ne,
                    r = t[2] / ee,
                    a = t[3] / ne;
                if (!se) {
                    var o = de.flipCoords(i, s, r, a),
                        c = de.getFixed(),
                        l = [c.x, c.y, c.x2, c.y2],
                        u = l,
                        d = M.animationDelay,
                        h = o[0] - l[0],
                        f = o[1] - l[1],
                        m = o[2] - l[2],
                        p = o[3] - l[3],
                        g = 0,
                        v = M.swingSpeed;
                    i = u[0], s = u[1], r = u[2], a = u[3], fe.animMode(!0);
                    var $ = function() {
                        return function() {
                            g += (100 - g) / v, u[0] = Math.round(i + g / 100 * h), u[1] = Math.round(s + g / 100 * f), u[2] = Math.round(r + g / 100 * m), u[3] = Math.round(a + g / 100 * p), g >= 99.8 && (g = 100), 100 > g ? (x(u), n()) : (fe.done(), fe.animMode(!1), "function" == typeof e && e.call(ge))
                        }
                    }();
                    n()
                }
            }

            function w(t) {
                x([t[0] / ee, t[1] / ne, t[2] / ee, t[3] / ne]), M.onSelect.call(ge, p(de.getFixed())), fe.enableHandles()
            }

            function x(t) {
                de.setPressed([t[0], t[1]]), de.setCurrent([t[2], t[3]]), fe.update()
            }

            function k() {
                return p(de.getFixed())
            }

            function C() {
                return de.getFixed()
            }

            function S(t) {
                c(t), P()
            }

            function T() {
                M.disabled = !0, fe.disableHandles(), fe.setCursor("default"), me.setCursor("default")
            }

            function L() {
                M.disabled = !1, P()
            }

            function A() {
                fe.done(), me.activateHandlers(null, null)
            }

            function D() {
                Y.remove(), F.show(), F.css("visibility", "visible"), t(e).removeData("Jcrop")
            }

            function _(t, e) {
                fe.release(), T();
                var n = new Image;
                n.onload = function() {
                    var i = n.width,
                        s = n.height,
                        r = M.boxWidth,
                        a = M.boxHeight;
                    z.width(i).height(s), z.attr("src", t), G.attr("src", t), m(z, r, a), U = z.width(), W = z.height(), G.width(U).height(W), oe.width(U + 2 * ae).height(W + 2 * ae), Y.width(U).height(W), he.resize(U, W), L(), "function" == typeof e && e.call(ge)
                }, n.src = t
            }

            function H(t, e, n) {
                var i = e || M.bgColor;
                M.bgFade && r() && M.fadeTime && !n ? t.animate({
                    backgroundColor: i
                }, {
                    queue: !1,
                    duration: M.fadeTime
                }) : t.css("backgroundColor", i)
            }

            function P(t) {
                M.allowResize ? t ? fe.enableOnly() : fe.enableHandles() : fe.disableHandles(), me.setCursor(M.allowSelect ? "crosshair" : "default"), fe.setCursor(M.allowMove ? "move" : "default"), M.hasOwnProperty("trueSize") && (ee = M.trueSize[0] / U, ne = M.trueSize[1] / W), M.hasOwnProperty("setSelect") && (w(M.setSelect), fe.done(), delete M.setSelect), he.refresh(), M.bgColor != ce && (H(M.shade ? he.getShades() : Y, M.shade ? M.shadeColor || M.bgColor : M.bgColor), ce = M.bgColor), le != M.bgOpacity && (le = M.bgOpacity, M.shade ? he.refresh() : fe.setBgOpacity(le)), K = M.maxSize[0] || 0, Q = M.maxSize[1] || 0, Z = M.minSize[0] || 0, te = M.minSize[1] || 0, M.hasOwnProperty("outerImage") && (z.attr("src", M.outerImage), delete M.outerImage), fe.refresh()
            }
            var E, M = t.extend({}, t.Jcrop.defaults),
                I = navigator.userAgent.toLowerCase(),
                O = /msie/.test(I),
                R = /msie [1-6]\./.test(I);
            "object" != typeof e && (e = t(e)[0]), "object" != typeof n && (n = {}), c(n);
            var B = {
                    border: "none",
                    visibility: "visible",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    top: 0,
                    left: 0
                },
                F = t(e),
                N = !0;
            if ("IMG" == e.tagName) {
                if (0 != F[0].width && 0 != F[0].height) F.width(F[0].width), F.height(F[0].height);
                else {
                    var q = new Image;
                    q.src = F[0].src, F.width(q.width), F.height(q.height)
                }
                var z = F.clone().removeAttr("id").css(B).show();
                z.width(F.width()), z.height(F.height()), F.after(z).hide()
            } else z = F.css(B).show(), N = !1, null === M.shade && (M.shade = !0);
            m(z, M.boxWidth, M.boxHeight);
            var U = z.width(),
                W = z.height(),
                Y = t("<div />").width(U).height(W).addClass(s("holder")).css({
                    position: "relative",
                    backgroundColor: M.bgColor
                }).insertAfter(F).append(z);
            M.addClass && Y.addClass(M.addClass);
            var G = t("<div />"),
                V = t("<div />").width("100%").height("100%").css({
                    zIndex: 310,
                    position: "absolute",
                    overflow: "hidden"
                }),
                X = t("<div />").width("100%").height("100%").css("zIndex", 320),
                J = t("<div />").css({
                    position: "absolute",
                    zIndex: 600
                }).dblclick(function() {
                    var t = de.getFixed();
                    M.onDblClick.call(ge, t)
                }).insertBefore(z).append(V, X);
            N && (G = t("<img />").attr("src", z.attr("src")).css(B).width(U).height(W), V.append(G)), R && J.css({
                overflowY: "hidden"
            });
            var K, Q, Z, te, ee, ne, ie, se, re, ae = M.boundary,
                oe = b().width(U + 2 * ae).height(W + 2 * ae).css({
                    position: "absolute",
                    top: i(-ae),
                    left: i(-ae),
                    zIndex: 290
                }).mousedown(v),
                ce = M.bgColor,
                le = M.bgOpacity;
            E = a(z);
            var ue = function() {
                    function t() {
                        var t, e = {},
                            n = ["touchstart", "touchmove", "touchend"],
                            i = document.createElement("div");
                        try {
                            for (t = 0; t < n.length; t++) {
                                var s = n[t];
                                s = "on" + s;
                                var r = s in i;
                                r || (i.setAttribute(s, "return;"), r = "function" == typeof i[s]), e[n[t]] = r
                            }
                            return e.touchstart && e.touchend && e.touchmove
                        } catch (a) {
                            return !1
                        }
                    }

                    function e() {
                        return M.touchSupport === !0 || M.touchSupport === !1 ? M.touchSupport : t()
                    }
                    return {
                        createDragger: function(t) {
                            return function(e) {
                                return M.disabled ? !1 : "move" !== t || M.allowMove ? (E = a(z), ie = !0, l(t, o(ue.cfilter(e)), !0), e.stopPropagation(), e.preventDefault(), !1) : !1
                            }
                        },
                        newSelection: function(t) {
                            return v(ue.cfilter(t))
                        },
                        cfilter: function(t) {
                            return t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t
                        },
                        isSupported: t,
                        support: e()
                    }
                }(),
                de = function() {
                    function t(t) {
                        t = a(t), m = h = t[0], p = f = t[1]
                    }

                    function e(t) {
                        t = a(t), u = t[0] - m, d = t[1] - p, m = t[0], p = t[1]
                    }

                    function n() {
                        return [u, d]
                    }

                    function i(t) {
                        var e = t[0],
                            n = t[1];
                        0 > h + e && (e -= e + h), 0 > f + n && (n -= n + f), p + n > W && (n += W - (p + n)), m + e > U && (e += U - (m + e)), h += e, m += e, f += n, p += n
                    }

                    function s(t) {
                        var e = r();
                        switch (t) {
                            case "ne":
                                return [e.x2, e.y];
                            case "nw":
                                return [e.x, e.y];
                            case "se":
                                return [e.x2, e.y2];
                            case "sw":
                                return [e.x, e.y2]
                        }
                    }

                    function r() {
                        if (!M.aspectRatio) return c();
                        var t, e, n, i, s = M.aspectRatio,
                            r = M.minSize[0] / ee,
                            a = M.maxSize[0] / ee,
                            u = M.maxSize[1] / ne,
                            d = m - h,
                            g = p - f,
                            v = Math.abs(d),
                            $ = Math.abs(g),
                            b = v / $;
                        return 0 === a && (a = 10 * U), 0 === u && (u = 10 * W), s > b ? (e = p, n = $ * s, t = 0 > d ? h - n : n + h, 0 > t ? (t = 0, i = Math.abs((t - h) / s), e = 0 > g ? f - i : i + f) : t > U && (t = U, i = Math.abs((t - h) / s), e = 0 > g ? f - i : i + f)) : (t = m, i = v / s, e = 0 > g ? f - i : f + i, 0 > e ? (e = 0, n = Math.abs((e - f) * s), t = 0 > d ? h - n : n + h) : e > W && (e = W, n = Math.abs(e - f) * s, t = 0 > d ? h - n : n + h)), t > h ? (r > t - h ? t = h + r : t - h > a && (t = h + a), e = e > f ? f + (t - h) / s : f - (t - h) / s) : h > t && (r > h - t ? t = h - r : h - t > a && (t = h - a), e = e > f ? f + (h - t) / s : f - (h - t) / s), 0 > t ? (h -= t, t = 0) : t > U && (h -= t - U, t = U), 0 > e ? (f -= e, e = 0) : e > W && (f -= e - W, e = W), l(o(h, f, t, e))
                    }

                    function a(t) {
                        return t[0] < 0 && (t[0] = 0), t[1] < 0 && (t[1] = 0), t[0] > U && (t[0] = U), t[1] > W && (t[1] = W), [Math.round(t[0]), Math.round(t[1])]
                    }

                    function o(t, e, n, i) {
                        var s = t,
                            r = n,
                            a = e,
                            o = i;
                        return t > n && (s = n, r = t), e > i && (a = i, o = e), [s, a, r, o]
                    }

                    function c() {
                        var t, e = m - h,
                            n = p - f;
                        return K && Math.abs(e) > K && (m = e > 0 ? h + K : h - K), Q && Math.abs(n) > Q && (p = n > 0 ? f + Q : f - Q), te / ne && Math.abs(n) < te / ne && (p = n > 0 ? f + te / ne : f - te / ne), Z / ee && Math.abs(e) < Z / ee && (m = e > 0 ? h + Z / ee : h - Z / ee), 0 > h && (m -= h, h -= h), 0 > f && (p -= f, f -= f), 0 > m && (h -= m, m -= m), 0 > p && (f -= p, p -= p), m > U && (t = m - U, h -= t, m -= t), p > W && (t = p - W, f -= t, p -= t), h > U && (t = h - W, p -= t, f -= t), f > W && (t = f - W, p -= t, f -= t), l(o(h, f, m, p))
                    }

                    function l(t) {
                        return {
                            x: t[0],
                            y: t[1],
                            x2: t[2],
                            y2: t[3],
                            w: t[2] - t[0],
                            h: t[3] - t[1]
                        }
                    }
                    var u, d, h = 0,
                        f = 0,
                        m = 0,
                        p = 0;
                    return {
                        flipCoords: o,
                        setPressed: t,
                        setCurrent: e,
                        getOffset: n,
                        moveOffset: i,
                        getCorner: s,
                        getFixed: r
                    }
                }(),
                he = function() {
                    function e(t, e) {
                        m.left.css({
                            height: i(e)
                        }), m.right.css({
                            height: i(e)
                        })
                    }

                    function n() {
                        return s(de.getFixed())
                    }

                    function s(t) {
                        m.top.css({
                            left: i(t.x),
                            width: i(t.w),
                            height: i(t.y)
                        }), m.bottom.css({
                            top: i(t.y2),
                            left: i(t.x),
                            width: i(t.w),
                            height: i(W - t.y2)
                        }), m.right.css({
                            left: i(t.x2),
                            width: i(U - t.x2)
                        }), m.left.css({
                            width: i(t.x)
                        })
                    }

                    function r() {
                        return t("<div />").css({
                            position: "absolute",
                            backgroundColor: M.shadeColor || M.bgColor
                        }).appendTo(f)
                    }

                    function a() {
                        h || (h = !0, f.insertBefore(z), n(), fe.setBgOpacity(1, 0, 1), G.hide(), o(M.shadeColor || M.bgColor, 1), fe.isAwake() ? l(M.bgOpacity, 1) : l(1, 1))
                    }

                    function o(t, e) {
                        H(d(), t, e)
                    }

                    function c() {
                        h && (f.remove(), G.show(), h = !1, fe.isAwake() ? fe.setBgOpacity(M.bgOpacity, 1, 1) : (fe.setBgOpacity(1, 1, 1), fe.disableHandles()), H(Y, 0, 1))
                    }

                    function l(t, e) {
                        h && (M.bgFade && !e ? f.animate({
                            opacity: 1 - t
                        }, {
                            queue: !1,
                            duration: M.fadeTime
                        }) : f.css({
                            opacity: 1 - t
                        }))
                    }

                    function u() {
                        M.shade ? a() : c(), fe.isAwake() && l(M.bgOpacity)
                    }

                    function d() {
                        return f.children()
                    }
                    var h = !1,
                        f = t("<div />").css({
                            position: "absolute",
                            zIndex: 240,
                            opacity: 0
                        }),
                        m = {
                            top: r(),
                            left: r().height(W),
                            right: r().height(W),
                            bottom: r()
                        };
                    return {
                        update: n,
                        updateRaw: s,
                        getShades: d,
                        setBgColor: o,
                        enable: a,
                        disable: c,
                        resize: e,
                        refresh: u,
                        opacity: l
                    }
                }(),
                fe = function() {
                    function e(e) {
                        var n = t("<div />").css({
                            position: "absolute",
                            opacity: M.borderOpacity
                        }).addClass(s(e));
                        return V.append(n), n
                    }

                    function n(e, n) {
                        var i = t("<div />").mousedown(f(e)).css({
                            cursor: e + "-resize",
                            position: "absolute",
                            zIndex: n
                        }).addClass("ord-" + e);
                        return ue.support && i.bind("touchstart.jcrop", ue.createDragger(e)), X.append(i), i
                    }

                    function r(t) {
                        var e = M.handleSize,
                            i = n(t, T++).css({
                                opacity: M.handleOpacity
                            }).addClass(s("handle"));
                        return e && i.width(e).height(e), i
                    }

                    function a(t) {
                        return n(t, T++).addClass("jcrop-dragbar")
                    }

                    function o(t) {
                        var e;
                        for (e = 0; e < t.length; e++) D[t[e]] = a(t[e])
                    }

                    function c(t) {
                        var n, i;
                        for (i = 0; i < t.length; i++) {
                            switch (t[i]) {
                                case "n":
                                    n = "hline";
                                    break;
                                case "s":
                                    n = "hline bottom";
                                    break;
                                case "e":
                                    n = "vline right";
                                    break;
                                case "w":
                                    n = "vline"
                            }
                            L[t[i]] = e(n)
                        }
                    }

                    function l(t) {
                        var e;
                        for (e = 0; e < t.length; e++) A[t[e]] = r(t[e])
                    }

                    function u(t, e) {
                        M.shade || G.css({
                            top: i(-e),
                            left: i(-t)
                        }), J.css({
                            top: i(e),
                            left: i(t)
                        })
                    }

                    function d(t, e) {
                        J.width(Math.round(t)).height(Math.round(e))
                    }

                    function h() {
                        var t = de.getFixed();
                        de.setPressed([t.x, t.y]), de.setCurrent([t.x2, t.y2]), m()
                    }

                    function m(t) {
                        return S ? g(t) : void 0
                    }

                    function g(t) {
                        var e = de.getFixed();
                        d(e.w, e.h), u(e.x, e.y), M.shade && he.updateRaw(e), S || $(), t ? M.onSelect.call(ge, p(e)) : M.onChange.call(ge, p(e))
                    }

                    function v(t, e, n) {
                        (S || e) && (M.bgFade && !n ? z.animate({
                            opacity: t
                        }, {
                            queue: !1,
                            duration: M.fadeTime
                        }) : z.css("opacity", t))
                    }

                    function $() {
                        J.show(), M.shade ? he.opacity(le) : v(le, !0), S = !0
                    }

                    function j() {
                        x(), J.hide(), M.shade ? he.opacity(1) : v(1), S = !1, M.onRelease.call(ge)
                    }

                    function y() {
                        _ && X.show()
                    }

                    function w() {
                        return _ = !0, M.allowResize ? (X.show(), !0) : void 0
                    }

                    function x() {
                        _ = !1, X.hide()
                    }

                    function k(t) {
                        t ? (se = !0, x()) : (se = !1, w())
                    }

                    function C() {
                        k(!1), h()
                    }
                    var S, T = 370,
                        L = {},
                        A = {},
                        D = {},
                        _ = !1;
                    M.dragEdges && t.isArray(M.createDragbars) && o(M.createDragbars), t.isArray(M.createHandles) && l(M.createHandles), M.drawBorders && t.isArray(M.createBorders) && c(M.createBorders), t(document).bind("touchstart.jcrop-ios", function(e) {
                        t(e.currentTarget).hasClass("jcrop-tracker") && e.stopPropagation()
                    });
                    var H = b().mousedown(f("move")).css({
                        cursor: "move",
                        position: "absolute",
                        zIndex: 360
                    });
                    return ue.support && H.bind("touchstart.jcrop", ue.createDragger("move")), V.append(H), x(), {
                        updateVisible: m,
                        update: g,
                        release: j,
                        refresh: h,
                        isAwake: function() {
                            return S
                        },
                        setCursor: function(t) {
                            H.css("cursor", t)
                        },
                        enableHandles: w,
                        enableOnly: function() {
                            _ = !0
                        },
                        showHandles: y,
                        disableHandles: x,
                        animMode: k,
                        setBgOpacity: v,
                        done: C
                    }
                }(),
                me = function() {
                    function e(e) {
                        oe.css({
                            zIndex: 450
                        }), e ? t(document).bind("touchmove.jcrop", a).bind("touchend.jcrop", c) : h && t(document).bind("mousemove.jcrop", i).bind("mouseup.jcrop", s)
                    }

                    function n() {
                        oe.css({
                            zIndex: 290
                        }), t(document).unbind(".jcrop")
                    }

                    function i(t) {
                        return u(o(t)), !1
                    }

                    function s(t) {
                        return t.preventDefault(), t.stopPropagation(), ie && (ie = !1, d(o(t)), fe.isAwake() && M.onSelect.call(ge, p(de.getFixed())), n(), u = function() {}, d = function() {}), !1
                    }

                    function r(t, n, i) {
                        return ie = !0, u = t, d = n, e(i), !1
                    }

                    function a(t) {
                        return u(o(ue.cfilter(t))), !1
                    }

                    function c(t) {
                        return s(ue.cfilter(t))
                    }

                    function l(t) {
                        oe.css("cursor", t)
                    }
                    var u = function() {},
                        d = function() {},
                        h = M.trackDocument;
                    return h || oe.mousemove(i).mouseup(s).mouseout(s), z.before(oe), {
                        activateHandlers: r,
                        setCursor: l
                    }
                }(),
                pe = function() {
                    function e() {
                        M.keySupport && (r.show(), r.focus())
                    }

                    function n() {
                        r.hide()
                    }

                    function i(t, e, n) {
                        M.allowMove && (de.moveOffset([e, n]), fe.updateVisible(!0)), t.preventDefault(), t.stopPropagation()
                    }

                    function s(t) {
                        if (t.ctrlKey || t.metaKey) return !0;
                        re = t.shiftKey ? !0 : !1;
                        var e = re ? 10 : 1;
                        switch (t.keyCode) {
                            case 37:
                                i(t, -e, 0);
                                break;
                            case 39:
                                i(t, e, 0);
                                break;
                            case 38:
                                i(t, 0, -e);
                                break;
                            case 40:
                                i(t, 0, e);
                                break;
                            case 27:
                                M.allowSelect && fe.release();
                                break;
                            case 9:
                                return !0
                        }
                        return !1
                    }
                    var r = t('<input type="radio" />').css({
                            position: "fixed",
                            left: "-120px",
                            width: "12px"
                        }).addClass("jcrop-keymgr"),
                        a = t("<div />").css({
                            position: "absolute",
                            overflow: "hidden"
                        }).append(r);
                    return M.keySupport && (r.keydown(s).blur(n), R || !M.fixedSupport ? (r.css({
                        position: "absolute",
                        left: "-20px"
                    }), a.append(r).insertBefore(z)) : r.insertBefore(z)), {
                        watchKeys: e
                    }
                }();
            ue.support && oe.bind("touchstart.jcrop", ue.newSelection), X.hide(), P(!0);
            var ge = {
                setImage: _,
                animateTo: y,
                setSelect: w,
                setOptions: S,
                tellSelect: k,
                tellScaled: C,
                setClass: j,
                disable: T,
                enable: L,
                cancel: A,
                release: fe.release,
                destroy: D,
                focus: pe.watchKeys,
                getBounds: function() {
                    return [U * ee, W * ne]
                },
                getWidgetSize: function() {
                    return [U, W]
                },
                getScaleFactor: function() {
                    return [ee, ne]
                },
                getOptions: function() {
                    return M
                },
                ui: {
                    holder: Y,
                    selection: J
                }
            };
            return O && Y.bind("selectstart", function() {
                return !1
            }), F.data("Jcrop", ge), ge
        }, t.fn.Jcrop = function(e, n) {
            var i;
            return this.each(function() {
                if (t(this).data("Jcrop")) {
                    if ("api" === e) return t(this).data("Jcrop");
                    t(this).data("Jcrop").setOptions(e)
                } else "IMG" == this.tagName ? t.Jcrop.Loader(this, function() {
                    t(this).css({
                        display: "block",
                        visibility: "hidden"
                    }), i = t.Jcrop(this, e), t.isFunction(n) && n.call(i)
                }) : (t(this).css({
                    display: "block",
                    visibility: "hidden"
                }), i = t.Jcrop(this, e), t.isFunction(n) && n.call(i))
            }), this
        }, t.Jcrop.Loader = function(e, n, i) {
            function s() {
                a.complete ? (r.unbind(".jcloader"), t.isFunction(n) && n.call(a)) : window.setTimeout(s, 50)
            }
            var r = t(e),
                a = r[0];
            r.bind("load.jcloader", s).bind("error.jcloader", function() {
                r.unbind(".jcloader"), t.isFunction(i) && i.call(a)
            }), a.complete && t.isFunction(n) && (r.unbind(".jcloader"), n.call(a))
        }, t.Jcrop.defaults = {
            allowSelect: !0,
            allowMove: !0,
            allowResize: !0,
            trackDocument: !0,
            baseClass: "jcrop",
            addClass: null,
            bgColor: "black",
            bgOpacity: .6,
            bgFade: !1,
            borderOpacity: .4,
            handleOpacity: .5,
            handleSize: null,
            aspectRatio: 0,
            keySupport: !0,
            createHandles: ["n", "s", "e", "w", "nw", "ne", "se", "sw"],
            createDragbars: ["n", "s", "e", "w"],
            createBorders: ["n", "s", "e", "w"],
            drawBorders: !0,
            dragEdges: !0,
            fixedSupport: !0,
            touchSupport: null,
            shade: null,
            boxWidth: 0,
            boxHeight: 0,
            boundary: 2,
            fadeTime: 400,
            animationDelay: 20,
            swingSpeed: 3,
            minSelect: [0, 0],
            maxSize: [0, 0],
            minSize: [0, 0],
            onChange: function() {},
            onSelect: function() {},
            onDblClick: function() {},
            onRelease: function() {}
        }
    }(jQuery),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t(t) {
                this.clearCropFormValues = e(this.clearCropFormValues, this), this.setCropFormValues = e(this.setCropFormValues, this), this.setCurrentSelection = e(this.setCurrentSelection, this), this.setTrueSize = e(this.setTrueSize, this);
                var n, i, s;
                this.container = $(t), this.spinner = this.container.find(".profile-picture-spinner"), this.img = this.container.find(".js-croppable-avatar"), this.croppedX = this.container.find(".js-crop-cropped_x"), this.croppedY = this.container.find(".js-crop-cropped_y"), this.croppedW = this.container.find(".js-crop-cropped_width"), this.croppedH = this.container.find(".js-crop-cropped_height"), n = this.img.parent("div").width(), s = {
                    aspectRatio: 1,
                    onSelect: this.setCropFormValues,
                    onRelease: this.clearCropFormValues,
                    bgColor: "",
                    maxSize: [3e3, 3e3],
                    boxWidth: n,
                    boxHeight: n
                }, this.setTrueSize(s), this.setCurrentSelection(s), i = this, this.img.Jcrop(s, function() {
                    return i.spinner.addClass("hidden"), i.jcrop = this
                })
            }
            return t.prototype.setTrueSize = function(t) {
                var e, n;
                return n = parseInt(this.img.data("true-width")), e = parseInt(this.img.data("true-height")), 0 !== n && 0 !== e ? t.trueSize = [n, e] : void 0
            }, t.prototype.setCurrentSelection = function(t) {
                var e, n, i, s;
                return n = parseInt(this.croppedW.val()), e = parseInt(this.croppedH.val()), 0 !== n && 0 !== e ? (i = parseInt(this.croppedX.val()), s = parseInt(this.croppedY.val()), t.setSelect = [i, s, i + n, s + e]) : void 0
            }, t.prototype.setCropFormValues = function(t) {
                return this.croppedX.val(t.x), this.croppedY.val(t.y), this.croppedW.val(t.w), this.croppedH.val(t.h)
            }, t.prototype.clearCropFormValues = function() {
                return this.croppedX.val("0"), this.croppedY.val("0"), this.croppedW.val("0"), this.croppedH.val("0")
            }, t
        }(), $.observe(".js-croppable-container", {
            add: function(e) {
                return new t(e)
            }
        }), $(document).on("afterClose.facebox", function() {
            return $(".js-avatar-field").val("")
        })
    }.call(this),
    function() {
        window.d3Ready = function() {
            return "undefined" != typeof d3 && null !== d3 ? Promise.resolve() : new Promise(function(t) {
                return document.addEventListener("graph-lib:loaded", function() {
                    return t()
                })
            })
        }
    }.call(this),
    function() {
        $.observe(".js-ds", function() {
            var t, e;
            (e = this.getAttribute("data-url")) && (t = new XMLHttpRequest, t.open("GET", e, !0), t.setRequestHeader("X-Requested-With", "XMLHttpRequest"), t.send())
        })
    }.call(this),
    function() {
        $(document).on("details:toggled", function(t) {
            var e, n, i;
            n = t.target, i = t.relatedTarget, e = $(n).find("input[autofocus], textarea[autofocus]").last()[0], e && document.activeElement !== e && e.focus(), i.classList.contains("tooltipped") && (i.classList.remove("tooltipped"), $(i).one("mouseleave", function() {
                return i.classList.add("tooltipped")
            })), i.blur()
        }), $.hashChange(function(t) {
            return $(t.target).parents(".js-details-container").addClass("open")
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("reveal.facebox", function() {
            var t, n;
            t = $("#facebox"), n = t.find("input[autofocus], textarea[autofocus]").last()[0], n && document.activeElement !== n && n.focus(), $(document).on("keydown", e)
        }), $(document).on("afterClose.facebox", function() {
            return $(document).off("keydown", e), $("#facebox :focus").blur()
        }), e = function(t) {
            var e, n, i, s, r, a;
            ("tab" === (a = t.hotkey) || "shift+tab" === a) && (t.preventDefault(), n = $("#facebox"), e = n.find("input, .button, textarea").visible(), s = "shift+tab" === t.hotkey ? -1 : 1, i = e.index(e.filter(":focus")), r = i + s, r === e.length || -1 === i && "tab" === t.hotkey ? e.first().focus() : -1 === i ? e.last().focus() : e.get(r).focus())
        }, $.observe("a[rel*=facebox]", t = function() {
            $(this).facebox()
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-flash-close", function() {
            var t;
            return t = $(this).closest(".flash-messages"), $(this).closest(".flash").fadeOut(300, function() {
                return $(this).remove(), 0 === t.find(".flash").length ? t.remove() : void 0
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s;
        n = function(t) {
            return $(t).closest(".js-suggester-container").find(".js-suggester")[0]
        }, e = function(t) {
            var e, s, r, a, o, c, l, u, d, h, f;
            if (s = document.getElementById(t)) {
                c = document.getElementById("fullscreen_overlay"), l = c.querySelector(".js-fullscreen-contents"), d = "gh-fullscreen-theme", "dark" === function() {
                    try {
                        return localStorage.getItem(d)
                    } catch (t) {}
                }() ? ($(".js-fullscreen-overlay").addClass("dark-theme"), u = "dark") : ($(".js-fullscreen-overlay").removeClass("dark-theme"), u = "light"), f = $(s).val(), e = $(s).caret(), $(c).attr("data-return-scroll-position", window.pageYOffset), $("body").addClass("fullscreen-overlay-enabled"), $(document).on("keydown", i), s.classList.contains("js-suggester-field") && (l.classList.add("js-suggester-field"), n(l).setAttribute("data-url", n(s).getAttribute("data-url"))), $(l).attr("placeholder", $(s).attr("placeholder")), $(l).val(f), $(l).caret(e), l.focus(), a = "gh-fullscreen-known-user", r = function() {
                    try {
                        return "known" === localStorage.getItem(a)
                    } catch (t) {}
                }();
                try {
                    r || localStorage.setItem(a, "known")
                } catch (m) {}
                if (function() {
                        try {
                            return localStorage.length
                        } catch (t) {}
                    }()) return h = "other", t.match(/pull_request_body/g) ? h = "pull" : t.match(/issue_body/g) ? h = "issue" : t.match(/blob_contents/g) ? h = "blob" : t.match(/comment_body/g) && (h = "comment"), o = "usecase:" + h + "; known_user:" + r + "; theme:" + u, window.ga("send", "event", "Fullscreen mode", "enter", o)
            }
        }, t = function(t) {
            var e, s, r, a, o, c, l;
            if (r = document.getElementById(t)) return a = document.getElementById("fullscreen_overlay"), c = a.querySelector(".js-fullscreen-contents"), l = $(c).val(), e = $(c).caret(), $("body").removeClass("fullscreen-overlay-enabled"), $(document).off("keydown", i), c.classList.remove("js-suggester-field"), $(n(c)).html(""), (o = $(a).attr("data-return-scroll-position")) && window.scrollTo(0, o), (s = $(r).parents(".js-code-editor").data("code-editor")) ? s.setCode(l) : ($(r).val(l), $(r).caret(e), $(r).trigger("validation:field:change")), window.ga("send", "event", "Fullscreen mode", "exit", "editor:" + (s && !0)), c.value = ""
        }, s = !1, i = function(t) {
            return 27 === t.keyCode || "ctrl+L" === t.hotkey || "meta+L" === t.hotkey ? (s ? history.back() : window.location.hash = "", t.preventDefault()) : void 0
        }, $(document).on("click", ".js-enable-fullscreen", function(t) {
            var e, n;
            return t.preventDefault(), (e = $(this).closest(".js-previewable-comment-form, .js-code-editor")[0]) ? (n = e.querySelector("textarea"), window.location = "#fullscreen_" + n.id) : void 0
        }), $(document).on("click", ".js-exit-fullscreen", function(t) {
            s && (t.preventDefault(), history.back())
        }), $(document).on("click", ".js-theme-switcher", function() {
            var t, e;
            if ($("body, .js-fullscreen-overlay").toggleClass("dark-theme"), e = "gh-fullscreen-theme", "dark" === function() {
                    try {
                        return localStorage.getItem(e)
                    } catch (t) {}
                }()) {
                try {
                    localStorage.removeItem(e)
                } catch (n) {}
                t = "light"
            } else {
                try {
                    localStorage.setItem(e, "dark")
                } catch (n) {}
                t = "dark"
            }
            return window.ga("send", "event", "Fullscreen mode", "switch theme", "to:" + t), !1
        }), $.hashChange(function(n) {
            var i, r, a;
            return a = n.oldURL, r = n.newURL, (i = null != r ? r.match(/\#fullscreen_(.+)$/) : void 0) ? (s = !!a, e(i[1])) : (i = null != a ? a.match(/\#fullscreen_(.+)$/) : void 0) ? (s = !1, t(i[1])) : void 0
        }), "dark" === function() {
            try {
                return localStorage.getItem("gh-fullscreen-theme")
            } catch (t) {}
        }() && $(function() {
            return $("body, .js-fullscreen-overlay").addClass("dark-theme")
        })
    }.call(this),
    function() {
        var t, e;
        GitHub.support.emoji || (t = Object.create(HTMLElement.prototype), t.createdCallback = function() {
            return this.textContent = "", this.appendChild(e(this))
        }, e = function(t) {
            var e;
            return e = document.createElement("img"), e.src = t.getAttribute("fallback-src"), e.className = "emoji", e.alt = e.title = ":" + t.getAttribute("alias") + ":", e.height = 20, e.width = 20, e.align = "absmiddle", e
        }, window.GEmojiElement = document.registerElement("g-emoji", {
            prototype: t
        }))
    }.call(this),
    function() {
        var t, e, n, i, s, r, a;
        s = 0, n = -1, e = function(t) {
            var e, n, i, s;
            return e = t.getBoundingClientRect(), i = $(window).height(), s = $(window).width(), 0 === e.height ? !1 : e.height < i ? e.top >= 0 && e.left >= 0 && e.bottom <= i && e.right <= s : (n = Math.ceil(i / 2), e.top >= 0 && e.top + n < i)
        }, t = function(t) {
            var n, i, s, r, a, o, c;
            for (r = t.elements, c = [], i = 0, s = r.length; s > i; i++) n = r[i], c.push(e(n) ? null != (a = t["in"]) ? a.call(n, n, t) : void 0 : null != (o = t.out) ? o.call(n, n, t) : void 0);
            return c
        }, a = function(e) {
            return document.hasFocus() && window.scrollY !== n && (n = window.scrollY, !e.checkPending) ? (e.checkPending = !0, window.requestAnimationFrame(function() {
                return e.checkPending = !1, t(e)
            })) : void 0
        }, i = function(e, n) {
            return 0 === n.elements.length && (window.addEventListener("scroll", n.scrollHandler), $.pageFocused().then(function() {
                return t(n)
            })), n.elements.push(e)
        }, r = function(t, e) {
            var n;
            return n = e.elements.indexOf(t), -1 !== n && e.elements.splice(n, 1), 0 === e.elements.length ? window.removeEventListener("scroll", e.scrollHandler) : void 0
        }, $.inViewport = function(t, e) {
            var n;
            return null != e.call && (e = {
                "in": e
            }), n = {
                id: s++,
                selector: t,
                "in": e["in"],
                out: e.out,
                elements: [],
                checkPending: !1
            }, n.scrollHandler = function() {
                return a(n)
            }, $.observe(t, {
                add: function(t) {
                    return i(t, n)
                },
                remove: function(t) {
                    return r(t, n)
                }
            }), n
        }
    }.call(this),
    function() {
        $.observe(".labeled-button:checked", {
            add: function() {
                return $(this).parent("label").addClass("selected")
            },
            remove: function() {
                return $(this).parent("label").removeClass("selected")
            }
        })
    }.call(this),
    function() {
        $(document).on("keydown", "div.minibutton, span.minibutton", function(t) {
            return "enter" === t.hotkey ? ($(this).click(), t.preventDefault()) : void 0
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-notice-dismiss", function() {
            return $(this).closest(".js-notice").fadeOut()
        })
    }.call(this),
    function() {
        $.observeLast = function(t, e) {
            var n, i;
            null == e && (e = "last"), n = i = function() {
                $(t).removeClass(e).last().addClass(e)
            }, $.observe(t, {
                add: n,
                remove: i
            })
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-permalink-shortcut", function() {
            return window.location = this.href + window.location.hash, !1
        })
    }.call(this),
    function() {
        $(document).on("pjax:start", function(t) {
            var e;
            (e = t.relatedTarget) && ($(e).addClass("pjax-active"), $(e).parents(".js-pjax-active").addClass("pjax-active"))
        }), $(document).on("pjax:end", function() {
            $(".pjax-active").removeClass("pjax-active")
        })
    }.call(this),
    function() {
        $(document).on("pjax:click", function() {
            return window.onbeforeunload ? !1 : void 0
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e;
            return e = function() {
                var e, n, i;
                for (i = [], e = 0, n = arguments.length; n > e; e++) t = arguments[e], i.push(t.split("/", 3).join("/"));
                return i
            }.apply(this, arguments), e[0] === e[1]
        }, $(document).on("pjax:click", "#js-repo-pjax-container a[href]", function() {
            var e;
            return e = $(this).prop("pathname"), t(e, location.pathname) ? void 0 : !1
        })
    }.call(this),
    function() {
        var t;
        $.support.pjax && ($.pjax.defaults.fragment = "#pjax-body", $.pjaxHeadCache = [], $(t = function() {
            return $.pjaxHeadCache[document.location.pathname] = $("head [data-pjax-transient]")
        }), $(document).on("pjax:success", function(t, e) {
            var s = $.parseHTML(e);
            for (var i=0; i<s.length; i++) {
                var element = s[i];
                if("pjax-head" === element.id) {
                    $.pjaxHeadCache[document.location.pathname] = $(element).children();
                }
                if("pjax-flash" === element.id) {
                    $("#js-flash-container").html(element);
                }
            }
        }), $(document).on("pjax:end", function() {
            var t, e, n;
            return t = $.pjaxHeadCache[document.location.pathname], t ? ($("head [data-pjax-transient]").remove(), n = $(t).not("title, script, link[rel='stylesheet']"), e = $(t).filter("link[rel='stylesheet']"), $(document.head).append(n.attr("data-pjax-transient", !0)), $(document.head).append(e)) : void 0
        }))
    }.call(this),
    function() {
        var t, e;
        $.support.pjax && (e = function(t) {
            return null != t.getAttribute("data-pjax-preserve-scroll") ? !1 : 0
        }, t = function(t) {
            var target = $(t);
            var n = target.add(target.parents("[data-pjax]")).map(function() {
                var t = this.getAttribute("data-pjax");
                if(t && "true" !== t )
                    return t;
            });
            var i = n[0];
            if(i) {
                return document.querySelector(i);
            }
            console.log(target.closest("[data-pjax-container]"));
            return target.closest("[data-pjax-container]")[0]
        }, $(document).on("click", "[data-pjax] a, a[data-pjax]", function(n) {
            var s = this;
            console.log(s);
            if(!s.getAttribute("data-skip-pjax") && !s.getAttribute("data-remote") ) {
                var i = t(s);
                $.pjax.click(n, {
                    container: i, scrollTo: e(s)
                });
            }
        }), $(document).on("submit", "form[data-pjax]", function(n) {
            var i, s;
            return s = this, (i = t(s)) ? $.pjax.submit(n, {
                container: i,
                scrollTo: e(s)
            }) : void 0
        }))
    }.call(this),
    function() {
        var t;
        $.support.pjax && (t = document.querySelector("meta[name=pjax-timeout]")) && ($.pjax.defaults.timeout = parseInt(t.content))
    }.call(this),
    function() {
        $.observe(".js-poll", function(t) {
            $.ajaxPoll({
                context: t,
                url: $(t).attr("data-url")
            })
        })
    }.call(this),
    function() {
        $(function() {
            return $(document.body).hasClass("js-print-popup") ? (window.print(), setTimeout(window.close, 1e3)) : void 0
        })
    }.call(this),
    function() {
        $(document).onFocusedKeydown(".js-quick-submit", function() {
            return function(t) {
                var e, n;
                return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? (n = $(this).closest("form"), e = n.find("input[type=submit], button[type=submit]").first(), e.prop("disabled") || n.submit(), !1) : void 0
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-reload", function() {
            return window.location.reload(), !1
        })
    }.call(this),
    function() {
        $.observe(".has-removed-contents", function() {
            var t, e, n;
            return t = $(this).contents(), e = function() {
                return t.detach()
            }, n = function() {
                return $(this).html(t)
            }, {
                add: e,
                remove: n
            }
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-repo-filter .js-filterable-field", function() {
            return $(this).closest(".js-repo-filter").find(".js-more-repos-link").click()
        }), $(document).on("click", ".js-repo-filter .js-repo-filter-tab", function() {
            var t;
            return t = $(this).closest(".js-repo-filter"), t.find(".js-more-repos-link").click(), t.find(".js-repo-filter-tab").removeClass("filter-selected"), $(this).addClass("filter-selected"), t.find(".js-filterable-field").fire("filterable:change"), !1
        }), $(document).on("filterable:change", ".js-repo-filter .js-repo-list", function() {
            var t, e;
            t = $(this).closest(".js-repo-filter"), (e = t.find(".js-repo-filter-tab.filter-selected").attr("data-filter")) && $(this).children().not(e).hide()
        }), $(document).on("click:prepare", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).hasClass("is-loading") ? !1 : void 0
        }), $(document).on("ajaxSend", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).addClass("is-loading")
        }), $(document).on("ajaxComplete", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).removeClass("is-loading")
        }), $(document).on("ajaxSuccess", ".js-repo-filter .js-more-repos-link", function(t, e, n, i) {
            var s;
            return s = $(this).closest(".js-repo-filter"), s.find(".js-repo-list").html(i), s.find(".js-filterable-field").fire("filterable:change"), $(this).remove()
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-select-menu:not([data-multiple])", function() {
            return $(this).menu("deactivate")
        }), $(document).on("ajaxSend", ".js-select-menu:not([data-multiple])", function() {
            return $(this).addClass("is-loading")
        }), $(document).on("ajaxComplete", ".js-select-menu", function() {
            return $(this).removeClass("is-loading")
        }), $(document).on("ajaxError", ".js-select-menu", function() {
            return $(this).addClass("has-error")
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).removeClass("is-loading has-error")
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-select-menu:not([data-multiple]) .js-navigation-item", function() {
            var t, e;
            return e = $(this), t = e.closest(".js-select-menu"), t.find(".js-navigation-item.selected").removeClass("selected"), e.addClass("selected"), e.removeClass("indeterminate"), e.find("input[type=radio], input[type=checkbox]").prop("checked", !0).change(), e.fire("selectmenu:selected"), t.hasClass("is-loading") ? void 0 : t.menu("deactivate")
        }), $(document).on("navigation:open", ".js-select-menu[data-multiple] .js-navigation-item", function() {
            var t, e;
            return t = $(this), e = t.hasClass("selected"), t.toggleClass("selected", !e), t.removeClass("indeterminate"), t.find("input[type=radio], input[type=checkbox]").prop("checked", !e).change(), t.fire("selectmenu:selected")
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:selected", ".js-select-menu .js-navigation-item", function() {
            var t, e, n;
            return t = $(this).closest(".js-select-menu"), n = $(this).find(".js-select-button-text"), n[0] && t.find(".js-select-button").html(n.html()), e = $(this).find(".js-select-menu-item-gravatar"), n[0] ? t.find(".js-select-button-gravatar").html(e.html()) : void 0
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:change", ".js-select-menu .select-menu-list", function(t) {
            var e, n;
            n = $(this).find(".js-navigation-item"), n.removeClass("last-visible"), n.visible().last().addClass("last-visible"), $(this).is("[data-filterable-for]") || (e = $(t.target).hasClass("filterable-empty"), $(this).toggleClass("filterable-empty", e))
        })
    }.call(this),
    function() {
        $(document).on("menu:activated selectmenu:load", ".js-select-menu", function() {
            return $(this).find(".js-filterable-field").focus()
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).find(".js-filterable-field").val("").trigger("filterable:change")
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e, n, i, s, r;
            return i = t.currentTarget, e = $(i), e.removeClass("js-load-contents"), e.addClass("is-loading"), e.removeClass("has-error"), s = e.attr("data-contents-url"), n = e.data("contents-data"), r = $.ajax({
                url: s,
                data: n
            }), r.then(function(t) {
                e.removeClass("is-loading"), e.find(".js-select-menu-deferred-content").html(t), e.hasClass("active") && e.fire("selectmenu:load")
            }, function() {
                e.removeClass("is-loading"), e.addClass("has-error")
            })
        }, $.observe(".js-select-menu.js-load-contents", {
            add: function() {
                $(this).on("mouseenter", t), $(this).on("menu:activate", t)
            },
            remove: function() {
                $(this).off("mouseenter", t), $(this).off("menu:activate", t)
            }
        })
    }.call(this),
    function() {
        $(document).on("menu:activate", ".js-select-menu", function() {
            return $(this).find(":focus").blur(), $(this).find(".js-menu-target").addClass("selected"), $(this).find(".js-navigation-container").navigation("push")
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).find(".js-menu-target").removeClass("selected"), $(this).find(".js-navigation-container").navigation("pop")
        }), $(document).on("filterable:change selectmenu:tabchange", ".js-select-menu .select-menu-list", function() {
            return $(this).navigation("refocus")
        })
    }.call(this),
    function() {
        var t;
        $(document).on("filterable:change", ".js-select-menu .select-menu-list", function(e) {
            var n, i, s, r;
            (i = this.querySelector(".js-new-item-form")) && (n = e.relatedTarget.value, "" === n || t(this, n) ? $(this).removeClass("is-showing-new-item-form") : ($(this).addClass("is-showing-new-item-form"), s = i.querySelector(".js-new-item-name"), "innerText" in s ? s.innerText = n : s.textContent = n, null != (r = i.querySelector(".js-new-item-value")) && (r.value = n))), $(e.target).trigger("selectmenu:change")
        }), t = function(t, e) {
            var n, i, s, r, a;
            for (a = t.querySelectorAll(".js-select-button-text"), s = 0, r = a.length; r > s; s++)
                if (n = a[s], i = n.textContent.toLowerCase().trim(), i === e.toLowerCase()) return !0;
            return !1
        }
    }.call(this),
    function() {
        var t;
        $(document).on("menu:activate selectmenu:load", ".js-select-menu", function() {
            var t;
            return t = $(this).find(".js-select-menu-tab"), t.removeClass("selected"), t.first().addClass("selected")
        }), $(document).on("click", ".js-select-menu .js-select-menu-tab", function() {
            var t;
            return t = $(this).closest(".js-select-menu"), t.find(".js-select-menu-tab.selected").removeClass("selected"), $(this).addClass("selected"), !1
        }), t = function(t, e) {
            var n, i, s;
            s = t.getAttribute("data-tab-filter"), i = $(t).closest(".js-select-menu").find(".js-select-menu-tab-bucket"), n = i.filter(function() {
                return this.getAttribute("data-tab-filter") === s
            }), n.toggleClass("selected", e), e && n.fire("selectmenu:tabchange")
        }, $.observe(".js-select-menu .js-select-menu-tab.selected", {
            add: function() {
                return t(this, !0)
            },
            remove: function() {
                return t(this, !1)
            }
        })
    }.call(this),
    function() {}.call(this),
    function() {
        var t, e, n, i;
        t = function(t) {
            var e;
            return null == t && (t = window.location), (e = document.querySelector("meta[name=session-resume-id]")) ? e.content : t.pathname
        }, i = null, $(window).on("submit:prepare", function(t) {
            i = t.target, setImmediate(function() {
                return t.isDefaultPrevented() ? i = null : void 0
            })
        }), e = function(t) {
            var e, n, s, r;
            if (s = "session-resume:" + t, r = function(t) {
                    return t.id && t.value !== t.defaultValue && t.form !== i
                }, n = function() {
                    var t, n, i, s;
                    for (i = $(".js-session-resumable"), s = [], t = 0, n = i.length; n > t; t++) e = i[t], r(e) && s.push([e.id, e.value]);
                    return s
                }(), n.length) try {
                sessionStorage.setItem(s, JSON.stringify(n))
            } catch (a) {}
        }, n = function(t) {
            var e, n, i, s, r, a, o;
            if (n = "session-resume:" + t, e = function() {
                    try {
                        return sessionStorage.getItem(n)
                    } catch (t) {}
                }()) {
                try {
                    sessionStorage.removeItem(n)
                } catch (c) {}
                for (a = JSON.parse(e), s = 0, r = a.length; r > s; s++) o = a[s], t = o[0], i = o[1], $(document).fire("session:resume", {
                    targetId: t,
                    targetValue: i
                }, function() {
                    var e;
                    e = document.getElementById(t), e && e.value === e.defaultValue && (e.value = i)
                })
            }
        }, $(window).on("pageshow pjax:end", function() {
            n(t())
        }), $(window).on("pagehide", function() {
            e(t())
        }), $(window).on("pjax:beforeReplace", function(n) {
            var i, s, r, a;
            (r = null != (a = n.previousState) ? a.url : void 0) ? (s = t(new URL(r)), e(s)) : (i = new Error("pjax:beforeReplace event.previousState.url is undefined"), setImmediate(function() {
                throw i
            }))
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-social-container", function(t, e, n, i) {
            return $(this).find(".js-social-count").text(i.count)
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
                return function() {
                    return t.apply(e, arguments)
                }
            },
            n = [].slice;
        "undefined" != typeof EventSource && null !== EventSource && (navigator.userAgent.match(/iPhone/) || (t = function() {
            function t(t) {
                this.base = t, this.flush = e(this.flush, this), this.setup = e(this.setup, this), this.readyState = this.CONNECTING, this.listeners = {}, setImmediate(this.setup)
            }
            return t.prototype.CONNECTING = 0, t.prototype.OPEN = 1, t.prototype.CLOSED = 2, t.prototype.setup = function() {
                var t, e;
                (e = this.popMessages()) && (t = {
                    message: e
                }), $.ajax({
                    type: "POST",
                    url: this.base,
                    data: t,
                    success: function(t) {
                        return function(e, n, i) {
                            var s;
                            return (s = i.getResponseHeader("Location")) ? (t.pollUrl = s, t.messageUrl = "" + t.pollUrl + "/message") : (t.pollUrl = e.pollUrl, t.messageUrl = e.messageUrl), t.pollUrl ? (t.readyState = t.OPEN, t.fire("open"), t.readyState === t.OPEN ? (t.flush(), t.start()) : void 0) : t.close()
                        }
                    }(this),
                    error: function(t) {
                        return function() {
                            return t.close()
                        }
                    }(this)
                })
            }, t.prototype.start = function() {
                var t;
                /^wss?:\/\//.test(this.pollUrl) ? (this.source = new WebSocket(this.pollUrl), t = WebSocket.CLOSED) : (this.source = new EventSource(this.pollUrl), t = EventSource.CLOSED), this.source.addEventListener("message", function(t) {
                    return function(e) {
                        var n;
                        n = JSON.parse(e.data), t.fire("message", n)
                    }
                }(this)), this.source.addEventListener("reopen", function(t) {
                    return function() {
                        t.fire("reopen")
                    }
                }(this)), this.source.addEventListener("error", function(e) {
                    return function() {
                        e.source.readyState === t && e.close()
                    }
                }(this))
            }, t.prototype.on = function(t, e) {
                var n;
                return null == (n = this.listeners)[t] && (n[t] = []), this.listeners[t].push(e), this
            }, t.prototype.fire = function() {
                var t, e, i, s, r, a;
                if (s = arguments[0], t = 2 <= arguments.length ? n.call(arguments, 1) : [], i = this.listeners[s])
                    for (r = 0, a = i.length; a > r; r++) e = i[r], e.apply(this, t)
            }, t.prototype.close = function() {
                var t;
                this.readyState = this.CLOSED, null != (t = this.source) && t.close(), this.source = null, this.pollUrl = null, this.messageUrl = null, this.fire("close")
            }, t.prototype.send = function(t) {
                null == this.outbox && (this.outbox = []), this.outbox.push(t), this.fire("send", t), this.readyState === this.OPEN && null == this.flushTimeout && (this.flushTimeout = setTimeout(this.flush, 0))
            }, t.prototype.flush = function() {
                var t;
                this.messageUrl && (this.flushTimeout = null, (t = this.popMessages()) && $.ajax({
                    type: "POST",
                    url: this.messageUrl,
                    data: {
                        message: t
                    },
                    error: function(t) {
                        return function() {
                            return t.close()
                        }
                    }(this)
                }))
            }, t.prototype.popMessages = function() {
                var t;
                if (this.outbox) return t = this.outbox, this.outbox = null, t
            }, t
        }(), $.socket = function(e) {
            return new t(e)
        }))
    }.call(this),
    function() {
        $.socket && ($.fn.socket = function() {
            var t, e;
            if ((t = this[0]) && $(t).is("link[rel=xhr-socket]")) return e = $(t).data("socket"), e && e.readyState !== e.CLOSED ? e : (e = $.socket(t.href), e.on("open", function() {
                return $(t).trigger("socket:open", [this])
            }), e.on("close", function() {
                return $(t).trigger("socket:close", [this])
            }), e.on("reopen", function() {
                return $(t).trigger("socket:reopen", [this])
            }), e.on("send", function(e) {
                return $(t).trigger("socket:send", [e, this])
            }), e.on("message", function(e) {
                return $(t).trigger("socket:message", [e, this])
            }), $(t).data("socket", e), e)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a;
        $.fn.socket && (s = {}, t = {}, a = null, n = function() {
            var t;
            return null != a ? a : a = (t = $(document.head).find("link[rel=xhr-socket]")[0]) ? $(t).socket() : !1
        }, e = function(t) {
            var e, n;
            return null != (e = null != (n = t.getAttribute("data-channel")) ? n.split(/\s+/) : void 0) ? e : []
        }, i = function(i) {
            var r, a, o, c, l;
            if (a = n())
                for (l = e(i), o = 0, c = l.length; c > o; o++) r = l[o], s[r] || (a.send({
                    subscribe: r
                }), s[r] = !0), null == t[r] && (t[r] = []), t[r].push(i)
        }, r = function(n) {
            var i, s, r, a;
            for (a = e(n), s = 0, r = a.length; r > s; s++) i = a[s], t[i] = $(t[i]).not(n).slice(0)
        }, $(document).on("socket:reopen", "link[rel=xhr-socket]", function(t, e) {
            var n, i;
            for (n in s) i = s[n], e.send({
                subscribe: n
            })
        }), $(document).on("socket:message", "link[rel=xhr-socket]", function(e, n) {
            var i, s;
            s = n[0], i = n[1], s && i && $(t[s]).trigger("socket:message", [i, s])
        }), $.observe(".js-socket-channel[data-channel]", {
            add: i,
            remove: r
        }))
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        d = function(t, e, n) {
            var i, s, r, a;
            return a = n[3], s = n[4], r = e - s.length, i = e, {
                type: t,
                text: a,
                query: s,
                startIndex: r,
                endIndex: i
            }
        }, a = {}, t = function() {
            function t(t) {
                this.textarea = t, this.deactivate = f(this.deactivate, this), this.onNavigationOpen = f(this.onNavigationOpen, this), this.onNavigationKeyDown = f(this.onNavigationKeyDown, this), this.onInput = f(this.onInput, this), this.onPaste = f(this.onPaste, this), this.teardown = f(this.teardown, this), $(this.textarea).on("focusout:delayed.suggester", this.teardown), $(this.textarea.form).on("reset.suggester", this.deactivate), $(this.textarea).on("paste.suggester", this.onPaste), $(this.textarea).on("input.suggester", this.onInput), this.suggester = $(this.textarea).closest(".js-suggester-container").find(".js-suggester")[0], $(this.suggester).on("navigation:keydown.suggester", "[data-value]", this.onNavigationKeyDown), $(this.suggester).on("navigation:open.suggester", "[data-value]", this.onNavigationOpen), this.loadSuggestions()
            }
            var e, i;
            return t.prototype.types = {
                mention: {
                    match: /(^|\s)(@([a-z0-9\-_\/]*))$/i,
                    replace: "$1@$value ",
                    search: function(t, e) {
                        var i, s, r;
                        return r = c(e), i = $(t).find("ul.mention-suggestions"), s = i.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: n,
                            score: r.score
                        }), Promise.resolve([i, s])
                    }
                },
                auditLogUser: {
                    match: /(^|\s)((\-?actor:|\-?user:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.user-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: d
                },
                auditLogOrg: {
                    match: /(^|\s)((\-?org:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.org-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: d
                },
                auditLogAction: {
                    match: /(^|\s)((\-?action:)([a-z0-9\.\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.action-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: d
                },
                auditLogRepo: {
                    match: /(^|\s)((\-?repo:)([a-z0-9\/\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.repo-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: d
                },
                auditLogCountry: {
                    match: /(^|\s)((\-?country:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.country-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: d
                },
                emoji: {
                    match: /(^|\s)(:([a-z0-9\-\+_]*))$/i,
                    replace: "$1:$value: ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.emoji-suggestions"), e = " " + e.toLowerCase().replace(/_/g, " "), i = n.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: r,
                            score: s
                        }), Promise.resolve([n, i])
                    }
                },
                hashed: {
                    match: /(^|\s)(\#([a-z0-9\-_\/]*))$/i,
                    replace: "$1#$value ",
                    search: function(t, e) {
                        var i, s, r, a;
                        return s = $(t).find("ul.hashed-suggestions"), i = /^\d+$/.test(e) ? (r = new RegExp("\\b" + e), function(t) {
                            return u(t, r)
                        }) : c(e).score, a = s.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: n,
                            score: i
                        }), Promise.resolve([s, a])
                    }
                }
            }, i = function(t) {
                return t.replace(/`{3,}[^`]*\n(.+)?\n`{3,}/g, "")
            }, e = function(t) {
                var e, n;
                return (null != (e = t.match(/`{3,}/g)) ? e.length : void 0) % 2 ? !0 : (null != (n = i(t).match(/`/g)) ? n.length : void 0) % 2 ? !0 : void 0
            }, t.prototype.teardown = function() {
                this.deactivate(), $(this.textarea).off(".suggester"), $(this.textarea.form).off(".suggester"), $(this.suggester).off(".suggester"), this.onSuggestionsLoaded = function() {
                    return null
                }
            }, t.prototype.onPaste = function() {
                this.deactivate(), this.justPasted = !0
            }, t.prototype.onInput = function() {
                return this.justPasted ? void(this.justPasted = !1) : this.checkQuery() ? !1 : void 0
            }, t.prototype.onNavigationKeyDown = function(t) {
                switch (t.hotkey) {
                    case "tab":
                        return this.onNavigationOpen(t), !1;
                    case "esc":
                        return this.deactivate(), t.stopImmediatePropagation(), !1
                }
            }, t.prototype.onNavigationOpen = function(t) {
                var e, n, i;
                i = $(t.target).attr("data-value"), n = this.textarea.value.substring(0, this.currentSearch.endIndex), e = this.textarea.value.substring(this.currentSearch.endIndex), n = n.replace(this.currentSearch.type.match, this.currentSearch.type.replace.replace("$value", i)), this.textarea.value = n + e, this.deactivate(), this.textarea.focus(), this.textarea.selectionStart = n.length, this.textarea.selectionEnd = n.length
            }, t.prototype.checkQuery = function() {
                var t, e;
                if (t = this.searchQuery()) {
                    if (t.query === (null != (e = this.currentSearch) ? e.query : void 0)) return;
                    return this.currentSearch = t, this.search(t.type, t.query).then(function(e) {
                        return function(n) {
                            return n ? e.activate(t.startIndex) : e.deactivate()
                        }
                    }(this)), this.currentSearch.query
                }
                this.currentSearch = null, this.deactivate()
            }, t.prototype.activate = function(t) {
                $(this.suggester).css($(this.textarea).textFieldSelectionPosition(t + 1)), $(this.suggester).hasClass("active") || ($(this.suggester).addClass("active"), $(this.textarea).addClass("js-navigation-enable"), $(this.suggester).navigation("push"), $(this.suggester).navigation("focus"))
            }, t.prototype.deactivate = function() {
                $(this.suggester).hasClass("active") && ($(this.suggester).removeClass("active"), $(this.suggester).find(".suggestions").hide(), $(this.textarea).removeClass("js-navigation-enable"), $(this.suggester).navigation("pop"))
            }, t.prototype.search = function(t, e) {
                return t.search(this.suggester, e).then(function(t) {
                    return function(e) {
                        var n, i;
                        return n = e[0], i = e[1], i > 0 ? (n.show(), $(t.suggester).navigation("focus"), !0) : !1
                    }
                }(this))
            }, t.prototype.searchQuery = function() {
                var t, n, i, s, r, a, o;
                if (s = this.textarea.selectionEnd, r = this.textarea.value.substring(0, s), !e(r)) {
                    o = this.types;
                    for (i in o)
                        if (a = o[i], t = r.match(a.match)) return n = null != a.normalizeMatch ? a.normalizeMatch(a, s, t) : this.normalizeMatch(a, s, t)
                }
            }, t.prototype.normalizeMatch = function(t, e, n) {
                var i, s, r, a;
                return a = n[2], s = n[3], r = e - a.length, i = e, {
                    type: t,
                    text: a,
                    query: s,
                    startIndex: r,
                    endIndex: i
                }
            }, t.prototype.loadSuggestions = function() {
                var t, e;
                if (null == this.suggester.firstElementChild && (e = this.suggester.getAttribute("data-url"), null != e)) return t = null != a[e] ? a[e] : a[e] = $.fetchText(e), t.then(function(t) {
                    return function(e) {
                        return t.onSuggestionsLoaded(e)
                    }
                }(this))
            }, t.prototype.onSuggestionsLoaded = function(t) {
                return $(this.suggester).html(t), document.activeElement === this.textarea ? (this.currentSearch = null, this.checkQuery()) : void 0
            }, t
        }(), i = {}, r = function(t) {
            var e;
            return e = t.getAttribute("data-value"), i[e] = " " + n(t).replace(/_/g, " "), e
        }, n = function(t) {
            return t.getAttribute("data-text").trim().toLowerCase()
        }, s = function(t, e) {
            var n;
            return n = i[t].indexOf(e), n > -1 ? 1e3 - n : 0
        }, u = function(t, e) {
            var n;
            return n = t.search(e), n > -1 ? 1e3 - n : 0
        }, h = function(t, n) {
            var i, s, r, a, o, c, u;
            if (o = e(t, n[0]), 0 !== o.length) {
                if (1 === n.length) return [o[0], 1, []];
                for (r = null, c = 0, u = o.length; u > c; c++) a = o[c], (i = l(t, n, a + 1)) && (s = i[i.length - 1] - a, (!r || s < r[1]) && (r = [a, s, i]));
                return r
            }
        }, e = function(t, e) {
            var n, i;
            for (n = 0, i = [];
                (n = t.indexOf(e, n)) > -1;) i.push(n++);
            return i
        }, l = function(t, e, n) {
            var i, s, r, a;
            for (s = [], i = r = 1, a = e.length; a >= 1 ? a > r : r > a; i = a >= 1 ? ++r : --r) {
                if (n = t.indexOf(e[i], n), -1 === n) return;
                s.push(n++)
            }
            return s
        }, o = function() {
            return 2
        }, c = function(t) {
            var e, n;
            return t ? (e = t.toLowerCase().split(""), n = function(n) {
                var i, s;
                return n && (i = h(n, e)) ? (s = t.length / i[1], s /= i[0] / 2 + 1) : 0
            }) : n = o, {
                score: n
            }
        }, $(document).on("focusin:delayed", ".js-suggester-field", function() {
            new t(this)
        })
    }.call(this),
    function() {
        $(document).on("tasklist:change", ".js-task-list-container", function() {
            $(this).taskList("disable")
        }), $(document).on("tasklist:changed", ".js-task-list-container", function(t, e, n) {
            var i, s, r, a;
            return s = $(this).find("form.js-comment-update"), r = s.find("input[name=task_list_key]"), r.length > 0 || (a = s.find(".js-task-list-field").attr("name").split("[")[0], r = $("<input>", {
                type: "hidden",
                name: "task_list_key",
                value: a
            }), s.append(r)), n = n ? "1" : "0", i = $("<input>", {
                type: "hidden",
                name: "task_list_checked",
                value: n
            }), s.append(i), s.one("ajaxComplete", function(t, e) {
                return i.remove(), 200 !== e.status || /^\s*</.test(e.responseText) ? 422 === e.status && e.stale ? window.location.reload() : void 0 : $(this).taskList("enable")
            }), s.submit()
        }), $.observe(".task-list", function() {
            $(this).taskList("enable")
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function() {
            var t, i, s, r, a, o;
            if (o = this.getAttribute("data-url")) return a = $.fetchJSON(o), s = this.getAttribute("data-id"), r = $(".js-team-mention[data-id='" + s + "']"), r.removeAttr("data-url"), t = function(t) {
                return t.total > t.members.length && t.members.push("" + (t.total - t.members.length) + " more"), n(r, e(t.members))
            }, i = function(t) {
                return function(e) {
                    var i, s, a;
                    return s = (null != (a = e.response) ? a.status : void 0) || 500, i = function() {
                        switch (s) {
                            case 404:
                                return this.getAttribute("data-permission-text");
                            default:
                                return this.getAttribute("data-error-text")
                        }
                    }.call(t), n(r, i)
                }
            }(this), a.then(t, i)
        }, n = function(t, e) {
            return t.attr("aria-label", e), t.addClass("tooltipped tooltipped-s tooltipped-multiline")
        }, e = function(t) {
            var e;
            return 0 === t.length ? "" : 1 === t.length ? t[0] : 2 === t.length ? t.join(" and ") : ([].splice.apply(t, [-1, 9e9].concat(e = "and " + t.slice(-1))), t.join(", "))
        }, $.observe(".js-team-mention", function() {
            return $(this).on("mouseenter", t)
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", function(t, e, n) {
            var i;
            n.crossDomain || (i = $(".js-timeline-marker"), i.length && e.setRequestHeader("X-Timeline-Last-Modified", i.attr("data-last-modified")))
        })
    }.call(this),
    /**
     * This script gives you the zone info key representing your device's time zone setting.
     *
     * @name jsTimezoneDetect
     * @version 1.0.5
     * @author Jon Nylander
     * @license MIT License - http://www.opensource.org/licenses/mit-license.php
     *
     * For usage and examples, visit:
     * http://pellepim.bitbucket.org/jstz/
     *
     * Copyright (c) Jon Nylander
     */
    function(t) {
        var e = function() {
            "use strict";
            var t = "s",
                n = function(t) {
                    var e = -t.getTimezoneOffset();
                    return null !== e ? e : 0
                },
                i = function(t, e, n) {
                    var i = new Date;
                    return void 0 !== t && i.setFullYear(t), i.setMonth(e), i.setDate(n), i
                },
                s = function(t) {
                    return n(i(t, 0, 2))
                },
                r = function(t) {
                    return n(i(t, 5, 2))
                },
                a = function(t) {
                    var e = t.getMonth() > 7,
                        i = e ? r(t.getFullYear()) : s(t.getFullYear()),
                        a = n(t),
                        o = 0 > i,
                        c = i - a;
                    return o || e ? 0 !== c : 0 > c
                },
                o = function() {
                    var e = s(),
                        n = r(),
                        i = e - n;
                    return 0 > i ? e + ",1" : i > 0 ? n + ",1," + t : e + ",0"
                },
                c = function() {
                    var t = o();
                    return new e.TimeZone(e.olson.timezones[t])
                },
                l = function(t) {
                    var e = new Date(2010, 6, 15, 1, 0, 0, 0),
                        n = {
                            "America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0),
                            "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0),
                            "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0),
                            "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0),
                            "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0),
                            "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0),
                            "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0),
                            "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0),
                            "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0),
                            "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0),
                            "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0),
                            "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0),
                            "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0),
                            "Europe/Helsinki": new Date(2013, 2, 31, 5, 0, 0, 0),
                            "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0),
                            "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0),
                            "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0),
                            "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0),
                            "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0),
                            "Europe/Moscow": e,
                            "Asia/Amman": new Date(2013, 2, 29, 1, 0, 0, 0),
                            "Asia/Beirut": new Date(2013, 2, 31, 2, 0, 0, 0),
                            "Asia/Damascus": new Date(2013, 3, 6, 2, 0, 0, 0),
                            "Asia/Jerusalem": new Date(2013, 2, 29, 5, 0, 0, 0),
                            "Asia/Yekaterinburg": e,
                            "Asia/Omsk": e,
                            "Asia/Krasnoyarsk": e,
                            "Asia/Irkutsk": e,
                            "Asia/Yakutsk": e,
                            "Asia/Vladivostok": e,
                            "Asia/Baku": new Date(2013, 2, 31, 4, 0, 0),
                            "Asia/Yerevan": new Date(2013, 2, 31, 3, 0, 0),
                            "Asia/Kamchatka": e,
                            "Asia/Gaza": new Date(2010, 2, 27, 4, 0, 0),
                            "Africa/Cairo": new Date(2010, 4, 1, 3, 0, 0),
                            "Europe/Minsk": e,
                            "Pacific/Apia": new Date(2010, 10, 1, 1, 0, 0, 0),
                            "Pacific/Fiji": new Date(2010, 11, 1, 0, 0, 0),
                            "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)
                        };
                    return n[t]
                };
            return {
                determine: c,
                date_is_dst: a,
                dst_start_for: l
            }
        }();
        e.TimeZone = function(t) {
            "use strict";
            var n = {
                    "America/Denver": ["America/Denver", "America/Mazatlan"],
                    "America/Chicago": ["America/Chicago", "America/Mexico_City"],
                    "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"],
                    "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"],
                    "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Asia/Beirut", "Europe/Helsinki", "Asia/Damascus"],
                    "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"],
                    "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"],
                    "America/New_York": ["America/Havana", "America/New_York"],
                    "America/Halifax": ["America/Goose_Bay", "America/Halifax"],
                    "America/Godthab": ["America/Miquelon", "America/Godthab"],
                    "Asia/Dubai": ["Europe/Moscow"],
                    "Asia/Dhaka": ["Asia/Yekaterinburg"],
                    "Asia/Jakarta": ["Asia/Omsk"],
                    "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"],
                    "Asia/Tokyo": ["Asia/Irkutsk"],
                    "Australia/Brisbane": ["Asia/Yakutsk"],
                    "Pacific/Noumea": ["Asia/Vladivostok"],
                    "Pacific/Tarawa": ["Asia/Kamchatka", "Pacific/Fiji"],
                    "Pacific/Tongatapu": ["Pacific/Apia"],
                    "Asia/Baghdad": ["Europe/Minsk"],
                    "Asia/Baku": ["Asia/Yerevan", "Asia/Baku"],
                    "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]
                },
                i = t,
                s = function() {
                    for (var t = n[i], s = t.length, r = 0, a = t[0]; s > r; r += 1)
                        if (a = t[r], e.date_is_dst(e.dst_start_for(a))) return void(i = a)
                },
                r = function() {
                    return "undefined" != typeof n[i]
                };
            return r() && s(), {
                name: function() {
                    return i
                }
            }
        }, e.olson = {}, e.olson.timezones = {
            "-720,0": "Pacific/Majuro",
            "-660,0": "Pacific/Pago_Pago",
            "-600,1": "America/Adak",
            "-600,0": "Pacific/Honolulu",
            "-570,0": "Pacific/Marquesas",
            "-540,0": "Pacific/Gambier",
            "-540,1": "America/Anchorage",
            "-480,1": "America/Los_Angeles",
            "-480,0": "Pacific/Pitcairn",
            "-420,0": "America/Phoenix",
            "-420,1": "America/Denver",
            "-360,0": "America/Guatemala",
            "-360,1": "America/Chicago",
            "-360,1,s": "Pacific/Easter",
            "-300,0": "America/Bogota",
            "-300,1": "America/New_York",
            "-270,0": "America/Caracas",
            "-240,1": "America/Halifax",
            "-240,0": "America/Santo_Domingo",
            "-240,1,s": "America/Santiago",
            "-210,1": "America/St_Johns",
            "-180,1": "America/Godthab",
            "-180,0": "America/Argentina/Buenos_Aires",
            "-180,1,s": "America/Montevideo",
            "-120,0": "America/Noronha",
            "-120,1": "America/Noronha",
            "-60,1": "Atlantic/Azores",
            "-60,0": "Atlantic/Cape_Verde",
            "0,0": "UTC",
            "0,1": "Europe/London",
            "60,1": "Europe/Berlin",
            "60,0": "Africa/Lagos",
            "60,1,s": "Africa/Windhoek",
            "120,1": "Asia/Beirut",
            "120,0": "Africa/Johannesburg",
            "180,0": "Asia/Baghdad",
            "180,1": "Europe/Moscow",
            "210,1": "Asia/Tehran",
            "240,0": "Asia/Dubai",
            "240,1": "Asia/Baku",
            "270,0": "Asia/Kabul",
            "300,1": "Asia/Yekaterinburg",
            "300,0": "Asia/Karachi",
            "330,0": "Asia/Kolkata",
            "345,0": "Asia/Kathmandu",
            "360,0": "Asia/Dhaka",
            "360,1": "Asia/Omsk",
            "390,0": "Asia/Rangoon",
            "420,1": "Asia/Krasnoyarsk",
            "420,0": "Asia/Jakarta",
            "480,0": "Asia/Shanghai",
            "480,1": "Asia/Irkutsk",
            "525,0": "Australia/Eucla",
            "525,1,s": "Australia/Eucla",
            "540,1": "Asia/Yakutsk",
            "540,0": "Asia/Tokyo",
            "570,0": "Australia/Darwin",
            "570,1,s": "Australia/Adelaide",
            "600,0": "Australia/Brisbane",
            "600,1": "Asia/Vladivostok",
            "600,1,s": "Australia/Sydney",
            "630,1,s": "Australia/Lord_Howe",
            "660,1": "Asia/Kamchatka",
            "660,0": "Pacific/Noumea",
            "690,0": "Pacific/Norfolk",
            "720,1,s": "Pacific/Auckland",
            "720,0": "Pacific/Tarawa",
            "765,1,s": "Pacific/Chatham",
            "780,0": "Pacific/Tongatapu",
            "780,1,s": "Pacific/Apia",
            "840,0": "Pacific/Kiritimati"
        }, "undefined" != typeof exports ? exports.jstz = e : t.jstz = e
    }(this),
    function() {
        var t, e;
        e = jstz.determine().name(), "https:" === location.protocol && (t = "secure"), document.cookie = "tz=" + encodeURIComponent(e) + "; path=/; " + t
    }.call(this),
    function() {
        var t, e;
        GitHub.performanceEnabled() && (e = function() {
            if (!window.performance.timing) try {
                return sessionStorage.setItem("navigationStart", Date.now())
            } catch (t) {}
        }, t = function() {
            return setTimeout(function() {
                var t, e, n, i, s, r, a, o, c, l;
                if (r = {}, r.crossBrowserLoadEvent = Date.now(), window.performance.timing) {
                    o = window.performance.timing;
                    for (e in o) a = o[e], "number" == typeof a && (r[e] = a);
                    (t = null != (c = window.chrome) && "function" == typeof c.loadTimes && null != (l = c.loadTimes()) ? l.firstPaintTime : void 0) && (r.chromeFirstPaintTime = Math.round(1e3 * t))
                } else n = function() {
                    try {
                        return sessionStorage.getItem("navigationStart")
                    } catch (t) {}
                }(), n && (r.simulatedNavigationStart = parseInt(n, 10));
                return s = function() {
                    var t, e, n, s, r, a;
                    for (r = null != (s = "function" == typeof(t = window.performance).getEntriesByType ? t.getEntriesByType("resource") : void 0) ? s : [], a = [], e = 0, n = r.length; n > e; e++) i = r[e], a.push($.extend({}, i));
                    return a
                }(), Object.keys(r).length > 1 || s.length ? GitHub.stats({
                    timing: r,
                    resources: s
                }) : void 0
            }, 0)
        }, $(window).on("pagehide", e), $(window).on("load", t))
    }.call(this),
    function() {
        $(document).on("click", ".js-toggler-container .js-toggler-target", function(t) {
            return $(t.target).trigger("toggler:toggle"), 0 === $(this).parent(".js-toggler-form").length ? !1 : void 0
        }), $(document).on("ajaxBeforeSend", ".js-toggler-container", function() {
            return this.classList.remove("success", "error"), this.classList.add("loading")
        }), $(document).on("ajaxComplete", ".js-toggler-container", function() {
            return this.classList.remove("loading")
        }), $(document).on("ajaxSuccess", ".js-toggler-container", function() {
            return this.classList.add("success")
        }), $(document).on("ajaxError", ".js-toggler-container", function() {
            return this.classList.add("error")
        }), $(document).on("toggler:toggle", ".js-toggler-container", function() {
            return this.classList.toggle("on")
        })
    }.call(this),
    function() {
        var t, e;
        e = 0, t = function() {
            var t;
            if (document.hasFocus()) return t = $(".js-timeline-marker").attr("data-mark-as-read-url"), t ? $.ajax({
                url: t,
                type: "post"
            }) : void 0
        }, $.inViewport(".js-unread-item", {
            "in": function() {
                return $(this).removeClass("js-unread-item unread-item")
            }
        }), $.observe(".js-unread-item", {
            add: function() {
                return e++
            },
            remove: function() {
                return e--, 0 === e ? t(this) : void 0
            }
        }), $(document).on("socket:message", ".js-discussion", function(t) {
            return this === t.target ? $(".js-unread-item").removeClass("js-unread-item unread-item") : void 0
        })
    }.call(this),
    function() {
        var t, e, n;
        $.fn.updateContent = function(t) {
            var n;
            return null != (n = this.data("xhr")) && n.abort(), e(this[0], t)
        }, $(document).on("socket:message", ".js-updatable-content", function(e, i, s) {
            var r;
            this === e.target && null == $(this).data("xhr") && (r = t(this, s).then(function(t) {
                return function(e) {
                    return n(t, e)
                }
            }(this)), r["catch"](function(t) {
                return function(e) {
                    return "XMLHttpRequest abort" !== e.message ? console.warn("Failed to update content", t, e) : void 0
                }
            }(this)))
        }), t = function(t, e) {
            var n;
            return null == e && (e = null), n = $(t).ajax({
                channel: e
            }), Promise.resolve(n)["catch"](function(t) {
                throw new Error("XMLHttpRequest " + t.statusText)
            })
        }, e = function(t, e) {
            return $.preserveInteractivePosition(function() {
                return $(t).replaceContent(e)
            })
        }, n = function(t, n) {
            if ($(t).hasInteractions()) throw new Error("element had interactions");
            return e(t, n)
        }
    }.call(this),
    function() {
        $(document).on("upload:complete", ".js-upload-avatar-image", function(t) {
            var e;
            return e = t.upload.result, $.facebox({
                ajax: "/settings/avatars/" + e.url
            })
        })
    }.call(this),
    function() {
        var t, e, n;
        e = function(t) {
            return t.toLowerCase().replace(/[^a-z0-9\-_]+/gi, ".").replace(/\.{2,}/g, ".").replace(/^\.|\.$/gi, "")
        }, n = function(t) {
            return "![Uploading " + t + " . . .]()"
        }, t = function(t) {
            return e(t).replace(/\.[^.]+$/, "").replace(/\./g, " ")
        }, $(document).on("upload:setup", ".js-upload-markdown-image", function(t) {
            var e;
            return e = $(this).find(".js-comment-field"), e.insertText(n(t.upload.file.name) + "\n"), $(this).trigger("validation:change", !1)
        }), $(document).on("upload:complete", ".js-upload-markdown-image", function(e) {
            var i, s, r;
            return i = $(this).find(".js-comment-field"), r = n(e.upload.policy.asset.original_name), s = "![" + t(e.upload.policy.asset.name) + "](" + e.upload.policy.asset.href + ")", i.replaceText(r, s), $(this).trigger("validation:field:change")
        }), $(document).on("upload:error", ".js-upload-markdown-image", function(t) {
            var e, i;
            return e = $(this).find(".js-comment-field"), i = n(t.upload.policy.asset.original_name), e.replaceText(i, ""), $(this).trigger("validation:field:change")
        }), $(document).on("upload:invalid", ".js-upload-markdown-image", function(t) {
            var e, i;
            return e = $(this).find(".js-comment-field"), i = n(t.upload.file.name), e.replaceText(i, ""), $(this).trigger("validation:field:change")
        })
    }.call(this),
    function() {
        $(document).on("upload:complete", ".js-upload-oauth-logo", function(t) {
            var e;
            return e = $(this).find(".js-image-field"), e.attr("src", t.upload.policy.asset.href), $(this).find("input.js-oauth-application-logo-id").val(t.upload.policy.asset.id), $(this).addClass("has-uploaded-logo")
        })
    }.call(this),
    function() {
        var t;
        t = [], $(document).on("upload:setup", ".js-upload-release-file", function(e) {
            var n;
            if (!$("#release_id").val()) return e.preventDefault(), t.length > 0 ? t.push(e.upload.ready) : (t.push(e.upload.ready), n = function() {
                var e, n;
                for (n = []; e = t.pop();) n.push(e());
                return n
            }, $("button.js-save-draft").trigger("click", n))
        }), $(document).on("upload:start", ".js-upload-release-file", function() {
            var t;
            return t = $(this).find(".js-upload-meter"), t.show()
        }), $(document).on("upload:complete", ".js-upload-release-file", function(t) {
            var e, n, i, s;
            return e = $(this).siblings("ul.js-releases-field"), i = e.find("li.js-template").clone(), i.removeClass("template"), i.removeClass("js-template"), n = t.upload.policy.asset.name || t.upload.policy.asset.href.split("/").pop(), i.find(".filename").val(n), t.upload.policy.asset.size ? (s = (t.upload.policy.asset.size / 1048576).toFixed(2), i.find(".filesize").text("(" + s + "MB)")) : i.find(".filesize").text(""), i.find("input[type=hidden].url").val(t.upload.policy.asset.href), i.find("input[type=hidden].id").val(t.upload.policy.asset.id), e.append(i), e.removeClass("not-populated"), e.addClass("is-populated"), $(this).find(".js-upload-meter").hide()
        }), $(document).on("upload:progress", ".js-upload-release-file", function(t) {
            var e;
            return e = $(this).find(".js-upload-meter"), e.css("width", t.upload.percent + "%")
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x, k, C, S, T = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        w = function() {
            return "this is csrf-token";//document.querySelector('meta[name="csrf-token"]').getAttribute("content")
        }, t = function() {
            function t() {
                this.uploads = [], this.busy = !1
            }
            return t.prototype.upload = function(t, e) {
                var n;
                return n = function() {}, this.uploads.push({
                    file: t,
                    to: e.to,
                    token: e.token,
                    key: e.key,
                    form: e.form || {},
                    header: e.header || {},
                    start: e.start || n,
                    progress: e.progress || n,
                    complete: e.complete || n,
                    error: e.error || n
                }), this.process()
            }, t.prototype.process = function() {
                var t, e, n, i, s, r, a;
                console.log("ppppppp")
                if (!this.busy && 0 !== this.uploads.length) {
                    n = this.uploads.shift(),
                    this.busy = !0,
                    s = new XMLHttpRequest,
                    s.open("POST", n.to, !0),
                    s.setRequestHeader("X-CSRF-Token", w()), r = n.header;
                    for (e in r) i = r[e], s.setRequestHeader(e, i);
                    s.onloadstart = function() {
                        return n.start()
                    }, s.onreadystatechange = function(t) {
                        return function() {
                            var e;
                            return 4 === s.readyState ? (204 === s.status ? (e = s.getResponseHeader("Location"), n.complete({
                                href: e
                            })) : 200 === s.status ?
                                n.complete(JSON.parse(s.responseText)) : n.error({
                                status: s.status,
                                body: s.responseText
                            }), t.busy = !1, t.process()) : void 0
                        }
                    }(this), s.onerror = function() {
                        return n.error({
                            status: 0,
                            body: ""
                        })
                    }, s.upload.onprogress = function(t) {
                        var e;
                        return t.lengthComputable ? (e = Math.round(t.loaded / t.total * 100), n.progress(e)) : void 0
                    }, t = new FormData, a = n.form;
                    for (e in a) i = a[e], t.append(e, i);
                    return t.append("file", n.file), t.append("key", n.key), t.append("token", n.token), s.send(t)
                }
            }, t
        }(), b = ["is-default", "is-uploading", "is-bad-file", "is-too-big", "is-failed", "is-bad-dimensions", "is-empty"], y = function(t, e) {
            return $(t).removeClass(b.join(" ")), $(t).addClass(e)
        }, S = new t, j = function(t, e) {
            var n, i;
            console.log("1" + e)
            return e = $(e), i = function() {
                var n, i, s;
                return s = r(t, e.attr("data-upload-policy-url")), n = function(n) {
                    var i;
                    console.log("2" + e)
                    return e.fire("upload:start", {
                        upload: {
                            file: t
                        }
                    }), i = a(n, e), S.upload(t, i)
                }, i = function(n) {
                    var i;
                    return e.fire("upload:invalid", {
                        upload: {
                            file: t
                        }
                    }), i = v(n, {
                        size: t.size
                    }), y(e, i)
                }, s.then(n, i)
            }, n = $.Event("upload:setup"), e.fire(n, {
                upload: {
                    file: t,
                    ready: i
                }
            }), n.isDefaultPrevented() ? void 0 : i()
        }, r = function(t, e) {
            var n, i, s, r;
            return n = new FormData, n.append("name", t.name), n.append("size", t.size), n.append("content_type", t.type), (i = $("#alambic_organization").attr("data-id")) && n.append("organization_id", i), (r = $("#release_repository_id").val()) && n.append("repository_id", r), (s = $("#release_id").val()) && n.append("release_id", s), $.fetchJSON(e, {
                method: "post",
                body: n
            })["catch"](function(t) {
                return null == t.response ? Promise.reject({
                    status: 0,
                    body: ""
                }) : t.response.text().then(function(e) {
                    return Promise.reject({
                        status: t.response.status,
                        body: e
                    })
                })
            })
        }, v = function(t, e) {
            var n, i, s, r, a, o;
            console.log(t.body);
            if (400 === t.status) return "is-bad-file";
            if (422 !== t.status) return "is-failed";
            if (i = JSON.parse(t.body), null == (null != i ? i.errors : void 0)) return "is-failed";
            for (o = i.errors, r = 0, a = o.length; a > r; r++) switch (n = o[r], n.field) {
                case "size":
                    return s = null != e ? e.size : void 0, null != s && 0 === parseInt(s) ? "is-empty" : "is-too-big";
                case "width":
                case "height":
                    return "is-bad-dimensions";
                case "content_type":
                case "name":
                    return "is-bad-file"
            }
            return "is-failed"
        }, a = function(t, e) {

            console.log("4" + t)
            var n;
            return e = $(e), n = {
                to: t.upload_url,
                form: t.form,
                header: t.header,
                token: t.token,
                key: t.key,
                start: function() {
                    return y(e, "is-uploading")
                },
                progress: function(t) {
                    return e.fire("upload:progress", {
                        upload: {
                            percent: t
                        }
                    })
                },
                complete: function(n) {
                    var i;
                    return (null != (i = t.asset_upload_url) ? i.length : void 0) > 0 && $.fetch(t.asset_upload_url, {
                        method: "put"
                    }), e.fire("upload:complete", {
                        upload: {
                            policy: t,
                            result: n
                        }
                    }), y(e, "is-default")
                },
                error: function(n) {
                    var i;
                    return e.fire("upload:error", {
                        upload: {
                            policy: t
                        }
                    }), i = v(n), y(e, i)
                }
            }
        }, x = function(t) {
            return t.types ? T.call(t.types, "Files") >= 0 : !1
        }, k = function(t) {
            return t.types ? T.call(t.types, "text/uri-list") >= 0 : !1
        }, C = function(t) {
            return t.types ? T.call(t.types, "text/plain") >= 0 : !1
        }, e = function(t, e) {
            var n, i, s, r;
            for (r = [], i = 0, s = t.length; s > i; i++) n = t[i], r.push(j(n, e));
            return r
        }, n = function(t, e) {
            var n, i, s, r, a, o, c;
            if (t) {
                for (n = $(e).find(".js-comment-field"), o = t.split("\r\n"), c = [], r = 0, a = o.length; a > r; r++) i = o[r], s = l(i) ? "\n![](" + i + ")\n" : i, c.push(n.insertText(s));
                return c
            }
        }, i = function(t, e) {
            var n;
            return n = $(e).find(".js-comment-field"), n.insertText(t)
        }, l = function(t) {
            var e;
            return e = t.split(".").pop(), "gif" === e || "png" === e || "jpg" === e || "jpeg" === e
        }, o = function(t) {
            return x(t) ? "copy" : k(t) ? "link" : C(t) ? "copy" : "none"
        }, c = function(t) {
            switch (t) {
                case "image/gif":
                    return "image.gif";
                case "image/png":
                    return "image.png";
                case "image/jpeg":
                    return "image.jpg"
            }
        }, h = function(t) {
            return t.preventDefault()
        }, d = function(t) {
            return t.dataTransfer.dropEffect = "none", t.preventDefault()
        }, f = function(t) {
            var e;
            return e = o(t.dataTransfer), t.dataTransfer.dropEffect = e, $(this).addClass("dragover"), t.stopPropagation(), t.preventDefault()
        }, m = function(t) {
            return t.dataTransfer.dropEffect = "none", $(this).removeClass("dragover"), t.stopPropagation(), t.preventDefault()
        }, p = function(t) {
            var s;
            return $(this).removeClass("dragover"), s = t.dataTransfer, s.types ? x(s) ? e(s.files, this) : k(s) ? n(s.getData("text/uri-list"), this) : C(s) && i(s.getData("text/plain"), this) : y(this, "is-bad-browser"), t.stopPropagation(), t.preventDefault()
        }, g = function(t) {
            var n, i, s, r, a, o, l;
            if (null != (null != (o = t.clipboardData) ? o.items : void 0)) {
                for (l = t.clipboardData.items, r = 0, a = l.length; a > r && (s = l[r], !(i = c(s.type))); r++);
                if (i) return n = s.getAsFile(), n.name = i, e([n], this), t.preventDefault()
            }
        }, u = function(t) {
            return t.target.classList.contains("js-manual-file-chooser") ? (t.target.files ? e(t.target.files, this) : y(this, "is-bad-browser"), t.target.value = "") : void 0
        }, s = 0, $.observe(".js-uploadable-container", {
            add: function() {
                return 0 === s++ && (document.addEventListener("drop", h), document.addEventListener("dragover", d)), this.addEventListener("dragenter", f), this.addEventListener("dragover", f), this.addEventListener("dragleave", m), this.addEventListener("drop", p), this.addEventListener("paste", g), this.addEventListener("change", u)
            },
            remove: function() {
                return 0 === --s && (document.removeEventListener("drop", h), document.removeEventListener("dragover", d)), this.removeEventListener("dragenter", f), this.removeEventListener("dragover", f), this.removeEventListener("dragleave", m), this.removeEventListener("drop", p), this.removeEventListener("paste", g), this.removeEventListener("change", u)
            }
        }), ("undefined" == typeof FormData || null === FormData) && $(document.documentElement).addClass("no-dnd-uploads")
    }.call(this),
    function() {
        var t, e, n, i, s;
        n = function(i) {
            var s, r, a, o, c;
            if (null != i.checkValidity) return i.checkValidity();
            if (s = $(i), s.is("[required]") && !e(i)) return !1;
            if (s.is("[pattern]") && !t(i)) return !1;
            if (s.is("form"))
                for (c = i.elements, a = 0, o = c.length; o > a; a++)
                    if (r = c[a], !n(r)) return !1;
            return !0
        }, e = function(t) {
            return !!t.value.trim()
        }, t = function(t) {
            var e;
            return e = new RegExp("^(?:" + $(t).attr("pattern") + ")$"), 0 === t.value.search(e)
        }, i = function() {
            var t;
            return t = n(this), t && $(this).trigger("validation:field:change"),
                function() {
                    var e;
                    e = n(this), e !== t && $(this).trigger("validation:field:change"), t = e
                }
        }, s = ["input[pattern]", "input[required]", "textarea[required]"].join(","), $(document).onFocusedInput(s, i), $(document).on("change", s, i), $.observe(s, function() {
            $(this).trigger("validation:field:change")
        }), $(document).on("validation:field:change", "form", function() {
            var t;
            return t = n(this), $(this).trigger("validation:change", [t])
        }), $(document).on("validation:change", "form", function(t, e) {
            return $(this).find("button[data-disable-invalid]").prop("disabled", !e)
        }), $(document).on("submit", ".js-normalize-submit", function(t) {
            return n(this) ? void 0 : t.preventDefault()
        })
    }.call(this),
    function() {
        var t;
        $.observe(".will-transition-once", {
            add: function() {
                this.addEventListener("transitionend", t)
            },
            remove: function() {
                this.removeEventListener("transitionend", t)
            }
        }), t = function(t) {
            return t.target.classList.remove("will-transition-once")
        }
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", function(t, e) {
            var n;
            (n = e.getResponseHeader("X-XHR-Location")) && (document.location.href = n, t.stopImmediatePropagation())
        })
    }.call(this),
    function() {
        $(function() {
            var t, e;
            if (t = $("meta[name=octolytics-script-host]")[0]) return null == window._octo && (window._octo = []), _octo.push(["enablePerformance"]), _octo.push(["recordPageView"]), e = document.createElement("script"), e.type = "text/javascript", e.async = !0, e.src = "//" + t.content + "/assets/api.js", document.getElementsByTagName("head")[0].appendChild(e)
        }), $(document).on("pjax:complete", function() {
            return "undefined" != typeof _octo && null !== _octo ? _octo.push(["recordPageView"]) : void 0
        })
    }.call(this),
    function() {
        var t;
        $.observe(".js-conduit-openfile-check", t = function(t) {
            $.conduit.capable("url-parameter-filepath").then(function(e) {
                return e ? t.setAttribute("href", t.getAttribute("data-url")) : (t.classList.add("disabled"), t.setAttribute("aria-label", t.getAttribute("data-failed-title")))
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m;
        a = null, o = null, h = null, f = null, $(document).on("pjax:send pjax:complete", ".js-contribution-activity", function(t) {
            var e;
            e = "pjax:send" === t.type, this.classList.toggle("loading", e)
        }), $(document).on("graph:load", ".js-calendar-graph", function(t, e) {
            $(this).append(e), n(this)
        }), $.observe(".js-calendar-graph", function() {
            var t;
            t = this.querySelector(".js-calendar-graph-svg"), t && n(this)
        }), $(document).on("click", ".js-calendar-graph rect.day", function(t) {
            var e;
            e = new Date(this.getAttribute("data-date")), c(e, t.shiftKey, !1)
        }), $(document).on("mouseover", ".js-calendar-graph rect.day", function() {
            m(this)
        }), $(document).on("mouseout", ".js-calendar-graph rect.day", function() {
            $(".svg-tip").remove()
        }), n = function(t) {
            var e, n;
            return e = t.getAttribute("data-from"), e && (e = o = new Date(e)), n = t.getAttribute("data-to"), n && (n = new Date(n)), e || n ? c(e, n, !0) : void 0
        }, t = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], m = function(e) {
            var n, i, s, r, a, o, c, l;
            return s = new Date(e.getAttribute("data-date")), i = parseInt(e.getAttribute("data-count")), o = 0 === i ? "No" : i, a = t[s.getUTCMonth()].slice(0, 3) + " " + s.getUTCDate() + ", " + s.getUTCFullYear(), r = $('<div class="svg-tip svg-tip-one-line">\n  <strong>' + o + " " + $.pluralize(i, "contribution") + "</strong> on " + a + "\n</div>").get(0), $(".svg-tip").remove(), document.body.appendChild(r), n = e.getBoundingClientRect(), c = n.left + window.pageXOffset - r.offsetWidth / 2 + n.width / 2, l = n.bottom + window.pageYOffset - r.offsetHeight - 2 * n.height, r.style.top = "" + l + "px", r.style.left = "" + c + "px"
        }, s = function(t) {
            return $.pjax({
                url: t,
                container: ".js-contribution-activity",
                scrollTo: !1,
                replace: !0
            })
        }, u = function(t) {
            var e, n;
            return a = t, e = null, h = null, f = null, n = "" + document.location.pathname + "?tab=contributions&period=" + a, d(), s(n)
        }, l = function(t, e) {
            var n, i;
            return i = t.getAttribute("class").trim().split(" "), i = function() {
                var t, s, r;
                for (r = [], t = 0, s = i.length; s > t; t++) n = i[t], n !== e && r.push(n);
                return r
            }(), t.setAttribute("class", i.join(" "))
        }, e = function(t, e) {
            var n;
            return n = t.getAttribute("class") + " " + e, t.setAttribute("class", n.trim())
        }, d = function(t, n) {
            var i, s, r, a, o, c, u, d, h;
            for (i = document.querySelector(".js-calendar-graph"), a = i.querySelectorAll("rect.day"), o = 0, u = a.length; u > o; o++) s = a[o], l(s, "active");
            if (i.classList.remove("days-selected"), t || n) {
                for (i.classList.add("days-selected"), r = function(e) {
                        var i;
                        return i = new Date(e.getAttribute("data-date")).getTime(), t && n ? t.getTime() <= i && i <= n.getTime() : i === t.getTime()
                    }, h = [], c = 0, d = a.length; d > c; c++) s = a[c], r(s) && h.push(e(s, "active"));
                return h
            }
        }, r = function(t) {
            return ("0" + t).slice(-2)
        }, i = function(t) {
            return t.getUTCFullYear() + "-" + r(t.getUTCMonth() + 1) + "-" + r(t.getUTCDate())
        }, c = function(t, e, n) {
            var r, c, l, m, p, g, v, $;
            return p = "" + document.location.pathname + "?tab=contributions", t >= h && f >= t ? void u("weekly") : ("object" == typeof e && (o = e, e = !0), o && e ? (l = new Date(o.getTime() - 26784e5), c = new Date(o.getTime() + 26784e5), g = t > o ? [o, t] : [t, o], r = g[0], m = g[1], l > r && (r = l), m > c && (m = c), v = [r, m], h = v[0], f = v[1], p += "&from=" + i(r) + "&to=" + i(m)) : (r = t, $ = [r, null], h = $[0], f = $[1], p += "&from=" + i(r)), o = t, a = "custom", d(r, m), n ? void 0 : s(p))
        }, $(document).on("change", ".js-period-container", function(t) {
            var e;
            return t.preventDefault(), t.stopPropagation(), e = $(t.target).val().toLowerCase(), a !== e ? u(e) : void 0
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("submit", ".js-find-coupon-form", function(t) {
            var e, n;
            return e = t.target.action, n = $("#code").val(), window.location = e + "/" + encodeURIComponent(n), t.stopPropagation(), t.preventDefault()
        }), $(document).on("click", ".js-choose-account", function(e) {
            return $(".js-plan-row, .js-choose-plan").removeClass("selected"), $(".js-plan").val(""), $(".js-billing-section").addClass("has-removed-contents"), t($(this).closest(".js-account-row")), e.stopPropagation(), e.preventDefault()
        }), $(document).on("click", ".js-choose-plan", function(t) {
            return e($(this).closest(".js-plan-row")), t.stopPropagation(), t.preventDefault()
        }), $.observe(".js-plan-row.selected", {
            add: function() {
                return $(this).closest("form").find(".js-redeem-button").prop("disabled", $(this).hasClass("free-plan"))
            }
        }), t = function(t) {
            var n, i, s, r;
            if (t.length) return s = t.data("login"), r = t.data("plan"), $(".js-account-row, .js-choose-account").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-account").addClass("selected"), $(".js-account").val(s), $(".js-plan-section").removeClass("is-hidden"), $(".js-billing-plans").addClass("is-hidden"), i = $(".js-plans-for-" + s), i.removeClass("is-hidden"), n = $(".js-plan-row", i), e(1 === n.length ? n : $("[data-name='" + r + "']", i))
        }, e = function(t) {
            var e, n, i, s, r;
            if (t.length) return s = t.data("name"), n = parseInt(t.data("cost"), 10), r = t.closest(".js-billing-plans"), i = r.data("has-billing"), e = r.data("login"), $(".js-plan-row, .js-choose-plan").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-plan").addClass("selected"), $(".js-plan").val(s), 0 === n || i ? $(".js-billing-section").addClass("has-removed-contents") : $(".js-billing-section[data-login='" + e + "']").removeClass("has-removed-contents")
        }, $(function() {
            return t($(".js-account-row.selected")), e($(".js-plan-row.selected"))
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-git-protocol-selector", function() {
            var t, e;
            return t = $(this).closest(".url-box"), e = $(this).attr("href"), t.find(".js-url-field").val(e), /\.patch$/.test(e) || $(".js-live-clone-url").text(e), (e = $(this).attr("data-url")) && $.ajax({
                type: "POST",
                url: e
            }), t.find(".js-clone-urls > .selected").removeClass("selected"), $(this).parent(".js-clone-url-button").addClass("selected"), !1
        }), $(document).on("click", ".js-clone-selector", function(t) {
            var e, n, i, s;
            return t.preventDefault(), e = $(this).attr("data-protocol"), s = $(".clone-url").hide(), n = s.filter('[data-protocol-type="' + e + '"]').show(), (i = n.attr("data-url")) ? $.ajax({
                type: "POST",
                url: i
            }) : void 0
        })
    }.call(this),
    function() {
        var t, e, n;
        e = function(t, e) {
            return $(document.createElementNS("http://www.w3.org/2000/svg", t)).attr(e)
        }, n = !(null == document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect), t = function() {
            var t, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x, k, C, S, T, L, A, D;
            if (n) {
                for (s = $(this), m = s.attr("data-outer-radius") || 40, h = s.attr("data-inner-radius") || 30, y = s.find("span").map(function() {
                        var t;
                        return t = {
                            className: this.className,
                            value: parseFloat($(this).text(), 10)
                        }
                    }), b = 0, S = 0, L = y.length; L > S; S++) f = y[S], b += f.value;
                for (u = 2 * m, i = e("svg", {
                        "class": "donut-chart"
                    }), i.empty().attr({
                        height: u,
                        width: u
                    }), s.hide().after(i), w = d = i.width(), d = i.height(), o = c = w / 2, p = Math.PI, v = function(t, e) {
                        var n;
                        return n = t / b * p * 2 - p / 2, [e * Math.cos(n) + o, e * Math.sin(n) + c]
                    }, r = 0, D = [], T = 0, A = y.length; A > T; T++) f = y[T], console.log(f), j = f.value, g = j / b, 0 !== g && (1 === g ? h ? (x = o - .01, k = c - m, C = c - h, t = e("path", {
                    d: ["M", o, k, "A", m, m, 0, 1, 1, x, k, "L", x, C, "A", h, h, 0, 1, 0, o, C].join(" ")
                })) : t = e("circle", {
                    cx: o,
                    cy: c,
                    r: m
                }) : (a = r + j, l = ["M"].concat(v(r, m), "A", m, m, 0, g > .5 ? 1 : 0, 1, v(a, m), "L"), h ? l = l.concat(v(a, h), "A", h, h, 0, g > .5 ? 1 : 0, 0, v(r, h)) : l.push(o, c), r += j, t = e("path", {
                    d: l.join(" ")
                })), t.attr("class", f.className), D.push(i.append(t)));
                return D
            }
        }, $.observe(".js-donut", t)
    }.call(this),
    function() {
        function t(t, e) {
            return t.href = e
        }

        function e(t, e) {
            return t.name = e
        }

        function n(t) {
            Ce.set(t)
        }

        function i(t) {
            return "function" == typeof t
        }

        function s(t) {
            return "[object Array]" == Object[pe].toString[$e](Object(t))
        }

        function r(t) {
            return void 0 != t && -1 < (t.constructor + "")[de]("String")
        }

        function a(t, e) {
            return 0 == t[de](e)
        }

        function o(t) {
            return t ? t[q](/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
        }

        function c() {
            return [Xe() ^ 2147483647 & Oe(), N.round((new Date)[X]() / 1e3)][xe](".")
        }

        function l(t) {
            var e = De[G]("img");
            return e.width = 1, e.height = 1, e.src = t, e
        }

        function u() {}

        function d(t) {
            return R instanceof Function ? R(t) : (n(28), t)
        }

        function h(t) {
            return d(t)[q](/\(/g, "%28")[q](/\)/g, "%29")
        }

        function f(t, e) {
            if (t) {
                var n = De[G]("script");
                n.type = "text/javascript", n.async = !0, n.src = t, n.id = e;
                var i = De.getElementsByTagName("script")[0];
                i[we].insertBefore(n, i)
            }
        }

        function m() {
            return dn || "https:" == De[Q][ne] ? "https:" : "http:"
        }

        function p() {
            var t = "" + De[Q][te];
            return 0 == t[de]("www.") ? t[je](4) : t
        }

        function g(t) {
            var e = De.referrer;
            if (/^https?:\/\//i [ce](e)) {
                if (t) return e;
                t = "//" + De[Q][te];
                var n = e[de](t);
                if ((5 == n || 6 == n) && (t = e.charAt(n + t[me]), "/" == t || "?" == t || "" == t || ":" == t)) return;
                return e
            }
        }

        function v(t, e) {
            if (1 == e[me] && null != e[0] && "object" == typeof e[0]) return e[0];
            for (var n = {}, i = N.min(t[me] + 1, e[me]), s = 0; i > s; s++) {
                if ("object" == typeof e[s]) {
                    for (var r in e[s]) e[s][Z](r) && (n[r] = e[s][r]);
                    break
                }
                s < t[me] && (n[t[s]] = e[s])
            }
            return n
        }

        function $(t) {
            if (100 != t.get(Pi) && O(Ze(t, yi)) % 1e4 >= 100 * tn(t, Pi)) throw "abort"
        }

        function b(t) {
            if (_e(Ze(t, xi))) throw "abort"
        }

        function j() {
            var t = De[Q][ne];
            if ("http:" != t && "https:" != t) throw "abort"
        }

        function y(t) {
            try {
                Ae.XMLHttpRequest && "withCredentials" in new Ae.XMLHttpRequest ? n(40) : Ae.XDomainRequest && n(41), Ae[ye].sendBeacon && n(42)
            } catch (e) {}
            t.set(bn, tn(t, bn) + 1);
            var i = [];
            if (Ke.map(function(e, n) {
                    if (n.p) {
                        var s = t.get(e);
                        void 0 != s && s != n[he] && ("boolean" == typeof s && (s *= 1), i[ae](n.p + "=" + d("" + s)))
                    }
                }), Fi(new Bi(1e4))) {
                var s = [];
                s[ae](Ge()), s[ae][re](s, c()[K](".")), s[ae](Ve());
                var r;
                r = Ae.crypto ? !0 : !1, s[ae](r ? "c" : "b"), i[ae]("z=" + s[xe]("."))
            } else i[ae]("z=" + Ve());
            t.set(vn, i[xe]("&"), !0)
        }

        function w(t) {
            var e = Ze(t, Ii) || Re() + "/collect";
            Ne(e, Ze(t, vn), t.get(gn), t.get($n)), t.set(gn, u, !0)
        }

        function x(t) {
            var e = Ae.gaData;
            e && (e.expId && t.set(Xn, e.expId), e.expVar && t.set(Jn, e.expVar))
        }

        function k() {
            if (Ae[ye] && "preview" == Ae[ye].loadPurpose) throw "abort"
        }

        function C(t) {
            var e = Ae.gaDevIds;
            s(e) && 0 != e[me] && t.set("&did", e[xe](","), !0)
        }

        function S(t) {
            if (!t.get(xi)) throw "abort"
        }

        function T(t) {
            var e = tn(t, ti);
            e >= 500 && n(15);
            var i = Ze(t, pn);
            if ("transaction" != i && "item" != i) {
                var i = tn(t, ni),
                    s = (new Date)[X](),
                    r = tn(t, ei);
                if (0 == r && t.set(ei, s), r = N.round(2 * (s - r) / 1e3), r > 0 && (i = N.min(i + r, 20), t.set(ei, s)), 0 >= i) throw "abort";
                t.set(ni, --i)
            }
            t.set(ti, ++e)
        }

        function L(t, e, i, s) {
            e[t] = function() {
                try {
                    return s && n(s), i[re](this, arguments)
                } catch (e) {
                    var r = e && e[fe];
                    if (!(1 <= 100 * N.random() || _e("?"))) {
                        var a = ["t=error", "_e=exc", "_v=j30", "sr=1"];
                        t && a[ae]("_f=" + t), r && a[ae]("_m=" + d(r[je](0, 100))), a[ae]("aip=1"), a[ae]("z=" + Xe()), Ne(Re() + "/collect", a[xe]("&"))
                    }
                    throw e
                }
            }
        }

        function A() {
            var t, e, n;
            if ((n = (n = Ae[ye]) ? n.plugins : null) && n[me])
                for (var i = 0; i < n[me] && !e; i++) {
                    var s = n[i]; - 1 < s[fe][de]("Shockwave Flash") && (e = s.description)
                }
            if (!e) try {
                t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), e = t.GetVariable("$version")
            } catch (r) {}
            if (!e) try {
                t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), e = "WIN 6,0,21,0", t.AllowScriptAccess = "always", e = t.GetVariable("$version")
            } catch (a) {}
            if (!e) try {
                t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), e = t.GetVariable("$version")
            } catch (o) {}
            return e && (t = e[U](/[\d]+/g)) && 3 <= t[me] && (e = t[0] + "." + t[1] + " r" + t[2]), e || void 0
        }

        function D(t, e, n) {
            "none" == e && (e = "");
            var i = [],
                s = Pe(t);
            t = "__utma" == t ? 6 : 2;
            for (var r = 0; r < s[me]; r++) {
                var a = ("" + s[r])[K](".");
                a[me] >= t && i[ae]({
                    hash: a[0],
                    R: s[r],
                    O: a
                })
            }
            return 0 == i[me] ? void 0 : 1 == i[me] ? i[0] : _(e, i) || _(n, i) || _(null, i) || i[0]
        }

        function _(t, e) {
            var n, i;
            null == t ? n = i = 1 : (n = O(t), i = O(a(t, ".") ? t[je](1) : "." + t));
            for (var s = 0; s < e[me]; s++)
                if (e[s][oe] == n || e[s][oe] == i) return e[s]
        }

        function H(t) {
            t = t.get(yi);
            var e = P(t, 0);
            return "_ga=1." + d(e + "." + t)
        }

        function P(t, e) {
            for (var n = new Date, i = Ae[ye], s = i.plugins || [], n = [t, i.userAgent, n.getTimezoneOffset(), n.getYear(), n.getDate(), n.getHours(), n.getMinutes() + e], i = 0; i < s[me]; ++i) n[ae](s[i].description);
            return O(n[xe]("."))
        }

        function E(t, e) {
            if (e == De[Q][te]) return !1;
            for (var n = 0; n < t[me]; n++)
                if (t[n] instanceof RegExp) {
                    if (t[n][ce](e)) return !0
                } else if (0 <= e[de](t[n])) return !0;
            return !1
        }

        function M() {
            var t = Ae.gaGlobal = Ae.gaGlobal || {};
            return t.hid = t.hid || Xe()
        }

        function I(t) {
            return 0 <= t[de](".") || 0 <= t[de](":")
        }

        function O(t) {
            var e, n = 1,
                i = 0;
            if (t)
                for (n = 0, e = t[me] - 1; e >= 0; e--) i = t.charCodeAt(e), n = (n << 6 & 268435455) + i + (i << 14), i = 266338304 & n, n = 0 != i ? n ^ i >> 21 : n;
            return n
        }
        var R = encodeURIComponent,
            B = window,
            F = setTimeout,
            N = Math,
            q = "replace",
            z = "data",
            U = "match",
            W = "send",
            Y = "port",
            G = "createElement",
            V = "setAttribute",
            X = "getTime",
            J = "host",
            K = "split",
            Q = "location",
            Z = "hasOwnProperty",
            te = "hostname",
            ee = "search",
            ne = "protocol",
            ie = "href",
            se = "action",
            re = "apply",
            ae = "push",
            oe = "hash",
            ce = "test",
            le = "slice",
            ue = "cookie",
            de = "indexOf",
            he = "defaultValue",
            fe = "name",
            me = "length",
            pe = "prototype",
            ge = "clientWidth",
            ve = "target",
            $e = "call",
            be = "clientHeight",
            je = "substring",
            ye = "navigator",
            we = "parentNode",
            xe = "join",
            ke = "toLowerCase",
            Ce = new function() {
                var t = [];
                this.set = function(e) {
                    t[e] = !0
                }, this.M = function() {
                    for (var e = [], n = 0; n < t[me]; n++) t[n] && (e[N.floor(n / 6)] = e[N.floor(n / 6)] ^ 1 << n % 6);
                    for (n = 0; n < e[me]; n++) e[n] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(e[n] || 0);
                    return e[xe]("") + "~"
                }
            },
            Se = function(t, e, i, s) {
                try {
                    t.addEventListener ? t.addEventListener(e, i, !!s) : t.attachEvent && t.attachEvent("on" + e, i)
                } catch (r) {
                    n(27)
                }
            },
            Te = function(t, e, n) {
                t.removeEventListener ? t.removeEventListener(e, n, !1) : t.detachEvent && t.detachEvent("on" + e, n)
            },
            Le = function() {
                this.keys = [], this.w = {}, this.m = {}
            };
        Le[pe].set = function(t, e, n) {
            this.keys[ae](t), n ? this.m[":" + t] = e : this.w[":" + t] = e
        }, Le[pe].get = function(t) {
            return this.m[Z](":" + t) ? this.m[":" + t] : this.w[":" + t]
        }, Le[pe].map = function(t) {
            for (var e = 0; e < this.keys[me]; e++) {
                var n = this.keys[e],
                    i = this.get(n);
                i && t(n, i)
            }
        };
        var Ae = B,
            De = document,
            _e = function(t) {
                var e = Ae._gaUserPrefs;
                if (e && e.ioo && e.ioo() || t && !0 === Ae["ga-disable-" + t]) return !0;
                try {
                    var n = Ae.external;
                    if (n && n._gaUserPrefs && "oo" == n._gaUserPrefs) return !0
                } catch (i) {}
                return !1
            },
            He = function(t) {
                F(t, 100)
            },
            Pe = function(t) {
                var e = [],
                    n = De[ue][K](";");
                t = new RegExp("^\\s*" + t + "=\\s*(.*?)\\s*$");
                for (var i = 0; i < n[me]; i++) {
                    var s = n[i][U](t);
                    s && e[ae](s[1])
                }
                return e
            },
            Ee = function(t, e, i, s, r, a) {
                if (r = _e(r) ? !1 : Ie[ce](De[Q][te]) || "/" == i && Me[ce](s) ? !1 : !0, !r) return !1;
                if (e && 1200 < e[me] && (e = e[je](0, 1200), n(24)), i = t + "=" + e + "; path=" + i + "; ", a && (i += "expires=" + new Date((new Date)[X]() + a).toGMTString() + "; "), s && "none" != s && (i += "domain=" + s + ";"), s = De[ue], De.cookie = i, !(s = s != De[ue])) t: {
                    for (t = Pe(t), s = 0; s < t[me]; s++)
                        if (e == t[s]) {
                            s = !0;
                            break t
                        }
                    s = !1
                }
                return s
            },
            Me = new RegExp(/^(www\.)?google(\.com?)?(\.[a-z]{2})?$/),
            Ie = new RegExp(/(^|\.)doubleclick\.net$/i),
            Oe = function() {
                for (var t = Ae[ye].userAgent + (De[ue] ? De[ue] : "") + (De.referrer ? De.referrer : ""), e = t[me], n = Ae.history[me]; n > 0;) t += n-- ^ e++;
                return O(t)
            },
            Re = function() {
                return m() + "//www.google-analytics.com"
            },
            Be = function(t) {
                e(this, "len"), this.message = t + "-8192"
            },
            Fe = function(t) {
                e(this, "ff2post"), this.message = t + "-2036"
            },
            Ne = function(t, e, n, i) {
                if (n = n || u, i && (i = n, Ae[ye].sendBeacon && Ae[ye].sendBeacon(t, e) ? (i(), i = !0) : i = !1), !i)
                    if (2036 >= e[me]) qe(t, e, n);
                    else {
                        if (!(8192 >= e[me])) throw new Be(e[me]);
                        if (0 <= Ae[ye].userAgent[de]("Firefox") && ![].reduce) throw new Fe(e[me]);
                        Ue(t, e, n) || ze(t, e, n) || We(e, n) || n()
                    }
            },
            qe = function(t, e, n) {
                var i = l(t + "?" + e);
                i.onload = i.onerror = function() {
                    i.onload = null, i.onerror = null, n()
                }
            },
            ze = function(t, e, n) {
                var i;
                return (i = Ae.XDomainRequest) ? (i = new i, i.open("POST", t), i.onerror = function() {
                    n()
                }, i.onload = n, i[W](e), !0) : !1
            },
            Ue = function(t, e, n) {
                var i = Ae.XMLHttpRequest;
                if (!i) return !1;
                var s = new i;
                return "withCredentials" in s ? (s.open("POST", t, !0), s.withCredentials = !0, s.setRequestHeader("Content-Type", "text/plain"), s.onreadystatechange = function() {
                    4 == s.readyState && (n(), s = null)
                }, s[W](e), !0) : !1
            },
            We = function(t, n) {
                if (!De.body) return He(function() {
                    We(t, n)
                }), !0;
                t = R(t);
                try {
                    var i = De[G]('<iframe name="' + t + '"></iframe>')
                } catch (s) {
                    i = De[G]("iframe"), e(i, t)
                }
                i.height = "0", i.width = "0", i.style.display = "none", i.style.visibility = "hidden";
                var r = De[Q],
                    r = Re() + "/analytics_iframe.html#" + R(r[ne] + "//" + r[J] + "/favicon.ico"),
                    a = function() {
                        i.src = "", i[we] && i[we].removeChild(i)
                    };
                Se(Ae, "beforeunload", a);
                var o = !1,
                    c = 0,
                    l = function() {
                        if (!o) {
                            try {
                                if (c > 9 || i.contentWindow[Q][J] == De[Q][J]) return o = !0, a(), Te(Ae, "beforeunload", a), void n()
                            } catch (t) {}
                            c++, F(l, 200)
                        }
                    };
                return Se(i, "load", l), De.body.appendChild(i), i.src = r, !0
            },
            Ye = function() {
                this.t = []
            };
        Ye[pe].add = function(t) {
            this.t[ae](t)
        }, Ye[pe].D = function(t) {
            try {
                for (var e = 0; e < this.t[me]; e++) {
                    var n = t.get(this.t[e]);
                    n && i(n) && n[$e](Ae, t)
                }
            } catch (s) {}
            e = t.get(gn), e != u && i(e) && (t.set(gn, u, !0), F(e, 10))
        };
        var Ge = function() {
                return N.round(2147483647 * N.random())
            },
            Ve = function() {
                try {
                    var t = new Uint32Array(1);
                    return Ae.crypto.getRandomValues(t), 2147483647 & t[0]
                } catch (e) {
                    return Ge()
                }
            },
            Xe = Ge,
            Je = function() {
                this.data = new Le
            },
            Ke = new Le,
            Qe = [];
        Je[pe].get = function(t) {
            var e = sn(t),
                n = this[z].get(t);
            return e && void 0 == n && (n = i(e[he]) ? e[he]() : e[he]), e && e.n ? e.n(this, t, n) : n
        };
        var Ze = function(t, e) {
                var n = t.get(e);
                return void 0 == n ? "" : "" + n
            },
            tn = function(t, e) {
                var n = t.get(e);
                return void 0 == n || "" === n ? 0 : 1 * n
            };
        Je[pe].set = function(t, e, n) {
            if (t)
                if ("object" == typeof t)
                    for (var i in t) t[Z](i) && en(this, i, t[i], n);
                else en(this, t, e, n)
        };
        var en = function(t, e, n, i) {
                if (void 0 != n) switch (e) {
                    case xi:
                        $s[ce](n)
                }
                var s = sn(e);
                s && s.o ? s.o(t, e, n, i) : t[z].set(e, n, i)
            },
            nn = function(t, n, i, s, r) {
                e(this, t), this.p = n, this.n = s, this.o = r, this.defaultValue = i
            },
            sn = function(t) {
                var e = Ke.get(t);
                if (!e)
                    for (var n = 0; n < Qe[me]; n++) {
                        var i = Qe[n],
                            s = i[0].exec(t);
                        if (s) {
                            e = i[1](s), Ke.set(e[fe], e);
                            break
                        }
                    }
                return e
            },
            rn = function(t) {
                var e;
                return Ke.map(function(n, i) {
                    i.p == t && (e = i)
                }), e && e[fe]
            },
            an = function(t, e, n, i, s) {
                return t = new nn(t, e, n, i, s), Ke.set(t[fe], t), t[fe]
            },
            on = function(t, e) {
                Qe[ae]([new RegExp("^" + t + "$"), e])
            },
            cn = function(t, e, n) {
                return an(t, e, n, void 0, ln)
            },
            ln = function() {},
            un = r(B.GoogleAnalyticsObject) && o(B.GoogleAnalyticsObject) || "ga",
            dn = !1,
            hn = cn("apiVersion", "v"),
            fn = cn("clientVersion", "_v");
        an("anonymizeIp", "aip");
        var mn = an("adSenseId", "a"),
            pn = an("hitType", "t"),
            gn = an("hitCallback"),
            vn = an("hitPayload");
        an("nonInteraction", "ni"), an("currencyCode", "cu");
        var $n = an("useBeacon", void 0, !1);
        an("dataSource", "ds"), an("sessionControl", "sc", ""), an("sessionGroup", "sg"), an("queueTime", "qt");
        var bn = an("_s", "_s");
        an("screenName", "cd");
        var jn = an("location", "dl", ""),
            yn = an("referrer", "dr"),
            wn = an("page", "dp", "");
        an("hostname", "dh");
        var xn = an("language", "ul"),
            kn = an("encoding", "de");
        an("title", "dt", function() {
            return De.title || void 0
        }), on("contentGroup([0-9]+)", function(t) {
            return new nn(t[0], "cg" + t[1])
        });
        var Cn = an("screenColors", "sd"),
            Sn = an("screenResolution", "sr"),
            Tn = an("viewportSize", "vp"),
            Ln = an("javaEnabled", "je"),
            An = an("flashVersion", "fl");
        an("campaignId", "ci"), an("campaignName", "cn"), an("campaignSource", "cs"), an("campaignMedium", "cm"), an("campaignKeyword", "ck"), an("campaignContent", "cc");
        var Dn = an("eventCategory", "ec"),
            _n = an("eventAction", "ea"),
            Hn = an("eventLabel", "el"),
            Pn = an("eventValue", "ev"),
            En = an("socialNetwork", "sn"),
            Mn = an("socialAction", "sa"),
            In = an("socialTarget", "st"),
            On = an("l1", "plt"),
            Rn = an("l2", "pdt"),
            Bn = an("l3", "dns"),
            Fn = an("l4", "rrt"),
            Nn = an("l5", "srt"),
            qn = an("l6", "tcp"),
            zn = an("l7", "dit"),
            Un = an("l8", "clt"),
            Wn = an("timingCategory", "utc"),
            Yn = an("timingVar", "utv"),
            Gn = an("timingLabel", "utl"),
            Vn = an("timingValue", "utt");
        an("appName", "an"), an("appVersion", "av", ""), an("appId", "aid", ""), an("appInstallerId", "aiid", ""), an("exDescription", "exd"), an("exFatal", "exf");
        var Xn = an("expId", "xid"),
            Jn = an("expVar", "xvar"),
            Kn = an("_utma", "_utma"),
            Qn = an("_utmz", "_utmz"),
            Zn = an("_utmht", "_utmht"),
            ti = an("_hc", void 0, 0),
            ei = an("_ti", void 0, 0),
            ni = an("_to", void 0, 20);
        on("dimension([0-9]+)", function(t) {
            return new nn(t[0], "cd" + t[1])
        }), on("metric([0-9]+)", function(t) {
            return new nn(t[0], "cm" + t[1])
        }), an("linkerParam", void 0, void 0, H, ln);
        var ii = an("usage", "_u", void 0, function() {
            return Ce.M()
        }, ln);
        an("forceSSL", void 0, void 0, function() {
            return dn
        }, function(t, e, i) {
            n(34), dn = !!i
        });
        var si = an("_j1", "jid"),
            ri = an("_j2", "gjid");
        on("\\&(.*)", function(t) {
            var e = new nn(t[0], t[1]),
                n = rn(t[0][je](1));
            return n && (e.n = function(t) {
                return t.get(n)
            }, e.o = function(t, e, i, s) {
                t.set(n, i, s)
            }, e.p = void 0), e
        });
        var ai = cn("_oot"),
            oi = an("previewTask"),
            ci = an("checkProtocolTask"),
            li = an("validationTask"),
            ui = an("checkStorageTask"),
            di = an("historyImportTask"),
            hi = an("samplerTask"),
            fi = cn("_rlt"),
            mi = an("buildHitTask"),
            pi = an("sendHitTask"),
            gi = an("ceTask"),
            vi = an("devIdTask"),
            $i = an("timingTask"),
            bi = an("displayFeaturesTask"),
            ji = cn("name"),
            yi = cn("clientId", "cid"),
            wi = an("userId", "uid"),
            xi = cn("trackingId", "tid"),
            ki = cn("cookieName", void 0, "_ga"),
            Ci = cn("cookieDomain"),
            Si = cn("cookiePath", void 0, "/"),
            Ti = cn("cookieExpires", void 0, 63072e3),
            Li = cn("legacyCookieDomain"),
            Ai = cn("legacyHistoryImport", void 0, !0),
            Di = cn("storage", void 0, "cookie"),
            _i = cn("allowLinker", void 0, !1),
            Hi = cn("allowAnchor", void 0, !0),
            Pi = cn("sampleRate", "sf", 100),
            Ei = cn("siteSpeedSampleRate", void 0, 1),
            Mi = cn("alwaysSendReferrer", void 0, !1),
            Ii = an("transportUrl"),
            Oi = an("_r", "_r"),
            Ri = an("_dfr", void 0, 1),
            Bi = function(t) {
                this.V = t, this.fa = void 0, this.$ = !1, this.ha = void 0, this.ea = 1
            },
            Fi = function(t, e, n) {
                if (t.fa && t.$) return 0;
                if (t.$ = !0, e) {
                    if (t.ha && tn(e, t.ha)) return tn(e, t.ha);
                    if (0 == e.get(Ei)) return 0
                }
                return 0 == t.V ? 0 : (void 0 === n && (n = Ve()), 0 == n % t.V ? N.floor(n / t.V) % t.ea + 1 : 0)
            },
            Ni = function(t, e) {
                var n = N.min(tn(t, Ei), 100);
                if (!(O(Ze(t, yi)) % 100 >= n) && (n = {}, qi(n) || zi(n))) {
                    var i = n[On];
                    void 0 == i || 1 / 0 == i || isNaN(i) || (i > 0 ? (Ui(n, Bn), Ui(n, qn), Ui(n, Nn), Ui(n, Rn), Ui(n, Fn), Ui(n, zn), Ui(n, Un), e(n)) : Se(Ae, "load", function() {
                        Ni(t, e)
                    }, !1))
                }
            },
            qi = function(t) {
                var e = Ae.performance || Ae.webkitPerformance,
                    e = e && e.timing;
                if (!e) return !1;
                var n = e.navigationStart;
                return 0 == n ? !1 : (t[On] = e.loadEventStart - n, t[Bn] = e.domainLookupEnd - e.domainLookupStart, t[qn] = e.connectEnd - e.connectStart, t[Nn] = e.responseStart - e.requestStart, t[Rn] = e.responseEnd - e.responseStart, t[Fn] = e.fetchStart - n, t[zn] = e.domInteractive - n, t[Un] = e.domContentLoadedEventStart - n, !0)
            },
            zi = function(t) {
                if (Ae.top != Ae) return !1;
                var e = Ae.external,
                    n = e && e.onloadT;
                return e && !e.isValidLoadTime && (n = void 0), n > 2147483648 && (n = void 0), n > 0 && e.setPageReadyTime(), void 0 == n ? !1 : (t[On] = n, !0)
            },
            Ui = function(t, e) {
                var n = t[e];
                (isNaN(n) || 1 / 0 == n || 0 > n) && (t[e] = void 0)
            },
            Wi = function(t) {
                return function(e) {
                    "pageview" != e.get(pn) || t.I || (t.I = !0, Ni(e, function(e) {
                        t[W]("timing", e)
                    }))
                }
            },
            Yi = !1,
            Gi = function(t) {
                if ("cookie" == Ze(t, Di)) {
                    var e = Ze(t, ki),
                        i = Ji(t),
                        s = ts(Ze(t, Si)),
                        r = Qi(Ze(t, Ci)),
                        a = 1e3 * tn(t, Ti),
                        o = Ze(t, xi);
                    if ("auto" != r) Ee(e, i, s, r, o, a) && (Yi = !0);
                    else {
                        n(32);
                        var c;
                        if (i = [], r = p()[K]("."), 4 != r[me] || (c = r[r[me] - 1], parseInt(c, 10) != c)) {
                            for (c = r[me] - 2; c >= 0; c--) i[ae](r[le](c)[xe]("."));
                            i[ae]("none"), c = i
                        } else c = ["none"];
                        for (var l = 0; l < c[me]; l++)
                            if (r = c[l], t[z].set(Ci, r), i = Ji(t), Ee(e, i, s, r, o, a)) return void(Yi = !0);
                        t[z].set(Ci, "auto")
                    }
                }
            },
            Vi = function(t) {
                if ("cookie" == Ze(t, Di) && !Yi && (Gi(t), !Yi)) throw "abort"
            },
            Xi = function(t) {
                if (t.get(Ai)) {
                    var e = Ze(t, Ci),
                        i = Ze(t, Li) || p(),
                        s = D("__utma", i, e);
                    s && (n(19), t.set(Zn, (new Date)[X](), !0), t.set(Kn, s.R), (e = D("__utmz", i, e)) && s[oe] == e[oe] && t.set(Qn, e.R))
                }
            },
            Ji = function(t) {
                var e = h(Ze(t, yi)),
                    n = Zi(Ze(t, Ci));
                return t = es(Ze(t, Si)), t > 1 && (n += "-" + t), ["GA1", n, e][xe](".")
            },
            Ki = function(t, e, n) {
                for (var i, s = [], r = [], a = 0; a < t[me]; a++) {
                    var o = t[a];
                    o.r[n] == e ? s[ae](o) : void 0 == i || o.r[n] < i ? (r = [o], i = o.r[n]) : o.r[n] == i && r[ae](o)
                }
                return 0 < s[me] ? s : r
            },
            Qi = function(t) {
                return 0 == t[de](".") ? t.substr(1) : t
            },
            Zi = function(t) {
                return Qi(t)[K](".")[me]
            },
            ts = function(t) {
                return t ? (1 < t[me] && t.lastIndexOf("/") == t[me] - 1 && (t = t.substr(0, t[me] - 1)), 0 != t[de]("/") && (t = "/" + t), t) : "/"
            },
            es = function(t) {
                return t = ts(t), "/" == t ? 1 : t[K]("/")[me]
            },
            ns = new RegExp(/^https?:\/\/([^\/:]+)/),
            is = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/,
            ss = function(t) {
                n(48), this.target = t, this.T = !1
            };
        ss[pe].Q = function(e, n) {
            if (e.tagName) {
                if ("a" == e.tagName[ke]()) return void(e[ie] && t(e, rs(this, e[ie], n)));
                if ("form" == e.tagName[ke]()) return as(this, e)
            }
            return "string" == typeof e ? rs(this, e, n) : void 0
        };
        var rs = function(t, e, n) {
                var i = is.exec(e);
                i && 3 <= i[me] && (e = i[1] + (i[3] ? i[2] + i[3] : "")), t = t[ve].get("linkerParam");
                var s = e[de]("?"),
                    i = e[de]("#");
                return n ? e += (-1 == i ? "#" : "&") + t : (n = -1 == s ? "?" : "&", e = -1 == i ? e + (n + t) : e[je](0, i) + n + t + e[je](i)), e
            },
            as = function(t, e) {
                if (e && e[se]) {
                    var n = t[ve].get("linkerParam")[K]("=")[1];
                    if ("get" == e.method[ke]()) {
                        for (var i = e.childNodes || [], s = 0; s < i[me]; s++)
                            if ("_ga" == i[s][fe]) return void i[s][V]("value", n);
                        i = De[G]("input"), i[V]("type", "hidden"), i[V]("name", "_ga"), i[V]("value", n), e.appendChild(i)
                    } else "post" == e.method[ke]() && (e.action = rs(t, e[se]))
                }
            };
        ss[pe].S = function(e, i, s) {
            function r(s) {
                try {
                    s = s || Ae.event;
                    var r;
                    t: {
                        var o = s[ve] || s.srcElement;
                        for (s = 100; o && s > 0;) {
                            if (o[ie] && o.nodeName[U](/^a(?:rea)?$/i)) {
                                r = o;
                                break t
                            }
                            o = o[we], s--
                        }
                        r = {}
                    }("http:" == r[ne] || "https:" == r[ne]) && E(e, r[te] || "") && r[ie] && t(r, rs(a, r[ie], i))
                } catch (c) {
                    n(26)
                }
            }
            var a = this;
            if (this.T || (this.T = !0, Se(De, "mousedown", r, !1), Se(De, "touchstart", r, !1), Se(De, "keyup", r, !1)), s) {
                s = function(t) {
                    if (t = t || Ae.event, (t = t[ve] || t.srcElement) && t[se]) {
                        var n = t[se][U](ns);
                        n && E(e, n[1]) && as(a, t)
                    }
                };
                for (var o = 0; o < De.forms[me]; o++) Se(De.forms[o], "submit", s)
            }
        };
        var os, cs = function(t, e, n, i) {
                this.U = e, this.aa = n, (e = i) || (e = (e = Ze(t, ji)) && "t0" != e ? fs[ce](e) ? "_gat_" + h(Ze(t, xi)) : "_gat_" + h(e) : "_gat"), this.Y = e
            },
            ls = function(t, e) {
                var n = e.get(mi);
                e.set(mi, function(e) {
                    us(t, e);
                    var i = n(e);
                    return ds(t, e), i
                });
                var i = e.get(pi);
                e.set(pi, function(e) {
                    var n = i(e);
                    return hs(t, e), n
                })
            },
            us = function(t, e) {
                e.get(t.U) || ("1" == Pe(t.Y)[0] ? e.set(t.U, "", !0) : e.set(t.U, "" + Xe(), !0))
            },
            ds = function(t, e) {
                e.get(t.U) && Ee(t.Y, "1", e.get(Si), e.get(Ci), e.get(xi), 6e5)
            },
            hs = function(t, e) {
                if (e.get(t.U)) {
                    var n = new Le,
                        i = function(t) {
                            n.set(sn(t).p, e.get(t))
                        };
                    i(hn), i(fn), i(xi), i(yi), i(t.U), i(ii);
                    var s = t.aa;
                    n.map(function(t, e) {
                        s += d(t) + "=" + d("" + e) + "&"
                    }), s += "z=" + Xe(), l(s), e.set(t.U, "", !0)
                }
            },
            fs = /^gtm\d+$/,
            ms = function(t, e) {
                var i = t.b;
                if (!i.get("dcLoaded")) {
                    n(29), Ae._gaq && n(52), e = e || {};
                    var s;
                    e[ki] && (s = h(e[ki])), s = new cs(i, si, "https://stats.g.doubleclick.net/collect?t=dc&aip=1&", s), ls(s, i), i.set("dcLoaded", !0)
                }
            },
            ps = function(t) {
                var e;
                t.get("dcLoaded") || "cookie" != t.get(Di) ? e = !1 : (e = new Bi(tn(t, Ri)), e = Fi(e, null, O(t.get(yi)))), e && (n(51), e = new cs(t, si), us(e, t), ds(e, t), t.get(e.U) && (t.set(Oi, 1, !0), t.set(Ii, Re() + "/r/collect", !0)))
            },
            gs = function(t, e) {
                var i = t.b;
                if (!i.get("_rlsaLoaded")) {
                    if (n(38), e = e || {}, e[ki]) var s = h(e[ki]);
                    s = new cs(i, ri, "https://www.google.com/ads/ga-audiences?t=sr&aip=1&", s), ls(s, i), i.set("_rlsaLoaded", !0), As("displayfeatures", t, e)
                }
            },
            vs = function(t, e, n) {
                if (!os) {
                    var i;
                    i = De[Q][oe];
                    var s = Ae[fe],
                        r = /^#?gaso=([^&]*)/;
                    (s = (i = (i = i && i[U](r) || s && s[U](r)) ? i[1] : Pe("GASO")[0] || "") && i[U](/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i)) && (Ee("GASO", "" + i, n, e, t, 0), B._udo || (B._udo = e), B._utcp || (B._utcp = n), t = s[1], f("https://www.google.com/analytics/web/inpage/pub/inpage.js?" + (t ? "prefix=" + t + "&" : "") + Xe(), "_gasojs")), os = !0
                }
            },
            $s = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/,
            bs = function(t) {
                function e(t, e) {
                    i.b[z].set(t, e)
                }

                function n(t, n) {
                    e(t, n), i.filters.add(t)
                }
                var i = this;
                this.b = new Je, this.filters = new Ye, e(ji, t[ji]), e(xi, o(t[xi])), e(ki, t[ki]), e(Ci, t[Ci] || p()), e(Si, t[Si]), e(Ti, t[Ti]), e(Li, t[Li]), e(Ai, t[Ai]), e(_i, t[_i]), e(Hi, t[Hi]), e(Pi, t[Pi]), e(Ei, t[Ei]), e(Mi, t[Mi]), e(Di, t[Di]), e(wi, t[wi]), e(hn, 1), e(fn, "j30"), n(ai, b), n(oi, k), n(ci, j), n(li, S), n(ui, Vi), n(di, Xi), n(hi, $), n(fi, T), n(gi, x), n(vi, C), n(bi, ps), n(mi, y), n(pi, w), n($i, Wi(this)), js(this.b, t[yi]), ys(this.b), this.b.set(mn, M()), vs(this.b.get(xi), this.b.get(Ci), this.b.get(Si))
            },
            js = function(t, e) {
                if ("cookie" == Ze(t, Di)) {
                    Yi = !1;
                    var i;
                    t: {
                        var s = Pe(Ze(t, ki));
                        if (s && !(1 > s[me])) {
                            i = [];
                            for (var r = 0; r < s[me]; r++) {
                                var a;
                                a = s[r][K](".");
                                var o = a.shift();
                                ("GA1" == o || "1" == o) && 1 < a[me] ? (o = a.shift()[K]("-"), 1 == o[me] && (o[1] = "1"), o[0] *= 1, o[1] *= 1, a = {
                                    r: o,
                                    s: a[xe](".")
                                }) : a = void 0, a && i[ae](a)
                            }
                            if (1 == i[me]) {
                                n(13), i = i[0].s;
                                break t
                            }
                            if (0 != i[me]) {
                                if (n(14), s = Zi(Ze(t, Ci)), i = Ki(i, s, 0), 1 == i[me]) {
                                    i = i[0].s;
                                    break t
                                }
                                s = es(Ze(t, Si)), i = Ki(i, s, 1), i = i[0] && i[0].s;
                                break t
                            }
                            n(12)
                        }
                        i = void 0
                    }
                    i || (i = Ze(t, Ci), s = Ze(t, Li) || p(), i = D("__utma", s, i), (i = void 0 == i ? void 0 : i.O[1] + "." + i.O[2]) && n(10)), i && (t[z].set(yi, i), Yi = !0)
                }
                i = t.get(Hi), (r = (i = De[Q][i ? "href" : "search"][U]("(?:&|#|\\?)" + d("_ga")[q](/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + "=([^&#]*)")) && 2 == i[me] ? i[1] : "") && (t.get(_i) ? (i = r[de]("."), -1 == i ? n(22) : (s = r[je](i + 1), "1" != r[je](0, i) ? n(22) : (i = s[de]("."), -1 == i ? n(22) : (r = s[je](0, i), i = s[je](i + 1), r != P(i, 0) && r != P(i, -1) && r != P(i, -2) ? n(23) : (n(11), t[z].set(yi, i)))))) : n(21)), e && (n(9), t[z].set(yi, d(e))), t.get(yi) || ((i = (i = Ae.gaGlobal && Ae.gaGlobal.vid) && -1 != i[ee](/^(?:utma\.)?\d+\.\d+$/) ? i : void 0) ? (n(17), t[z].set(yi, i)) : (n(8), t[z].set(yi, c()))), Gi(t)
            },
            ys = function(t) {
                var e = Ae[ye],
                    i = Ae.screen,
                    s = De[Q];
                if (t.set(yn, g(t.get(Mi))), s) {
                    var r = s.pathname || "";
                    "/" != r.charAt(0) && (n(31), r = "/" + r), t.set(jn, s[ne] + "//" + s[te] + r + s[ee])
                }
                i && t.set(Sn, i.width + "x" + i.height), i && t.set(Cn, i.colorDepth + "-bit");
                var i = De.documentElement,
                    o = (r = De.body) && r[ge] && r[be],
                    c = [];
                if (i && i[ge] && i[be] && ("CSS1Compat" === De.compatMode || !o) ? c = [i[ge], i[be]] : o && (c = [r[ge], r[be]]), i = 0 >= c[0] || 0 >= c[1] ? "" : c[xe]("x"), t.set(Tn, i), t.set(An, A()), t.set(kn, De.characterSet || De.charset), t.set(Ln, e && "function" == typeof e.javaEnabled && e.javaEnabled() || !1), t.set(xn, (e && (e.language || e.browserLanguage) || "")[ke]()), s && t.get(Hi) && (e = De[Q][oe])) {
                    for (e = e[K](/[?&#]+/), s = [], i = 0; i < e[me]; ++i)(a(e[i], "utm_id") || a(e[i], "utm_campaign") || a(e[i], "utm_source") || a(e[i], "utm_medium") || a(e[i], "utm_term") || a(e[i], "utm_content") || a(e[i], "gclid") || a(e[i], "dclid") || a(e[i], "gclsrc")) && s[ae](e[i]);
                    0 < s[me] && (e = "#" + s[xe]("&"), t.set(jn, t.get(jn) + e))
                }
            };
        bs[pe].get = function(t) {
            return this.b.get(t)
        }, bs[pe].set = function(t, e) {
            this.b.set(t, e)
        };
        var ws = {
            pageview: [wn],
            event: [Dn, _n, Hn, Pn],
            social: [En, Mn, In],
            timing: [Wn, Yn, Vn, Gn]
        };
        bs[pe].send = function() {
            if (!(1 > arguments[me])) {
                var t, e;
                "string" == typeof arguments[0] ? (t = arguments[0], e = [][le][$e](arguments, 1)) : (t = arguments[0] && arguments[0][pn], e = arguments), t && (e = v(ws[t] || [], e), e[pn] = t, this.b.set(e, void 0, !0), this.filters.D(this.b), this.b[z].m = {}, n(44))
            }
        };
        var xs, ks, Cs, Ss = function(t) {
                return "prerender" == De.visibilityState ? !1 : (t(), !0)
            },
            Ts = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/,
            Ls = function(t) {
                if (i(t[0])) this.u = t[0];
                else {
                    var e = Ts.exec(t[0]);
                    if (null != e && 4 == e[me] && (this.c = e[1] || "t0", this.e = e[2] || "", this.d = e[3], this.a = [][le][$e](t, 1), this.e || (this.A = "create" == this.d, this.i = "require" == this.d, this.g = "provide" == this.d, this.ba = "remove" == this.d), this.i && (3 <= this.a[me] ? (this.X = this.a[1], this.W = this.a[2]) : this.a[1] && (r(this.a[1]) ? this.X = this.a[1] : this.W = this.a[1]))), e = t[1], t = t[2], !this.d) throw "abort";
                    if (this.i && (!r(e) || "" == e)) throw "abort";
                    if (this.g && (!r(e) || "" == e || !i(t))) throw "abort";
                    if (I(this.c) || I(this.e)) throw "abort";
                    if (this.g && "t0" != this.c) throw "abort"
                }
            };
        xs = new Le, Cs = new Le, ks = {
            ec: 45,
            ecommerce: 46,
            linkid: 47
        };
        var As = function(t, e, s) {
                e == Hs ? n(35) : e.get(ji);
                var r = xs.get(t);
                return i(r) ? (e.plugins_ = e.plugins_ || new Le, e.plugins_.get(t) ? !0 : (e.plugins_.set(t, new r(e, s || {})), !0)) : !1
            },
            Ds = function(e) {
                function n(t) {
                    var e = (t[te] || "")[K](":")[0][ke](),
                        n = (t[ne] || "")[ke](),
                        n = 1 * t[Y] || ("http:" == n ? 80 : "https:" == n ? 443 : "");
                    return t = t.pathname || "", a(t, "/") || (t = "/" + t), [e, "" + n, t]
                }
                var i = De[G]("a");
                t(i, De[Q][ie]);
                var s = (i[ne] || "")[ke](),
                    r = n(i),
                    o = i[ee] || "",
                    c = s + "//" + r[0] + (r[1] ? ":" + r[1] : "");
                return a(e, "//") ? e = s + e : a(e, "/") ? e = c + e : !e || a(e, "?") ? e = c + r[2] + (e || o) : 0 > e[K]("/")[0][de](":") && (e = c + r[2][je](0, r[2].lastIndexOf("/")) + "/" + e), t(i, e), s = n(i), {
                    protocol: (i[ne] || "")[ke](),
                    host: s[0],
                    port: s[1],
                    path: s[2],
                    G: i[ee] || "",
                    url: e || ""
                }
            },
            _s = {
                ga: function() {
                    _s.f = []
                }
            };
        _s.ga(), _s.D = function() {
            var t = _s.J[re](_s, arguments),
                t = _s.f.concat(t);
            for (_s.f = []; 0 < t[me] && !_s.v(t[0]) && (t.shift(), !(0 < _s.f[me])););
            _s.f = _s.f.concat(t)
        }, _s.J = function() {
            for (var t = [], e = 0; e < arguments[me]; e++) try {
                var s = new Ls(arguments[e]);
                if (s.g) xs.set(s.a[0], s.a[1]);
                else {
                    if (s.i) {
                        var r = s,
                            o = r.a[0];
                        if (!i(xs.get(o)) && !Cs.get(o)) {
                            ks[Z](o) && n(ks[o]);
                            var c = r.X;
                            if (!c && ks[Z](o) ? (n(39), c = o + ".js") : n(43), c) {
                                c && 0 <= c[de]("/") || (c = m() + "//www.google-analytics.com/plugins/ua/" + c);
                                var l, u = Ds(c),
                                    r = void 0,
                                    d = u[ne],
                                    h = De[Q][ne],
                                    r = "https:" == d || d == h ? !0 : "http:" != d ? !1 : "http:" == h;
                                if (l = r) {
                                    var r = u,
                                        p = Ds(De[Q][ie]);
                                    if (r.G || 0 <= r.url[de]("?") || 0 <= r.path[de]("://")) l = !1;
                                    else if (r[J] == p[J] && r[Y] == p[Y]) l = !0;
                                    else {
                                        var g = "http:" == r[ne] ? 80 : 443;
                                        l = "www.google-analytics.com" == r[J] && (r[Y] || g) == g && a(r.path, "/plugins/") ? !0 : !1
                                    }
                                }
                                l && (f(u.url), Cs.set(o, !0))
                            }
                        }
                    }
                    t[ae](s)
                }
            } catch (v) {}
            return t
        }, _s.v = function(t) {
            try {
                if (t.u) t.u[$e](Ae, Hs.j("t0"));
                else {
                    var e = t.c == un ? Hs : Hs.j(t.c);
                    if (t.A) "t0" == t.c && Hs.create[re](Hs, t.a);
                    else if (t.ba) Hs.remove(t.c);
                    else if (e)
                        if (t.i) {
                            if (!As(t.a[0], e, t.W)) return !0
                        } else if (t.e) {
                        var n = t.d,
                            i = t.a,
                            s = e.plugins_.get(t.e);
                        s[n][re](s, i)
                    } else e[t.d][re](e, t.a)
                }
            } catch (r) {}
        };
        var Hs = function() {
            n(1), _s.D[re](_s, [arguments])
        };
        Hs.h = {}, Hs.P = [], Hs.L = 0, Hs.answer = 42;
        var Ps = [xi, Ci, ji];
        Hs.create = function() {
                var t = v(Ps, [][le][$e](arguments));
                t[ji] || (t[ji] = "t0");
                var e = "" + t[ji];
                return Hs.h[e] ? Hs.h[e] : (t = new bs(t), Hs.h[e] = t, Hs.P[ae](t), t)
            }, Hs.remove = function(t) {
                for (var e = 0; e < Hs.P[me]; e++)
                    if (Hs.P[e].get(ji) == t) {
                        Hs.P.splice(e, 1), Hs.h[t] = null;
                        break
                    }
            }, Hs.j = function(t) {
                return Hs.h[t]
            }, Hs.K = function() {
                return Hs.P[le](0)
            }, Hs.N = function() {
                "ga" != un && n(49);
                var t = Ae[un];
                if (!t || 42 != t.answer) {
                    Hs.L = t && t.l, Hs.loaded = !0;
                    var e = Ae[un] = Hs;
                    L("create", e, e.create, 3), L("remove", e, e.remove), L("getByName", e, e.j, 5), L("getAll", e, e.K, 6), e = bs[pe], L("get", e, e.get, 7), L("set", e, e.set, 4), L("send", e, e[W], 2), e = Je[pe], L("get", e, e.get), L("set", e, e.set), (Ae.gaplugins = Ae.gaplugins || {}).Linker = ss, e = ss[pe], xs.set("linker", ss), L("decorate", e, e.Q, 20), L("autoLink", e, e.S, 25), xs.set("displayfeatures", ms), xs.set("adfeatures", gs), t = t && t.q, s(t) ? _s.D[re](Hs, t) : n(50)
                }
            },
            function() {
                var t = Hs.N;
                if (!Ss(t)) {
                    n(16);
                    var e = !1,
                        i = function() {
                            !e && Ss(t) && (e = !0, Te(De, "visibilitychange", i))
                        };
                    Se(De, "visibilitychange", i)
                }
            }()
    }(window),
    function() {
        var t, e, n, i;
        window.GoogleAnalyticsObject = "ga", null == window.ga && (window.ga = function() {
                var t;
                return null == (t = window.ga).q && (t.q = []), window.ga.q.push(arguments)
            }), window.ga.l = Date.now(), t = function() {
                var t;
                return t = $("meta[name=analytics-location]"), t.length ? t.last()[0].content : window.location.pathname + window.location.search
            }, e = function() {
                return $("meta[name=analytics-location]").length ? document.title.replace(/([\w-]+\/)+[\w\.-]+/g, "private/private") : document.title
            }, n = function() {
                var n;
                return n = window.location.protocol + "//" + window.location.host + t(), window.ga("set", "title", e()), window.ga("set", "location", n)
            }, i = function() {
                var i;
                return n(), i = {
                    title: e(),
                    path: t()
                }, i.dimension1 = $(document.body).hasClass("logged_in") ? "Logged In" : "Logged Out", window.ga("send", "pageview", i)
            },
            function() {
                var t;
                if (t = $("meta[name=google-analytics]")[0]) return window.ga("create", t.content, "github.com"), n()
            }(), $(i), $(document).on("pjax:complete", function() {
                return setTimeout(i, 20)
            })
    }.call(this),
    function() {
        $(document).on("submit", ".js-user-recommendations-form", function() {
            var t;
            return t = $(".js-user-interests-input").val(), window.ga("send", "event", "Recommendations", "submit", "Interest entered : " + t)
        }), $(document).on("click", ".js-interest-option", function() {
            var t;
            return t = $(this).text(), window.ga("send", "event", "Recommendations", "click", "Example Interest clicked : " + t)
        }), $(document).on("submit", ".js-remove-user-interest-form", function() {
            var t;
            return t = this.querySelector('input[name="interest"]').value, window.ga("send", "event", "Recommendations", "click", "Interest removed : " + t)
        }), $(document).on("submit", ".recommendations-wrapper .js-unfollow-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Unfollowed a User suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-follow-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Followed a User suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-unstar-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Unstarred a Repo suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-star-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Starred a Repo suggestion")
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-form-signup-home").one("input", "input[type=text]", function() {
                return window.ga("send", "event", "Signup", "Attempt", "Homepage Form")
            }), $(".js-form-signup-detail").one("input", "input[type=text]", function() {
                return window.ga("send", "event", "Signup", "Attempt", "Detail Form")
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f = [].slice;
        n = {
            originalHistoryState: JSON.stringify(window.history.state)
        }, e = [], c = (new Date).getTime(), h = !1, a = function() {
            h = !0
        }, r = function() {
            h = !1
        }, $(window).on("pageshow", r), $(window).on("pagehide", a), $(window).on("error", function(t) {
            var i, r, a, l, d, h;
            h = t.originalEvent, d = h.message, a = h.filename, l = h.lineno, r = h.error, i = $.extend.apply($, [{}, n].concat(f.call(e), [{
                message: d,
                filename: a,
                lineno: l,
                url: window.location.href,
                readyState: document.readyState,
                referrer: document.referrer,
                stack: null != r ? r.stack : void 0,
                historyState: JSON.stringify(window.history.state),
                timeSinceLoad: Math.round((new Date).getTime() - c),
                extensionScripts: JSON.stringify(s().sort()),
                navigations: JSON.stringify(o())
            }], [null != r ? r.failbotContext : void 0])), e = [], null != i.eventTarget && (i.eventTarget = $(i.eventTarget).inspect()), $(document).trigger("captured:error", i), u(t) && $.ajax({
                type: "POST",
                url: "/_errors",
                data: {
                    error: i
                }
            })
        }), u = function() {
            var t;
            return t = 0,
                function(e) {
                    var n, i, s;
                    return s = e.originalEvent, i = s.lineno, n = s.error, null != (null != n ? n.stack : void 0) && i ? h ? !1 : t >= 10 ? !1 : (t++, !0) : !1
                }
        }(), s = function() {
            var t, e, n, i, s;
            for (i = $("script"), s = [], e = 0, n = i.length; n > e; e++) t = i[e], /^(?:chrome-extension|file):/.test(t.src) && s.push(t.src);
            return s
        }, i = jQuery.event.dispatch, jQuery.event.dispatch = function(t) {
            var n;
            return "error" === t.type && t.target === window ? i.apply(this, arguments) : (e.push({
                eventType: t.type,
                eventTarget: t.target
            }), n = i.apply(this, arguments), e.pop(), n)
        }, l = function(t, e) {
            var n;
            return n = o(), n.push({
                type: t,
                url: window.location.href,
                state: window.history.state,
                info: e
            }), d(n)
        }, t = "navigations", o = function() {
            var e;
            return e = function() {
                try {
                    return sessionStorage.getItem(t)
                } catch (e) {}
            }(), e ? JSON.parse(e) : []
        }, d = function(e) {
            try {
                return sessionStorage.setItem(t, JSON.stringify(e))
            } catch (n) {}
        }, l("load"), $(window).on("hashchange", function(t) {
            return l("hashchange", {
                oldURL: t.oldURL,
                newURL: t.newURL
            })
        }), $(window).on("popstate", function(t) {
            return l("popstate", {
                eventState: t.state
            })
        }), $(document).on("pjax:success", function() {
            return l("pjax:success")
        }), $(document).on("pjax:popstate", function(t) {
            return l("pjax:popstate", {
                pjaxDirection: t.direction,
                pjaxState: t.state
            })
        }), "#b00m" === window.location.hash && b00m()
    }.call(this),
    function() {
        $(document).on("click", ".email-hidden-toggle > a", function() {
            return $(this).parent().siblings(".email-hidden-reply").toggle(), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r;
        i = function(t) {
            var e, n, i, s, r;
            r = t.trim().split(/\s*,\s*/), n = r[0], e = r[1], i = r[2], s = r[3], s ? window.ga("send", "event", n, e, i, s, {
                useBeacon: !0
            }) : window.ga("send", "event", n, e, i, {
                useBeacon: !0
            })
        }, e = function(t) {
            var e;
            e = $(t.target).closest("[data-ga-click]").attr("data-ga-click"), e && i(e)
        }, r = new WeakMap, n = function() {
            var t, e, n, s;
            for (e = $("[data-ga-load]"), n = 0, s = e.length; s > n; n++) t = e[n], r.get(t) || (r.set(t, !0), i(t.getAttribute("data-ga-load")))
        }, s = function() {
            var t, e, n, s, a;
            for (e = $("meta[name=analytics-event]"), a = [], n = 0, s = e.length; s > n; n++) t = e[n], r.get(t) || (r.set(t, !0), a.push(i(t.content)));
            return a
        }, t = function() {
            return s(), n()
        }, $(t), $(document).on("pjax:complete", function() {
            return setTimeout(t, 20)
        }), window.addEventListener("click", e, !0)
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e, n, i, s, r, a, o, c, l, u;
            n = $(this), c = n.attr("data-url"), a = n.attr("data-search-url"), s = {
                top: 5,
                right: 0,
                bottom: 15,
                left: 0
            }, u = n.width() - s.left - s.right, i = n.height() - s.top - s.bottom, e = d3.time.format("%Y-%m-%d"), o = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                return "<strong>" + t.count + "</strong> " + $.pluralize(t.count, "event")
            }), l = d3.select(n.get(0)).append("svg").attr("width", u + s.left + s.right).attr("height", i + s.top + s.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + s.left + ", " + s.top + ")").call(o), r = function() {
                l.remove(), $(".js-auth-info").remove(), n.append("div").attr("class", "inline-error").text("We couldn't render audit log activity for some reason. Try refreshing the page.")
            }, t = function(t) {
                var e;
                return e = {}, t.forEach(function(t) {
                    var n, i;
                    return t.date = n = new Date(1e3 * t.time), i = n.toDateString(), e.hasOwnProperty(i) ? e[i].count += t.count : e[i] = t
                }), d3.map(e).values()
            }, d3.json(c, function(n, s) {
                var c, d, h, f, m;
                return null != n ? r() : (s = t(s), d = d3.max(s, function(t) {
                    return t.count
                }), h = d3.sum(s, function(t) {
                    return t.count
                }), f = d3.scale.ordinal().domain(d3.range(s.length)).rangeRoundBands([0, u], .1), m = d3.scale.linear().domain([0, d]).range([i, 0]), c = l.selectAll(".audit-day").data(s).enter().append("g").attr("class", "audit-day").attr("transform", function(t, e) {
                    return "translate(" + f(e) + ", 0)"
                }), c.append("rect").attr("width", f.rangeBand()).attr("height", 1).attr("y", i - 1).attr("class", "bar-base"), c.append("a").attr("xlink:href", function(t) {
                    return "" + a + "?q=created:" + e(t.date)
                }).append("rect").attr("width", f.rangeBand()).attr("height", function(t) {
                    return "" + (i - m(t.count))
                }).attr("y", function(t) {
                    return m(t.count)
                }).on("mouseover", o.show).on("mouseout", o.hide), c.append("text").attr("y", i + 15).attr("x", f.rangeBand() / 2).text(function(t) {
                    return d3.time.format("%a")(t.date).slice(0, 2)
                }), d3.select(".js-auth-info").html("<span class='sum'>" + h + "</span> " + $.pluralize(h, "event") + " happened in the past two weeks."))
            })
        }, d3Ready().then(function() {
            return $.observe(".js-audit-activity", t)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-new-user-contrib-example", function(t) {
            var e, n, i;
            return t.preventDefault(), e = document.querySelector(".js-calendar-graph"), e.classList.contains("sample-graph") ? void 0 : (e.classList.add("sample-graph"), n = function(t) {
                var n;
                return n = e.querySelector(".js-calendar-graph-svg"), $(n).replaceWith(t)
            }, i = function() {
                return e.classList.remove("sample-graph")
            }, $.fetchText(this.getAttribute("href")).then(n, i))
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-graph-code-frequency", function(t, e) {
            var n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y;
            return p = $(this).width(), r = 500, y = [10, 10, 20, 40], d = y[0], u = y[1], c = y[2], l = y[3], e = e.map(function(t) {
                return [new Date(1e3 * t[0]), t[1], t[2]]
            }).sort(function(t, e) {
                return d3.ascending(t[0], e[0])
            }), n = e.map(function(t) {
                return [t[0], t[1]]
            }), s = e.map(function(t) {
                return [t[0], t[2]]
            }), a = d3.max(n, function(t) {
                return t[1]
            }), o = d3.min(s, function(t) {
                return t[1]
            }), m = e[0][0], f = e[e.length - 1][0], g = d3.time.scale().domain([m, f]).range([0, p - l - u]), b = d3.scale.linear().domain([o, a]).range([r - c - d, 0]), v = d3.svg.axis().scale(g).tickFormat(function(t) {
                return m.getFullYear() !== f.getFullYear() ? d3.time.format("%m/%y")(t) : d3.time.format("%m/%d")(t)
            }), j = d3.svg.axis().scale(b).orient("left").tickPadding(5).tickSize(p).tickFormat(function(t) {
                return d3.formatSymbol(t, !0)
            }), i = d3.svg.area().x(function(t) {
                return g(t[0])
            }).y0(function(t) {
                return b(t[1])
            }).y1(function() {
                return b(0)
            }), h = d3.select(this).data(e).append("svg").attr("width", p).attr("height", r).attr("class", "viz code-frequency").append("g").attr("transform", "translate(" + l + "," + d + ")"), h.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (r - d - c) + ")").call(v), h.append("g").attr("class", "y axis").attr("transform", "translate(" + p + ", 0)").call(j), h.selectAll("path.area").data([n, s]).enter().append("path").attr("class", function(t, e) {
                return 0 === e ? "addition" : "deletion"
            }).attr("d", i)
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-commit-activity-graph", function(t, e) {
            var n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x, k;
            return c = $("#commit-activity-master"), i = $("#commit-activity-detail"), a = 260, v = i.width(), b = 0, p = null,
                function() {
                    var t, n, r, o, c, l, u, d, h, f, m, g, j, y, w, x, k, C, S, T;
                    for (l = 0, c = C = 0, S = e.length; S > C; c = ++C) t = e[c], 0 !== t.total && (l = c);
                    return b = l, T = [20, 30, 30, 40], m = T[0], h = T[1], f = T[2], d = T[3], r = e[b].days, u = d3.max(e, function(t) {
                        return d3.max(t.days)
                    }), y = d3.scale.linear().domain([0, r.length - 1]).range([0, v - h - f]), x = d3.scale.linear().domain([0, u]).range([a, 0]), k = d3.svg.axis().scale(x).orient("left").ticks(5).tickSize(-v + f + h), $(this).on("hotkey:activate", function(t) {
                        var n, i;
                        return i = b, n = t.originalEvent.hotkey, "left" === n || "right" === n ? (b > 0 && "left" === n && (i -= 1), b < e.length && "right" === n && (i += 1), p({
                            index: i
                        })) : void 0
                    }), j = d3.select(i[0]).data([r]).append("svg").attr("width", v).attr("height", a + m + d).attr("class", "viz").append("g").attr("transform", "translate(" + h + "," + m + ")"), j.append("g").attr("class", "y axis").call(k), w = j.append("g").attr("class", "axis"), n = w.selectAll(".day").data(d3.weekdays).enter().append("g").attr("class", "day").attr("transform", function(t, e) {
                        return "translate(" + y(e) + ", " + a + ")"
                    }), n.append("text").attr("text-anchor", "middle").attr("dy", "2em").text(function(t) {
                        return t
                    }), g = d3.svg.line().x(function(t, e) {
                        return y(e)
                    }).y(x), j.append("path").attr("class", "path").attr("d", g), o = j.selectAll("g.dot").data(r).enter().append("g").attr("class", "dot").attr("transform", function(t, e) {
                        return "translate(" + y(e) + ", " + x(t) + ")"
                    }), o.append("circle").attr("r", 4), o.append("text").attr("text-anchor", "middle").attr("class", "tip").attr("dy", -10).text(function(t) {
                        return t
                    }), p = function(t) {
                        var n, i, a;
                        if (!(t.index >= 52 || t.index < 0)) return b = t.index, r = e[t.index].days, u = d3.max(r), y.domain([0, r.length - 1]), a = d3.selectAll(".bar.mini").attr("class", "bar mini"), n = d3.select(a[0][b]).attr("class", "bar mini active"), i = d3.transform(n.attr("transform")), s.transition().ease("back-out").duration(300).attr("transform", "translate(" + (i.translate[0] + 8) + ", 105)"), j.selectAll(".path").data([r]).transition().duration(500).attr("d", g), j.selectAll("g.dot").data(r).transition().duration(300).attr("transform", function(t, e) {
                            return "translate(" + y(e) + ", " + x(t) + ")"
                        }), j.selectAll("text.tip").data(r).text(function(t) {
                            return t
                        })
                    }
                }(), k = [10, 30, 20, 30], h = k[0], u = k[1], d = k[2], l = k[3], a = 100, m = e.map(function(t) {
                    return t.total
                }), o = d3.max(m), r = d3.time.format.utc("%m/%d"), j = d3.scale.ordinal().domain(d3.range(m.length)).rangeRoundBands([0, v - u - d], .1), w = d3.scale.linear().domain([0, o]).range([a, 0]), x = d3.svg.axis().scale(w).orient("left").ticks(3).tickSize(-v + u + d).tickFormat(d3.formatSymbol), y = d3.svg.axis().scale(j).ticks(d3.time.weeks).tickFormat(function(t, n) {
                    var i;
                    return i = new Date(1e3 * e[n].week), r(i)
                }), f = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t, n) {
                    var i, s;
                    return i = new Date(1e3 * e[n].week), s = "" + d3.months[i.getUTCMonth()].slice(0, 3) + " " + i.getUTCDate(), "<strong>" + t + "</strong> " + $.pluralize(t, "commit") + " the week of " + s
                }), g = d3.select(c[0]).style("width", "" + v + "px").append("svg").attr("width", v + (u + d)).attr("height", a + h + l).attr("class", "viz").append("g").attr("transform", "translate(" + u + "," + h + ")").call(f), g.append("g").attr("class", "y axis").call(x), n = g.selectAll("g.mini").data(m).enter().append("g").attr("class", function(t, e) {
                    return e === b ? "bar mini active" : "bar mini"
                }).attr("transform", function(t, e) {
                    return "translate(" + j(e) + ", 0)"
                }).on("click", function(t, e) {
                    return p({
                        node: this,
                        index: e,
                        data: t
                    })
                }), n.append("rect").attr("width", j.rangeBand()).attr("height", function(t) {
                    return a - w(t)
                }).attr("y", function(t) {
                    return w(t)
                }).on("mouseover", f.show).on("mouseout", f.hide), g.append("g").attr("class", "x axis").attr("transform", "translate(0," + a + ")").call(y).selectAll(".tick").style("display", function(t, e) {
                    return e % 3 !== 0 ? "none" : "block"
                }), s = g.append("circle").attr("class", "focus").attr("r", 8).attr("transform", "translate(" + (j(b) + j.rangeBand() / 2) + ", " + -a + ")"), s.transition().ease("elastic-in").duration(1e3).attr("r", 2).attr("transform", "translate(" + (j(b) + j.rangeBand() / 2) + ", " + (a + 5) + ")")
        })
    }.call(this),
    function() {
        var t, e, n, i;
        n = function() {
            var t, e, n, i, s, r, a, o;
            for (n = {}, a = document.location.search.substr(1).split("&"), s = 0, r = a.length; r > s; s++) e = a[s], o = e.split("="), t = o[0], i = o[1], n[t] = i;
            return n
        }, t = function(t) {
            return t = new Date(t), d3.months[t.getUTCMonth()].slice(0, 3) + " " + t.getUTCDate() + ", " + t.getUTCFullYear()
        }, i = function(e, n) {
            var i, s;
            return s = t(e), i = t(n), $(".js-date-range").html("" + s + " &ndash; " + i)
        }, e = function(t) {
            var e, n;
            return e = t[0].weeks[0].date, n = new Date(e.getTime() - 6048e5), t.forEach(function(t) {
                return t.weeks.unshift({
                    a: 0,
                    c: 0,
                    d: 0,
                    date: n,
                    w: n / 1e3
                })
            })
        }, $(document).on("graph:load", "#contributors", function(t, s) {
            var r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x, k;
            return a = $(this), o = [], f = n(), k = null, x = null, null != f.from && (j = new Date(f.from)), null != f.to && (l = new Date(f.to)), c = (null != f ? f.type : void 0) || "c", d = d3.time.format.utc("%Y-%m-%d"), m = function(t) {
                return new Date(1e3 * ~~t)
            }, a.on("range.selection.end", function(t, e) {
                var n;
                return n = e.range, j = n[0], l = n[1], d(j) === d(l) && (j = k, l = x), w(), i(j, l), v()
            }), g = function(t) {
                var n, s;
                return 1 === t[0].weeks.length && e(t), s = r(t), k = m(s[0].key), x = m(~~s[s.length - 1].key + 518400), n = new Date, x > n && (x = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()))), null == j && (j = k), null == l && (l = x), i(j, l), b(s, k, x), v(t, k, x), $(".js-contribution-container").on("change", "input[type=radio]", h)
            }, p = function(t) {
                var e, n, i, s, r, a, o;
                for (i = 0, r = t.length; r > i; i++)
                    for (e = t[i], o = e.weeks, s = 0, a = o.length; a > s; s++) n = o[s], n.date = new Date(1e3 * n.w);
                return t
            }, u = function(t, e) {
                return t.map(function(t) {
                    var n;
                    return n = $.extend(!0, {}, t), n.weeks = n.weeks.filter(function(t) {
                        return t.date >= e[0] && t.date <= e[1]
                    }), n
                })
            }, r = function(t) {
                var e, n, i, s, r, a, o, c, l;
                for (n = {}, s = 0, a = t.length; a > s; s++)
                    for (e = t[s], l = e.weeks, r = 0, o = l.length; o > r; r++) i = l[r], null == n[c = i.w] && (n[c] = {
                        c: 0,
                        a: 0,
                        d: 0
                    }), n[i.w].c += i.c, n[i.w].a += i.a, n[i.w].d += i.d;
                return d3.entries(n)
            }, y = function(t) {
                return t = u(t, [j, l]), t.forEach(function(t) {
                    var e, n, i, s, r, a, o;
                    for (n = 0, e = 0, i = 0, o = t.weeks, r = 0, a = o.length; a > r; r++) s = o[r], n += s.c, e += s.a, i += s.d;
                    return t.c = n, t.a = e, t.d = i
                }), t.sort(function(t, e) {
                    return d3.descending(t[c], e[c])
                })
            }, b = function(t, e, n) {
                var i, s, r, o, u, h, f, p, g, v, $, b, y, w, x, k, C, S;
                return S = [20, 50, 20, 30], p = S[0], h = S[1], f = S[2], u = S[3], y = a.width(), r = 125, o = d3.max(t, function(t) {
                    return t.value[c]
                }), w = d3.time.scale().domain([e, n]).range([0, y - h - f]), k = d3.scale.linear().domain([0, o]).range([r, 0]), C = d3.svg.axis().scale(k).orient("left").ticks(4).tickSize(-y + h + f).tickPadding(10).tickFormat(d3.formatSymbol), x = d3.svg.axis().scale(w), t.length < 5 && x.ticks(t.length), i = d3.svg.area().interpolate("basis").x(function(t) {
                    return w(m(t.key))
                }).y0(function() {
                    return r
                }).y1(function(t) {
                    return k(t.value[c])
                }), d3.select("#contributors-master svg").remove(), b = d3.select("#contributors-master").data([t]).append("svg").attr("height", r + p + u).attr("width", y).attr("class", "viz").append("g").attr("transform", "translate(" + h + "," + p + ")"), b.append("g").attr("class", "x axis").attr("transform", "translate(0, " + r + ")").call(x), b.append("g").attr("class", "y axis").call(C), b.append("path").attr("class", "area").attr("d", i), $ = function() {
                    var t;
                    return b.classed("selecting", !0), t = d3.event.target.extent(), a.trigger("range.selection.start", {
                        data: arguments[0],
                        range: t
                    })
                }, g = function() {
                    var t;
                    return t = d3.event.target.extent(), a.trigger("range.selection.selected", {
                        data: arguments[0],
                        range: t
                    })
                }, v = function() {
                    var t;
                    return b.classed("selecting", !d3.event.target.empty()), t = d3.event.target.extent(), a.trigger("range.selection.end", {
                        data: arguments[0],
                        range: t
                    })
                }, s = d3.svg.brush().x(w).on("brushstart", $).on("brush", g).on("brushend", v), (d(j) !== d(e) || d(l) !== d(n)) && s.extent([j, l]), b.append("g").attr("class", "selection").call(s).selectAll("rect").attr("height", r)
            }, v = function() {
                var t, e, n, i, r, a, u, d, h, f, m, p, g, v, b, w, x, k, C, S, T, L;
                return L = [10, 10, 10, 20], f = L[0], d = L[1], h = L[2], u = L[3], w = 428, n = 100, $("#contributors ol").remove(), s = y(o), g = document.createElement("ol"), b = d3.select(g).attr("class", "contrib-data capped-cards clearfix"), r = d3.max(s, function(t) {
                    return d3.max(t.weeks, function(t) {
                        return t[c]
                    })
                }), x = d3.time.scale().domain([j, l]).range([0, w]), C = d3.scale.linear().domain([0, r]).range([n - u - f, 0]), e = d3.svg.area().interpolate("basis").x(function(t) {
                    return x(t.date)
                }).y0(function() {
                    return n - u - f
                }).y1(function(t) {
                    return C(t[c])
                }), S = d3.svg.axis().scale(C).orient("left").ticks(2).tickSize(-w).tickPadding(10).tickFormat(d3.formatSymbol), k = d3.svg.axis().scale(x), s[0].weeks.length < 5 && k.ticks(s[0].weeks.length).tickFormat(d3.time.format("%x")), $("li.capped-card").remove(), m = b.selectAll("li.capped-card").data(s).enter().append("li").attr("class", "capped-card").style("display", function(t) {
                    return t[c] < 1 ? "none" : "block"
                }), i = m.append("h3"), i.append("img").attr("src", function(t) {
                    return t.author.avatar
                }).attr("class", "avatar").attr("alt", ""), i.append("span").attr("class", "rank").text(function(t, e) {
                    return "#" + (e + 1)
                }), i.append("a").attr("class", "aname").attr("href", function(t) {
                    return "/" + t.author.login
                }).text(function(t) {
                    return t.author.login
                }), t = i.append("span").attr("class", "ameta"), p = $(".graphs").attr("data-repo-url"), t.append("span").attr("class", "cmeta").html(function(t) {
                    var e, n, i, s, r, a;
                    return e = "" + p + "/commits?author=" + t.author.login, a = "" + $.commafy(t.c) + " " + $.pluralize(t.c, "commit"), r = $("<a>", {
                        href: e,
                        "class": "cmt",
                        text: a
                    }), i = $("<span>", {
                        "class": "a",
                        text: "" + $.commafy(t.a) + " ++"
                    }), s = $("<span>", {
                        "class": "d",
                        text: "" + $.commafy(t.d) + " --"
                    }), n = " / ", $("<div>").append([r, n, i, n, s]).html()
                }), v = m.append("svg").attr("width", w + (d + h)).attr("height", n + f + u).attr("class", "capped-card-content").append("g").attr("transform", "translate(" + d + "," + f + ")"), a = k.ticks()[0], v.append("g").attr("class", "x axis").classed("dense", a >= 10).attr("transform", "translate(0, " + (n - f - u) + ")").call(k).selectAll(".tick text").style("display", function(t, e) {
                    return e % 2 !== 0 ? "none" : "block"
                }), v.select(".x.dense text").attr("dx", 7), T = v.append("g").attr("class", "y axis").call(S).selectAll(".y.axis g text").attr("dx", w / 2).style("display", function(t, e) {
                    return 0 === e ? "none" : "block"
                }).classed("midlabel", !0), v.append("path").attr("d", function(t) {
                    return e(t.weeks)
                }), document.querySelector("#contributors").appendChild(g)
            }, w = function() {
                var t, e;
                return $.support.pjax ? (t = document.location, c = $("input[name=ctype]:checked").prop("value").toLowerCase(), e = "" + t.pathname + "?from=" + d(j) + "&to=" + d(l) + "&type=" + c, window.history.pushState(null, null, e)) : void 0
            }, h = function() {
                return c !== $(this).val() ? (w(), g(o)) : void 0
            }, o = p(s), g(s)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o;
        i = function(t) {
            var e;
            return (e = d3.format(","))(t)
        }, n = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 40
        }, o = 980 - n.left - n.right, e = 150 - n.top - n.bottom, t = function(t) {
            return "<div class='blankslate'> <span class='mega-octicon octicon-graph'></span> <h3>No activity so far this " + t + "</h3> </div>"
        }, a = function(t) {
            var e;
            return e = 0 > t ? "octicon-arrow-down" : t > 0 ? "octicon-arrow-up" : "", "<span class='totals-num'> <span class='octicon " + e + "'></span> " + i(Math.abs(t)) + " change </span>"
        }, s = function(t) {
            var e, n;
            return e = 0 > t ? "octicon-arrow-down" : t > 0 ? "octicon-arrow-up" : "", n = 0 > t ? "decrease" : "increase", "<span class='totals-num'> <span class='octicon " + e + "'></span> " + i(Math.abs(t)) + "% " + n + " </span>"
        }, r = function(r, c) {
            var l, u, d, h, f, m, p, g, v, b, j, y, w, x, k, C, S, T, L, A, D, _, H, P, E, M, I, O;
            if (c && null == c.error) {
                for (f = c.counts, h = c.summary.columns, k = new Date(1e3 * c.summary.starting), p = new Date(1e3 * c.summary.ending), y = c.summary.model, w = c.summary.period, j = d3.max(d3.merge(d3.values(f)), function(t) {
                        return t.count
                    }), b = d3.time.format("%A, %B %-d, %Y"), g = d3.time.format("%-I%p"), u = d3.bisector(function(t) {
                        return t.date
                    }).left, E = 0, I = h.length; I > E; E++) d = h[E], $(".js-" + y + "-" + d + " .js-total").text(i(c.summary.totals[d])), $(".js-" + y + "-" + d + " .js-changes").append(a(c.summary.total_changes[d])), $(".js-" + y + "-" + d + " .js-changes").append(s(c.summary.percent_changes[d]));
                if (0 === d3.values(c.summary.totals).filter(function(t) {
                        return 0 !== t
                    }).length) return $(this).html(t(w));
                for (T = d3.tip().attr("class", "svg-tip total-unique comparison").offset([-10, 0]).html(function(t) {
                        var e, n, s, r, a, o;
                        for (s = "", e = function() {
                                switch (w) {
                                    case "year":
                                        return "Week of " + b(t.date);
                                    case "week":
                                        return "" + b(t.date) + " starting at " + g(t.date);
                                    default:
                                        return b(t.date)
                                }
                            }(), n = 270 / c.summary.columns.length, o = c.summary.columns, r = 0, a = o.length; a > r; r++) d = o[r], s += "<li class='totals " + d + "' style='width:" + n + "px'> <strong>" + i(t[d]) + "</strong> " + d.split("_at")[0] + " </li>";
                        return "<span class='title'>" + e + "</span> <ul> " + s + " </ul>"
                    }), x = function() {
                        var t, e, n, i, s, r, a, o, c, l;
                        for (a = {}, o = A.invert(d3.mouse(this)[0]), s = h[0], r = u(f[s], o, 1), e = f[s][r - 1], n = f[s][r], t = n && o - e.date > n.date - o ? r : r - 1, a.date = f[s][t].date, c = 0, l = h.length; l > c; c++) d = h[c], a[d] = f[d][t].count;
                        return i = L.selectAll("g.dots circle").filter(function(t) {
                            return t.date === a.date
                        }), T.show.call(this, a, i[0][0])
                    }, M = 0, O = h.length; O > M; M++) d = h[M], f[d].forEach(function(t) {
                    return t.date = new Date(1e3 * t.bucket)
                }), f[d] = f[d].filter(function(t) {
                    return t.date < new Date
                });
                return A = d3.time.scale().range([0, o]), _ = d3.scale.linear().range([e, 0]), H = d3.scale.linear().range([e, 0]), C = 1, S = function() {
                    switch (w) {
                        case "year":
                            return d3.time.months;
                        case "week":
                            return C = 8, d3.time.hours;
                        default:
                            return C = 2, d3.time.days
                    }
                }(), D = d3.svg.axis().scale(A).tickSize(e + 5).tickPadding(10).ticks(S, C).orient("bottom"), P = d3.svg.axis().scale(_).ticks(3).tickFormat(d3.formatSymbol).orient("left"), v = d3.svg.line().x(function(t) {
                    return A(t.date)
                }).y(function(t) {
                    return _(t.count)
                }), L = d3.select(this).append("svg").attr("width", o + n.left + n.right).attr("height", e + n.top + n.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + n.left + "," + n.top + ")").call(T), A.domain([k, p]), _.domain([0, j]), L.append("g").attr("class", "x axis").call(D).selectAll("text").attr("text-anchor", "middle"), L.append("g").attr("class", "y axis").call(P), l = d3.values(f), L.selectAll("path.path").data(l).enter().append("path").attr("class", function(t) {
                    return "path total " + t[0].column
                }).attr("d", function(t) {
                    return v(t)
                }), m = L.selectAll("g.dots").data(l).enter().append("g").attr("class", function(t) {
                    return "dots totals " + t[0].column
                }), m.each(function() {
                    var t;
                    return t = d3.select(this), t.selectAll("circle").data(function(t) {
                        return f[t[0].column]
                    }).enter().append("circle").attr("cx", function(t) {
                        return A(t.date)
                    }).attr("cy", function(t) {
                        return _(t.count)
                    }).attr("r", 4)
                }), P.orient("right"), L.append("g").attr("class", "y axis unique").attr("transform", "translate(" + o + ", 0)").call(P), L.append("rect").attr("class", "overlay").attr("width", o).attr("height", e).on("mousemove", x).on("mouseout", function() {
                    return setTimeout(T.hide, 500)
                })
            }
        }, $(document).on("graph:load", ".js-dashboards-overview-graph", r)
    }.call(this),
    function() {
        var t, e, n;
        t = {}, n = function(t) {
            return t.json()
        }, $.observe(".js-graph", e = function(e) {
            var i, s, r, a;
            (a = e.getAttribute("data-url")) && ($(e).find("svg").remove(), r = null != t[a] ? t[a] : t[a] = $.fetchPoll(a).then(n), e.classList.add("is-graph-loading"), e.classList.remove("is-graph-load-error", "is-graph-empty"), i = function(t) {
                var n, i, s;
                return e.classList.remove("is-graph-loading"), 0 === (null != t ? t.length : void 0) || 0 === (null != t && null != (n = t.summary) ? n.total : void 0) || 0 === (null != (i = t[0]) && null != (s = i.weeks) ? s.length : void 0) ? e.classList.add("is-graph-empty") : d3Ready().then(function() {
                    return $(e).trigger("graph:load", [t])
                })
            }, s = function() {
                return e.classList.remove("is-graph-loading"), e.classList.add("is-graph-load-error")
            }, r.then(i, s))
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        i = function() {
            function i(t, e, n) {
                this.container = t, this.width = e, this.height = n, this.initError = o(this.initError, this), this.init = o(this.init, this), this.loaderInterval = null, this.loaderOffset = 0, this.ctx = this.initCanvas(t, e, n), this.startLoader("Loading graph data"), this.loadMeta()
            }
            return i.prototype.initCanvas = function(t) {
                var e, n, i, s, r, a, o;
                return s = t.getElementsByTagName("canvas")[0], s.style.zIndex = "0", i = s.width, n = s.height, r = s.getContext("2d"), a = window.devicePixelRatio || 1, e = r.webkitBackingStorePixelRatio || r.mozBackingStorePixelRatio || r.msBackingStorePixelRatio || r.oBackingStorePixelRatio || r.backingStorePixelRatio || 1, o = a / e, 1 === o ? r : (s.width = i * o, s.height = n * o, s.style.width = i + "px", s.style.height = n + "px", r.scale(o, o), r)
            }, i.prototype.startLoader = function(t) {
                return this.ctx.save(), this.ctx.font = "14px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#cacaca", this.ctx.textAlign = "center", this.ctx.fillText(t, this.width / 2, 155), this.ctx.restore(), this.displayLoader()
            }, i.prototype.stopLoader = function() {
                var t;
                return t = this.container.querySelector(".large-loading-area"), t.classList.add("is-hidden")
            }, i.prototype.displayLoader = function() {
                var t;
                return t = this.container.querySelector(".large-loading-area"), t.classList.remove("is-hidden")
            }, i.prototype.loadMeta = function() {
                var t, e;
                return t = function(t) {
                    return t.json()
                }, e = this.container.getAttribute("data-network-graph-meta-url"), $.fetchPoll(e).then(t, this.initError).then(this.init)
            }, i.prototype.init = function(i) {
                var o, c, l, u, d, h;
                if (a) {
                    for (this.focus = i.focus, this.nethash = i.nethash, this.spaceMap = i.spacemap, this.userBlocks = i.blocks, this.commits = function() {
                            var e, n, s, r;
                            for (s = i.dates, r = [], c = e = 0, n = s.length; n > e; c = ++e) o = s[c], r.push(new t(c, o));
                            return r
                        }(), this.users = {}, h = i.users, u = 0, d = h.length; d > u; u++) l = h[u], this.users[l.name] = l;
                    return this.chrome = new s(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users), this.graph = new r(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash), this.mouseDriver = new n(this.container, this.chrome, this.graph), this.keyDriver = new e(this.chrome, this.graph), this.stopLoader(), this.graph.drawBackground(), this.chrome.draw(), this.graph.requestInitialChunk()
                }
            }, i.prototype.initError = function() {
                return this.stopLoader(), this.ctx.clearRect(0, 0, this.width, this.height), this.startLoader("Graph could not be drawn due to a network problem.")
            }, i
        }(), t = function() {
            function t(t, e) {
                this.time = t, this.date = new Date(e), this.requested = null, this.populated = null
            }
            return t.prototype.populate = function(t, e, n) {
                return this.user = e, this.author = t.author, this.date = new Date(t.date.replace(" ", "T")), this.gravatar = t.gravatar, this.id = t.id, this.login = t.login, this.message = t.message, this.space = t.space, this.time = t.time, this.parents = this.populateParents(t.parents, n), this.requested = !0, this.populated = new Date
            }, t.prototype.populateParents = function(t, e) {
                var n, i, s;
                return s = function() {
                    var s, r, a;
                    for (a = [], s = 0, r = t.length; r > s; s++) n = t[s], i = e[n[1]], i.id = n[0], i.space = n[2], a.push(i);
                    return a
                }()
            }, t
        }(), s = function() {
            function t(t, e, n, i, s, r, a, o) {
                this.network = t, this.ctx = e, this.width = n, this.height = i, this.commits = r, this.userBlocks = a, this.users = o, this.namesWidth = 120, this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], this.userBgColors = ["#fff", "#f7f7f7"], this.headerColor = "#f7f7f7", this.dividerColor = "#ddd", this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = this.headerHeight + this.dateRowHeight, this.nameLineHeight = 24, this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.activeUser = null
            }
            return t.prototype.moveX = function(t) {
                return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight ? this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight : void 0
            }, t.prototype.moveY = function(t) {
                return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - this.graphTopOffset ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
            }, t.prototype.calcContentHeight = function() {
                var t, e, n, i, s;
                for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++) t = s[n], e += t.count;
                return e * this.nameLineHeight
            }, t.prototype.hover = function(t, e) {
                var n, i, s, r;
                for (r = this.userBlocks, i = 0, s = r.length; s > i; i++)
                    if (n = r[i], t > 0 && t < this.namesWidth && e > this.graphTopOffset + this.offsetY + n.start * this.nameLineHeight && e < this.graphTopOffset + this.offsetY + (n.start + n.count) * this.nameLineHeight) return this.users[n.name];
                return null
            }, t.prototype.draw = function() {
                return this.drawTimeline(this.ctx), this.drawUsers(this.ctx)
            }, t.prototype.drawTimeline = function(t) {
                var e, n, i, s, r, a, o, c, l, u, d;
                for (t.fillStyle = this.headerColor, t.fillRect(0, 0, this.width, this.headerHeight), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.width, 1), c = parseInt((0 - this.offsetX) / this.nameLineHeight), 0 > c && (c = 0), o = c + parseInt(this.width / (this.nameLineHeight - 1)), o > this.commits.length && (o = this.commits.length), t.save(), t.translate(this.offsetX, 0), a = null, r = null, s = d = c; o >= c ? o > d : d > o; s = o >= c ? ++d : --d) e = this.commits[s], l = this.months[e.date.getMonth()], l !== a && (t.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", u = this.ctx.measureText(l).width, t.fillText(l, s * this.nameLineHeight - u / 2, this.headerHeight / 2 + 4), a = l), i = e.date.getDate(), i !== r && (t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", n = this.ctx.measureText(i).width, t.fillText(i, s * this.nameLineHeight - n / 2, this.headerHeight + this.dateRowHeight / 2 + 3), r = i, t.fillStyle = "#ddd", t.fillRect(s * this.nameLineHeight, this.headerHeight, 1, 6));
                return t.restore()
            }, t.prototype.drawUsers = function(t) {
                var e, n, i, s, r, a, o;
                for (t.fillStyle = "#fff", t.fillRect(0, 0, this.namesWidth, this.height), t.save(), t.translate(0, this.headerHeight + this.dateRowHeight + this.offsetY), o = this.userBlocks, n = r = 0, a = o.length; a > r; n = ++r) e = o[n], t.fillStyle = this.userBgColors[n % 2], t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight), this.activeUser && this.activeUser.name === e.name && (t.fillStyle = "rgba(0, 0, 0, 0.05)", t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight)), i = (e.start + e.count / 2) * this.nameLineHeight + 3, t.fillStyle = "rgba(0, 0, 0, 0.1)", t.fillRect(0, e.start * this.nameLineHeight + e.count * this.nameLineHeight - 1, this.namesWidth, 1), t.fillStyle = "#333", t.font = "13px 'Helvetica Neue', Arial, sans-serif", t.textAlign = "center", t.fillText(e.name, this.namesWidth / 2, i, 96);
                return t.restore(), t.fillStyle = this.headerColor, t.fillRect(0, 0, this.namesWidth, this.headerHeight), t.fillStyle = "#777", t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillText("Owners", 40, this.headerHeight / 2 + 3), s = 10, t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, s, 1, this.headerHeight - 2 * s), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.namesWidth, 1), t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, this.headerHeight, 1, this.height - this.headerHeight)
            }, t
        }(), r = function() {
            function t(t, e, n, i, s, r, a, o, c, l) {
                var u, d, h, f, m, p, g, v, $, b, j, y, w, x, k;
                for (this.network = t, this.ctx = e, this.width = n, this.height = i, this.focus = s, this.commits = r, this.users = a, this.spaceMap = o, this.userBlocks = c, this.nethash = l, this.namesWidth = 120, this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = 10 + this.headerHeight + this.dateRowHeight, this.bgColors = ["#fff", "#f9f9f9"], this.nameLineHeight = 24, this.spaceColors = ["#c0392b", "#3498db", "#2ecc71", "#8e44ad", "#f1c40f", "#e67e22", "#34495e", "#e74c3c", "#2980b9", "#1abc9c", "#9b59b6", "#f39c12", "#7f8c8d", "#2c3e50", "#d35400", "#e74c3c", "#95a5a6", "#bdc3c7", "#16a085", "#27ae60"], this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.bgCycle = 0, this.marginMap = {}, this.gravatars = {}, this.activeCommit = null, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.showRefs = !0, this.lastHotLoadCenterIndex = null, this.connectionMap = {}, this.spaceUserMap = {}, p = 0, b = c.length; b > p; p++)
                    for (u = c[p], f = g = w = u.start, x = u.start + u.count; x >= w ? x > g : g > x; f = x >= w ? ++g : --g) this.spaceUserMap[f] = a[u.name];
                for (this.headsMap = {}, v = 0, j = c.length; j > v; v++)
                    for (u = c[v], m = a[u.name], k = m.heads, $ = 0, y = k.length; y > $; $++) d = k[$], this.headsMap[d.id] || (this.headsMap[d.id] = []), h = {
                        name: m.name,
                        head: d
                    }, this.headsMap[d.id].push(h)
            }
            return t.prototype.moveX = function(t) {
                return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight && (this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight), this.hotLoadCommits()
            }, t.prototype.moveY = function(t) {
                return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - 40 ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
            }, t.prototype.toggleRefs = function() {
                return this.showRefs = !this.showRefs
            }, t.prototype.calcContentHeight = function() {
                var t, e, n, i, s;
                for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++) t = s[n], e += t.count;
                return e * this.nameLineHeight
            }, t.prototype.hover = function(t, e) {
                var n, i, s, r, a, o, c, l;
                for (a = this.timeWindow(), i = o = c = a.min, l = a.max; l >= c ? l >= o : o >= l; i = l >= c ? ++o : --o)
                    if (n = this.commits[i], s = this.offsetX + n.time * this.nameLineHeight, r = this.offsetY + this.graphTopOffset + n.space * this.nameLineHeight, t > s - 5 && s + 5 > t && e > r - 5 && r + 5 > e) return n;
                return null
            }, t.prototype.hotLoadCommits = function() {
                var t, e, n, i, s, r;
                return s = 200, e = parseInt((-this.offsetX + this.graphMidpoint) / this.nameLineHeight), 0 > e && (e = 0), e > this.commits.length - 1 && (e = this.commits.length - 1), this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - e) < 10 ? void 0 : (this.lastHotLoadCenterIndex = e, t = this.backSpan(e, s), i = this.frontSpan(e, s), t || i ? (r = t ? t[0] : i[0], n = i ? i[1] : t[1], this.requestChunk(r, n)) : void 0)
            }, t.prototype.backSpan = function(t, e) {
                var n, i, s, r, a, o;
                for (i = null, n = a = t;
                    (0 >= t ? 0 >= a : a >= 0) && n > t - e; n = 0 >= t ? ++a : --a)
                    if (!this.commits[n].requested) {
                        i = n;
                        break
                    }
                if (null !== i) {
                    for (s = null, r = null, n = o = i;
                        (0 >= i ? 0 >= o : o >= 0) && n > i - e; n = 0 >= i ? ++o : --o)
                        if (this.commits[n].requested) {
                            s = n;
                            break
                        }
                    return s ? r = s + 1 : (r = i - e, 0 > r && (r = 0)), [r, i]
                }
                return null
            }, t.prototype.frontSpan = function(t, e) {
                var n, i, s, r, a, o, c, l;
                for (i = null, n = a = t, c = this.commits.length;
                    (c >= t ? c > a : a > c) && t + e > n; n = c >= t ? ++a : --a)
                    if (!this.commits[n].requested) {
                        i = n;
                        break
                    }
                if (null !== i) {
                    for (s = null, r = null, n = o = i, l = this.commits.length;
                        (l >= i ? l > o : o > l) && i + e > n; n = l >= i ? ++o : --o)
                        if (this.commits[n].requested) {
                            s = n;
                            break
                        }
                    return r = s ? s - 1 : i + e >= this.commits.length ? this.commits.length - 1 : i + e, [i, r]
                }
                return null
            }, t.prototype.chunkUrl = function() {
                return document.querySelector(".js-network-graph-container").getAttribute("data-network-graph-chunk-url")
            }, t.prototype.requestInitialChunk = function() {
                var t;
                if (a) return t = this.chunkUrl() + "?" + $.param({
                    nethash: this.nethash
                }), $.fetchJSON(t).then(function(t) {
                    return function(e) {
                        return t.importChunk(e), t.draw(), t.network.chrome.draw()
                    }
                }(this))
            }, t.prototype.requestChunk = function(t, e) {
                var n, i, s;
                if (a) {
                    for (n = s = t; e >= t ? e >= s : s >= e; n = e >= t ? ++s : --s) this.commits[n].requested = new Date;
                    return i = this.chunkUrl() + "?" + $.param({
                        nethash: this.nethash,
                        start: t,
                        end: e
                    }), $.fetchJSON(i).then(function(t) {
                        return function(e) {
                            return t.importChunk(e), t.draw(), t.network.chrome.draw(), t.lastHotLoadCenterIndex = t.focus
                        }
                    }(this))
                }
            }, t.prototype.importChunk = function(t) {
                var e, n, i, s, r, a, o, c, l;
                if (t.commits) {
                    for (c = t.commits, l = [], a = 0, o = c.length; o > a; a++) e = c[a], r = this.spaceUserMap[e.space], n = this.commits[e.time], n.populate(e, r, this.commits), l.push(function() {
                        var t, e, r, a;
                        for (r = n.parents, a = [], t = 0, e = r.length; e > t; t++) s = r[t], a.push(function() {
                            var t, e, r, a;
                            for (a = [], i = t = e = s.time + 1, r = n.time; r >= e ? r > t : t > r; i = r >= e ? ++t : --t) this.connectionMap[i] = this.connectionMap[i] || [], a.push(this.connectionMap[i].push(n));
                            return a
                        }.call(this));
                        return a
                    }.call(this));
                    return l
                }
            }, t.prototype.timeWindow = function() {
                var t, e;
                return e = parseInt((this.namesWidth - this.offsetX + this.nameLineHeight) / this.nameLineHeight), 0 > e && (e = 0), t = e + parseInt((this.width - this.namesWidth) / this.nameLineHeight), t > this.commits.length - 1 && (t = this.commits.length - 1), {
                    min: e,
                    max: t
                }
            }, t.prototype.draw = function() {
                var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, $, b, j, y, w, x, k, C, S, T;
                for (this.drawBackground(), h = this.timeWindow(), c = h.min, o = h.max, this.ctx.save(), this.ctx.translate(this.offsetX, this.offsetY + this.graphTopOffset), n = {}, S = this.spaceMap, r = m = 0, $ = S.length; $ > m; r = ++m)
                    for (f = S[r], d = this.spaceMap.length - r - 1, a = p = c; o >= c ? o >= p : p >= o; a = o >= c ? ++p : --p) t = this.commits[a], t.populated && t.space === d && (this.drawConnection(t), n[t.id] = !0);
                for (r = g = c; o >= c ? o >= g : g >= o; r = o >= c ? ++g : --g)
                    if (e = this.connectionMap[r])
                        for (v = 0, b = e.length; b > v; v++) t = e[v], n[t.id] || (this.drawConnection(t), n[t.id] = !0);
                for (T = this.spaceMap, r = w = 0, j = T.length; j > w; r = ++w)
                    for (f = T[r], d = this.spaceMap.length - r - 1, a = x = c; o >= c ? o >= x : x >= o; a = o >= c ? ++x : --x) t = this.commits[a], t.populated && t.space === d && (t === this.activeCommit ? this.drawActiveCommit(t) : this.drawCommit(t));
                if (this.showRefs)
                    for (a = k = c; o >= c ? o >= k : k >= o; a = o >= c ? ++k : --k)
                        if (t = this.commits[a], t.populated && (s = this.headsMap[t.id]))
                            for (u = 0, C = 0, y = s.length; y > C; C++) i = s[C], this.spaceUserMap[t.space].name === i.name && (l = this.drawHead(t, i.head, u), u += l);
                return this.ctx.restore(), this.activeCommit ? this.drawCommitInfo(this.activeCommit) : void 0
            }, t.prototype.drawBackground = function() {
                var t, e, n, i, s;
                for (this.ctx.clearRect(0, 0, this.width, this.height), this.ctx.save(), this.ctx.translate(0, this.offsetY + this.graphTopOffset), this.ctx.clearRect(0, -10, this.width, this.height), s = this.userBlocks, e = n = 0, i = s.length; i > n; e = ++n) t = s[e], this.ctx.fillStyle = this.bgColors[e % 2], this.ctx.fillRect(0, t.start * this.nameLineHeight - 10, this.width, t.count * this.nameLineHeight), this.ctx.fillStyle = "#DDDDDD", this.ctx.fillRect(0, (t.start + t.count) * this.nameLineHeight - 11, this.width, 1);
                return this.ctx.restore()
            }, t.prototype.drawCommit = function(t) {
                var e, n;
                return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 3, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
            }, t.prototype.drawActiveCommit = function(t) {
                var e, n;
                return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 6, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
            }, t.prototype.drawCommitInfo = function(t) {
                var e, n, i, s, r, a, o, c, l, u;
                return e = 3, n = 340, u = 56, l = t.message ? this.splitLines(t.message, 48) : [], a = Math.max(u, 38 + 16 * l.length), i = this.offsetX + t.time * this.nameLineHeight, s = this.graphTopOffset + this.offsetY + t.space * this.nameLineHeight, o = 0, c = 0, o = i < this.graphMidpoint ? i + 10 : i - (n + 10), c = s < 40 + (this.height - 40) / 2 ? s + 10 : s - a - 10, this.ctx.save(), this.ctx.translate(o, c), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)", this.ctx.lineWidth = 1, this.roundRect(0, 0, n, a, e), r = this.gravatars[t.gravatar], r ? this.drawGravatar(r, 10, 10) : (r = new Image, r.src = t.gravatar, r.onload = function(e) {
                    return function() {
                        return e.activeCommit === t ? (e.drawGravatar(r, o + 10, c + 10), e.gravatars[t.gravatar] = r) : void 0
                    }
                }(this)), this.ctx.fillStyle = "#000", this.ctx.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillText(t.author, 55, 24), this.ctx.fillStyle = "#bbb", this.ctx.font = "11px Consolas, Menlo, Courier, monospace", this.ctx.fillText(t.id.slice(0, 7), 280, 24), this.drawMessage(l, 55, 41), this.ctx.restore()
            }, t.prototype.drawGravatar = function(t, e, n) {
                var i;
                return i = 32, this.ctx.save(), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.0)", this.ctx.lineWidth = .1, this.roundRect(e + 2, n + 2, i, i, 4), this.ctx.clip(), this.ctx.drawImage(t, e + 2, n + 2, i, i), this.ctx.restore()
            }, t.prototype.roundRect = function(t, e, n, i, s) {
                return this.ctx.beginPath(), this.ctx.moveTo(t, e + s), this.ctx.lineTo(t, e + i - s), this.ctx.quadraticCurveTo(t, e + i, t + s, e + i), this.ctx.lineTo(t + n - s, e + i), this.ctx.quadraticCurveTo(t + n, e + i, t + n, e + i - s), this.ctx.lineTo(t + n, e + s), this.ctx.quadraticCurveTo(t + n, e, t + n - s, e), this.ctx.lineTo(t + s, e), this.ctx.quadraticCurveTo(t, e, t, e + s), this.ctx.fill(), this.ctx.stroke()
            }, t.prototype.drawMessage = function(t, e, n) {
                var i, s, r, a, o;
                for (this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#000000", o = [], i = r = 0, a = t.length; a > r; i = ++r) s = t[i], o.push(this.ctx.fillText(s, e, n + 16 * i));
                return o
            }, t.prototype.splitLines = function(t, e) {
                var n, i, s, r, a, o;
                for (r = t.split(" "), i = [], n = "", a = 0, o = r.length; o > a; a++) s = r[a], n.length + 1 + s.length < e ? n = "" === n ? s : n + " " + s : (i.push(n), n = s);
                return i.push(n), i
            }, t.prototype.drawHead = function(t, e, n) {
                var i, s, r, a;
                return this.ctx.font = "11px 'Helvetica Neue', Arial, sans-serif", this.ctx.save(), i = this.ctx.measureText(e.name).width, this.ctx.restore(), r = t.time * this.nameLineHeight, a = t.space * this.nameLineHeight + 5 + n, s = 2.5, this.ctx.save(), this.ctx.translate(r, a - s), this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)", this.ctx.beginPath(), this.ctx.moveTo(0, s), this.ctx.lineTo(-4, 10), this.ctx.quadraticCurveTo(-9, 10, -9, 15), this.ctx.lineTo(-9, 15 + i), this.ctx.quadraticCurveTo(-9, 15 + i + 5, -4, 15 + i + 5), this.ctx.lineTo(4, 15 + i + 5), this.ctx.quadraticCurveTo(9, 15 + i + 5, 9, 15 + i), this.ctx.lineTo(9, 15), this.ctx.quadraticCurveTo(9, 10, 4, 10), this.ctx.lineTo(0, s), this.ctx.fill(), this.ctx.fillStyle = "#fff", this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.textBaseline = "middle", this.ctx.scale(.85, .85), this.ctx.rotate(Math.PI / 2), this.ctx.fillText(e.name, 19, -.5), this.ctx.restore(), i + this.nameLineHeight
            }, t.prototype.drawConnection = function(t) {
                var e, n, i, s, r, a;
                for (r = t.parents, a = [], e = i = 0, s = r.length; s > i; e = ++i) n = r[e], a.push(0 === e ? n.space === t.space ? this.drawBasicConnection(n, t) : this.drawBranchConnection(n, t) : this.drawMergeConnection(n, t));
                return a
            }, t.prototype.drawBasicConnection = function(t, e) {
                var n;
                return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.stroke()
            }, t.prototype.drawBranchConnection = function(t, e) {
                var n;
                return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight), this.ctx.stroke(), this.threeClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)
            }, t.prototype.drawMergeConnection = function(t, e) {
                var n, i, s;
                return n = this.spaceColor(t.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), t.space > e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), s = this.safePath(t.time, e.time, t.space), s ? (this.ctx.lineTo(e.time * this.nameLineHeight - 10, t.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)) : (i = this.closestMargin(t.time, e.time, t.space, -1), t.space === e.space + 1 && t.space === i + 1 ? (this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, i * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, i * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : t.time + 1 === e.time ? (i = this.closestMargin(t.time, e.time, e.space, 0), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.lineTo(t.time * this.nameLineHeight + 10, t.space * this.nameLineHeight - 10), this.ctx.lineTo(t.time * this.nameLineHeight + 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))) : (i = this.closestMargin(t.time, e.time, e.space, -1), i < e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight - 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight - 7.7), this.ctx.stroke(), this.fourClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))
            }, t.prototype.addMargin = function(t, e, n) {
                return this.marginMap[n] || (this.marginMap[n] = []), this.marginMap[n].push([t, e])
            }, t.prototype.oneClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 3, n + 10.5), this.ctx.lineTo(e - 9, n + 5.5), this.ctx.lineTo(e - 2.6, n + 3.5), this.ctx.fill()
            }, t.prototype.twoClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n + 6.6), this.ctx.lineTo(e - 9.3, n + 10.6), this.ctx.lineTo(e - 3.2, n + 2.4), this.ctx.fill()
            }, t.prototype.threeClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 10, n - 3.5), this.ctx.lineTo(e - 10, n + 3.5), this.ctx.lineTo(e - 4, n), this.ctx.fill()
            }, t.prototype.fourClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n - 6.6), this.ctx.lineTo(e - 9.3, n - 10.6), this.ctx.lineTo(e - 3.2, n - 2.4), this.ctx.fill()
            }, t.prototype.safePath = function(t, e, n) {
                var i, s, r, a;
                for (a = this.spaceMap[n], s = 0, r = a.length; r > s; s++)
                    if (i = a[s], this.timeInPath(t, i)) return i[1] === e;
                return !1
            }, t.prototype.closestMargin = function(t, e, n, i) {
                var s, r, a, o, c;
                for (o = this.spaceMap.length, a = i, r = !1, s = !1, c = !1; !s || !r;) {
                    if (n + a >= 0 && this.safeMargin(t, e, n + a)) return n + a;
                    0 > n + a && (r = !0), n + a > o && (s = !0), c === !1 && 0 === a ? (a = -1, c = !0) : a = 0 > a ? -a - 1 : -a - 2
                }
                return n > 0 ? n - 1 : 0
            }, t.prototype.safeMargin = function(t, e, n) {
                var i, s, r, a;
                if (!this.marginMap[n]) return !0;
                for (a = this.marginMap[n], s = 0, r = a.length; r > s; s++)
                    if (i = a[s], this.pathsCollide([t, e], i)) return !1;
                return !0
            }, t.prototype.pathsCollide = function(t, e) {
                return this.timeWithinPath(t[0], e) || this.timeWithinPath(t[1], e) || this.timeWithinPath(e[0], t) || this.timeWithinPath(e[1], t)
            }, t.prototype.timeInPath = function(t, e) {
                return t >= e[0] && t <= e[1]
            }, t.prototype.timeWithinPath = function(t, e) {
                return t > e[0] && t < e[1]
            }, t.prototype.spaceColor = function(t) {
                return 0 === t ? "#000000" : this.spaceColors[t % this.spaceColors.length]
            }, t
        }(), n = function() {
            function t(t, e, n) {
                this.chrome = e, this.graph = n, this.out = o(this.out, this), this.move = o(this.move, this), this.docmove = o(this.docmove, this), this.down = o(this.down, this), this.up = o(this.up, this), this.dragging = !1, this.lastPoint = {
                    x: 0,
                    y: 0
                }, this.lastHoverCommit = null, this.lastHoverUser = null, this.pressedCommit = null, this.pressedUser = null, this.canvas = t.getElementsByTagName("canvas")[0], this.canvasOffset = $(this.canvas).offset(), this.canvas.style.cursor = "move", document.body.addEventListener("mouseup", this.up), document.body.addEventListener("mousemove", this.docmove), this.canvas.addEventListener("mousedown", this.down), this.canvas.addEventListener("mousemove", this.move), this.canvas.addEventListener("mouseout", this.out)
            }
            return t.prototype.up = function() {
                return this.dragging = !1, this.pressedCommit && this.graph.activeCommit === this.pressedCommit ? window.open("/" + this.graph.activeCommit.user.name + "/" + this.graph.activeCommit.user.repo + "/commit/" + this.graph.activeCommit.id) : this.pressedUser && this.chrome.activeUser === this.pressedUser && (window.location = "/" + this.chrome.activeUser.name + "/" + this.chrome.activeUser.repo + "/network"), this.pressedCommit = null, this.pressedUser = null
            }, t.prototype.down = function() {
                return this.graph.activeCommit ? this.pressedCommit = this.graph.activeCommit : this.chrome.activeUser ? this.pressedUser = this.chrome.activeUser : this.dragging = !0
            }, t.prototype.docmove = function(t) {
                var e, n;
                return e = t.pageX, n = t.pageY, this.dragging && (this.graph.moveX(e - this.lastPoint.x), this.graph.moveY(n - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(e - this.lastPoint.x), this.chrome.moveY(n - this.lastPoint.y), this.chrome.draw()), this.lastPoint.x = e, this.lastPoint.y = n
            }, t.prototype.move = function(t) {
                var e, n, i, s;
                return i = t.pageX, s = t.pageY, this.dragging ? (this.graph.moveX(i - this.lastPoint.x), this.graph.moveY(s - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(i - this.lastPoint.x), this.chrome.moveY(s - this.lastPoint.y), this.chrome.draw()) : (n = this.chrome.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), n !== this.lastHoverUser ? (this.canvas.style.cursor = n ? "pointer" : "move", this.chrome.activeUser = n, this.chrome.draw(), this.lastHoverUser = n) : (e = this.graph.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), e !== this.lastHoverCommit && (this.canvas.style.cursor = e ? "pointer" : "move", this.graph.activeCommit = e, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = e))), this.lastPoint.x = i, this.lastPoint.y = s
            }, t.prototype.out = function() {
                return this.graph.activeCommit = null, this.chrome.activeUser = null, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = null, this.lastHoverUser = null
            }, t
        }(), e = function() {
            function t(t, e) {
                this.chrome = t, this.graph = e, this.down = o(this.down, this), this.dirty = !1, document.addEventListener("keydown", this.down)
            }
            return t.prototype.moveBothX = function(t) {
                return this.graph.moveX(t), this.chrome.moveX(t), this.graph.activeCommit = null, this.dirty = !0
            }, t.prototype.moveBothY = function(t) {
                return this.graph.moveY(t), this.chrome.moveY(t), this.graph.activeCommit = null, this.dirty = !0
            }, t.prototype.toggleRefs = function() {
                return this.graph.toggleRefs(), this.dirty = !0
            }, t.prototype.redraw = function() {
                return this.dirty && (this.graph.draw(), this.chrome.draw()), this.dirty = !1
            }, t.prototype.down = function(t) {
                if ($(t.target).is("input")) return !0;
                if (t.shiftKey) switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(999999), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(999999), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-999999), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-999999), this.redraw()
                } else switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(100), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(30), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-100), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-30), this.redraw();
                    case 84:
                        return this.toggleRefs(), this.redraw()
                }
            }, t
        }(), a = !1, $.observe(".js-network-graph-container", {
            add: function() {
                return a = !0, new i(this, 920, 600)
            },
            remove: function() {
                return a = !1
            }
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-pulse-authors-graph", function(t, e) {
            var n, i, s, r, a, o, c, l, u, d;
            return n = 15, e = e.slice(0, +(n - 1) + 1 || 9e9), r = {
                top: 20,
                right: 0,
                bottom: 30,
                left: 20
            }, c = $(this).width() - r.left - r.right, s = $(this).height() - r.top - r.bottom, l = d3.scale.ordinal().domain(d3.range(n)).rangeRoundBands([0, c], .2), u = d3.scale.linear().domain([0, d3.max(e, function(t) {
                return t.commits
            })]).range([s, 0]), d = d3.svg.axis().scale(u).orient("left").ticks(3).tickSize(-c).tickFormat(function(t) {
                return 1e3 > t ? t : d3.format(",s")(t)
            }), a = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                var e;
                return "<strong>" + t.commits + "</strong> " + $.pluralize(t.commits, "commit") + " by <strong>" + (null != (e = t.login) ? e : t.name) + "</strong>"
            }), o = d3.select(this).append("svg").attr("width", c + r.left + r.right).attr("height", s + r.top + r.bottom).append("g").attr("transform", "translate(" + r.left + ", " + r.top + ")").call(a), o.append("g").attr("class", "y axis").call(d), i = o.selectAll(".bar").data(e).enter().append("g").attr("class", "bar").attr("transform", function(t, e) {
                return "translate(" + l(e) + ", 0)"
            }), i.append("rect").attr("width", l.rangeBand()).attr("height", function(t) {
                return s - u(t.commits)
            }).attr("y", function(t) {
                return u(t.commits)
            }).on("mouseover", a.show).on("mouseout", a.hide), i.append("a").attr("xlink:href", function(t) {
                return null != t.login ? "/" + t.login : void 0
            }).append("image").attr("y", s + 5).attr("xlink:href", function(t) {
                return t.gravatar
            }).attr("width", l.rangeBand()).attr("height", l.rangeBand())
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-graph-punchcard", function(t, e) {
            var n, i, s, r, a, o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x;
            return a = 500, j = $(this).width(), d = {}, e.forEach(function(t) {
                var e, n, i;
                return i = d3.weekdays[t[0]], e = null != d[i] ? d[i] : d[i] = [], n = t[1], null == e[n] && (e[n] = 0), e[n] += t[2]
            }), e = d3.entries(d).reverse(), x = [0, 0, 0, 20], p = x[0], f = x[1], m = x[2], h = x[3], c = 100, i = d3.range(7), o = d3.range(24), u = d3.min(e, function(t) {
                return d3.min(t.value)
            }), l = d3.max(e, function(t) {
                return d3.max(t.value)
            }), y = d3.scale.ordinal().domain(o).rangeRoundBands([0, j - c - f - m], .1), w = d3.scale.ordinal().domain(i).rangeRoundBands([a - p - h, 0], .1), g = d3.scale.sqrt().domain([0, l]).range([0, y.rangeBand() / 2]), v = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                return "<strong>" + t + "</strong> " + $.pluralize(t, "commit")
            }), b = d3.select(this).data(e).attr("width", "" + j + "px").append("svg").attr("width", j + (f + m)).attr("height", a + p + h).attr("class", "viz").append("g").attr("transform", "translate(" + f + "," + p + ")").call(v), s = b.selectAll("g.day").data(e).enter().append("g").attr("class", "day").attr("transform", function(t, e) {
                return "translate(0, " + w(e) + ")"
            }), s.append("line").attr("x1", 0).attr("y1", w.rangeBand()).attr("x2", j - f - m).attr("y2", w.rangeBand()).attr("class", "axis"), s.append("text").attr("class", "day-name").text(function(t) {
                return t.key
            }).attr("dy", w.rangeBand() / 2), b.append("g").selectAll("text.hour").data(o).enter().append("text").attr("text-anchor", "middle").attr("transform", function(t, e) {
                return "translate(" + (y(e) + c) + ", " + a + ")"
            }).attr("class", "label").text(function(t) {
                var e;
                return e = t % 12 || 12, 0 === t || 12 > t ? "" + e + "a" : "" + e + "p"
            }), r = s.selectAll(".hour").data(function(t) {
                return t.value
            }).enter().append("g").attr("class", "hour").attr("transform", function(t, e) {
                return "translate(" + (y(e) + c) + ", 0)"
            }).attr("width", y.rangeBand()), r.append("line").attr("x1", 0).attr("y1", function(t, e) {
                return w.rangeBand() - (e % 2 === 0 ? 15 : 10)
            }).attr("x2", 0).attr("y2", w.rangeBand()).attr("class", function(t, e) {
                return e % 2 === 0 ? "axis even" : "axis odd"
            }), n = r.append("circle").attr("r", 0).attr("cy", w.rangeBand() / 2 - 5).attr("class", function() {
                return "day"
            }).on("mouseover", v.show).on("mouseout", v.hide), n.transition().attr("r", g)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r;
        i = function(t) {
            var e;
            return (e = d3.format(","))(t)
        }, n = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 40
        }, r = 960 - n.left - n.right, e = 150 - n.top - n.bottom, t = function(t, e) {
            var n;
            return n = d3.time.format.utc("%A, %B %-d, %Y"), d3.tip().attr("class", "svg-tip web-views comparison").offset([-10, 0]).html(function(s) {
                return "<span class='title'>" + n(s.date) + "</span> <ul class='web-views'> <li class='totals'><strong>" + i(s.total) + "</strong> " + t + "</li> <li class='uniques'><strong>" + i(s.unique) + "</strong> " + e + "</li> </ul>"
            })
        }, s = function(t, s, a) {
            var o, c, l, u, d, h, f, m, p, g, v, b, j, y, w, x, k, C, S, T, L, A, D, _, H, P;
            if (s && null == s.error) {
                for (C = d3.time.scale.utc().range([0, r]), T = d3.scale.linear().range([e, 0]), L = d3.scale.linear().range([e, 0]), m = d3.time.format.utc("%m/%d"), S = d3.svg.axis().scale(C).tickSize(e + 5).tickPadding(10).tickFormat(m).orient("bottom"), A = d3.svg.axis().scale(T).ticks(3).tickFormat(d3.formatSymbol).orient("left"), h = d3.svg.line().x(function(t) {
                        return C(t.key)
                    }).y(function(t) {
                        return T(t.value)
                    }), w = d3.select(this).select(".js-graph").append("svg").attr("width", r + n.left + n.right).attr("height", e + n.top + n.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + n.left + "," + n.top + ")").call(a), c = s.counts, c.forEach(function(t) {
                        return t.date = new Date(1e3 * t.bucket)
                    }), c.sort(function(t, e) {
                        return d3.ascending(t.date, e.date)
                    }), c = c.slice(-14), o = d3.bisector(function(t) {
                        return t.date
                    }).left, p = function() {
                        var t, e, n, i, s, r;
                        return r = C.invert(d3.mouse(this)[0]), s = o(c, r, 1), e = c[s - 1], n = c[s], e && n ? (t = r - e.date > n.date - r ? n : e, i = w.selectAll("g.dots circle").filter(function(e) {
                            return e.key === t.date
                        }), i = i[0], i.sort(function(t, e) {
                            return $(t).attr("cy") - $(e).attr("cy")
                        }), a.show.call(this, t, i[0])) : void 0
                    }, v = [], y = [], D = 0, _ = c.length; _ > D; D++) d = c[D], v.push({
                    key: d.date,
                    value: d.total
                }), y.push({
                    key: d.date,
                    value: d.unique
                });
                return f = [v, y], H = d3.extent(c, function(t) {
                    return t.date
                }), g = H[0], u = H[1], P = d3.extent(v, function(t) {
                    return t.value
                }), k = P[0], x = P[1], b = d3.max(y, function(t) {
                    return t.value
                }), j = b + d3.median(y, function(t) {
                    return t.value
                }), C.domain([g, u]), T.domain([0, x]), L.domain([0, j]), $(this).find(".js-traffic-total").text(i(s.summary.total)), $(this).find(".js-traffic-uniques").text(i(s.summary.unique)), w.append("g").attr("class", "x axis").call(S), w.append("g").attr("class", "y axis views").call(A), w.selectAll("path.path").data(f).enter().append("path").attr("class", function(t, e) {
                    return "path " + (0 === e ? "total" : "unique")
                }).attr("d", function(t, e) {
                    return 0 === e ? h(t) : h.y(function(t) {
                        return L(t.value)
                    })(t)
                }), l = w.selectAll("g.dots").data(f).enter().append("g").attr("class", function(t, e) {
                    return 0 === e ? "dots totals" : "dots uniques"
                }), l.each(function(t, e) {
                    var n;
                    return n = d3.select(this), 1 === e && (T = L), n.selectAll("circle").data(function(t) {
                        return t
                    }).enter().append("circle").attr("cx", function(t) {
                        return C(t.key)
                    }).attr("cy", function(t) {
                        return T(t.value)
                    }).attr("r", 4)
                }), A.scale(L).orient("right"), w.append("g").attr("class", "y axis unique").attr("transform", "translate(" + r + ", 0)").call(A), w.append("rect").attr("class", "overlay").attr("width", r).attr("height", e).on("mousemove", p).on("mouseout", function() {
                    return setTimeout(a.hide, 500)
                })
            }
        }, $(document).on("graph:load", "#js-visitors-graph", function(e, n) {
            var i;
            return i = t("views", "unique visitors"), $.observe("#js-visitors-graph .js-graph", {
                remove: i.hide
            }), s.apply(this, [e, n, i])
        }), $(document).on("graph:load", "#js-clones-graph", function(e, n) {
            var i;
            return i = t("clones", "unique cloners"), $.observe("#js-clones-graph .js-graph", {
                remove: i.hide
            }), s.apply(this, [e, n, i])
        }), $(document).on("click", ".js-domain-list", function(t) {
            return t.preventDefault(), $(".js-top-paths").fadeOut("fast", function() {
                return $(".js-top-domains").fadeIn("fast")
            })
        }), $(document).on("click", ".js-domain", function(t) {
            return t.preventDefault(), $(".js-top-domains").hide(), $(".js-spinner").show(), $.fetchText(this.getAttribute("href")).then(function(t) {
                return $(".js-spinner").hide(), $(".js-top-paths").html(t).fadeIn("fast")
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-skip-to-content", function() {
            return $("#start-of-content").next().attr("tabindex", "-1").focus()
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-mobile-preference-form", function() {
            var t;
            return t = $(this).find(".js-mobile-preference-anchor-field"), t.val(window.location.hash.substr(1)), !0
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("click", ".js-org-billing-plans .js-choose-plan", function() {
            return t($(this).closest(".js-plan-row")), !1
        }), t = function(t) {
            var n, i, s, r;
            return s = t.attr("data-name"), i = parseInt(t.attr("data-cost"), 10), n = parseInt(null != (r = t.attr("data-balance")) ? r : "0", 10), $(".js-org-billing-plans").find(".js-plan-row, .js-choose-plan").removeClass("selected"), t.find(".js-choose-plan").addClass("selected"), t.addClass("selected"), $(".js-plan").val(s), 0 === i && 0 === n ? $(".js-billing-section").addClass("has-removed-contents") : ($(".js-billing-section").removeClass("has-removed-contents"), null != t.attr("data-balance") ? e(s) : void 0)
        }, e = function(t) {
            return $(".js-plan-change-message").addClass("is-hidden"), $('.js-plan-change-message[data-name="' + t + '"]').removeClass("is-hidden")
        }, $(function() {
            return $(".selected .js-choose-plan").click()
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            var t, n, i, s, r, a;
            return r = [], n = $(".js-advanced-search-input").val(), a = {
                Repositories: 0,
                Users: 0,
                Code: 0
            }, t = $("input[type=text].js-advanced-search-prefix, select.js-advanced-search-prefix"), r = e(t, function(t, e, n) {
                return "" === t ? "" : ("" !== e && a[n] ++, "" !== e ? "" + t + e : void 0)
            }), $.merge(r, e($("input[type=checkbox].js-advanced-search-prefix"), function(t, e, n) {
                var i;
                return i = $(this).prop("checked"), i !== !1 && a[n] ++, i !== !1 ? "" + t + i : void 0
            })), i = function(t) {
                return t.Users > t.Code && t.Users > t.Repositories ? "Users" : t.Code > t.Users && t.Code > t.Repositories ? "Code" : "Repositories"
            }, s = $.trim(r.join(" ")), $(".js-type-value").val(i(a)), $(".js-search-query").val($.trim("" + n + " " + s)), $(".js-advanced-query").empty(), $(".js-advanced-query").text("" + s), $(".js-advanced-query").prepend($("<span>").text($.trim(n)), " ")
        }, e = function(t, e) {
            return $.map(t, function(t) {
                var n, i, s, r;
                return s = $.trim($(t).val()), n = $(t).attr("data-search-prefix"), i = $(t).attr("data-search-type"), r = function(t) {
                    return -1 !== t.search(/\s/g) ? '"' + t + '"' : t
                }, "" === n ? e.call(t, n, s, i) : -1 !== s.search(/\,/g) && "location" !== n ? s.split(/\,/).map(function(s) {
                    return e.call(t, n, r($.trim(s)), i)
                }) : e.call(t, n, r(s), i)
            })
        }, $(document).onFocusedInput(".js-advanced-search-prefix", function() {
            return function() {
                return t()
            }
        }), $(document).on("change", ".js-advanced-search-prefix", t), $(document).on("focusin", ".js-advanced-search-input", function() {
            return $(this).closest(".js-advanced-search-label").addClass("focus")
        }), $(document).on("focusout", ".js-advanced-search-input", function() {
            return $(this).closest(".js-advanced-search-label").removeClass("focus")
        }), $(document).on("click", ".js-see-all-search-cheatsheet", function() {
            return $(".js-more-cheatsheet-info").removeClass("hidden"), !1
        }), $(function() {
            return $(".js-advanced-search-input").length ? t() : void 0
        })
    }.call(this),
    function() {
        $(document).delegate(".audit-search-form .js-suggester", "navigation:open", function() {
            return $(this).closest("form").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l;
        s = function(t) {
            var e, n, i, s, r;
            if (n = t.match(/\#?(?:L|-)(\d+)/gi)) {
                for (r = [], i = 0, s = n.length; s > i; i++) e = n[i], r.push(parseInt(e.replace(/\D/g, "")));
                return r
            }
            return []
        }, n = function(t) {
            var e;
            return (e = t.match(/(file-.+?-)L\d+?/i)) ? e[1] : ""
        }, i = function(t) {
            return {
                lineRange: s(t),
                anchorPrefix: n(t)
            }
        }, t = function(t) {
            var e, n;
            switch (n = t.lineRange, e = t.anchorPrefix, n.sort(c), n.length) {
                case 1:
                    return "#" + e + "L" + n[0];
                case 2:
                    return "#" + e + "L" + n[0] + "-L" + n[1];
                default:
                    return "#"
            }
        }, c = function(t, e) {
            return t - e
        }, o = !1, e = function(t) {
            var e, n, i, s, r;
            if (s = t.lineRange, e = t.anchorPrefix, i = $(".js-file-line"), i.length) {
                if (i.css("background-color", ""), 1 === s.length) return $("#" + e + "LC" + s[0]).css("background-color", "#f8eec7");
                if (s.length > 1) {
                    for (n = s[0], r = []; n <= s[1];) $("#" + e + "LC" + n).css("background-color", "#f8eec7"), r.push(n++);
                    return r
                }
            }
        }, a = function(t) {
            var n, s, r;
            return null == t && (t = i(window.location.hash)), r = t.lineRange, n = t.anchorPrefix, e(t), !o && (s = $("#" + n + "LC" + r[0])).length && $(window).scrollTop(s.offset().top - .33 * $(window).height()), o = !1
        }, l = function(t, e) {
            var n, i, s, r, a;
            for (null == e && (e = window.location.hash), a = [], s = 0, r = t.length; r > s; s++) i = t[s], a.push(e ? i.hash = e : (n = i.href.indexOf("#")) >= 0 ? i.href = i.href.substr(0, n) : void 0);
            return a
        }, $.hashChange(function() {
            return $(".js-file-line-container").length ? (setTimeout(a, 0), l($(".js-update-url-with-hash"))) : void 0
        }), r = function(t) {
            var e, n;
            return o = !0, e = null != (n = $(window).scrollTop()) ? n : 0, t(), $(window).scrollTop(e)
        }, $(document).on("mousedown", ".js-line-number", function(e) {
            var n, a;
            return n = i(this.id), e.shiftKey && (a = s(window.location.hash), n.lineRange.unshift(a[0])), r(function() {
                return window.location.hash = t(n)
            }), !1
        }), $(document).on("submit", ".js-jump-to-line-form", function() {
            var t, e;
            return t = $(this).find(".js-jump-to-line-field")[0], (e = t.value.replace(/[^\d\-]/g, "")) && (window.location.hash = "L" + e), $(document).trigger("close.facebox"), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o, c, l, u, d, h, f, m;
        a = function(t) {
            var e, n;
            return e = t.find(".js-blob-filename"), e[0] ? e.val() === e.attr("data-default-value") ? !1 : "." === (n = e.val()) || ".." === n || ".git" === n ? !1 : /\S/.test(e.val()) : !0
        }, t = function(t) {
            var e;
            return e = t.find(".js-blob-contents")[0], e ? $(e).attr("data-allow-unchanged") ? !0 : $(e).attr("data-new-filename") ? !0 : e.value !== e.defaultValue : !0
        }, e = function(e) {
            return e = $(".js-blob-form"), e.find(".js-check-for-fork").is($.visible) ? !1 : a(e) && t(e)
        }, d = function(t) {
            var e;
            return e = t.find(".js-blob-contents")[0], e ? $(e).attr("data-allow-unchanged") ? !0 : e.value !== e.defaultValue : !1
        }, o = function(t) {
            var e, n, i;
            return e = t.find(".js-blob-contents")[0], e.value !== e.defaultValue ? !0 : (n = $(".js-new-filename-field").val(), i = $(e).attr("data-old-filename"), n !== i ? !0 : !1)
        }, n = null, i = function(t) {
            var e;
            return e = $(t).attr("data-github-confirm-unload"), ("yes" === e || "true" === e) && (e = ""), null == e && (e = "false"), "no" === e || "false" === e ? null : function() {
                return e
            }
        }, l = function() {
            var t;
            return t = $(".js-blob-form"), t.find(".js-blob-submit").prop("disabled", !e(t)), t.find(".js-blob-contents-changed").val(d(t)), n ? window.onbeforeunload = o(t) ? n : null : void 0
        }, $.observe(".js-blob-form", function() {
            l(), n = i(this), $(this).on("submit", function() {
                return window.onbeforeunload = null
            })
        }), $(document).on("change", ".js-blob-contents", function() {
            return u($(".js-blob-filename")), l()
        }), $(document).on("click", ".js-new-blob-submit", function() {
            return $(this).closest("form.js-new-blob-form").submit()
        }), $(document).onFocusedInput(".js-blob-filename", function() {
            return function() {
                return $(".js-blob-contents").attr("data-filename", $(this).val()), c($(this).val()), u($(this))
            }
        }), $(document).onFocusedInput(".js-breadcrumb-nav", function() {
            return function() {
                return m($(this)), u($(this))
            }
        }), $(document).onFocusedKeydown(".js-breadcrumb-nav", function() {
            return function(t) {
                var e, n, i;
                return n = $(this).caretSelection(), i = [0, 0], e = 0 === $(n).not(i).length && 0 === $(i).not(n).length, e && 8 === t.keyCode && 1 !== $(this).parent().children(".separator").length && (r($(this), !0), t.preventDefault()), u($(this))
            }
        }), u = function(t) {
            return null != t[0] && (f(t), h(t)), l()
        }, m = function(t) {
            var e, n, i, a, o, c;
            for (c = []; t.val().split("/").length > 1;) e = t.val(), i = e.split("/"), n = i[0], o = i.slice(1).join("/"), "" === n || "." === n || ".git" === n ? (t.val(o), a = function() {
                return t.caret(0)
            }, c.push(window.setTimeout(a, 1))) : c.push(".." === n ? r(t) : s(t, n, o));
            return c
        }, c = function(t) {
            var e, n;
            return e = $(".js-gitignore-template"), n = $(".js-license-template"), /^(.+\/)?\.gitignore$/.test(t) ? e.addClass("is-visible") : /^(.+\/)?(licen[sc]e|copying)($|\.)/i.test(t) ? n.addClass("is-visible") : (e.removeClass("is-visible"), n.removeClass("is-visible"))
        }, h = function(t) {
            var e, n, i, s, r, a, o, c, l, u, d, h;
            return i = t.closest("form"), n = $(".js-blob-contents"), e = i.find(".js-new-blob-commit-summary"), o = t.val() ? "Create " + t.val() : "Create new file", d = n.attr("data-old-filename"), c = $(".js-new-filename-field").val(), n.removeAttr("data-new-filename"), o = d.length && c !== d && null != t[0] ? (n.attr("data-new-filename", "true"), r = n[0].value !== n[0].defaultValue, s = r ? "Update and rename" : "Rename", t.val().length && c.length ? (h = d.split("/"), l = c.split("/"), u = !0, a = h.length - 1, h.forEach(function(t, e) {
                return e !== a && t !== l[e] ? u = !1 : void 0
            }), h.length === l.length && u ? "" + s + " " + h[a] + " to " + l[a] : "" + s + " " + d + " to " + c) : "" + s + " " + d) : d.length && c === d ? "Update " + t.val() : o, e.attr("placeholder", o), $(".js-commit-message-fallback").val(o)
        }, f = function(t) {
            var e, n;
            return e = $(".breadcrumb").children("[itemscope]"), n = "", e.each(function() {
                var t;
                return t = $(this), n = n + t.text() + "/"
            }), n += t.val(), $(".js-new-filename-field").val(n)
        }, r = function(t, e) {
            var n, i;
            return null == e && (e = !1), e || t.val(t.val().replace("../", "")), i = function() {
                return t.caret(0)
            }, 1 !== t.parent().children(".separator").length && (t.prev().remove(), n = t.prev().children().children().html(), t.prev().remove(), e && (t.val("" + n + t.val()), i = function() {
                return e ? t.caret(n.length) : void 0
            })), c(t.val()), window.setTimeout(i, 1)
        }, s = function(t, e, n) {
            var i, s, r, a, o, l, u;
            return null == n && (n = ""), e = e.replace(/[^-.a-z_0-9]+/gi, "-"), e = e.replace(/^-+|-+$/g, ""), e.length > 0 && (u = t.parent().children(".js-repo-root, [itemtype]").children("a").last().attr("href"), u || (i = t.parent().children(".js-repo-root, [itemtype]").children("span").children("a").last(), s = i.attr("data-branch"), o = i.attr("href"), u = "" + o + "/tree/" + s), r = $(".js-crumb-template").clone().removeClass("js-crumb-template"), r.find("a[itemscope]").attr("href", "" + u + "/" + e), r.find("span").text(e), a = $(".js-crumb-separator").clone().removeClass("js-crumb-separator"), t.before(r, a)), t.val(n), c(t.val()), l = function() {
                return t.caret(0)
            }, window.setTimeout(l, 1)
        }, $(document).onFocusedInput(".js-new-blob-commit-summary", function() {
            var t;
            return t = $(this).closest(".js-file-commit-form"),
                function() {
                    return t.toggleClass("is-too-long-error", $(this).val().length > 50)
                }
        }), $.observe(".js-check-for-fork", function() {
            this.addEventListener("load", function() {
                return l()
            })
        }), $(document).on("change", ".js-gitignore-template input[type=radio]", function() {
            var t;
            return t = $(this).closest(".js-blob-form").find(".js-code-editor").data("code-editor"), $.fetchText(this.getAttribute("data-template-url")).then(function(e) {
                return t.setCode(e)
            })
        }), $(document).on("change", ".js-license-template input[type=radio]", function() {
            var t, e;
            return t = $(this).closest(".js-blob-form").find(".js-code-editor").data("code-editor"), e = $(this).attr("data-template-contents"), t.setCode(e)
        }), $(document).onFocusedKeydown(".js-new-blob-commit-description", function() {
            return function(t) {
                return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? ($(this).closest("form").submit(), !1) : void 0
            }
        })
    }.call(this),
    function() {
        var t;
        t = null, $(document).focused(".js-branch-search-field")["in"](function() {
            var e, n, i, s, r, a, o, c, l, u, d, h, f, m;
            return n = $(this), i = n.closest(".js-branch-search"), e = i.closest(".js-branches"), s = e.find(".js-branches-subnav .js-subnav-item"), f = i.prop("action"), h = i.attr("data-reset-url"), m = i.attr("data-results-container"), l = /\S/, o = function() {
                return l.test(n.val())
            }, u = function(t, e) {
                var n;
                return $.support.pjax && window.history.replaceState(null, "", e), n = document.getElementById(m), $(n).html(t)
            }, a = null, r = function(t) {
                return a && a.readyState < 4 && a.abort(), a = $.ajax(t)
            }, c = function() {
                var n, a;
                return null === t && (t = s.filter(".selected")), n = o(), a = n ? f + "?" + i.serialize() : h, r({
                    url: a,
                    context: i
                }).always(function() {
                    return e.removeClass("is-loading")
                }).done(function(t) {
                    return u(t, a)
                }), e.toggleClass("is-search-mode", n), e.addClass("is-loading"), s.removeClass("selected"), n ? s.filter(".js-branches-all").addClass("selected") : (t.addClass("selected"), t = null)
            }, d = function() {
                var t;
                return t = o(), n.val(""), t ? c() : void 0
            }, n.on("throttled:input.autosearch_form", c), n.on("keyup.autosearch_form", function(t) {
                return "esc" === t.hotkey ? (d(), this.blur()) : void 0
            })
        }).out(function() {
            return $(this).off(".autosearch_form")
        }), $(document).on("submit", ".js-branch-search", !1), $(document).on("click", ".js-clear-branch-search", function(t) {
            var e;
            if (1 === t.which) return e = $(this).closest(".js-branch-search").find(".js-branch-search-field"), e.focus().val("").trigger("input"), t.preventDefault()
        }), $(document).on("ajaxSend", ".js-branch-destroy, .js-branch-restore", function(t, e) {
            var n, i, s, r, a;
            return i = $(this), a = i.is(".js-branch-destroy"), r = i.closest(".js-branch-row").attr("data-branch-name"), n = i.closest(".js-branches").find(".js-branch-row").filter(function() {
                return this.getAttribute("data-branch-name") === r
            }), s = i.find("button[type=submit]"), s.blur().removeClass("tooltipped"), n.addClass("loading"), e.done(function() {
                return n.toggleClass("is-deleted", a)
            }).always(function() {
                return n.removeClass("loading"), s.addClass("tooltipped")
            })
        })
    }.call(this),
    function() {
        $(document).on("change", "#js-inline-comments-toggle", function() {
            return $("#comments").toggleClass("only-commit-comments", !this.checked)
        })
    }.call(this),
    function() {
        $(document).on("navigation:keyopen", ".commits-list-item", function() {
            return $(this).find(".commit-title > a").first().click(), !1
        }), $(document).on("navigation:keydown", ".commits-list-item", function(t) {
            return "c" === t.hotkey ? ($(this).find(".commit-title > a").first().click(), !1) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-compare-tabs a", function() {
            return $(this).closest(".js-compare-tabs").find("a").removeClass("selected"), $(this).addClass("selected"), $("#commits_bucket, #files_bucket, #commit_comments_bucket").hide(), $(this.hash).show(), !1
        }), $.hashChange(function() {
            return $(this).closest("#files_bucket")[0] && !$(this).is($.visible) ? $('a.tabnav-tab[href="#files_bucket"]').click() : void 0
        }), $(document).on("click", ".js-toggle-range-editor-cross-repo", function() {
            return $(this).closest(".js-range-editor").addClass("is-cross-repo"), !1
        }), $(document).on("pjax:click", ".js-range-editor", function(t, e) {
            $(".js-compare-pr").hasClass("open") && !e.url.match(/expand=1/) && (null == e.data && (e.data = {}), e.data.expand = "1")
        }), $(document).on("navigation:open", "form.js-commitish-form", function() {
            var t, e, n;
            return e = $(this), n = e.find(".js-new-item-name").text(), t = $("<input>", {
                type: "hidden",
                name: "new_compare_ref",
                value: n
            }), e.append(t), e.submit()
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-contact-javascript-flag").val("true")
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e, n, i, s, r, a;
            for (t = t.toLowerCase(), e = $(".js-csv-data tbody tr"), a = [], s = 0, r = e.length; r > s; s++) n = e[s], i = $(n).text().toLowerCase(), a.push(-1 === i.indexOf(t) ? $(n).hide() : $(n).show());
            return a
        }, $(document).on("keyup", ".js-csv-filter-field", function(e) {
            var n;
            return n = e.target.value, null != n && t(n), !1
        })
    }.call(this),
    function() {
        var t, e, n;
        $.hashChange(function() {
            var t;
            return t = window.location.hash, e(t, !0)
        }), e = function(i, s) {
            var r, a, o, c, l, u, d, h, f;
            return null == s && (s = !1), i && (u = n(i)) && (f = u[0], r = u[1], d = u[2], l = u[3], !document.getElementById(i.slice(1)) && (c = $(document.getElementsByName(r)).next()[0]) && (o = t(c, d, l))) ? ($(o).parents(".js-details-container").addClass("open"), h = o.getAttribute("data-url"), a = {
                anchor: r
            }, $.ajax({
                url: h,
                data: a
            }).then(function(t) {
                var n, r, a, c, l, u;
                if (n = $(o).closest(".js-expandable-line"), r = n.next(".file-diff-line"), r.preservingScrollPosition(function() {
                        return n.replaceWith(t)
                    }), c = document.getElementById(i.slice(1))) {
                    if (u = $(c).overflowOffset(), l = u.top, a = u.bottom, 0 > l || 0 > a) return c.scrollIntoView()
                } else if (s) return e(i)
            })) : void 0
        }, n = function(t) {
            var e, n;
            return e = t.match(/\#(diff\-[a-f0-9]+)([L|R])(\d+)$/i), null != e && 4 === e.length ? e : (n = t.match(/\#(discussion\-diff\-[0-9]+)([L|R])(\d+)$/i), null != n && 4 === n.length ? n : null)
        }, t = function(t, e, n) {
            var i, s, r, a, o, c, l, u;
            for (n = parseInt(n, 10), l = $(t).find(".js-expand"), o = 0, c = l.length; c > o; o++)
                if (s = l[o], i = "R" === e ? "data-right-range" : "data-left-range", u = s.getAttribute(i).split("-"), a = u[0], r = u[1], parseInt(a, 10) <= n && n <= parseInt(r, 10)) return s;
            return null
        }
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o;
        $(document).on("click", ".js-add-single-line-comment", function() {
            var t, e, i, s, o, c;
            n($(this).closest(".file")[0]), o = this.getAttribute("data-path"), t = this.getAttribute("data-anchor"), c = this.getAttribute("data-position"), e = this.getAttribute("data-line"), s = a($(this).closest("tr")[0], {
                path: o,
                anchor: t,
                position: c,
                line: e
            }), i = $(s).find(".js-line-comments")[0], r(i)
        }), $(document).on("click", ".js-add-split-line-comment", function() {
            var t, e, s, a, c, l, u;
            n($(this).closest(".file")[0]), u = this.getAttribute("data-type"), c = this.getAttribute("data-path"), t = this.getAttribute("data-anchor"), l = this.getAttribute("data-position"), e = this.getAttribute("data-line"), a = o($(this).closest("tr")[0]), s = i(a, "js-" + u, {
                type: u,
                anchor: t,
                path: c,
                position: l,
                line: e
            }), r(s)
        }), $(document).on("click", ".js-toggle-inline-comment-form", function() {
            return r($(this).closest(".js-line-comments")[0]), !1
        }), $(document).on("quote:selection", ".js-line-comments", function() {
            r(this)
        }), $(document).onFocusedKeydown(".js-inline-comment-form .js-comment-field", function() {
            return function(e) {
                return $(this).hasClass("js-navigation-enable") ? void 0 : "esc" === e.hotkey && 0 === this.value.length ? (t($(this).closest(".js-inline-comment-form")[0]), !1) : void 0
            }
        }), $(document).on("click", ".js-hide-inline-comment-form", function() {
            return t($(this).closest(".js-inline-comment-form")[0]), !1
        }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function(e, n, i, s) {
            var r;
            this === e.target && (r = $(this).closest(".js-line-comments"), r.find(".js-comments-holder").append(s), t(this))
        }), $(document).on("session:resume", function(t) {
            var e;
            (e = t.targetId.match(/^new_inline_comment_(diff-\w+)_(\d+)$/)) && $(".js-add-line-comment[data-anchor=" + e[1] + "][data-position=" + e[2] + "]").click()
        }), r = function(t) {
            return $(t).find(".inline-comment-form-container").addClass("open"), $(t).find(".js-write-tab").click(), $(t).find(".js-comment-field").focus()
        }, t = function(t) {
            return t.reset(), $(t).closest(".inline-comment-form-container").removeClass("open"), e()
        }, n = function(t) {
            return $(t).find(".js-toggle-file-notes").prop("checked", !0).trigger("change")
        }, e = function() {
            var t, e, n, i, s, r;
            for (r = $(".file .js-inline-comments-container"), i = 0, s = r.length; s > i; i++) t = r[i], n = $(t).find(".js-comments-holder > *").length > 0, e = $(t).find(".inline-comment-form-container").hasClass("open"), n || e || $(t).remove()
        }, $.observe(".js-comment", {
            remove: e
        }), a = function(t, e) {
            var n, i, r;
            return null == e && (e = {}), (r = $(t).next(".js-inline-comments-container")[0]) ? r : (n = $("#js-inline-comments-single-container-template"), r = n.children().first().clone()[0], i = r.querySelector(".js-inline-comment-form"), s(i, e), i.querySelector(".js-comment-field").id = "new_inline_comment_" + e.anchor + "_" + e.position, $(t).after(r), r)
        }, i = function(t, e, n) {
            var i, r, a;
            return null == n && (n = {}), (a = $(t).find(".js-line-comments." + e)[0]) ? a : (a = $("#js-inline-comments-split-form-container-template").clone().children()[0], $(a).addClass(e), r = $(a).find(".js-inline-comment-form")[0], s(r, n), r.querySelector(".js-comment-field").id = "new_inline_comment_" + n.anchor + "_" + n.position, i = $(t).find("." + e), i.last().after(a), i.remove(), a)
        }, o = function(t) {
            var e;
            return (e = $(t).next(".js-inline-comments-container")[0]) ? e : (e = $("#js-inline-comments-split-container-template").clone().children()[0], $(t).after(e), e)
        }, s = function(t, e) {
            var n, i, s, r;
            for (r = t.elements, i = 0, s = r.length; s > i; i++) n = r[i], n.name in e && (n.value = e[n.name])
        }
    }.call(this),
    function() {
        var t;
        (t = function(t, e, n) {
            return $.observe(t, function(t) {
                var i, s, r, a, o, c;
                return c = null, s = r = function() {
                    c && n(c, !1), c = null
                }, a = function(t) {
                    c && n(c, !1), c = $(t.target).closest(e)[0], c && n(c, !0)
                }, i = function() {
                    return t.addEventListener("mouseenter", s), t.addEventListener("mouseleave", r), t.addEventListener("mouseover", a)
                }, o = function() {
                    return t.removeEventListener("mouseenter", s), t.removeEventListener("mouseleave", r), t.removeEventListener("mouseover", a)
                }, {
                    add: i,
                    remove: o
                }
            })
        })(".diff-table", "td.blob-code, td.blob-num", function(t, e) {
            var n;
            return n = $(t).siblings(), 3 === n.length && (n = $(t).siblings($(t).hasClass("base") ? ".base" : ".head")), n.add(t).toggleClass("is-hovered", e)
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("click", ".js-linkable-line-number", function() {
            return window.location.hash = this.id, !1
        }), t = null, e = function() {
            var e, n, i;
            n = window.location.hash.substring(1), n && (i = document.getElementById(n)), t && t.removeClass("selected-line"), i && i.classList.contains("js-linkable-line-number") && (e = $(i).siblings(), 3 === e.length && (e = $(i).siblings($(i).hasClass("base") ? ".base" : ".head")), t = e.add(i), t.addClass("selected-line"))
        }, $.hashChange(e), $.observe(".blob-expanded", e)
    }.call(this),
    function() {
        var t;
        t = function() {
            var t;
            return t = "split" === $("meta[name=diff-view]").prop("content") && $(".file-diff-split").is(":visible"), document.body.classList.toggle("split-diff", t)
        }, $.observe("meta[name=diff-view]", {
            add: t,
            remove: t
        }), $.observe(".file-diff-split", {
            add: t,
            remove: t
        }), $.observe(".js-pull-request-tab.selected", {
            add: t,
            remove: t
        }), $.observe(".js-compare-tabs .tabnav-tab.selected", {
            add: t,
            remove: t
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-toggle-file-notes", function() {
            return $(this).closest(".file").toggleClass("show-inline-notes", this.checked)
        }), $(document).on("click", ".js-toggle-all-file-notes", function() {
            var t, e;
            return t = $(".js-toggle-file-notes"), e = 0 === t.filter(":checked").length, t.prop("checked", e).trigger("change"), !1
        }), $.observe(".js-inline-comments-container", function() {
            var t, e, n;
            return (e = $(this).closest(".file")[0]) ? (t = n = function() {
                var t;
                t = null != e.querySelector(".js-inline-comments-container"), e.classList.toggle("has-inline-notes", t)
            }, {
                add: t,
                remove: n
            }) : void 0
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-url-field", function() {
            var t;
            return t = this, setTimeout(function() {
                return $(t).select()
            }, 0)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-events-pagination", function() {
            var t, e;
            return e = $(this).parent(".ajax_paginate"), t = e.parent(), e.hasClass("loading") ? !1 : (e.addClass("loading"), $.ajax({
                url: $(this).attr("href"),
                complete: function() {
                    return e.removeClass("loading")
                },
                success: function(t) {
                    return e.replaceWith(t)
                }
            }), !1)
        })
    }.call(this),
    function() {
        $(function() {
            var t, e;
            return t = $(".js-newsletter-frequency-choice"), t.length ? (e = function() {
                var e;
                return t.find(".selected").removeClass("selected"), e = t.find("input[type=radio]:enabled:checked"), e.closest(".choice").addClass("selected")
            }, t.on("change", "input[type=radio]", function() {
                return e()
            }), e()) : void 0
        }), $(document).on("ajaxSuccess", ".js-subscription-toggle", function() {
            var t;
            return t = $(this).find(".selected .notice"), t.addClass("visible"), setTimeout(function() {
                return t.removeClass("visible")
            }, 2e3)
        }), $(document).on("ajaxSuccess", ".js-explore-newsletter-subscription-container", function(t, e) {
            return $(this).replaceWith(e.responseText)
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            var t;
            return t = $("#js-features-branch-diagram"), t.removeClass("preload"), t.find("path").each(function() {
                var t, e, n;
                return $(this).is("#js-branch-diagram-branch") ? n = "stroke-dashoffset 3.5s linear 0.25s" : $(this).is("#js-branch-diagram-master") ? n = "stroke-dashoffset 4.1s linear 0s" : $(this).is("#js-branch-diagram-arrow") && (n = "stroke-dashoffset 0.2s linear 4.3s"), e = $(this).get(0), t = e.getTotalLength(), e.style.transition = e.style.WebkitTransition = "none", e.style.strokeDasharray = t + " " + t, e.style.strokeDashoffset = t, e.getBoundingClientRect(), e.style.transition = e.style.WebkitTransition = n, e.style.strokeDashoffset = "0"
            })
        }, $(document).on("click", ".js-segmented-nav-button", function(t) {
            var e, n;
            return n = $(this).data("selected-tab"), e = $(this).closest(".js-segmented-nav"), e.find("li").removeClass("active"), e.siblings(".js-selected-nav-tab").removeClass("active"), $(this).parent().addClass("active"), $("." + n).addClass("active"), t.preventDefault()
        }), e = function() {
            return $(document).scrollTop() >= $("#js-features-branch-diagram").offset().top - 700 ? t() : void 0
        }, $.observe("#js-features-branch-diagram.preload", {
            add: function() {
                return $(window).on("scroll", e)
            },
            remove: function() {
                return $(window).off("scroll", e)
            }
        })
    }.call(this),
    function() {
        $(function() {
            var t;
            return $(document).on("click", ".js-survey-option", function(t) {
                var e, n, i, s, r, a, o;
                return t.preventDefault(), t.stopPropagation(), n = $("#first-run-questions"), n.find("> *").addClass("hidden"), n.find(".js-first-run-spinner").removeClass("hidden"), i = $(this).parents("form"), o = i.attr("action"), r = $(this).attr("data-question-id"), e = $(this).attr("data-choice-id"), a = i.attr("data-source-id"), s = i.find(".js-other-text").val(), $.ajax({
                    type: "PUT",
                    url: o,
                    data: {
                        choice_id: e,
                        question_id: r,
                        survey_id: a,
                        other_text: s
                    },
                    success: function(t) {
                        return n.html(t)
                    },
                    error: function() {
                        return alert("There was an error submitting your response.")
                    }
                })
            }), $(document).on("click", ".js-ignore-experiment", function(t) {
                var e;
                return t.preventDefault(), t.stopPropagation(), e = $(this).attr("data-ref"), console.log("experiment_id", e), $.ajax({
                    type: "PUT",
                    url: "/ignore-survey",
                    data: {
                        experiment_id: e
                    },
                    success: function() {
                        return window.location.href = "/"
                    },
                    error: function() {
                        return alert("There was an error submitting your response.")
                    }
                })
            }), t = function(t) {
                var e;
                t = $(t), e = t.val(), e.length > 0 ? t.next(".js-other-submit").prop("disabled", !1) : t.next(".js-other-submit").prop("disabled", !0)
            }, $(document).onFocusedInput("input.js-other-text", function(e) {
                return $(this).on("throttled:input." + e, function() {
                    return t(this)
                }), !1
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-fork-owner-select-target", function() {
            var t;
            if (!$(this).hasClass("disabled")) return t = $(this).text().replace("@", ""), $("#organization").val(t), $("#fork").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i;
        t = function() {
            return $(".js-code-textarea").val().trim().length > 0
        }, i = function() {
            return $(".js-remove-gist-file").length <= 1 ? $(".js-remove-gist-file").hide() : $(".js-remove-gist-file").show()
        }, $(document).on("change", ".js-code-textarea", function() {
            return $(".js-gist-create").prop("disabled", !t())
        }), $(document).on("throttled:input", ".js-gist-filename", function() {
            var t, e, n;
            return t = $(this), n = t.val(), e = t.parents(".js-code-editor").data("code-editor"), $.ajax({
                url: t.attr("data-language-detection-url"),
                method: "POST",
                data: {
                    filename: n
                },
                dataType: "json"
            }).done(function(n) {
                return (null != n ? n.language : void 0) ? (e.setMode(n.language), t.parents(".meta").find(".js-gist-file-language").text(n.message)) : void 0
            })
        }), n = $("#js-gist-file-template"), $(document).on("click", ".js-add-gist-file", function() {
            var t, e;
            return t = $(".js-gist-files"), e = $($("#js-gist-file-template").html()), t.append(e), $(document).scrollTop(e.offset().top - 100), i()
        }), $(document).on("click", ".js-remove-gist-file", function() {
            var t;
            return t = $(this).closest(".js-gist-file"), t.find(".js-gist-deleted input").removeAttr("disabled"), t.find(".js-code-editor").remove(), i(), $(".js-gist-file").length || $(".js-gist-files").append($("#js-gist-file-template").html()), !1
        }), $(document).on("click", ".js-delete-button", function(t) {
            return confirm("Are you positive you want to delete this Gist?") ? void 0 : t.preventDefault()
        }), $(document).on("click", ".js-gist-visibility-toggle", function() {
            return $(this).find("input").prop("checked", !0), $(".js-gist-visibility-toggle").removeClass("active"), $(this).closest(".js-gist-visibility-toggle").addClass("active"), e($(this).data("visibility-type"))
        }), e = function(t) {
            return $(".js-gist-create").text("Create " + t + " Gist"), $(".js-gist-update").text("Update " + t + " Gist")
        }, $(function() {
            return i()
        })
    }.call(this),
    function() {
        var t, e;
        t = {
            isHttpFragment: function(t) {
                return 0 === "http://".indexOf(t) || 0 === "https://".indexOf(t)
            },
            isValidHttpUrl: function(t) {
                var e, n, i, s;
                return s = function() {
                    try {
                        return new URL(t)
                    } catch (n) {
                        return e = n, null
                    }
                }(), null == s ? !1 : (n = /^https?/.test(s.protocol), i = s.href === t || s.href === "" + t + "/", n && i)
            }
        }, $.observe(".js-hook-url-field", function(e) {
            var n, i, s;
            n = $(e), i = function(t) {
                var e, n;
                return e = $(t).closest("form"), n = /^https:\/\/.+/.test(t.val()), e.toggleClass("is-ssl", n)
            }, s = function(e) {
                var n, i;
                return n = e.val(), i = t.isHttpFragment(n) || t.isValidHttpUrl(n), e.closest("form").toggleClass("is-invalid-url", !i)
            }, n.on("keyup", function() {
                return i(n)
            }), n.on("throttled:input", function() {
                return s(n)
            }), i(n), s(n)
        }), $(document).on("click", ".js-hook-toggle-ssl-verification", function(t) {
            return t.preventDefault(), $(".js-ssl-hook-fields").toggleClass("is-not-verifying-ssl"), $(".js-ssl-hook-fields").hasClass("is-not-verifying-ssl") ? ($(".js-hook-ssl-verification-field").val("1"), $(document).trigger("close.facebox")) : $(".js-hook-ssl-verification-field").val("0")
        }), e = function(t) {
            var e;
            return e = $(".js-hook-event-checkbox"), e.prop("checked", !1), null != t ? e.filter(t).prop("checked", !0) : void 0
        }, $(document).on("change", ".js-hook-event-choice", function() {
            var t;
            return t = "custom" === $(this).val(), $(".js-hook-events-field").toggleClass("is-custom", t), !0
        }), $(document).on("submit", ".js-hook-form", function() {
            var t, n;
            return t = $(this), n = t.find(".js-hook-event-choice:checked").val(), "custom" === n && $(".js-hook-wildcard-event").prop("checked", !1), "push" === n && e('[value="push"]'), "all" === n && e(".js-hook-wildcard-event"), !0
        }), $(document).on("details:toggled", ".js-hook-secret", function() {
            var t, e;
            return t = $(this), e = t.find("input[type=password]"), t.hasClass("open") ? e.removeAttr("disabled").focus() : e.attr("disabled", "disabled")
        }), $(document).on("details:toggle", ".js-hook-delivery-item", function() {
            var t, e;
            return t = $(this), e = this.querySelector(".js-hook-delivery-details"), t.data("details-load-initiated") ? void 0 : $.sudo().then(function() {
                var n, i;
                return t.data("details-load-initiated", !0), e.classList.add("is-loading"), n = function(t) {
                    return $(e).replaceContent(t), e.classList.remove("is-loading")
                }, i = function() {
                    return e.classList.add("has-error"), e.classList.remove("is-loading")
                }, $.fetchText(e.getAttribute("data-url")).then(n, i)
            })
        }), $(document).on("click", ".js-hook-delivery-details .js-tabnav-tab", function() {
            var t, e, n;
            return e = $(this), t = e.closest(".js-hook-delivery-details"), t.find(".js-tabnav-tab").removeClass("selected"), n = t.find(".js-tabnav-tabcontent").removeClass("selected"), e.addClass("selected"), n.filter(function() {
                return this.getAttribute("data-tab-name") === e.attr("data-tab-target")
            }).addClass("selected")
        }), $(document).on("click", ".js-hook-deliveries-pagination-button", function(t) {
            var e, n;
            return t.preventDefault(), n = this, e = $(this).parent(), $.sudo().then(function() {
                return e.addClass("loading"), $.fetchText(n.getAttribute("href")).then(function(t) {
                    return e.replaceWith(t)
                })
            })
        }), $(document).on("click", ".js-redeliver-hook-delivery-init-button", function(t) {
            var e;
            return t.preventDefault(), e = this.getAttribute("href"), $.sudo().then(function() {
                return $.facebox({
                    div: e
                })
            })
        }), $(document).on("click", ".js-redeliver-hook-delivery-button", function(t) {
            var e, n, i, s, r, a;
            return t.preventDefault(), i = this, i.classList.contains("disabled") ? void 0 : (i.classList.add("disabled"), a = i.getAttribute("data-delivery-guid"), e = $(".js-hook-delivery-details").filter(function() {
                return this.getAttribute("data-delivery-guid") === a
            }), n = e.closest(".js-hook-delivery-item"), s = function(t) {
                var i;
                return $(document).trigger("close.facebox"), i = $(t), e.replaceWith(i), i.on("load", function() {
                    return e = n.find(".js-hook-delivery-details"), n.find(".js-item-status").removeClass("success pending failure").addClass(e.attr("data-status-class")), n.find(".js-item-status-tooltip").attr("aria-label", e.attr("data-status-message"))
                })
            }, r = function() {
                return $(i).siblings(".js-redelivery-dialog").addClass("failed")
            }, $.fetchText(i.getAttribute("href"), {
                method: "post"
            }).then(s, r))
        }), $(document).on("click", ".js-test-hook-button", function(t) {
            var e;
            return t.preventDefault(), e = this, e.classList.contains("disabled") ? void 0 : $.sudo().then(function() {
                var t, n, i;
                return e.classList.add("disabled"), t = $(".js-test-hook-message").removeClass("error success"), n = function() {
                    return t.addClass("success"), e.classList.remove("disabled")
                }, i = function(n) {
                    var i;
                    return t.addClass("error"), e.classList.remove("disabled"), i = t.find(".js-test-hook-message-errors"), null != n.response ? n.response.json().then(function(t) {
                        return i.text(t.errors)
                    }) : i.text("Network request failed")
                }, $.fetch(e.getAttribute("data-test-hook-url"), {
                    method: "post"
                }).then(n, i)
            })
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function(t) {
            var e;
            return null == t && (t = $(this)), e = t.find("a").attr("href"), $(".js-slideshow-nav .active").removeClass("active"), t.addClass("active"), $(".js-integrations-slide-content .active").removeClass("active"), $(e).addClass("active"), !1
        }, e = function() {
            var e, n;
            return e = $(".js-slideshow-nav .active"), n = 0 === e.next().length, t(n ? $(".js-slide-tab").eq(0) : e.next())
        }, n = null, $.observe(".js-slideshow-nav", {
            add: function() {
                return n = setInterval(e, 9e3)
            },
            remove: function() {
                return clearInterval(n)
            }
        }), $(document).on("click", ".js-slide-tab a", function() {
            return t($(this).closest(".js-slide-tab")), clearInterval(n), !1
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-issues-custom-filter", function() {
            var t, e, n, i;
            return e = $(this), i = e.find(".js-new-item-name").text(), n = e.attr("data-name"), t = $("<input>", {
                type: "hidden",
                name: n,
                value: i
            }), e.append(t), e.submit()
        })
    }.call(this),
    function() {
        var t, e, n;
        e = function(e, n) {
            return e.closest(".js-label-editor").find(".js-color-editor-bg").css("background-color", n), e.css("color", t(n, -.5)), e.css("border-color", n)
        }, n = function(t) {
            var e, n;
            return e = "#c00", n = $(t).closest(".js-color-editor"), n.find(".js-color-editor-bg").css("background-color", e), t.css("color", "#c00"), t.css("border-color", e)
        }, t = function(t, e) {
            var n, i, s;
            for (t = String(t).toLowerCase().replace(/[^0-9a-f]/g, ""), t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), e = e || 0, s = "#", n = void 0, i = 0; 3 > i;) n = parseInt(t.substr(2 * i, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * e), 255)).toString(16), s += ("00" + n).substr(n.length), i++;
            return s
        }, $(document).on("focusin", ".js-color-editor-input", function() {
            var t, i;
            return i = $(this), t = $(this).closest(".js-label-editor"), i.on("throttled:input.colorEditor", function() {
                var s;
                return "#" !== i.val().charAt(0) && i.val("#" + i.val()), t.removeClass("is-valid is-not-valid"), s = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(i.val()), s ? (t.addClass("is-valid"), e(i, i.val())) : (t.addClass("is-not-valid"), n(i))
            }), i.on("blur.colorEditor", function() {
                return i.off(".colorEditor")
            })
        }), $(document).on("mousedown", ".js-color-chooser-color", function() {
            var t, n, i;
            return $(this).closest(".js-color-editor").removeClass("open"), t = $(this).closest(".js-label-editor"), n = "#" + $(this).data("hex-color"), i = t.find(".js-color-editor-input"), t.removeClass("is-valid is-not-valid"), i.val(n), e(i, n)
        }), $(document).on("submit", ".js-label-editor form", function() {
            var t, e;
            return t = $(this).find(".js-color-editor-input"), e = t.val(), e.length < 6 && (e = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), t.val(e.replace("#", ""))
        }), $(document).on("focusin", ".js-label-editor", function() {
            return $(this).closest(".js-label-editor").addClass("open")
        }), $(document).on("reset", ".js-create-label", function() {
            var t, n, i;
            return t = $(this).find(".color-chooser span").removeAttr("data-selected"), i = t.eq(Math.floor(Math.random() * t.length)), n = "#" + i.attr("data-selected", "").data("hex-color"), setImmediate(function(t) {
                return function() {
                    var i;
                    return i = $(t).find(".js-color-editor-input"), i.data("original-color", n).attr("value", n), e(i, i.val())
                }
            }(this))
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-edit-label", function() {
            return $(this).closest(".labels-list-item").addClass("edit")
        }), $(document).on("click", ".js-edit-label-cancel", function() {
            return this.form.reset(), $(this).closest(".labels-list-item").removeClass("edit")
        }), $(document).on("ajaxSuccess", ".js-create-label", function(t, e, n, i) {
            return this.reset(), $(this).nextAll(".table-list").prepend(i), $(".blankslate").hide()
        }), $(document).on("ajaxSuccess", ".js-update-label", function(t, e, n, i) {
            return $(this).closest(".labels-list-item").replaceWith(i)
        }), $(document).on("ajaxSend", ".js-update-label, .js-create-label", function() {
            return $(this).find(".error").text("")
        }), $(document).on("ajaxError", ".js-update-label, .js-create-label", function(t, e) {
            return $(this).find(".error").text(e.responseText), !1
        }), $(document).on("ajaxSuccess", ".js-delete-label", function() {
            return $(this).closest(".labels-list-item").fadeOut()
        })
    }.call(this),
    function() {
        $.hashChange(function(t) {
            var e, n, i, s;
            return i = t.newURL, (n = i.match(/\/issues#issue\/(\d+)$/)) ? (s = n[0], e = n[1], window.location = i.replace(/\/?#issue\/.+/, "/" + e)) : void 0
        }), $.hashChange(function(t) {
            var e, n, i, s, r;
            return s = t.newURL, (i = s.match(/\/issues#issue\/(\d+)\/comment\/(\d+)$/)) ? (r = i[0], n = i[1], e = i[2], window.location = s.replace(/\/?#issue\/.+/, "/" + n + "#issuecomment-" + e)) : void 0
        })
    }.call(this),
    function() {
        var t;
        $.observe(".js-issues-list-check:checked", {
            add: function() {
                return $(this).closest(".js-issue-row").addClass("selected")
            },
            remove: function() {
                return $(this).closest(".js-issue-row").removeClass("selected")
            }
        }), $(document).on("navigation:keydown", ".js-issue-row", function(e) {
            return "x" === e.hotkey ? (t(this), !1) : void 0
        }), $("#js-issues-search").focus(function() {
            return this.value = this.value
        }), t = function(t) {
            var e;
            (e = $(t).find(".js-issues-list-check")[0]) && (e.checked = !e.checked, $(e).trigger("change"))
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-new-issue-form .js-composer-label", function() {
            var t;
            return t = $(this).find("input[type=checkbox]")[0], t.checked = !t.checked, this.classList.toggle("selected", t.checked), !1
        }),$(document).on("click", ".js-suggestion-member-form .js-composer-member", function() {
            var t;
            var $this = $(this);
            $this.parent().find(".selected").removeClass("selected")
            return t = $this.find("input[type=radio]")[0], t.checked = true, this.classList.toggle("selected", true), !1
        })
    }.call(this),
    function() {
        var t;
        $(document).on("selectmenu:selected", ".js-composer-assignee-picker .js-navigation-item", function() {
            var t, e, n;
            return t = $(this).closest(".js-infobar"), e = $(this).find("input[type=radio]").val(), n = $(this).hasClass("js-clear-assignee"), t.find(".js-composer-assignee-picker").toggleClass("is-showing-clear-item", !n), t.find(".js-assignee-infobar-item-wrapper").empty().append(function() {
                var t, i;
                return n ? "No one will be assigned" : (i = $("<a>", {
                    href: "/" + e,
                    "class": "css-truncate-target",
                    text: e
                }), t = $("<span>", {
                    text: " will be assigned"
                }), [i, t])
            })
        }), $(document).on("selectmenu:selected", ".js-assignee-picker .js-navigation-item", function() {
            var e;
            return e = $(this).closest("form"), t(e, {}, function(t) {
                return function() {
                    var e, n;
                    return e = $(t).closest(".js-assignee-picker"), n = $(t).hasClass("js-clear-assignee"), e.toggleClass("is-showing-clear-item", !n), $(".js-assignee-infobar-item-wrapper").empty().append(function() {
                        var e, i, s;
                        return n ? "No one assigned" : (s = $(t).find("input[type=radio]").val(), e = $(t).find(".js-select-menu-item-gravatar").html(), i = $("<a>", {
                            href: "/" + s,
                            "class": "assignee css-truncate-target",
                            text: s
                        }), [e, i])
                    })
                }
            }(this))
        }), $(document).on("selectmenu:selected", ".js-composer-milestone-picker .js-navigation-item", function() {
            var t, e, n, i, s;
            return t = $(this).closest(".js-infobar"), i = $(this).find("input[type=radio]"), e = t.find('input[name="issue[milestone_id]"]'), n = t.find('input[name="new_milestone_title"]'), $(this).hasClass("js-new-item-form") ? (e.val("new"), n.val($(this).find(".js-new-item-name").text())) : e.val(i[0].value), s = $(this).hasClass("js-clear-milestone"), t.find(".js-composer-milestone-picker").toggleClass("is-showing-clear-item", !s), $(".js-composer-milestone-title").empty().append(function(t) {
                return function() {
                    var e;
                    return s ? "No milestone" : (e = $(t).find(".js-milestone-title").html(), $("<strong>", {
                        "class": "css-truncate-target"
                    }).append(e))
                }
            }(this))
        }), $(document).on("selectmenu:selected", ".js-milestone-picker .js-navigation-item", function() {
            var e;
            return e = $(this).closest("form"), t(e, {}, function(t) {
                return function(e) {
                    var n, i, s;
                    return i = $(t).closest(".js-milestone-picker"), s = $(t).hasClass("js-clear-milestone"), i.toggleClass("is-showing-clear-item", !s), n = $(".js-milestone-infobar-item-wrapper"), n.length ? (n.html(e.infobar_body), i.menu("deactivate"), i.find(".js-milestone-picker-body").html(e.select_menu_body)) : void 0
                }
            }(this))
        }), $(document).on("click", ".js-apply-labels", function() {
            var e;
            return e = $(this).closest("form"), t(e, {
                type: "put"
            }, function(t) {
                return function() {
                    return $(t).menu("deactivate")
                }
            }(this)), !1
        }), $(document).on("click", ".js-remove-labels", function() {
            var e;
            return e = $(this).closest("form"), t(e, {
                type: "delete"
            }, function(t) {
                return function() {
                    return $(t).menu("deactivate")
                }
            }(this)), !1
        }), $(document).on("selectmenu:selected", ".js-issue-show-label-select-menu .js-navigation-item", function() {
            var e, n, i;
            return e = $(this).closest("form"), n = $(this).find("input[type=checkbox]"), i = {
                type: n.is(":checked") ? "put" : "delete",
                data: {
                    "issueId": e.find(".js-issue-number").val(),
                    "labels[]": n.val()
                }
            }, t(e, i, function(t) {
                return $(".discussion-labels > .color-label-list, .js-timeline-label-list").html(t.labels)
            }), !1
        }), t = function(t, e, n) {
            var i;
            if (i = t[0]) return $.ajax({
                context: i,
                type: e.type || t.attr("method"),
                url: t.attr("action"),
                data: e.data || t.serialize(),
                success: n
            })
        }
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-issue-quick-assign", function() {
            var t;
            t = $(this).closest(".js-assignee-infobar-item-wrapper"), t.find(".js-issue-self-assigned").show().siblings().remove()
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-issues-list-check", function() {
            $("#js-issues-toolbar").toggleClass("triage-mode", $(".js-issues-list-check:checked").length > 0)
        }), $(document).on("change", ".js-issues-list-check", function() {
            var t;
            t = $(".js-issues-list-check:checked"), $("#js-issues-toolbar .js-issues-toolbar-triage .js-select-menu").data("contents-data", t).addClass("js-load-contents")
        }), $(document).on("selectmenu:selected", ".js-issues-toolbar-triage .js-navigation-item", function() {
            var t, e, n, i, s, r;
            n = $(this).closest(".js-menu-container").hasClass("js-label-select-menu"), t = $(this).closest("form"), s = $(this).hasClass("selected"), i = $(this).attr("data-name"), r = $(this).attr("data-value"), e = n ? $("<input>", {
                type: "hidden",
                name: "" + i + "[" + r + "]",
                value: s ? "1" : "0"
            }) : $("<input>", {
                type: "hidden",
                name: i,
                value: s ? r : ""
            }), setImmediate(function(t) {
                return function() {
                    return $(t).menu("deactivate")
                }
            }(this)), t.find(".js-issues-triage-fields").append(e), t.addClass("js-submit")
        }), $(document).on("menu:deactivate", ".js-issues-toolbar-triage .js-menu-container", function(t) {
            var e, n;
            (e = this.querySelector("form.js-submit")) && (this.classList.add("is-loading"), n = $.fetchJSON(e.getAttribute("action"), {
                method: e.getAttribute("method"),
                body: $.param($(e).serializeArray()),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }), n.then(function(t) {
                return function(e) {
                    var n, i, s;
                    return s = $.fetchPoll(e.job.url), n = function() {
                        return $(t).menu("deactivate"), location.reload()
                    }, i = function() {
                        return t.classList.add("has-error")
                    }, s.then(n, i)
                }
            }(this)), e.classList.remove("js-submit"), t.preventDefault())
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t;
            return t = {
                div: "#keyboard_shortcuts_pane",
                ajax: "/site/keyboard_shortcuts?url=" + window.location.pathname
            }, $.facebox(t, "shortcuts")
        }, $(document).on("click", ".js-keyboard-shortcuts", function() {
            return t(), !1
        }), $(document).on("click", ".js-see-all-keyboard-shortcuts", function() {
            return $(this).remove(), $(".facebox .js-hidden-pane").css("display", "table-row-group"), !1
        }), $(document).on("keypress", function(e) {
            return e.target === document.body && 63 === e.which ? ($(".facebox").is($.visible) ? $.facebox.close() : t(), !1) : void 0
        })
    }.call(this),
    function() {
        $.observe("input.js-date-input", function() {
            $(this).next(".date_selector").remove(), new DateInput(this)
        }), $(document).on("click", ".js-date-input-clear", function() {
            return $("input.js-date-input").data("datePicker").resetDate(), !1
        }), $(document).on("change click", ".js-milestone-edit-form", function() {
            var t;
            t = this.querySelector(".js-milestone-edit-cancel"), $(this).hasDirtyFields() ? t.setAttribute("data-confirm", t.getAttribute("data-confirm-changes")) : t.removeAttribute("data-confirm")
        })
    }.call(this),
    function() {
        var t, e;
        t = function(t) {
            return $(t).is(".read") ? void 0 : $(t).toggleClass("unread read")
        }, e = function(t) {
            return $(t).is(".unread") ? void 0 : $(t).toggleClass("unread read")
        }, $(document).on("click", ".js-notification-target", function(e) {
            return e.which > 1 ? void 0 : t($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".js-delete-notification", function() {
            return t($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".is-preview-features .js-undo-notification", function() {
            return e($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".js-mute-notification", function() {
            var e;
            return t($(this).closest(".js-notification")), e = $(this).closest(".js-notification"), this.action = e.is(".muted") ? this.action.replace("unmute", "mute") : this.action.replace("mute", "unmute"), e.toggleClass("muted")
        }), $(document).on("ajaxSuccess", ".js-mark-visible-as-read", function() {
            var t;
            return t = $(this).closest(".js-notifications-browser"), t.find(".unread").toggleClass("unread read"), t.find(".js-mark-visible-as-read").addClass("mark-all-as-read-confirmed"), t.find(".js-mark-as-read-confirmation").addClass("mark-all-as-read-confirmed")
        }), $(document).on("ajaxSuccess", ".js-mark-remaining-as-read", function() {
            var t;
            return t = $(this).closest(".js-notifications-browser"), t.find(".js-mark-remaining-as-read").hide(), t.find(".js-mark-remaining-as-read-confirmation").show()
        }), $(document).on("navigation:keydown", ".js-notification", function(t) {
            switch (t.hotkey) {
                case "I":
                case "e":
                case "y":
                    return $(this).find(".js-delete-notification").submit(), !1;
                case "U":
                case "meta+U":
                    return $(this).find(".js-undo-notification").submit(), !1;
                case "M":
                case "m":
                    return $(this).find(".js-mute-notification").submit(), !1
            }
        }), $(document).on("navigation:keyopen", ".js-notification", function() {
            return t(this)
        }), $(document).on("ajaxBeforeSend", ".js-notifications-subscription", function() {
            return $(this).find(".js-spinner").show()
        }), $(document).on("ajaxComplete", ".js-notifications-subscription", function() {
            return $(this).find(".js-spinner").hide()
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-oauth-org-access-details  .js-set-approval-state", function() {
            var t, e;
            return t = $(this).closest(".js-toggler-container"), e = {
                url: this.href,
                type: "PUT",
                success: function() {
                    return t.removeClass("loading").toggleClass("on")
                }
            }, $.sudo().then(function() {
                return t.addClass("loading"), $.ajax(e)
            }), !1
        }), $(document).on("click", ".js-request-approval-facebox-button", function(t) {
            var e, n;
            return n = $(t.target).data("request-button"), e = $(".js-" + n).closest(".js-toggler-container"), $.ajax({
                url: this.href,
                type: "POST",
                success: function() {
                    return e.removeClass("loading").toggleClass("on"), $(document).trigger("close.facebox")
                }
            }), !1
        })
    }.call(this),
    function() {
        $(document).on("submit", ".org form[data-results-container]", function() {
            return !1
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            return $(".js-invitation-toggle-team:checked").visible()
        }, e = function() {
            var e, n, i;
            return $(".js-ldap-notice").length > 0 ? $(".js-invitation-create").removeClass("disabled") : (e = $(".js-invitation-form"), i = "limited-member" === e.attr("data-role") || $(".js-invitation-role-limited-member").is(":checked"), e.toggleClass("invitation-limited-member-role-selected", i), n = !i || t().length > 0, $(".js-invitation-create").toggleClass("disabled", !n))
        }, $(document).on("click", ".js-invitations-team-suggestions-view-all", function() {
            return $.fetchText(this.href).then(function(e) {
                return function(n) {
                    var i, s;
                    return s = t().map(function() {
                        return this.value
                    }), i = $(e).closest("ul"), i.html(n), s.each(function() {
                        return i.find(".js-invitation-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        }), $(document).on("change", ".js-invitation-toggle-team", e), $(document).on("change", ".js-invitation-role", e), $.observe(".js-invitation-create", e)
    }.call(this),
    function() {
        var t, e, n, i;
        t = [], e = function() {
            var t, e, n;
            return t = $(".js-person-grid"), e = t.find(".js-org-person").has(".js-org-person-toggle:checked"),
                function() {
                    var t, i, s;
                    for (s = [], t = 0, i = e.length; i > t; t++) n = e[t], s.push($(n).attr("data-id"));
                    return s
                }().sort()
        }, i = null, $(document).on("change", ".js-org-person-toggle", function() {
            var n, s, r, a;
            return n = $(".js-org-toolbar"), s = n.find(".js-member-selected-actions"), r = e(), a = r.length > 0, JSON.stringify(r) !== JSON.stringify(t) ? (t = r, n.find(".js-org-toolbar-select-all-label").toggleClass("has-selected-members", a), $(".js-member-not-selected-actions").toggleClass("hidden", a), s.toggleClass("hidden", !a), n.addClass("disabled"), null != i && i.abort(), i = $.ajax({
                url: s.attr("data-toolbar-actions-url"),
                data: {
                    member_ids: r
                }
            }), i.done(function(t) {
                return s.html(t)
            }), i.always(function() {
                return n.removeClass("disabled")
            })) : void 0
        }), $(document).on("click", ".js-member-remove-confirm-button", function(t) {
            return t.preventDefault(), $.facebox(function() {
                var n;
                return n = $.ajax({
                    url: $(t.target).attr("data-url"),
                    data: {
                        member_ids: e()
                    }
                }), n.done(function(t) {
                    return $.facebox(t)
                })
            })
        }), $(document).on("click", ".js-member-search-filter", function() {
            var t, e;
            return e = $(this).data("filter"), t = $(".js-member-filter-field"), t.val("" + e + " "), t.focus(), t.trigger("throttled:input"), !1
        }), $(document).on("ajaxSend ajaxComplete", ".js-add-member-form", function(t) {
            return this === t.target ? this.classList.toggle("is-sending", "ajaxSend" === t.type) : void 0
        }), n = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl", $(document).onFocusedKeydown(".js-add-member-form .js-autocomplete-field", function() {
            return function(t) {
                return "enter" === t.hotkey || t.hotkey === "" + n + "+enter" ? t.preventDefault() : void 0
            }
        }), $(document).on("autocomplete:result", ".js-add-member-form", function() {
            var t, e;
            return t = this, e = function() {
                return $(t).submit()
            }, this.classList.contains("js-sudo-required") ? $.sudo().then(e) : setImmediate(e)
        }), $(document).on("ajaxSuccess", ".js-add-member-form", function(t, e, n, i) {
            var s, r, a, o, c, l, u;
            if (s = $(i), r = $(".js-member-list"), this.querySelector(".js-autocomplete-field").value = "", o = s.attr("data-login"))
                for (u = r.children(), c = 0, l = u.length; l > c; c++)
                    if (a = u[c], a.getAttribute("data-login") === o) return;
            return r.prepend(s), r.closest(".js-org-section").toggleClass("is-empty", !r.children().length)
        }), $(document).on("ajaxError", ".js-add-member-form", function(t, e) {
            return /<html/.test(e.responseText) ? void 0 : ($(".js-member-list").before(e.responseText), !1)
        }),$(document).on("autocomplete:result", ".js-suggestion-member-form", function(event) {
            var t, e;
            return t = this, e = function() {
                var target = $(event.target)
                var userName = target.val();
                target.val('')
                var obj = '<li class="clearfix "  data-type="application"><input type="hidden" name="members[' + userName + ']" value="' + userName + '"><a class="delete-button js-delete-member right" aria-label="Delete comment"> <span class="octicon octicon-x"></span></a> <div class="button-group"><a href="#" class="minibutton js-composer-member selected"><input style="display: none" type="radio" checked value="false" name="memberTypes[' + userName + ']">Member</a><a href="#" class="minibutton js-composer-member"><input style="display: none" type="radio" value="true" name="memberTypes[' + userName + ']">Manager</a> </div> <strong>' + userName + '</strong></li>'
                return $('#member', $(t)).append(obj)
            }, this.classList.contains("js-sudo-required") ? $.sudo().then(e) : setImmediate(e)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-remove-person-from-org-button", function(t) {
            var e;
            return t.preventDefault(), e = $(t.target), $.facebox(function() {
                var t;
                return t = $.ajax({
                    url: e.attr("data-url"),
                    data: {
                        member_ids: [e.attr("data-user-id")],
                        redirect_to_path: e.attr("data-redirect-to-path")
                    }
                }), t.done(function(t) {
                    return $.facebox(t)
                })
            })
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-migrate-legacy-member-form", function() {
            return this.closest(".js-migrate-legacy-member-container").classList.add("loading")
        }), $(document).on("ajaxError", ".js-migrate-legacy-member-form", function() {
            var t;
            return t = this.closest(".js-migrate-legacy-member-container"), t.classList.remove("loading")
        }), $(document).on("ajaxSuccess", ".js-migrate-legacy-member-form", function() {
            var t, e;
            return t = this.closest(".js-migrate-legacy-member-container"), t.classList.remove("loading"), e = this.closest(".js-migrate-legacy-member-row"), $(e).on("transitionend webkitTransitionEnd oTransitionEnd", function() {
                return e.remove(), t.querySelector(".js-migrate-legacy-member-row") ? void 0 : document.location.href = t.getAttribute("data-empty-url")
            }), e.classList.add("hide-legacy-member")
        })
    }.call(this),
    function() {
        $(document).onFocusedInput(".js-new-organization-name", function() {
            var t;
            return t = $(this).closest("dd").find(".js-field-hint-name"),
                function() {
                    return t.text($(this).val())
                }
        }), $(document).on("click", ".js-org-creation-invitation-cancel", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget), n = e.closest("li"), n.hide(), $.ajax({
                url: e.attr("href"),
                method: "DELETE"
            }).done(function() {
                return n.remove()
            }).fail(function() {
                return n.show(), alert("There was an error canceling the invitation.")
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-make-direct-members", function() {
            return $(this).closest(".js-notice").fadeOut()
        }), $(document).on("click", ".js-expand-orgs-help", function() {
            return $(this).closest(".orgs-help-shelf-content").addClass("open")
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-repo-search-filter", function() {
            var t, e, n, i, s;
            return e = $(this).data("filter"), n = $(this).data("negate"), t = $(".js-repo-filter-field"), i = t.val(), i.indexOf(n) > -1 && (i = i.replace(n, ""), i = i.replace(/^\s*/, "")), -1 === i.indexOf(e) && (s = i && i.match(/\s$/) ? "" : " ", t.val(i + ("" + s + e + " ")), t.focus(), t.trigger("throttled:input")), $("body").removeClass("menu-active"), !1
        }), $(document).on("keypress", ".js-repository-fallback-search", function(t) {
            var e, n, i, s;
            if (13 === t.which) return e = $(this), n = e.data("host"), i = e.data("org"), s = e.val(), document.location = "http://" + n + "/search?q=user%3A" + i + "+" + s + "&type=Repositories"
        }), $(document).on("click", ".js-team-repo-higher-access", function(t) {
            return t.preventDefault(), $.facebox(function() {
                var e;
                return e = $.ajax({
                    url: $(t.target).attr("data-url")
                }), e.done(function(t) {
                    return $.facebox(t)
                })
            })
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:selected", ".js-select-repo-permission .js-navigation-item", function() {
            var t, e, n, i, s;
            return t = $(this), s = t.parents(".js-select-repo-permission"), e = t.attr("data-level-text"), n = s.find(".js-menu-target"), i = t.parents(".js-org-repo"), s.addClass("is-updating"), s.removeClass("was-successful"), $.ajax({
                url: s.attr("data-url"),
                method: "PUT",
                data: {
                    permission: t.attr("data-ref"),
                    fork_count: i.find(".js-org-repo-forked").attr("data-repo-fork-count")
                },
                success: function(t) {
                    return n.text(e), s.removeClass("is-updating"), s.addClass("was-successful"), i.find(".js-team-repo-higher-access-container").toggleClass("hidden", !t.members_with_higher_access)
                },
                error: function() {
                    return alert("There was an error changing permission.")
                }
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-delete-team-button", function() {
            var t;
            return t = $(this), t.attr("disabled", "disabled"), $.ajax({
                url: t.attr("data-url"),
                type: "delete"
            }), !1
        }), $(document).on("click", ".js-delete-member", function() {
            var $this = $(this)
            $this.parent().remove()
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-ldap-import-groups-container", function(t, e) {
            return e.setRequestHeader("X-Context", "import")
        }), $(document).on("autocomplete:autocompleted:changed", ".js-team-ldap-group-field", function() {
            var t;
            return t = $(this).closest(".js-ldap-group-adder").removeClass("is-exists"), t.find(".js-ldap-group-adder-button").toggleClass("disabled", !$(this).attr("data-autocompleted"))
        }), $(document).on("navigation:open", ".js-team-ldap-group-autocomplete-results .js-navigation-item", function() {
            var t, e;
            return t = $(this).closest(".js-ldap-group-adder"), e = $(this).attr("data-dn"), t.find(".js-team-ldap-dn-field").val(e), $(this).closest(".js-ldap-import-groups-container").find(".js-ldap-group-dn").map(function(n, i) {
                $(i).text() === e && (t.addClass("is-exists"), t.find(".js-ldap-group-adder-button").addClass("disabled"))
            })
        }), $(document).on("ajaxBeforeSend", ".js-import-container", function() {
            var t;
            return t = $(this).find(".js-ldap-group-adder-button"), t.hasClass("disabled") ? !1 : ($(this).addClass("is-importing"), t.addClass("disabled"))
        }), $(document).on("ajaxComplete", ".js-import-container", function() {
            return $(this).removeClass("is-importing")
        }), $(document).on("ajaxSuccess", ".js-ldap-group-adder", function(t, e, n, i) {
            return $(this).closest(".js-ldap-import-groups-container").removeClass("is-empty").find(".js-ldap-imported-groups").prepend($(i)), this.reset(), $(this).find(".js-team-ldap-group-field").focus(), $(this).find(".js-ldap-group-adder-button").addClass("disabled"), $(".js-import-form-actions").removeClass("hidden")
        }), $(document).on("click", ".js-team-remove-group", function(t) {
            return $(this).hasClass("disabled") ? !1 : (t.preventDefault(), $(this).addClass("disabled").closest(".js-team").addClass("is-removing"), $(".js-team-ldap-group-field").focus())
        }), $(document).on("ajaxSuccess", ".js-team-remove-group", function() {
            return $(this).closest(".js-team").remove(), 0 === $(".js-team:not(.is-removing)").length ? ($(".js-ldap-import-groups-container").addClass("is-empty"), $(".js-import-form-actions").addClass("hidden")) : void 0
        }), $(document).on("ajaxError", ".js-team-remove-group", function() {
            return $(this).removeClass("disabled").closest(".js-team").removeClass("is-removing")
        }), $(document).on("click", ".js-edit-team", function(t) {
            return $(this).closest(".js-team").hasClass("is-removing") ? !1 : (t.preventDefault(), $(this).closest(".js-team").addClass("is-editing"), $(this).closest(".js-team").find(".js-team-name-field").focus())
        }), $(document).on("click", ".js-save-button", function() {
            return $(this).hasClass("disabled") ? !1 : $(this).closest(".js-team").addClass("is-sending")
        }), $(document).on("click", ".js-cancel-team-edit", function(t) {
            var e, n;
            return t.preventDefault(), n = $(this).closest(".js-team").removeClass("is-editing"), e = n.find(".js-team-form").removeClass("is-exists"), e.find(".js-slug").text(e.find(".js-slug").data("original-slug")), e[0].reset()
        }), $(document).on("ajaxSuccess", ".js-team-form:not(.is-checking)", function(t, e, n, i) {
            return e.nameCheck ? void 0 : $(this).closest(".js-team").removeClass("is-editing").replaceWith($(i))
        }), $(document).on("ajaxSuccess", ".js-team-form.is-checking", function(t, e, n, i) {
            var s, r;
            return s = $(this).removeClass("is-checking"), "function" == typeof(r = s.find(".js-team-name-field")).removeData && r.removeData("autocheck-xhr"), i.error ? (s.find(".js-save-button").addClass("disabled"), "exists" === i.error ? (s.addClass("is-exists"), s.find(".js-slug").html(i.slug)) : void 0) : (s.find(".js-slug").html(i.slug), s.find(".js-save-button").removeClass("disabled"))
        }), $(document).on("ajaxError", ".js-team-form", function(t, e) {
            return e.nameCheck && "abort" === e.statusText ? !1 : void 0
        }), $(document).on("throttled:input", ".js-team-name-field", function() {
            var t, e, n, i;
            return e = $(this), t = e.closest(".js-team-form"), null != (i = e.data("autocheck-xhr")) && i.abort(), t.removeClass("is-exists").addClass("is-checking"), t.find(".js-save-button").addClass("disabled"), n = $.ajax({
                url: e.attr("data-check-url"),
                type: "GET",
                context: this,
                data: {
                    name: this.value
                }
            }), n.nameCheck = !0, e.data("autocheck-xhr", n)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-show-own-teams", function() {
            var t, e, n, i;
            return t = $(".js-team-search-field"), i = t.val(), n = $(this).attr("data-me"), -1 === i.indexOf("@" + n) && (e = i ? " " : "", t.val("" + i + e + "@" + n), t.focus(), t.trigger("throttled:input")), !1
        })
    }.call(this),
    function() {
        var t;
        t = function(t, e, n) {
            var i, s;
            return t.addClass("is-sending"), i = t.find(".team-name-octicon"), i.attr("class", "hidden octicon team-name-octicon"), s = $.get(e.attr("data-check-url"), {
                name: n
            }), s.done(function(s) {
                var r, a, o, c, l;
                return t.removeClass("is-sending"), t.find(".js-team-name-errors").html(s ? s : ""), o = null != (l = e.attr("data-original")) ? l.trim() : void 0, a = o && n === o, r = !!t.find(".js-error").length, c = (r || !n) && !a, c ? t.find(".js-create-team-button").attr("disabled", "disabled") : t.find(".js-create-team-button").removeAttr("disabled"), r ? i.attr("class", "octicon team-name-octicon octicon-alert") : n ? i.attr("class", "octicon team-name-octicon octicon-check") : void 0
            })
        }, $(document).on("throttled:input", ".js-new-team", function() {
            var e, n;
            return n = $(this), e = n.closest("form"), t(e, n, n.val().trim())
        }), $(document).ready(function() {
            var e, n;
            return $(".js-new-org-team").length > 0 && (e = $("#team-name"), n = e.val().trim()) ? t($(".org-team-form"), e, n) : void 0
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-remove-team-members-form", function() {
            return $.sudo().then(function(t) {
                return function() {
                    var e;
                    return e = $(t), $.fetch(e.attr("action"), {
                        method: "post",
                        body: e.serialize(),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    }).then(function() {
                        var t;
                        return t = e.closest(".js-org-section"), e.closest(".js-edit-team-member").remove(), t.toggleClass("is-empty", !t.find(".js-org-list").children().length)
                    })
                }
            }(this)), !1
        }), $(document).on("ajaxSuccess", ".js-remove-team-repository", function() {
            var t, e;
            return e = $(this), t = e.closest(".js-org-section"), e.closest(".js-org-repo").remove(), t.toggleClass("is-empty", !t.find(".js-org-list").children().length)
        }), $(document).on("click", ".js-team-description-toggle", function() {
            return $(".js-description-toggler").toggleClass("on")
        }), $(document).on("ajaxComplete", ".js-team-description-form", function() {
            var t;
            return t = $(".js-team-description-field").val(), $(".js-description-toggler").toggleClass("on"), t.trim() ? $(".js-team-description .description").text(t) : $(".js-team-description .description").html("<span class='link'>This team has no description</span>")
        })
    }.call(this),
    function() {
        $(function() {
            var t;
            return $("#load-readme").click(function() {
                var e, n, i, s, r, a;
                return n = $("#gollum-editor-body"), e = $("#editor-body-buffer"), s = $("#undo-load-readme"), a = e.text(), t(n, e), i = $(this), i.prop("disabled", !0), i.text(i.data("readme-name") + " loaded"), s.show(), r = function() {
                    return $(this).val() !== a && s.hide(), n.off("change keyup", r)
                }, n.on("change keyup", r), !1
            }), $("#undo-load-readme").click(function() {
                var e;
                return t($("#gollum-editor-body"), $("#editor-body-buffer")), e = $("#load-readme"), e.prop("disabled", !1), e.text("Load " + e.data("readme-name")), $(this).hide(), !1
            }), t = function(t, e) {
                var n, i, s;
                return n = $(t), i = $(e), s = n.val(), n.val(i.text()), i.text(s)
            }
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e;
            return e = $(this), t = e.find(":selected"), t.attr("data-already-member") ? ($(".js-hide-if-prerelease-member").addClass("hidden"), $(".js-show-if-prerelease-member").removeClass("hidden")) : ($(".js-hide-if-prerelease-member").removeClass("hidden"), $(".js-show-if-prerelease-member").addClass("hidden"))
        }, $.observe(".js-prerelease-member", t), $(document).on("change", ".js-prerelease-member", t)
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-cleanup-pull-request", function(t, e, n, i) {
            var s, r, a;
            a = i.updateContent;
            for (r in a) s = a[r], $(r).updateContent(s)
        }), $(document).on("ajaxError", ".js-cleanup-pull-request", function(t, e) {
            return $(this).addClass("error"), $(this).closest(".js-deletable-state").removeClass("mergeable-merged").addClass("mergeable-error"), e.responseText && $(this).find(".js-cleanup-error-message").html(e.responseText), !1
        })
    }.call(this),
    function() {
        $(document).on("details:toggled", ".js-pull-merging", function() {
            var t;
            return t = $(this).find(".js-merge-pull-request"), t.toggleClass("js-dirty", t.is($.visible))
        }), $(document).on("ajaxSuccess", ".js-merge-pull-request", function(t, e, n, i) {
            var s, r, a;
            this.reset(), $(this).removeClass("js-dirty"), a = i.updateContent;
            for (r in a) s = a[r], $(r).updateContent(s)
        }), $(document).on("ajaxError", ".js-merge-pull-request", function(t, e) {
            return $(this).addClass("error"), $(this).closest(".js-mergable-state").removeClass("mergeable-clean").addClass("mergeable-error"), e.responseText && $(this).find(".js-merge-error-message").text(e.responseText), !1
        }), $(document).on("session:resume", function(t) {
            var e, n;
            return (n = document.getElementById(t.targetId)) ? (e = $(n).closest(".js-merge-pull-request"), e.closest(".js-details-container").addClass("open")) : void 0
        })
    }.call(this),
    function() {
        var t;
        $.observeLast(".pull-request-ref-restore", "last"), t = function() {
            var t;
            return t = $("#js-pull-restorable").length, $(".pull-discussion-timeline").toggleClass("is-pull-restorable", t)
        }, $.observe("#js-pull-restorable", {
            add: t,
            remove: t
        }), $(document).on("ajaxSuccess", ".js-restore-head-ref", function(t, e, n, i) {
            var s, r, a;
            a = i.updateContent;
            for (r in a) s = a[r], $(r).updateContent(s)
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e;
            return e = t.getAttribute("data-container-id"), document.getElementById(e)
        }, $(document).on("pjax:click", ".js-pull-request-tab", function(e, n) {
            return t(this) ? !1 : (n.push = !1, n.replace = !0)
        }), $(document).on("click", ".js-pull-request-tab", function(e) {
            var n, i, s, r, a;
            if (1 === e.which && !e.metaKey && !e.ctrlKey && (n = t(this))) {
                for (a = $(".js-pull-request-tab.selected"), s = 0, r = a.length; r > s; s++) i = a[s], $(i).removeClass("selected"), $(t(i)).removeClass("is-visible");
                return $(n).addClass("is-visible"), $(this).addClass("selected").blur(), $.support.pjax && window.history.replaceState($.pjax.state, "", this.href), !1
            }
        }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function() {
            return $(this).closest("#discussion_bucket").length ? $("#files_bucket").remove() : $("#discussion_bucket").remove()
        }), $(document).on("socket:message", ".js-pull-request-tabs", function() {
            $(this).ajax()
        }), $(document).on("ajaxSuccess", ".js-pull-request-tabs", function(t, e, n, i) {
            var s;
            return s = $($.parseHTML(i)), $(this).find("#commits_tab_counter").replaceWith(s.find("#commits_tab_counter")), $(this).find("#files_tab_counter").replaceWith(s.find("#files_tab_counter")), $(this).find("#diffstat").replaceWith(s.find("#diffstat"))
        }), $(document).on("socket:message", ".js-pull-request-stale-files", function() {
            return $("#files_bucket").addClass("is-stale")
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-pulse-period", function(t) {
            var e;
            return e = $(t.target).attr("data-url"), $.pjax({
                url: e,
                container: "#js-repo-pjax-container"
            })
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-create-branch", function() {
            return $(this).submit(), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r;
        $(document).on("click", ".js-releases-field a.remove", function() {
            var t;
            return t = $(this).closest("li"), t.addClass("delete"), t.find("input.destroy").val("true"), !1
        }), $(document).on("click", ".js-releases-field a.undo", function() {
            var t;
            return t = $(this).closest("li"), t.removeClass("delete"), t.find("input.destroy").val(""), !1
        }), $(document).on("click", ".js-timeline-tags-expander", function() {
            return $(this).closest(".js-timeline-tags").removeClass("is-collapsed")
        }), n = ["is-default", "is-saving", "is-saved", "is-failed"], i = function(t, e) {
            return t.removeClass(n.join(" ")), t.addClass(e), "is-saving" === e ? t.attr("disabled", "disabled") : t.removeAttr("disabled")
        }, $(document).on("click", ".js-save-draft", function(t, n) {
            var s, r, a, o, c, l;
            return $("#release_draft").val("1"), s = $(this), o = s.closest("form"), a = $("#delete_release_confirm form"), c = o.data("repo-url"), l = o.attr("action"), r = o.serialize(), i(s, "is-saving"), $.ajax({
                url: l,
                type: "POST",
                data: r,
                dataType: "json",
                success: function(t) {
                    var r, l;
                    return l = e("tag", c, t.tag_name), o.attr("action", l), a.attr("action", l), window.history.replaceState(null, document.title, e("edit", c, t.tag_name)), r = $("#release_id"), r.val() || (r.val(t.id), o.append('<input type="hidden" id="release_method" name="_method" value="put">')), i(s, "is-saved"), setTimeout(function() {
                        return i(s, "is-default")
                    }, 5e3), n ? n() : void 0
                },
                complete: function() {},
                error: function() {
                    console.log("test" + s);
                    return i(s, "is-failed")
                }
            }), t.preventDefault()
        }), $(document).on("click", ".js-publish-release", function() {
            return $("#release_draft").val("0")
        }), r = ["is-loading", "is-empty", "is-valid", "is-invalid", "is-duplicate", "is-pending"], s = function(t) {
            var e;
            switch (t) {
                case "is-valid":
                    $(".release-target-wrapper").addClass("hidden");
                    break;
                case "is-loading":
                    break;
                default:
                    $(".release-target-wrapper").removeClass("hidden")
            }
            return e = $(".js-release-tag"), e.removeClass(r.join(" ")), e.addClass(t)
        }, t = function(t) {
            return t.val() && t.val() !== t.attr("data-last-checked") ? (s("is-loading"), $.ajax({
                url: t.attr("data-url"),
                type: "GET",
                data: {
                    tag_name: t.val()
                },
                dataType: "json",
                success: function(e) {
                    return "duplicate" === e.status && parseInt(t.attr("data-existing-id")) === parseInt(e.release_id) ? void s("is-valid") : ($(".js-release-tag .js-edit-release-link").attr("href", e.url), s("is-" + e.status))
                },
                error: function() {
                    return s("is-invalid")
                },
                complete: function() {
                    return t.attr("data-last-checked", t.val())
                }
            })) : void 0
        }, e = function(t, e, n) {
            return "" + e + "/releases/" + t + "/" + n
        }, $(document).on("blur", ".js-release-tag-field", function() {
            return t($(this))
        }), $.observe(".js-release-tag-field", function() {
            t($(this))
        }), $(document).on("change", ".js-release-tag", function() {
            var t, e, n, i, s, r, a, o, c;
            if (n = $(this), t = n.closest("form"), e = t.find(".js-previewable-comment-form"), e.length) {
                for (i = e.data("base-preview-url"), i || (i = e.attr("data-preview-url"), i += i.indexOf("?") >= 0 ? "&" : "?", e.data("base-preview-url", i)), s = [], c = n.find('input[name="release[tag_name]"], input[name="release[target_commitish]"]:checked'), a = 0, o = c.length; o > a; a++) r = c[a], r.value && s.push({
                    name: r.name,
                    value: r.value
                });
                return e.attr("data-preview-url", i + $.param(s))
            }
        }), $.observe(".js-previewable-comment-form", function() {
            $(this).closest("form").find(".js-release-tag").trigger("change")
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t() {
                this.validate = e(this.validate, this), this.updateUpsell = e(this.updateUpsell, this), this.selectedPrivacyToggleElement = e(this.selectedPrivacyToggleElement, this), this.handlePrivacyChange = e(this.handlePrivacyChange, this), this.handleOwnerChange = e(this.handleOwnerChange, this), this.elements = {
                    ownerContainer: $(".js-owner-container"),
                    iconPreviewPublic: $(".js-icon-preview-public"),
                    iconPreviewPrivate: $(".js-icon-preview-private"),
                    upgradeUpsell: $("#js-upgrade-container").hide(),
                    upgradeConfirmationCheckbox: $(".js-confirm-upgrade"),
                    upsells: $(".js-upgrade"),
                    privacyToggles: $(".js-privacy-toggle"),
                    privateRadio: $(".js-privacy-toggle[value=false]"),
                    publicRadio: $(".js-privacy-toggle[value=true]"),
                    repoNameField: $("input[type=text].js-repo-name"),
                    form: $("#new_repository"),
                    licenseContainer: $(".js-license-container"),
                    teamBoxes: $(".js-team-select"),
                    suggestion: $(".js-reponame-suggestion")
                }, this.current_login = $("input[name=owner]:checked").prop("value"), this.privateRepo = !1, this.changedPrivacyManually = !1, this.elements.teamBoxes.hide(), this.elements.ownerContainer.on("change", "input[type=radio]", this.handleOwnerChange), this.elements.privacyToggles.on("change", function(t) {
                    return function(e) {
                        return t.handlePrivacyChange(e.targetElement, e)
                    }
                }(this)), this.elements.upgradeUpsell.on("change input", "input", this.validate), this.elements.form.on("repoform:validate", this.validate), this.elements.suggestion.on("click", function(t) {
                    return function(e) {
                        var n;
                        return n = t.elements.repoNameField, n.val($(e.target).text()), n.trigger("change")
                    }
                }(this)), this.handleOwnerChange(), this.validate()
            }
            return t.prototype.handleOwnerChange = function() {
                var t, e;
                return this.current_login = $("input[name=owner]:checked").prop("value"), this.elements.repoNameField.trigger("change"), e = this.elements.ownerContainer.find(".select-menu-item.selected"), this.elements.teamBoxes.hide().find("input, select").prop("disabled", !0), t = this.elements.teamBoxes.filter("[data-login=" + this.current_login + "]"), t.show().find("input, select").prop("disabled", !1), this.changedPrivacyManually || ("private" === e.attr("data-default") ? this.elements.privateRadio.prop("checked", "checked").change() : this.elements.publicRadio.prop("checked", "checked").change()), "yes" === e.attr("data-permission") ? ($(".with-permission-fields").show(), $(".without-permission-fields").hide(), $(".errored").show(), $("dl.warn").show()) : ($(".with-permission-fields").hide(), $(".without-permission-fields").show(), $(".errored").hide(), $("dl.warn").hide()), this.updateUpsell(), this.handlePrivacyChange()
            }, t.prototype.handlePrivacyChange = function(t, e) {
                var n;
                return null == t && (t = this.selectedPrivacyToggleElement()), null == e && (e = null), e && !e.isTrigger && (this.changedPrivacyManually = !0), n = this.elements.upgradeUpsell.find(".js-billing-section"), "false" === t.val() ? (this.privateRepo = !0, this.elements.upgradeUpsell.show(), n.removeClass("has-removed-contents"), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", "checked"), this.elements.iconPreviewPublic.hide(), this.elements.iconPreviewPrivate.show()) : (this.privateRepo = !1, this.elements.upgradeUpsell.hide(), n.addClass("has-removed-contents"), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", null), this.elements.form.attr("action", this.elements.form.attr("data-url")), this.elements.iconPreviewPrivate.hide(), this.elements.iconPreviewPublic.show()), this.validate()
            }, t.prototype.selectedPrivacyToggleElement = function() {
                return this.elements.privateRadio.is(":checked") ? this.elements.privateRadio : this.elements.publicRadio
            }, t.prototype.updateUpsell = function() {
                var t;
                return t = this.elements.upsells.filter("[data-login=" + this.current_login + "]"), this.elements.upgradeUpsell.html(t)
            }, t.prototype.validate = function() {
                var t, e;
                return e = !0, this.elements.repoNameField.is(".is-autocheck-successful") || (e = !1), t = this.elements.upgradeUpsell.find("input[type=checkbox]"), this.privateRepo && t.length && !t.is(":checked") && (e = !1), this.elements.form.find("button.primary").prop("disabled", !e)
            }, t
        }(), $(function() {
            return $(".page-new-repo").length ? new t : void 0
        }), $(document).on("autocheck:send", "#repository_name", function(t, e) {
            var n, i;
            n = $(this), i = n.closest("form").find("input[name=owner]:checked").val(), e.owner = i, n.trigger("repoform:validate")
        }), $(document).on("autocheck:complete", "#repository_name", function() {
            return $(this).trigger("repoform:validate")
        }), $(document).on("autocheck:success", "#repository_name", function(t, e) {
            var n, i, s;
            return i = $(this).val(), i && i !== e.name ? (n = $(this).closest("dl.form"), n.addClass("warn"), s = $("<dd>").addClass("warning").text("Will be created as " + e.name), n.append(s)) : void 0
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e;
            t = null != document.getElementById("js-show-full-navigation"), $(".repository-with-sidebar").toggleClass("with-full-navigation", t);
            return t ? (e = $(".js-repo-nav").attr("data-issue-count-url"), $.fetchJSON(e).then(function(t) {
                return $(".js-issue-replace-counter").replaceWith(t.issues_count), $(".js-pull-replace-counter").replaceWith(t.pulls_count)
            })) : void 0
        }, $(function() {
            var e;
            return (e = document.getElementById("js-repo-pjax-container")) ? t(e) : void 0
        }), $(document).on("pjax:end", "#js-repo-pjax-container", function() {
            return t(this)
        }), $(document).on("pjax:clicked", ".js-directory-link", function() {
            return $(this).closest("tr").addClass("is-loading"), $(document.body).addClass("disables-context-loader")
        }), $(document).on("pjax:click", ".js-octicon-loaders a", function() {
            return $(this).addClass("is-loading"), $(document).one("pjax:end", function(t) {
                return function() {
                    return $(t).removeClass("is-loading")
                }
            }(this))
        }), $(function() {
            var t;
            return t = $(".mini-nav, .repo-container .menu"), t.length ? $.each(t, function(t, e) {
                return new FastClick(e)
            }) : void 0
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            return $(".js-repo-toggle-team:checked").visible()
        }, $(document).onFocusedInput(".js-repository-name", function() {
            var t, e, n;
            return e = /[^0-9A-Za-z_\-.]/g, n = $(".js-form-note"), t = $(".js-rename-repository-button"),
                function() {
                    n.html("Will be renamed as <code>" + this.value.replace(e, "-") + "</code>"), e.test(this.value) ? n.show() : n.hide(), this.value && this.value !== $(this).attr("data-original-name") ? t.prop("disabled", !1) : t.prop("disabled", !0)
                }
        }), $(document).on("click", ".js-repo-team-suggestions-view-all", function() {
            return $.fetchText(this.href).then(function(e) {
                return function(n) {
                    var i, s;
                    return s = t().map(function() {
                        return this.value
                    }), i = $(e).closest("ul"), i.html(n), s.each(function() {
                        return i.find(".js-repo-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        $(document).on("pjax:end", function() {
            var t, e, n, i, s, r, a, o, c, l, u;
            var s = $(document.head).find("meta[name='selected-link']").attr("value");
            if(s) {
                var e = $(".js-sidenav-container-pjax .js-selected-navigation-item").removeClass("selected");
                for(var r = 0; r < e.length; r++) {
                    var t = e[r];
                    var l;
                    var i = null != (l = $(t).attr("data-selected-links")) ? l : "";
                    var u = i.split(" ");
                    for(var j = 0;j < u.length; j++) {
                        var n = u[j]
                        if(n === s) {
                            $(t).addClass("selected")
                        }
                    }
                }
            }
        })
    }.call(this),
    function() {
        var t, e;
        t = function(t) {
            var e;
            return e = $(".js-site-search-form")[0], e.setAttribute("action", e.getAttribute("data-global-search-url")), $(".js-site-search").removeClass("repo-scope"), t.setAttribute("placeholder", t.getAttribute("data-global-scope-placeholder"))
        }, e = function(t) {
            var e;
            return e = $(".js-site-search-form")[0], e.setAttribute("action", e.getAttribute("data-repo-search-url")), $(".js-site-search").addClass("repo-scope"), t.setAttribute("placeholder", t.getAttribute("data-repo-scope-placeholder"))
        }, $(document).on("keyup", ".js-site-search-field", function(n) {
            var i;
            return i = this.value, "" === i && "backspace" === n.hotkey && this.classList.contains("is-clearable") && t(this), "" === i && "esc" === n.hotkey && e(this), this.classList.toggle("is-clearable", "" === i)
        }), $(document).on("focusout", ".js-site-search-field", function() {
            "" === this.value && e(this)
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-action-ldap-create", function() {
            return $(this).find(".minibutton").addClass("disabled")
        }), $(document).on("ajaxError", ".js-action-ldap-create", function() {
            return !1
        }), $(document).on("ajaxComplete", ".js-action-ldap-create", function(t, e) {
            var n, i;
            return n = $(this), i = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(" &ndash; " + i), 200 === e.status && n.find(".button").hide(), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-action-pull", function() {
            return $(this).find(".minibutton").not(".disabled").addClass("reenable disabled")
        }), $(document).on("ajaxComplete", ".js-action-pull", function(t, e) {
            var n, i, s;
            return n = $(this), s = $(t.target), 200 === e.status && (s.hasClass("close") || s.hasClass("open") ? $.pjax.reload($("#js-pjax-container")) : n.find(".reenable").removeClass("reenable disabled")), i = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(i), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-success").removeClass("status-indicator-loading").addClass("status-indicator-loading")
        }), $(document).on("ajaxError", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-loading").addClass("status-indicator-failed")
        }), $(document).on("ajaxSuccess", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-loading").addClass("status-indicator-success")
        }), $(document).on("ajaxBeforeSend", ".js-unignore-form, .js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").addClass("loading")
        }), $(document).on("ajaxError", ".js-unignore-form, .js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem unignoring this repo.")
        }), $(document).on("ajaxSuccess", ".js-unignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), $(document).on("ajaxBeforeSend", ".js-unsubscribe-form, .js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").addClass("loading")
        }), $(document).on("ajaxError", ".js-unsubscribe-form, .js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem with unsubscribing :(")
        }), $(document).on("ajaxSuccess", ".js-unsubscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-thread-subscription-status", function(t, e, n, i) {
            return $(".js-thread-subscription-status").updateContent(i)
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            return $(".js-team-add-user-form[data-ajax-save-enabled]").length > 0
        }, $(document).on("autocomplete:autocompleted:changed", ".js-team-add-user-name", function() {
            var t;
            return t = $(".js-team-add-user-button")[0], t.disabled = !$(this).attr("data-autocompleted")
        }), $(document).on("click", ".js-team-remove-user", function(e) {
            var n, i, s;
            return e.preventDefault(), $(".js-team-add-user-form").removeClass("hidden"), $(".js-team-add-user-name").focus(), n = $(this).closest("li").remove(), i = n.attr("data-login"), t() ? (s = $(".js-team-add-user-form").attr("data-destroy-url"), $.ajax({
                url: s,
                data: {
                    member: i
                },
                type: "POST"
            })) : void 0
        }), $(document).on("click", ".js-team-add-user-button", function(e) {
            var n, i, s, r, a, o;
            if (e.preventDefault(), n = $(".js-team-add-user-name"), s = n.val(), s && n.attr("data-autocompleted")) {
                for (n.val(""), o = $(".js-team-user-logins li"), r = 0, a = o.length; a > r; r++)
                    if (i = o[r], $(i).attr("data-login") === s) return;
                return $.sudo().then(function() {
                    var e;
                    return t() && (e = $(".js-team-add-user-form").attr("data-create-url"), $.ajax({
                        url: e,
                        data: {
                            member: s
                        },
                        type: "POST"
                    })), $.ajax({
                        url: $(".js-team-add-user-form").attr("data-template-url"),
                        data: {
                            member: s
                        },
                        success: function(e) {
                            return $(".js-team-user-logins").append(e), $(".js-login-field").prop("disabled", t()), t() ? void 0 : $(".js-team-add-user-form").addClass("hidden")
                        }
                    }), $(".js-team-add-user-name").focus()
                })
            }
        })
    }.call(this),
    function() {
        var t, e, n = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t(t) {
                var e;
                e = $(t), this.name = e.data("theme-name"), this.slug = e.data("theme-slug"), this.baseHref = e.attr("href")
            }
            return t.prototype.wrappedKey = function(t, e) {
                return null == e && (e = null), e ? "" + e + "[" + t + "]" : t
            }, t.prototype.params = function(t) {
                var e;
                return null == t && (t = null), e = {}, e[this.wrappedKey("theme_slug", t)] = this.slug, e
            }, t.prototype.previewSrc = function() {
                return [this.baseHref, $.param(this.params())].join("&")
            }, t
        }(), e = function() {
            function e() {
                this.updateScrollLinks = n(this.updateScrollLinks, this), this.scrollThemeLinksContainer = n(this.scrollThemeLinksContainer, this), this.onPublishClick = n(this.onPublishClick, this), this.onHideClick = n(this.onHideClick, this), this.onThemeLinkClick = n(this.onThemeLinkClick, this), this.onThemeNavNextClick = n(this.onThemeNavNextClick, this), this.onThemeNavPrevClick = n(this.onThemeNavPrevClick, this), this.onScrollForwardsClick = n(this.onScrollForwardsClick, this), this.onScrollBackwardsClick = n(this.onScrollBackwardsClick, this), this.onPagePreviewLoad = n(this.onPagePreviewLoad, this), this.pagePreview = $("#page-preview"), this.contextLoader = $(".theme-picker-spinner"), this.fullPicker = $(".theme-picker-thumbs"), this.miniPicker = $(".theme-picker-controls"), this.scrollBackwardsLinks = $(".theme-toggle-full-left"), this.scrollForwardsLinks = $(".theme-toggle-full-right"), this.prevLinks = $(".theme-picker-prev"), this.nextLinks = $(".theme-picker-next"), this.themeLinksContainer = this.fullPicker.find(".js-theme-selector"), this.themeLinks = this.themeLinksContainer.find(".theme-selector-thumbnail"), this.themes = [], this.themeLinks.each(function(e) {
                    return function(n, i) {
                        return e.themes.push(new t(i))
                    }
                }(this)), this.selectedTheme = this.themes[0], this.pagePreview.load(this.onPagePreviewLoad), this.scrollBackwardsLinks.click(this.onScrollBackwardsClick), this.scrollForwardsLinks.click(this.onScrollForwardsClick), this.prevLinks.click(this.onThemeNavPrevClick), this.nextLinks.click(this.onThemeNavNextClick), this.themeLinks.click(this.onThemeLinkClick), $(".theme-picker-view-toggle").click(this.onHideClick), $("#page-edit").click(this.onEditClick), $("#page-publish").click(this.onPublishClick), this.theme(this.selectedTheme), this.updateScrollLinks()
            }
            return e.prototype.onPagePreviewLoad = function() {
                var t, e;
                return this.contextLoader.removeClass("visible"), t = this.pagePreview[0].contentDocument ? this.pagePreview[0].contentDocument : this.pagePreview[0].contentWindow.document, e = "" + this.getDocHeight(t) + "px", this.pagePreview.css("visibility", "hidden"), this.pagePreview.height("10px"), this.pagePreview.height(e), this.pagePreview.css("visibility", "visible")
            }, e.prototype.onScrollBackwardsClick = function() {
                return this.scrollThemeLinksContainer(-1)
            }, e.prototype.onScrollForwardsClick = function() {
                return this.scrollThemeLinksContainer(1)
            }, e.prototype.onThemeNavPrevClick = function() {
                return this.theme(this.prevTheme())
            }, e.prototype.onThemeNavNextClick = function() {
                return this.theme(this.nextTheme())
            }, e.prototype.onThemeLinkClick = function(t) {
                return this.theme(this.themeForLink(t.currentTarget)), !1
            }, e.prototype.onHideClick = function(t) {
                var e;
                return this.fullPicker.toggle(), this.miniPicker.toggle(), this.scrollToTheme(this.theme(), !1), e = $(t.currentTarget), e.toggleClass("open")
            }, e.prototype.onEditClick = function() {
                return $("#page-edit-form").submit(), !1
            }, e.prototype.onPublishClick = function() {
                var t;
                return t = $("#page-publish-form"), t.find('input[name="page[theme_slug]"]').val(this.theme().slug), $("#page-publish-form").submit(), !1
            }, e.prototype.scrollThemeLinksContainer = function(t) {
                var e, n, i;
                return n = this.themeLinksContainer.scrollLeft(), i = this.themeLinksContainer.outerWidth(!0), e = n + i * t, this.themeLinksContainer.animate({
                    scrollLeft: e
                }, 400, function(t) {
                    return function() {
                        return t.updateScrollLinks()
                    }
                }(this)), !1
            }, e.prototype.updateScrollLinks = function() {
                var t, e, n;
                return t = this.themeLinksContainer.scrollLeft(), 0 >= t ? (this.scrollBackwardsLinks.addClass("disabled"), this.scrollForwardsLinks.removeClass("disabled")) : (this.scrollBackwardsLinks.removeClass("disabled"), n = this.themeLinksContainer[0].scrollWidth, e = n - this.themeLinksContainer.outerWidth(!0), t >= e ? this.scrollForwardsLinks.addClass("disabled") : this.scrollForwardsLinks.removeClass("disabled"))
            }, e.prototype.selectedThemeIndex = function() {
                return this.themes.indexOf(this.selectedTheme)
            }, e.prototype.prevTheme = function() {
                var t;
                return t = (this.selectedThemeIndex() - 1) % this.themes.length, 0 > t && (t += this.themes.length), this.themes[t]
            }, e.prototype.nextTheme = function() {
                return this.themes[(this.selectedThemeIndex() + 1) % this.themes.length]
            }, e.prototype.themeForLink = function(t) {
                return this.themes[this.themeLinks.index($(t))]
            }, e.prototype.linkForTheme = function(t) {
                return $(this.themeLinks[this.themes.indexOf(t)])
            }, e.prototype.scrollToTheme = function(t, e) {
                var n, i, s, r, a, o;
                return null == e && (e = !0), n = this.linkForTheme(t), o = this.themes.indexOf(t), r = n.outerWidth(!0), s = o * r, i = this.themeLinksContainer.scrollLeft(), a = i + this.themeLinksContainer.outerWidth(!0), i > s || s + r > a ? e ? this.themeLinksContainer.animate({
                    scrollLeft: s
                }, 500) : this.themeLinksContainer.scrollLeft(s) : void 0
            }, e.prototype.theme = function(t) {
                return null == t && (t = null), t ? (this.selectedTheme = t, this.showPreviewFor(t), this.themeLinks.removeClass("selected"), this.linkForTheme(t).addClass("selected"), this.scrollToTheme(t), this.miniPicker.find(".js-theme-name").text(t.name), !1) : this.selectedTheme
            }, e.prototype.showPreviewFor = function(t) {
                var e;
                return this.contextLoader.addClass("visible"), e = this.fullPicker.find("form"), e.find('input[name="theme_slug"]').val(t.slug), e.submit()
            }, e.prototype.getDocHeight = function(t) {
                var e, n;
                return this.pagePreview.height("auto"), e = t.body, n = t.documentElement, Math.max(e.scrollHeight, e.offsetHeight, n.clientHeight, n.scrollHeight, n.offsetHeight)
            }, e
        }(), $(function() {
            return document.getElementById("theme-picker-wrap") ? new e : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-transfer-owner-select-target", function() {
            return $(this).hasClass("disabled") ? void 0 : $(this).closest("form").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r;
        s = function(t) {
            return setTimeout(function() {
                var e, n, i, s, a;
                for (s = document.querySelectorAll(".js-tree-finder-field"), a = [], n = 0, i = s.length; i > n; n++) e = s[n], e.value = t, a.push(r(e));
                return a
            }, 0)
        }, i = null, t = new WeakMap, r = function(e, n) {
            var s, a, o, c, l, u, d, h, f, m, p, g, v, b;
            if (m = document.getElementById(e.getAttribute("data-results"))) {
                if (!(c = t.get(m))) return void(null == i && (i = $.fetchJSON(m.getAttribute("data-url")).then(function(n) {
                    return t.set(m, n.paths), r(e), i = null
                })["catch"](function() {
                    return i = null
                })));
                for (p = m.querySelector(".js-tree-browser-result-template").firstElementChild, d = m.querySelector(".js-tree-finder-results"), null == n && (n = e.value), n ? (l = $.fuzzyRegexp(n), f = $.fuzzySort(c, n)) : f = c, s = document.createDocumentFragment(), b = f.slice(0, 50), g = 0, v = b.length; v > g; g++) h = b[g], u = p.cloneNode(!0), a = u.getElementsByClassName("js-tree-finder-path")[0], o = new URL(a.href), o.pathname = "" + o.pathname + "/" + h, a.href = o.href, a.textContent = h, $.fuzzyHighlight(a, n, l), s.appendChild(u);
                d.innerHTML = "", d.appendChild(s), $(d).navigation("focus")
            }
        }, $(document).onFocusedKeydown(".js-tree-finder-field", function(t) {
            return r(this), $(this).on("throttled:input." + t, function() {
                    return r(this)
                }),
                function(t) {
                    return "esc" === t.hotkey ? (history.back(), t.preventDefault()) : void 0
                }
        }), e = function() {
            var t;
            return t = $("<textarea>").css({
                    position: "fixed",
                    top: 0,
                    left: 0,
                    opacity: 0
                }), $(document.body).append(t), t.focus(),
                function() {
                    return t.blur().remove().val()
                }
        }, n = null, $(document).on("pjax:click", ".js-show-file-finder", function() {
            return n = e()
        }), $(document).on("pjax:end", "#js-repo-pjax-container", function() {
            var t;
            return n ? ((t = n()) && s(t), n = null) : void 0
        }), $.observe(".js-tree-finder-field", function() {
            r(this)
        })
    }.call(this),
    function() {
        var t, e, n, i;
        n = function() {
            return $("body").addClass("is-sending"), $("body").removeClass("is-sent is-not-sent")
        }, i = function() {
            return $("body").addClass("is-sent"), $("body").removeClass("is-sending")
        }, e = function(t) {
            return t.responseText.length && $(".js-sms-error").text(t.responseText), $("body").addClass("is-not-sent"), $("body").removeClass("is-sending")
        }, t = function(t) {
            return n(), $.ajax({
                url: t,
                type: "POST",
                success: i,
                error: e
            }), !1
        }, $(document).on("click", ".js-resend-auth-code", function() {
            return t("/sessions/two_factor/resend")
        }), $(document).on("click", ".js-send-fallback-auth-code", function() {
            return t("/sessions/two_factor/send_fallback")
        }), $(document).on("click", ".js-send-two-factor-code", function() {
            var t, s, r, a, o;
            return t = $(this).closest("form"), s = t.find(".js-country-code-select").val(), r = t.find(".js-sms-number").val(), a = "" + s + " " + r, o = t.find(".js-two-factor-secret").val(), t.find("input,button,select").prop("disabled", !0), n(), $.ajax({
                url: "/settings/two_factor_authentication/send_sms",
                type: "POST",
                data: {
                    number: a,
                    two_factor_secret: o
                },
                success: function() {
                    return i(), t.find(".js-2fa-enable").prop("disabled", !1), t.find(".js-2fa-confirm").prop("disabled", !0), t.find(".js-2fa-otp").focus()
                },
                error: function(n) {
                    return e(n), t.find(".js-2fa-enable").prop("disabled", !0), t.find(".js-2fa-confirm").prop("disabled", !1)
                }
            }), !1
        }), $(document).on("click", "button.js-2fa-enable", function() {
            var t;
            return t = $(this).closest("form"), t.find("input,button,select").prop("disabled", !1)
        }), $(document).on("loading.facebox", function() {
            return "/settings/two_factor_authentication/configure" === window.location.pathname ? ($(".js-configure-sms-fallback .facebox-alert").text("").hide(), $(".js-configure-sms-fallback").show(), $(".js-verify-sms-fallback").hide()) : void 0
        }), $(document).on("ajaxSuccess", ".js-two-factor-set-sms-fallback", function(t, e) {
            switch (e.status) {
                case 200:
                case 201:
                    return window.location.reload();
                case 202:
                    return $(".js-configure-sms-fallback").hide(), $(".js-verify-sms-fallback").show(), $(".js-fallback-otp").focus()
            }
        }), $(document).on("ajaxError", ".js-two-factor-set-sms-fallback", function(t, e) {
            switch (e.status) {
                case 422:
                    return window.location.reload();
                case 429:
                    return $(".js-configure-sms-fallback .facebox-alert").text(e.responseText).show(), !1
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-user-sessions-revoke", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return $.ajax({
                        type: "DELETE",
                        url: t.href
                    }).then(function() {
                        return $(t).closest("li").remove()
                    })
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-add-yubicat-link", function(t) {
            return $(".js-new-yubicat").addClass("is-active").removeClass("is-showing-error"), $(".js-yubicat-otp-field").focus(), t.preventDefault()
        }), $(document).on("click", ".js-add-yubicat-cancel", function(t) {
            return $(".js-new-yubicat").removeClass("is-active"), t.preventDefault()
        }), $(document).on("ajaxBeforeSend", ".js-new-yubicat", function() {
            return $(this).addClass("is-sending"), $(this).removeClass("is-showing-error")
        }), $(document).on("click", ".js-yubicat-delete", function() {
            return $(this).closest(".js-yubicat-device").addClass("is-sending")
        }), $(document).on("ajaxSuccess", ".js-yubicat-delete", function() {
            return $(this).closest(".js-yubicat-device").remove()
        }), $(document).on("ajaxSuccess", ".js-new-yubicat", function(t, e) {
            var n, i, s;
            return $(this).removeClass("is-sending is-active"), $(".js-yubicat-otp-field").val(""), n = $(".js-yubicat-device-template").clone().addClass("yubicat-device js-yubicat-device").removeClass("hidden js-yubicat-device-template"), i = n.find(".js-yubicat-delete"), s = i.attr("href").replace("deviceId", e.responseText), i.attr("href", s), n.find(".js-yubicat-device-id").html(e.responseText), $(".js-yubicat-list").append(n)
        }), $(document).on("ajaxError", ".js-new-yubicat", function(t, e) {
            var n;
            return n = $(".js-yubicat-error"), n.html(422 === e.status && "" !== e.responseText.replace(/\s/, "") ? e.responseText : "There was an error. Refresh the page and try again."), $(this).removeClass("is-sending is-active"), $(this).addClass("is-showing-error"), $(".js-yubicat-otp-field").val(""), !1
        }), $(document).on("click", ".js-yubicat-error-close", function() {
            return $(".js-new-yubicat").removeClass("is-showing-error")
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a;
        $.support.pjax && GitHub.performanceEnabled() && (e = null, s = "last_pjax_request", r = "pjax_start", i = "pjax_end", n = function(t) {
            var n, i;
            (n = null != (i = t.relatedTarget) ? i.href : void 0) && (window.performance.mark(r), e = n)
        }, a = function() {
            setImmediate(function() {
                var n, a;
                if (window.performance.getEntriesByName(r).length && (window.performance.mark(i), window.performance.measure(s, r, i), a = window.performance.getEntriesByName(s), n = a.pop().duration)) return GitHub.stats({
                    pjax: {
                        url: e,
                        ms: Math.round(n)
                    }
                }), t()
            })
        }, t = function() {
            window.performance.clearMarks(r), window.performance.clearMarks(i), window.performance.clearMeasures(s)
        }, $(document).on("pjax:start", n), $(document).on("pjax:end", a))
    }.call(this),
    function() {
        $(document).on("click", ".js-rich-diff.collapsed .js-expandable", function(t) {
            return t.preventDefault(), $(t.target).closest(".js-rich-diff").removeClass("collapsed")
        }), $(document).on("click", ".js-show-rich-diff", function(t) {
            return t.preventDefault(), $(this).closest(".js-warn-no-visible-changes").addClass("hidden").hide().siblings(".js-no-rich-changes").removeClass("hidden").show()
        })
    }.call(this),
    function() {
        var t, e, n, i, s, r, a;
        e = function() {
            return $(".user-interests-item").not(".hidden").length
        }, r = function() {
            return 0 === e() ? ($(".recommendations-outro").fadeOut(100), $(".recommendations-intro").fadeIn(100)) : ($(".recommendations-intro").fadeOut(100), $(".recommendations-outro").fadeIn(100))
        }, a = function() {
            var t, n;
            return t = e(), n = function() {
                switch (!1) {
                    case 0 !== t:
                        return "Which programming languages, frameworks, topics, etc.?";
                    case 1 !== t:
                        return "Awesome! What else?";
                    case 2 !== t:
                        return "Excellent \u2013 let's keep going!";
                    case 3 !== t:
                        return "These are great. Anything else?";
                    case 4 !== t:
                        return "Great! Maybe one more?"
                }
            }(), 5 === t ? ($(".js-user-recommendations-form").delay(500).hide(), $(".js-recommendations-complete").delay(500).show()) : $(".js-recommendations-complete").visible() && ($(".js-user-recommendations-form").show(), $(".js-recommendations-complete").hide()), $(".js-user-interests-input").attr("placeholder", n), r()
        }, s = null, t = function(t, e, r) {
            var o, c, l, u, d;
            return c = document.querySelector(".js-user-recommendations-form"), l = c.querySelector(".js-user-interests-input"), t = t.trim(), $(".js-button-skip").hide(), l.value = "", null == s && (s = $(".js-user-interests-item.hidden").remove().removeClass("hidden")[0]), u = s.cloneNode(!0), u.title = t, u.insertBefore(document.createTextNode(t), u.firstChild), $(".js-user-interests-list").append(u), u = $(u), d = u.offset(), o = Math.abs(r - d.left), u.css("position", "absolute").css("top", e).css("left", r).fadeIn(100).animate({
                top: d.top,
                left: d.left - 8
            }, {
                duration: 300 + .2 * o,
                specialEasing: {
                    top: "easeInBack"
                },
                complete: function() {
                    return $(this).css("position", "relative"), $(this).css("top", 0), $(this).css("left", 0), l.value = t, i(c).then(function() {
                        return n()
                    }), l.value = ""
                }
            }), a()
        }, $.easing.easeInBack = function(t, e, n, i, s, r) {
            return void 0 === r && (r = 3.70158), i * (e /= s) * e * ((r + 1) * e - r) + n
        }, n = function() {
            return $.pjax({
                url: "/recommendations",
                container: "#site-container"
            })
        }, $(document).on("pjax:complete", function() {
            return a()
        }), $(function() {
            return $(".user-interests-item").length ? a() : void 0
        }), $(document).on("submit", ".js-user-recommendations-form", function(e) {
            var n, i, s, r, a;
            return e.preventDefault(), n = this.querySelector(".js-user-interests-input"), i = n.value, r = $(n).offset(), a = r.top, s = r.left, t(i, a, s)
        }), $(document).on("click", ".js-interest-option", function(e) {
            var n, i, s, r, a;
            return e.preventDefault(), r = this, n = r.getAttribute("data-name"), s = $(r).offset(), a = s.top - $(r).height() / 2, i = s.left - $(r).width() / 2, t(n, a, i)
        }), $(document).on("submit", ".js-remove-user-interest-form", function(t) {
            return t.preventDefault(), i(this).then(function() {
                return n()
            })
        }), $(document).onFocusedKeydown(".js-user-interests-input", function() {
            return function(t) {
                return "," === t.hotkey && ($(".js-user-recommendations-form").trigger("submit"), t.preventDefault()), "" === $(this).val() && "space" === t.hotkey ? t.preventDefault() : void 0
            }
        }), i = function(t) {
            return $.fetch(t.getAttribute("action"), {
                method: t.getAttribute("method"),
                body: $.param($(t).serializeArray()),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
        }
    }.call(this),
    function() {
        var t, e, n, i, s, r, a, o;
        a = ["is-render-pending", "is-render-ready", "is-render-loading", "is-render-loaded"].reduce(function(t, e) {
            return "" + t + " " + e
        }), r = function(t) {
            var e;
            return e = t.data("timing"), null != e ? (e.load = e.hello = null, e.helloTimer && (clearTimeout(e.helloTimer), e.helloTimer = null), e.loadTimer ? (clearTimeout(e.loadTimer), e.loadTimer = null) : void 0) : void 0
        }, n = function(t) {
            var e, n, i;
            if (!t.data("timing")) return e = 10, n = 45, i = {
                load: null,
                hello: null,
                helloTimer: null,
                loadTimer: null
            }, i.load = Date.now(), i.helloTimer = setTimeout(o(t, function() {
                return !i.hello
            }), 1e3 * e), i.loadTimer = setTimeout(o(t), 1e3 * n), t.data("timing", i)
        }, s = function(t) {
            return t.addClass("is-render-requested")
        }, i = function(t, e) {
            return t.removeClass(a), t.addClass("is-render-failed"), null != e && t.addClass("is-render-failed-" + e), r(t)
        }, o = function(t, e) {
            return null == e && (e = function() {
                    return !0
                }),
                function() {
                    var n, s;
                    return n = function() {
                        try {
                            return t.is($.visible)
                        } catch (e) {
                            return t.visible().length > 0
                        }
                    }(), !n || t.hasClass("is-render-ready") || t.hasClass("is-render-failed") || t.hasClass("is-render-failed-fatally") || !e() ? void 0 : (s = t.data("timing")) ? (console.error("Render timeout: " + JSON.stringify(s) + " Now: " + Date.now()), i(t)) : console.error("No timing data on $:", t)
                }
        }, t = function(t) {
            var e, i;
            e = $(t || this), (null != (i = e.data("timing")) ? i.load : 0) || (r(e), n(e), e.addClass("is-render-automatic"), s(e))
        }, null != $.observe ? $.observe(".js-render-target", t) : $(function() {
            return $.each($(".js-render-target"), function(e, n) {
                return t(n)
            })
        }), e = function(t) {
            var e;
            return e = ".js-render-target", $(t ? "" + e + "[data-identity='" + t + "']" : e)
        }, $(window).on("message", function(t) {
            var n, s, r, o, c, l, u, d, h, f, m, p, g, v, $, b;
            if (v = null != (g = t.originalEvent) ? g : t, o = v.data, d = v.origin, o && d && ($ = function() {
                    try {
                        return JSON.parse(o)
                    } catch (e) {
                        return t = e, o
                    }
                }(), p = $.type, l = $.identity, r = $.body, h = $.payload, p && r && 1 === (n = e(l)).length && d === n.data("host") && (f = n.data("timing") || {
                    untimed: !0
                }, "render" === p))) switch (r) {
                case "hello":
                    if (f.hello = Date.now(), s = {
                            type: "render:cmd",
                            body: {
                                cmd: "ack",
                                ack: !0
                            }
                        }, u = {
                            type: "render:cmd",
                            body: {
                                cmd: "branding",
                                branding: !1
                            }
                        }, m = null != (b = n.find("iframe").get(0)) ? b.contentWindow : void 0, "function" == typeof m.postMessage && m.postMessage(JSON.stringify(s), "*"), "function" == typeof m.postMessage && m.postMessage(JSON.stringify(u), "*"), n.data("local")) return c = n.parents(".js-code-editor").data("code-editor"), u = {
                        type: "render:data",
                        body: c.code()
                    }, "function" == typeof m.postMessage ? m.postMessage(JSON.stringify(u), "*") : void 0;
                    break;
                case "error":
                    return i(n);
                case "error:fatal":
                    return i(n, "fatal");
                case "error:invalid":
                    return i(n, "invalid");
                case "loading":
                    return n.removeClass(a), n.addClass("is-render-loading");
                case "loaded":
                    return n.removeClass(a), n.addClass("is-render-loaded");
                case "ready":
                    if (n.removeClass(a), n.addClass("is-render-ready"), null != (null != h ? h.height : void 0)) return n.height(h.height);
                    break;
                case "resize":
                    return null != (null != h ? h.height : void 0) && n.hasClass("is-render-ready") ? n.height(h.height) : console.error("Resize event sent without height or before ready");
                default:
                    return console.error("Unknown message [" + p + "]=>'" + r + "'")
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-toggle-lang-stats", function(t) {
            var e, n;
            return $(".js-stats-switcher-viewport").toggleClass("is-revealing-lang-stats"), n = $(this).closest(".tooltipped").attr("aria-label"), e = "", e = n.match("Show") ? n.replace("Show", "Hide") : n.replace("Hide", "Show"), $(".js-toggle-lang-stats").closest(".tooltipped").attr("aria-label", e), $(this).trigger("mouseover"), t.preventDefault()
        })
    }.call(this),
    function() {
        var t;
        $(document).on("autocomplete:autocompleted:changed", ".js-repository-new-collab-field", function() {
            var t;
            return t = $(this).closest("form").find(".js-add-new-collab"), $(this).attr("data-autocompleted") ? t.removeAttr("disabled") : t.attr("disabled", "disabled")
        }), $(function() {
            return $(".js-add-new-collab").attr("disabled", "disabled")
        }), t = function(t) {
            return t ? $(".js-collab-error").text(t).show() : $(".js-collab-error").hide()
        }, $(document).on("submit", ".js-add-collab-form", function(e) {
            var n, i;
            return e.preventDefault(), n = $(".js-repository-new-collab-field"), i = n.val(), i && n.attr("data-autocompleted") ? (t(), $.ajax({
                url: this.action,
                data: {
                    member: i
                },
                type: "POST",
                dataType: "json",
                success: function(e) {
                    return n.val(""), e.error ? t(e.error) : ($(".js-collab-list").append(e.html), $(".js-empty-collab-list").remove())
                },
                error: function() {
                    return t("An unidentified error occurred, try again?")
                }
            })) : !1
        }), $(document).on("submit", ".js-add-team-form", function(e) {
            var n, i;
            return e.preventDefault(), n = $(".js-repository-new-team-select"), i = n.val().trim(), "" === i ? (t("You must select a team"), !1) : (t(), $.ajax({
                url: this.action,
                data: {
                    team: i
                },
                type: "POST",
                dataType: "json",
                success: function(e) {
                    return n.val(""), e.error ? t(e.error) : $(".js-repo-team-list").append(e.html)
                },
                error: function() {
                    return t("An unidentified error occurred, try again?")
                }
            }))
        }), $(document).on("click", ".js-remove-repo-access", function(e) {
            var n;
            return e.preventDefault(), t(), n = $(this).closest(".js-repo-access-entry"), $.ajax({
                type: "DELETE",
                url: this.href,
                success: function() {
                    return n.remove()
                },
                error: function() {
                    return t("Sorry, we couldn\u2019t remove access. Please try again.")
                }
            })
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-repo-default-branch", function() {
            var t, e, n, i;
            return e = $(this), t = $(this).parents("dl.form"), n = t.find(".js-status-indicator"), i = e.val(), n.removeClass("status-indicator-success").removeClass("status-indicator-failed").addClass("status-indicator-loading"), $.ajax({
                type: "PUT",
                url: t.closest("form").attr("action"),
                data: {
                    field: "repository_default_branch",
                    value: i
                },
                complete: function() {
                    return n.removeClass("status-indicator-loading")
                },
                success: function() {
                    return n.addClass("status-indicator-success")
                },
                error: function() {
                    return n.addClass("status-indicator-failed"), e.val(i)
                }
            })
        }), $(document).on("change", ".js-repo-feature-checkbox", function() {
            var t, e, n;
            return e = this, n = $(this).closest(".js-repo-option"), t = n.find(".js-status-indicator"), t.removeClass("status-indicator-success").removeClass("status-indicator-failed").addClass("status-indicator-loading"), $.ajax({
                type: "PUT",
                url: n.closest("form").attr("action"),
                data: {
                    field: e.name,
                    value: e.checked ? 1 : 0
                },
                success: function(e) {
                    return t.removeClass("status-indicator-loading").addClass("status-indicator-success"), /^\s*</.test(e) ? $(".repo-nav").replaceWith(e) : void 0
                },
                error: function() {
                    return e.checked = !e.checked, t.removeClass("status-indicator-loading").addClass("status-indicator-failed")
                }
            })
        }), $(document).on("change", ".js-repo-feature-radio", function() {
            var t, e, n;
            return e = this, n = $(this).closest(".js-repo-option"), t = n.find(".js-status-indicator"), t.removeClass("status-indicator-success").removeClass("status-indicator-failed").addClass("status-indicator-loading"), $.ajax({
                type: "PUT",
                url: n.closest("form").attr("action"),
                data: {
                    field: e.name,
                    value: e.value
                },
                success: function(e) {
                    return t.removeClass("status-indicator-loading").addClass("status-indicator-success"), /^\s*</.test(e) ? $(".repo-nav").replaceWith(e) : void 0
                },
                error: function() {
                    return e.checked = !1, t.removeClass("status-indicator-loading").addClass("status-indicator-failed")
                }
            })
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-notifications-settings input[type=checkbox]", function() {
            var t, e;
            return t = $(this), e = t.parents("li").find(".js-auto-subscribe-spinner"), e.removeClass("hidden"), $.ajax({
                url: t.parents(".js-notifications-settings").attr("data-toggle-url"),
                type: "POST",
                data: t.parents(".js-notifications-settings").serialize(),
                complete: function() {
                    return e.addClass("hidden")
                }
            })
        }), $(document).on("ajaxSuccess", ".js-remove-item", function() {
            return this.closest("li").remove()
        }), $(document).on("submit", ".js-delete-email", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return $.ajax({
                        type: "DELETE",
                        url: t.action
                    }).then(function() {
                        return $(t).closest("li").remove()
                    })
                }
            }(this)), !1
        }), $(document).on("ajaxSuccess", ".js-toggle-visibility", function(t, e, n, i) {
            return $("#settings-emails").children(".settings-email.primary").toggleClass("private", "private" === i.visibility)
        }), $(document).on("ajaxSend", ".js-remove-key", function() {
            return $(this).addClass("disabled").find("span").text("Deleting\u2026")
        }), $(document).on("ajaxError", ".js-remove-key", function() {
            return $(this).removeClass("disabled").find("span").text("Error. Try again.")
        }), $(document).on("ajaxSuccess", ".js-remove-key", function() {
            return $(this).parents("li").remove(), 0 === $(".js-ssh-keys-box li").length ? $(".js-no-ssh-keys").show() : void 0
        }), $(document).on("click", ".js-leave-collaborated-repo", function(t) {
            var e, n, i;
            return e = $(t.currentTarget), n = e.closest("[data-repo]").attr("data-repo"), i = $('ul.repositories li[data-repo="' + n + '"]'), $.ajax({
                url: "/account/leave_repo/" + n,
                type: "POST"
            }), $.facebox.close(), i.fadeOut(), !1
        }), $(document).on("ajaxError", ".js-name-change-in-progress", function() {
            return $(".js-name-change-in-progress").hide(), $(".js-name-change-error").show()
        }), $(document).on("ajaxSuccess", ".js-unsubscribe-from-newsletter form", function() {
            return $(".js-unsubscribe-from-newsletter .message").toggle()
        }), $(document).on("click", ".js-show-new-ssh-key-form", function() {
            return $(".js-new-ssh-key-box").toggle().find(".js-ssh-key-title").focus(), !1
        }), $(document).on("click", ".js-revoke-access", function() {
            var t, e, n, i, s;
            return i = $(this).data("id"), s = $(this).data("type"), e = $(this).siblings(".js-delete-failed").addClass("hidden"), n = "[data-type=" + s + "][data-id=" + i + "]", t = $(".js-revoke-item").filter(n), $.ajax({
                url: $(this).data("path"),
                type: "DELETE",
                success: function() {
                    return $.facebox.close(), t.remove(), t.hasClass("new-token") ? $(".js-flash-new-token").hide() : void 0
                },
                error: function() {
                    return e.removeClass("hidden")
                }
            }), !1
        }), $(document).on("click", ".js-delete-oauth-application-image", function() {
            var t, e, n;
            return t = $(this).closest(".js-uploadable-container"), t.removeClass("has-uploaded-logo"), e = t.find("img.js-image-field"), n = t.find("input.js-oauth-application-logo-id"), e.attr("src", ""), n.val(""), !1
        }), $(document).on("click", ".js-new-callback", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget).closest(".js-callback-urls"), n = e.find(".js-callback-url").first().clone(), n.removeClass("is-default-callback"), n.find("input").val(""), e.addClass("has-many"), $(t.currentTarget).before(n)
        }), $(document).on("click", ".js-delete-callback", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget).closest(".js-callback-urls"), $(t.currentTarget).closest(".js-callback-url").remove(), n = e.find(".js-callback-url"), n.length <= 1 ? e.removeClass("has-many") : void 0
        }), $(document).on("click", ".js-oauth-application-whitelist .js-deny-this-request", function(t) {
            return $(t.currentTarget).siblings("#state").val("denied"), $(t.currentTarget).closest(".js-org-application-access-form").submit()
        }), $(document).on("ajaxSuccess", ".js-org-application-access-form", function() {
            return window.location.reload()
        }), $(document).on("click", ".js-user-rename-warning-continue", function() {
            return $(".js-user-rename-warning, .js-user-rename-form").toggle(), !1
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-email-notice-trigger").focus(function() {
                return $(".js-email-notice").addClass("notice-highlight")
            }), $(".js-email-notice-trigger").blur(function() {
                return $(".js-email-notice").removeClass("notice-highlight")
            })
        }), $.observe(".js-plan-choice:checked", {
            add: function() {
                return $(this).closest(".plan-row").addClass("selected")
            },
            remove: function() {
                return $(this).closest(".plan-row").removeClass("selected")
            }
        }), $.observe(".js-plan-row.selected", {
            add: function() {
                var t;
                return t = $(this).find(".js-choose-button"), t.text(t.attr("data-selected-text"))
            },
            remove: function() {
                var t;
                return t = $(this).find(".js-choose-button"), t.text(t.attr("data-default-text"))
            }
        }), $.observe(".js-plan-row.free-plan.selected", {
            add: function() {
                var t;
                return t = $("#js-signup-billing-fields"), t.data("contents", t.contents().detach())
            },
            remove: function() {
                var t, e;
                return t = $("#js-signup-billing-fields"), e = t.data("contents"), t.append(e)
            }
        }), $.observe(".js-setup-organization:checked", {
            add: function() {
                var t;
                return t = $(".js-choose-plan-submit"), t.attr("data-default-text") || t.attr("data-default-text", t.text()), t.text(t.attr("data-org-text"))
            },
            remove: function() {
                var t;
                return t = $(".js-choose-plan-submit"), t.text(t.attr("data-default-text"))
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-approve-ssh-key", function() {
            var t;
            return t = $(this), t.addClass("disabled").find("span").text("Approving\u2026"), $.ajax({
                url: t.attr("href"),
                type: "POST",
                success: function() {
                    return t.parents("li").addClass("approved")
                },
                error: function() {
                    return t.removeClass("disabled").find("span").text("Error. Try Again")
                }
            }), !1
        }), $(document).on("click", ".js-reject-ssh-key", function() {
            var t;
            return t = $(this), t.addClass("disabled").find("span").text("Rejecting\u2026"), $.ajax({
                url: t.attr("href"),
                type: "DELETE",
                success: function() {
                    return t.parents("li").addClass("rejected")
                },
                error: function() {
                    return t.removeClass("disabled").find("span").text("Error. Try Again")
                }
            }), !1
        })
    }.call(this),
    function() {
        !$.support.pjax || location.search || location.hash || $(function() {
            var t, e, n;
            return t = null != (n = document.getElementById("issues-dashboard")) ? n : document.getElementById("issues_list"), (e = $(t).attr("data-url")) ? window.history.replaceState(null, document.title, e) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-tabs-container .js-tabs-target", function(t) {
            var e, n;
            n = $(this), e = n.closest(".js-tabs-container"), console.log("click"), e.performTransition(n.hasClass("open") ? function() {
                this.removeClass("open")
            } : function() {
                this.addClass("open")
            }), n.fire("tabs:toggle", {
                relatedTarget: t.target
            }, function() {
                var i;
                i = n.attr("data-tab"), e.find("[data-tab!='" + i + "']").performTransition(function() {
                    this.removeClass("open")
                }), e.find(".js-tabs-target[data-tab='" + i + "']").performTransition(function() {
                    this.toggleClass("open")
                }), e.find(".js-tabs-content-view[data-tab='" + i + "']").performTransition(function() {
                    this.addClass("open")
                }), t.preventDefault()
            })
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e;
            if (location.hash && !document.querySelector(":target")) return t = "user-content-" + location.hash.slice(1), e = document.getElementById(t) || document.getElementsByName(t)[0], null != e ? e.scrollIntoView() : void 0
        }, window.addEventListener("hashchange", function() {
            return t()
        }), $(function() {
            return t()
        })
    }.call(this), $(function() {
        function t() {
            var n = $("#current-version").val();
            n && $.fetchText("_current").then(function(i) {
                n == i ? setTimeout(t, 5e3) : e || ($("#gollum-error-message").text("Someone has edited the wiki since you started. Please reload this page and re-apply your changes."), $("#gollum-error-message").show(), $("#gollum-editor-submit").attr("disabled", "disabled"), $("#gollum-editor-submit").attr("value", "Cannot Save, Someone Else Has Edited"))
            })
        }
        var e = !1;
        $("#gollum-editor-body").each(t), $("#gollum-editor-submit").click(function() {
            e = !0
        })
    });
