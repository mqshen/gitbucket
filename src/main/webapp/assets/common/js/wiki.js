$(document).ready(function() {
        var e = {
            node1: null,
            node2: null,
            selectNodeRange: function() {
                if (e.node1 && e.node2) {
                    if ($(".wiki-history td.selected").removeClass("selected"), e.node1.addClass("selected"), e.node2.addClass("selected"), e.nodeComesAfter(e.node1, e.node2)) {
                        var t = e.node1;
                        e.node1 = e.node2, e.node2 = t
                    }
                    for (var o = e.node1.next(); o && (o.addClass("selected"), o[0] != e.node2[0]);) o = o.next()
                }
            },
            nodeComesAfter: function(e, t) {
                var o = !1;
                return $(e).prevAll().each(function() {
                    $(this)[0] == $(t)[0] && (o = !0)
                }), o
            },
            checkNode: function(t) {
                var o = t,
                    n = $(t).parent().parent();
                o.is(":checked") ? e.node1 ? e.node2 ? o[0].checked = !1 : (e.node2 = n, e.node2.addClass("selected"), e.selectNodeRange(e.node1, e.node2)) : (e.node1 = n, e.node1.addClass("selected")) : ($(".wiki-history tr.selected").each(function() {
                    $(this).find("td.checkbox input").is(":checked") || $(this).removeClass("selected")
                }), n[0] == e.node1[0] ? (e.node1 = null, e.node2 && (e.node1 = e.node2, e.node2 = null)) : n[0] == e.node2[0] && (e.node2 = null))
            }
        };
        $("#minibutton-new-page").length && ($("#minibutton-new-page").removeClass("jaws"), $("#minibutton-new-page").click(function(e) {
            e.preventDefault(), $.GollumDialog.init({
                title: "Create New Page",
                fields: [{
                    id: "name",
                    name: "Page Name",
                    type: "text"
                }],
                OK: function(e) {
                    var t = "New Page";
                    if (e.name) var t = e.name;
                    t = encodeURIComponent(t), window.location = "/" + t
                }
            })
        })), $("#wiki-wrapper").hasClass("history") && ($(".wiki-history td.checkbox input").each(function() {
            $(this).click(function() {
                e.checkNode($(this))
            }), $(this).is(":checked") && e.checkNode($(this))
        }), $(".wiki-history a.action-compare-revision").length && $(".wiki-history a.action-compare-revision").click(function() {
            $("#version-form").submit()
        })), $("#searchbar a#search-submit").length && ($.GollumPlaceholder.add($("#searchbar #search-query")), $("#searchbar a#search-submit").click(function(e) {
            e.preventDefault(), $("#searchbar #search-form").submit()
        }), $("#searchbar #search-form").submit(function() {
            $.GollumPlaceholder.clearAll(), $(this).unbind("submit"), $(this).submit()
        })), $("#gollum-revert-form").length && $(".gollum-revert-button").length && $("a.gollum-revert-button").click(function(e) {
            e.preventDefault(), $("#gollum-revert-form").submit()
        })
    }),
    function(e) {
        var t = {
            _PLACEHOLDERS: [],
            _p: function(t) {
                this.fieldObject = t, this.placeholderText = t.val();
                var o = t.val();
                t.addClass("ph"), t.blur(function() {
                    "" == e(this).val() && (e(this).val(o), e(this).addClass("ph"))
                }), t.focus(function() {
                    e(this).removeClass("ph"), e(this).val() == o ? e(this).val("") : e(this)[0].select()
                })
            },
            add: function(e) {
                t._PLACEHOLDERS.push(new t._p(e))
            },
            clearAll: function() {
                for (var e = 0; e < t._PLACEHOLDERS.length; e++) t._PLACEHOLDERS[e].fieldObject.val() == t._PLACEHOLDERS[e].placeholderText && t._PLACEHOLDERS[e].fieldObject.val("")
            },
            exists: function() {
                return _PLACEHOLDERS.length
            }
        };
        e.GollumPlaceholder = t
    }(jQuery),
    function(e) {
        var t = {
            debugOn: !1,
            markupCreated: !1,
            markup: "",
            attachEvents: function(o) {
                e("#gollum-dialog-action-ok").click(function(e) {
                    t.eventOK(e, o)
                }), e("#gollum-dialog-action-cancel").click(t.eventCancel), e('#gollum-dialog-dialog input[type="text"]').keydown(function(e) {
                    13 == e.keyCode && t.eventOK(e, o)
                })
            },
            detachEvents: function() {
                e("#gollum-dialog-action-ok").unbind("click"), e("#gollum-dialog-action-cancel").unbind("click")
            },
            createFieldMarkup: function(e) {
                for (var o = "<fieldset>", n = 0; n < e.length; n++)
                    if ("object" == typeof e[n]) {
                        switch (o += '<div class="field">', e[n].type) {
                            case "text":
                                o += t.createFieldText(e[n])
                        }
                        o += "</div>"
                    }
                return o += "</fieldset>"
            },
            createFieldText: function(e) {
                var t = "";
                return e.name && (t += "<label", e.id && (t += ' for="' + e.name + '"'), t += ">" + e.name + "</label>"), t += '<input type="text"', e.id && (t += ' name="' + e.id + '"', "code" == e.type && (t += ' class="code"'), t += ' id="gollum-dialog-dialog-generated-field-' + e.id + '">'), t
            },
            createMarkup: function(o, n) {
                return t.markupCreated = !0, e.facebox ? '<div id="gollum-dialog-dialog"><div id="gollum-dialog-dialog-title"><h4>' + o + '</h4></div><div id="gollum-dialog-dialog-body">' + n + '</div><div id="gollum-dialog-dialog-buttons"><a href="#" title="Cancel" id="gollum-dialog-action-cancel" class="gollum-minibutton">Cancel</a><a href="#" title="OK" id="gollum-dialog-action-ok" class="gollum-minibutton">OK</a></div></div>' : '<div id="gollum-dialog-dialog"><div id="gollum-dialog-dialog-inner"><div id="gollum-dialog-dialog-bg"><div id="gollum-dialog-dialog-title"><h4>' + o + '</h4></div><div id="gollum-dialog-dialog-body">' + n + '</div><div id="gollum-dialog-dialog-buttons"><a href="#" title="Cancel" id="gollum-dialog-action-cancel" class="minibutton">Cancel</a><a href="#" title="OK" id="gollum-dialog-action-ok" class="minibutton">OK</a></div></div></div></div>'
            },
            eventCancel: function(e) {
                e.preventDefault(), o("Cancelled dialog."), t.hide()
            },
            eventOK: function(o, n) {
                o.preventDefault();
                var a = [];
                e("#gollum-dialog-dialog-body input").each(function() {
                    a[e(this).attr("name")] = e(this).val()
                }), n && "function" == typeof n && n(a), t.hide()
            },
            hide: function() {
                e.facebox ? (t.markupCreated = !1, e(document).trigger("close.facebox"), t.detachEvents()) : e.browser.msie ? (e("#gollum-dialog-dialog").hide().removeClass("active"), e("select").css("visibility", "visible")) : e("#gollum-dialog-dialog").animate({
                    opacity: 0
                }, {
                    duration: 200,
                    complete: function() {
                        e("#gollum-dialog-dialog").removeClass("active")
                    }
                })
            },
            init: function(n) {
                var a = "",
                    i = "";
                return n && "object" == typeof n ? (n.body && "string" == typeof n.body && (i = "<p>" + n.body + "</p>"), n.fields && "object" == typeof n.fields && (i += t.createFieldMarkup(n.fields)), n.title && "string" == typeof n.title && (a = n.title), t.markupCreated && (e.facebox ? e(document).trigger("close.facebox") : e("#gollum-dialog-dialog").remove()), t.markup = t.createMarkup(a, i), e.facebox ? e(document).bind("reveal.facebox", function() {
                    n.OK && "function" == typeof n.OK && (t.attachEvents(n.OK), e(e('#facebox input[type="text"]').get(0)).focus())
                }) : (e("body").append(t.markup), n.OK && "function" == typeof n.OK && t.attachEvents(n.OK)), void t.show()) : void o("Editor Dialog: Cannot init; invalid init object")
            },
            show: function() {
                t.markupCreated ? (o("Showing dialog"), e.facebox ? e.facebox(t.markup) : e.browser.msie ? (e("#gollum-dialog.dialog").addClass("active"), t.position(), e("select").css("visibility", "hidden")) : (e("#gollum-dialog.dialog").css("display", "none"), e("#gollum-dialog-dialog").animate({
                    opacity: 0
                }, {
                    duration: 0,
                    complete: function() {
                        e("#gollum-dialog-dialog").css("display", "block"), t.position(), e("#gollum-dialog-dialog").animate({
                            opacity: 1
                        }, {
                            duration: 500
                        })
                    }
                }))) : o("Dialog: No markup to show. Please use init first.")
            },
            position: function() {
                var t = e("#gollum-dialog-dialog-inner").height();
                e("#gollum-dialog-dialog-inner").css("height", t + "px").css("margin-top", -1 * parseInt(t / 2))
            }
        };
        e.facebox && e(document).bind("reveal.facebox", function() {
            e("#facebox img.close_image").remove()
        });
        var o = function(e) {
            t.debugOn && "undefined" != typeof console && console.log(e)
        };
        e.GollumDialog = t
    }(jQuery),
    function() {
        $.hidden = function() {
            return this.offsetWidth <= 0 && this.offsetHeight <= 0
        }, $.visible = function() {
            return !$.hidden.call(this)
        }, $.fn.hidden = function() {
            return this.filter($.hidden)
        }, $.fn.visible = function() {
            return this.filter($.visible)
        }
    }.call(this),
    function(e) {
        var t = {
                MarkupType: "markdown",
                EditorMode: "code",
                NewFile: !1,
                HasFunctionBar: !0,
                Debug: !1,
                NoDefinitionsFor: []
            },
            o = {};
        e.GollumEditor = function(l) {
            if (o = e.extend(t, l), n("GollumEditor loading"), i.baseEditorMarkup()) {
                if (i.titleDisplayed() && e("#gollum-editor-title-field").addClass("active"), i.collapsibleInputs() && e("#gollum-editor .collapsed a.button, #gollum-editor .expanded a.button").click(function(t) {
                        t.preventDefault(), e(this).parent().toggleClass("expanded"), e(this).parent().toggleClass("collapsed")
                    }), i.previewButton()) {
                    e("#gollum-editor #gollum-editor-preview").click(function() {
                        var t = e("#gollum-editor form").attr("action"),
                            o = e(e("#gollum-editor form").get(0));
                        return o.attr("action", this.href || "/preview"), o.attr("target", "_blank"), o.submit(), o.attr("action", t), o.removeAttr("target"), !1
                    })
                }
                if (i.functionBar()) {
                    var c = e("#gollum-editor-body").attr("data-markup-lang");
                    c && (o.MarkupType = c), i.formatSelector() && r.init(e("#gollum-editor-format-selector select")), a.setActiveLanguage(o.MarkupType), i.help() && (e("#gollum-editor-help").hide(), e("#gollum-editor-help").removeClass("jaws"))
                }
            }
        }, e.GollumEditor.defineLanguage = function(e, t) {
            "object" == typeof t ? a.define(e, t) : n("GollumEditor.defineLanguage: definition for " + e + " is not an object")
        };
        var n = function(e) {
                o.Debug && "undefined" != typeof console && console.log(e)
            },
            a = {
                _ACTIVE_LANG: "",
                _LOADED_LANGS: [],
                _LANG: {},
                define: function(t, o) {
                    if (a._ACTIVE_LANG = t, a._LOADED_LANGS.push(t), "object" == typeof e.GollumEditor.WikiLanguage) {
                        var n = {};
                        e.extend(n, e.GollumEditor.WikiLanguage, o), a._LANG[t] = n
                    } else a._LANG[t] = o
                },
                getActiveLanguage: function() {
                    return a._ACTIVE_LANG
                },
                setActiveLanguage: function(e) {
                    function t() {
                        l.refresh(), a.isValid() && i.formatSelector() && r.updateSelected(), a.getHookFunctionFor("activate") && a.getHookFunctionFor("activate")()
                    }
                    a.getHookFunctionFor("deactivate") && a.getHookFunctionFor("deactivate")(), a.isLoadedFor(e) ? (a._ACTIVE_LANG = e, t()) : (a._ACTIVE_LANG = null, a.loadFor(e, function(o, i) {
                        "success" != i && (n("Failed to load language definition for " + e), a.define(e, {})), t()
                    }))
                },
                getHookFunctionFor: function(e, t) {
                    return t || (t = a._ACTIVE_LANG), a.isLoadedFor(t) && a._LANG[t][e] && "function" == typeof a._LANG[t][e] ? a._LANG[t][e] : null
                },
                getDefinitionFor: function(e, t) {
                    return t || (t = a._ACTIVE_LANG), a.isLoadedFor(t) && a._LANG[t][e] && "object" == typeof a._LANG[t][e] ? a._LANG[t][e] : null
                },
                loadFor: function(t, n) {
                    if (o.NoDefinitionsFor.length)
                        for (var a = 0; a < o.NoDefinitionsFor.length; a++)
                            if (t == o.NoDefinitionsFor[a] && "function" == typeof n) return void n(null, "error");
                    var i = "/javascript/editor/langs/" + t + ".js";
                    e.ajax({
                        url: i,
                        dataType: "script",
                        complete: function(e, t) {
                            "function" == typeof n && n(e, t)
                        }
                    })
                },
                isLoadedFor: function(e) {
                    if (0 === a._LOADED_LANGS.length) return !1;
                    for (var t = 0; t < a._LOADED_LANGS.length; t++)
                        if (a._LOADED_LANGS[t] == e) return !0;
                    return !1
                },
                isValid: function() {
                    return a._ACTIVE_LANG && "object" == typeof a._LANG[a._ACTIVE_LANG]
                }
            },
            i = {
                baseEditorMarkup: function() {
                    return e("#gollum-editor").length && e("#gollum-editor-body").length
                },
                collapsibleInputs: function() {
                    return e("#gollum-editor .collapsed, #gollum-editor .expanded").length
                },
                formatSelector: function() {
                    return e("#gollum-editor-format-selector select").length
                },
                functionBar: function() {
                    return o.HasFunctionBar && e("#gollum-editor-function-bar").length
                },
                ff4Environment: function() {
                    var e = new RegExp(/Firefox\/4.0b/);
                    return e.test(navigator.userAgent)
                },
                editSummaryMarkup: function() {
                    return e("input#gollum-editor-message-field").length > 0
                },
                help: function() {
                    return e("#gollum-editor #gollum-editor-help").length && e("#gollum-editor #function-help").length
                },
                previewButton: function() {
                    return e("#gollum-editor #gollum-editor-preview").length
                },
                titleDisplayed: function() {
                    return o.NewFile
                }
            },
            l = {
                isActive: !1,
                activate: function() {
                    n("Activating function bar"), e("#gollum-editor-function-bar a.function-button").each(function() {
                        a.getDefinitionFor(e(this).attr("id")) ? (e(this).click(l.evtFunctionButtonClick), e(this).removeClass("disabled")) : "function-help" != e(this).attr("id") && e(this).addClass("disabled")
                    }), e("#gollum-editor-function-bar").addClass("active"), l.isActive = !0
                },
                deactivate: function() {
                    e("#gollum-editor-function-bar a.function-button").unbind("click"), e("#gollum-editor-function-bar").removeClass("active"), l.isActive = !1
                },
                evtFunctionButtonClick: function(t) {
                    t.preventDefault();
                    var o = a.getDefinitionFor(e(this).attr("id"));
                    "object" == typeof o && l.executeAction(o)
                },
                executeAction: function(t) {
                    var o = e("#gollum-editor-body").val(),
                        a = (l.getFieldSelectionPosition(e("#gollum-editor-body")), l.getFieldSelection(e("#gollum-editor-body"))),
                        i = a,
                        r = !0,
                        c = null;
                    if (t.exec && "function" == typeof t.exec) return void t.exec(o, a, e("#gollum-editor-body"));
                    var d = /([^\n]+)/gi;
                    if (t.search && "object" == typeof t.search && (n("Replacing search Regex"), d = null, d = new RegExp(t.search), n(d)), n('repText is "' + i + '"'), t.replace && "string" == typeof t.replace) {
                        n("Running replacement - using " + t.replace);
                        var s = t.replace;
                        i = i.replace(d, s), i = i.replace(/\$[\d]/g, ""), "" === i && (n("Search string is empty"), c = s.indexOf("$1"), i = s.replace(/\$[\d]/g, ""), -1 == c && (c = Math.floor(s.length / 2)))
                    }
                    t.append && "string" == typeof t.append && (i == a && (r = !1), i += t.append), i && l.replaceFieldSelection(e("#gollum-editor-body"), i, r, c)
                },
                getFieldSelectionPosition: function(e) {
                    if (e.length) {
                        var t = 0,
                            o = 0,
                            a = e.get(0);
                        if ("number" == typeof a.selectionStart && "number" == typeof a.selectionEnd) t = a.selectionStart, o = a.selectionEnd;
                        else {
                            var i = document.selection.createRange(),
                                l = i.duplicate();
                            l.moveToElementText(a), l.setEndPoint("EndToEnd", i), t = l.text.length - i.text.length, o = t + i.text.length;
                            var r, c = t,
                                d = 0;
                            for (n("IE: start position is currently " + c), r = 0; c > r; r++) a.value.charAt(r).match(/\r/) && ++d;
                            d && (n("IE start: compensating for " + d + " line breaks"), t -= d, d = 0);
                            var s = o;
                            for (r = 0; s > r; r++) a.value.charAt(r).match(/\r/) && ++d;
                            d && (n("IE end: compensating for " + d + " line breaks"), o -= d)
                        }
                        return {
                            start: t,
                            end: o
                        }
                    }
                },
                getFieldSelection: function(e) {
                    var t, o = "";
                    return e.length ? (t = l.getFieldSelectionPosition(e), o = e.val().substring(t.start, t.end), n("Selected: " + o + " (" + t.start + ", " + t.end + ")"), o) : !1
                },
                isShown: function() {
                    return e("#gollum-editor-function-bar").is(e.visible)
                },
                refresh: function() {
                    i.functionBar() && (n("Refreshing function bar"), a.isValid() ? (e("#gollum-editor-function-bar a.function-button").unbind("click"), l.activate(), c && c.setActiveHelp(a.getActiveLanguage())) : (n("Language definition is invalid."), l.isShown() && l.deactivate(), c.isShown() && c.hide()))
                },
                replaceFieldSelection: function(e, t, o, n) {
                    var a = l.getFieldSelectionPosition(e),
                        i = e.val(),
                        r = !0;
                    o === !1 && (r = !1);
                    var c = null;
                    if (e[0].scrollTop && (c = e[0].scrollTop), e.val(i.substring(0, a.start) + t + i.substring(a.end)), e[0].focus(), r)
                        if (e[0].setSelectionRange) n ? e[0].setSelectionRange(a.start + n, a.start + n) : e[0].setSelectionRange(a.start, a.start + t.length);
                        else if (e[0].createTextRange) {
                        var d = e[0].createTextRange();
                        d.collapse(!0), n ? (d.moveEnd(a.start + n), d.moveStart(a.start + n)) : (d.moveEnd("character", a.start + t.length), d.moveStart("character", a.start)), d.select()
                    }
                    c && (e[0].scrollTop = c)
                }
            },
            r = {
                $_SELECTOR: null,
                evtChangeFormat: function() {
                    var t = e(this).val();
                    a.setActiveLanguage(t)
                },
                init: function(e) {
                    n("Initializing format selector"), r.$_SELECTOR && "object" == typeof r.$_SELECTOR && r.$_SELECTOR.unbind("change"), r.$_SELECTOR = e, r.updateSelected(), r.$_SELECTOR.change(r.evtChangeFormat)
                },
                updateSelected: function() {
                    var e = a.getActiveLanguage();
                    r.$_SELECTOR.val(e)
                }
            },
            c = {
                _ACTIVE_HELP: "",
                _LOADED_HELP_LANGS: [],
                _HELP: {},
                define: function(t, o) {
                    c.isValidHelpFormat(o) ? (n("help is a valid format"), c._ACTIVE_HELP_LANG = t, c._LOADED_HELP_LANGS.push(t), c._HELP[t] = o, e("#function-help").length && (e("#function-help").hasClass("disabled") && e("#function-help").removeClass("disabled"), e("#function-help").unbind("click"), e("#function-help").click(c.evtHelpButtonClick), c.generateHelpMenuFor(t), void 0 !== e("#gollum-editor-help").attr("data-autodisplay") && c.show())) : e("#function-help").length && e("#function-help").addClass("disabled")
                },
                generateHelpMenuFor: function(t) {
                    if (!c._HELP[t]) return n("Help is not defined for " + t.toString()), !1;
                    var o = c._HELP[t];
                    e("#gollum-editor-help-parent").html(""), e("#gollum-editor-help-list").html(""), e("#gollum-editor-help-content").html("");
                    for (var a = 0; a < o.length && "object" == typeof o[a]; a++) {
                        var i = e('<li><a href="#" rel="' + a + '">' + o[a].menuName + "</a></li>");
                        e("#gollum-editor-help-parent").append(i), 0 === a && i.children("a").addClass("selected"), i.children("a").click(c.evtParentMenuClick)
                    }
                    c.generateSubMenu(o[0], 0), e(e("#gollum-editor-help-list li a").get(0)).click()
                },
                generateSubMenu: function(t, o) {
                    e("#gollum-editor-help-list").html(""), e("#gollum-editor-help-content").html("");
                    for (var n = 0; n < t.content.length && "object" == typeof t.content[n]; n++) {
                        var a = e('<li><a href="#" rel="' + o + ":" + n + '">' + t.content[n].menuName + "</a></li>");
                        e("#gollum-editor-help-list").append(a), a.children("a").click(c.evtSubMenuClick)
                    }
                },
                hide: function() {
                    e("#gollum-editor-help").animate({
                        opacity: 0
                    }, 200, function() {
                        e("#gollum-editor-help").animate({
                            height: "hide"
                        }, 200)
                    })
                },
                show: function() {
                    e("#gollum-editor-help").animate({
                        height: "show"
                    }, 200, function() {
                        e("#gollum-editor-help").animate({
                            opacity: 1
                        }, 300)
                    })
                },
                showHelpFor: function(t, o) {
                    var n = c._HELP[c._ACTIVE_HELP_LANG][t].content[o].data;
                    e("#gollum-editor-help-content").html(n)
                },
                isLoadedFor: function(e) {
                    for (var t = 0; t < c._LOADED_HELP_LANGS.length; t++)
                        if (e == c._LOADED_HELP_LANGS[t]) return !0;
                    return !1
                },
                isShown: function() {
                    return e("#gollum-editor-help").is(e.visible)
                },
                isValidHelpFormat: function(e) {
                    return "object" == typeof e && e.length && "string" == typeof e[0].menuName && "object" == typeof e[0].content && e[0].content.length
                },
                setActiveHelp: function(t) {
                    c.isLoadedFor(t) ? (c._ACTIVE_HELP_LANG = t, e("#function-help").length && (e("#function-help").hasClass("disabled") && e("#function-help").removeClass("disabled"), e("#function-help").unbind("click"), e("#function-help").click(c.evtHelpButtonClick), c.generateHelpMenuFor(t))) : (e("#function-help").length && e("#function-help").addClass("disabled"), c.isShown() && c.hide())
                },
                evtHelpButtonClick: function(t) {
                    if (t.preventDefault(), c.isShown()) {
                        var o = e("#gollum-editor-help");
                        void 0 !== o.attr("data-autodisplay") && (e.fetch("/wiki/help", {
                            method: "DELETE"
                        }), o.removeAttr("data-autodisplay")), c.hide()
                    } else c.show()
                },
                evtParentMenuClick: function(t) {
                    if (t.preventDefault(), !e(this).hasClass("selected")) {
                        var o = e(this).attr("rel"),
                            n = c._HELP[c._ACTIVE_HELP_LANG][o];
                        e("#gollum-editor-help-parent li a").removeClass("selected"), e(this).addClass("selected"), c.generateSubMenu(n, o), e(e("#gollum-editor-help-list li a").get(0)).click()
                    }
                },
                evtSubMenuClick: function(t) {
                    if (t.preventDefault(), !e(this).hasClass("selected")) {
                        var o = e(this).attr("rel").split(":");
                        e("#gollum-editor-help-list li a").removeClass("selected"), e(this).addClass("selected"), c.showHelpFor(o[0], o[1])
                    }
                }
            };
        e.GollumEditor.defineHelp = c.define, e.GollumEditor.Dialog = e.GollumDialog, e.GollumEditor.replaceSelection = function(t) {
            l.replaceFieldSelection(e("#gollum-editor-body"), t)
        }, e.GollumEditor.Placeholder = e.GollumPlaceholder
    }(jQuery),
    function() {
        $.hashChange(function(e) {
            var t, o, n, a, i;
            return o = e.newURL, $("#wiki-wrapper").length && (t = window.location.hash.match(/^#(wiki-(.+))$/)) && (n = t[1], i = t[2], a = document.getElementsByName(n), !a.length) ? window.location.hash = i : void 0
        })
    }.call(this),
    function(e) {
        var t = {
            "function-bold": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "*$1*$2"
            },
            "function-italic": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "_$1_$2"
            },
            "function-code": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "+$1+$2"
            },
            "function-ul": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "* $1$2"
            },
            "function-ol": {
                search: /(.+)([\n]?)/g,
                replace: ". $1$2"
            },
            "function-blockquote": {
                search: /(.+)([\n]?)/g,
                replace: "----\n$1$2\n----\n"
            },
            "function-link": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Link",
                        fields: [{
                            id: "text",
                            name: "Link Text",
                            type: "text",
                            help: "The text to display to the user."
                        }, {
                            id: "href",
                            name: "URL",
                            type: "text",
                            help: "The URL to link to."
                        }],
                        OK: function(t) {
                            var o = "";
                            t.text && t.href && (o = t.href + "[" + t.text + "]"), e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            },
            "function-image": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Image",
                        fields: [{
                            id: "url",
                            name: "Image URL",
                            type: "text"
                        }, {
                            id: "alt",
                            name: "Alt Text",
                            type: "text"
                        }],
                        OK: function(t) {
                            var o = "";
                            t.url && t.alt && (o = "image::" + t.url + "[" + t.alt + "]"), e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            }
        };
        e.GollumEditor.defineLanguage("asciidoc", t);
        var o = [{
            menuName: "Text Formatting",
            content: [{
                menuName: "Headers",
                data: "<p>ASCIIDoc headers can be written in two ways: with differing underlines or with different indentation using <code>=</code> (equals sign). ASCIIDoc supports headings 1-4. The editor will automatically use the <code>=</code> notation. To create a level one header, prefix your line with one <code>=</code>. Level two headers are created with <code>==</code> and so on.</p>"
            }, {
                menuName: "Bold / Italic",
                data: "<p>To display text as <strong>bold</strong>, wrap the text in <code>*</code> (asterisks). To display text as <em>italic</em>, wrap the text in <code>_</code> (underscores). To create <code>monospace</code> text, wrap the text in <code>+</code> (plus signs)."
            }, {
                menuName: "Scripts",
                data: "<p>Superscript and subscript is created the same way as other inline formats. To create superscript text, wrap your text in <code>^</code> (carats). To create subscript text, wrap your text in <code>~</code> (tildes).</p>"
            }, {
                menuName: "Special Characters",
                data: "<p>ASCIIDoc will automatically convert textual representations of commonly-used special characters. For example, <code>(R)</code> becomes &reg;, <code>(C)</code> becomes &copy; and <code>(TM)</code> becomes &trade;.</p>"
            }]
        }, {
            menuName: "Blocks",
            content: [{
                menuName: "Paragraphs",
                data: "<p>ASCIIDoc allows paragraphs to have optional titles or icons to denote special sections. To make a normal paragraph, simply add a line between blocks and a new paragraph will start. If you want to title your paragraphs, adda line prefixed by <code>.</code> (full stop). An example paragraph with optional title is displayed below:<br><br><code>.Optional Title<br><br>This is my paragraph. It is two sentences long.</code></p>"
            }, {
                menuName: "Source Blocks",
                data: "<p>To create source blocks (long blocks of code), follow the same syntax as above but with an extra line denoting the inline source and lines of four dashes (<code>----</code>) delimiting the source block.. An example of Python source is below:<br><br><code>.python.py<br>[source,python]<br>----<br># i just wrote a comment in python<br># and maybe one more<br>----</code></p>"
            }, {
                menuName: "Comment Blocks",
                data: "<p>Comment blocks are useful if you want to keep notes for yourself inline but do not want them displayed to the public. To create a comment block, simply wrap the paragraph in dividers with four slashes (<code>////</code>). An example comment block is below:<br><br><code>////<br>My comment block is here now<br><br>It can be multiple paragraphs. Really.<br>////</p>"
            }, {
                menuName: "Quote Blocks",
                data: "<p>Quote blocks work much like comment blocks &mdash; simply create dividers using four underscores (<code>____</code>) around your quote. An example quote block is displayed below:<br><code>____<br>This is my quote block. Quote something nice here, otherwise there is no point in quoting.<br>____</code></p>"
            }]
        }, {
            menuName: "Macros",
            content: [{
                menuName: "Links",
                data: '<p>To create links to external pages, you can simply write the URI if you want the URI to link to itself. (i.e., <code>http://github.com/</code> will automatically be parsed to <a href="javascript:void(0);">http://github.com/</a>. If you want different text to be displayed, simply append it to the end of the URI in between <code>[</code> (brackets.) For example, <code>http://github.com/[GitHub]</code> will be parsed as <a href="javascript:void(0);">GitHub</a>, with the URI pointing to <code>http://github.com</code>.</p>'
            }, {
                menuName: "Images",
                data: "<p>Images in ASCIIDoc work much like hyperlinks, but image URLs are prefixed with <code>image:</code>. For example, to link to an image at <code>images/icons/home.png</code>, write <code>image:images/icons/home.png</code>. Alt text can be added by appending the text to the URI in <code>[</code> (brackets).</p>"
            }]
        }];
        e.GollumEditor.defineHelp("asciidoc", o)
    }(jQuery),
    function(e) {
        var t = {
            "function-bold": {
                search: /([^\n]+)([\n]*)/gi,
                replace: "**$1**$2"
            },
            "function-italic": {
                search: /([^\n]+)([\n]*)/gi,
                replace: "//$1//$2"
            },
            "function-code": {
                search: /([^\n]+)([\n]*)/gi,
                replace: "{{{$1}}}$2"
            },
            "function-hr": {
                append: "\n\n----\n\n"
            },
            "function-ul": {
                search: /(.+)([\n]?)/gi,
                replace: "* $1$2"
            },
            "function-ol": {
                search: /(.+)([\n]?)/gi,
                replace: "# $1$2"
            },
            "function-link": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Link",
                        fields: [{
                            id: "text",
                            name: "Link Text",
                            type: "text",
                            help: "The text to display to the user."
                        }, {
                            id: "href",
                            name: "URL",
                            type: "text",
                            help: "The URL to link to."
                        }],
                        OK: function(t) {
                            var o = "[[" + t.href + "|" + t.text + "]]";
                            e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            },
            "function-image": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Image",
                        fields: [{
                            id: "url",
                            name: "Image URL",
                            type: "text"
                        }, {
                            id: "alt",
                            name: "Alt Text",
                            type: "text"
                        }],
                        OK: function(t) {
                            var o = "";
                            t.url && t.alt && (o = "{{" + t.url, "" != t.alt && (o += "|" + t.alt + "}}")), e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            }
        };
        e.GollumEditor.defineLanguage("creole", t)
    }(jQuery),
    function(e) {
        var t = {
                "function-bold": {
                    search: /([^\n]+)([\n\s]*)/g,
                    replace: "**$1**$2"
                },
                "function-italic": {
                    search: /([^\n]+)([\n\s]*)/g,
                    replace: "_$1_$2"
                },
                "function-code": {
                    search: /([^\n]+)([\n\s]*)/g,
                    replace: "`$1`$2"
                },
                "function-hr": {
                    append: "\n***\n"
                },
                "function-ul": {
                    search: /(.+)([\n]?)/g,
                    replace: "* $1$2"
                },
                "function-ol": {
                    search: /(.+)([\n]?)/g,
                    replace: "1. $1$2"
                },
                "function-blockquote": {
                    search: /(.+)([\n]?)/g,
                    replace: "> $1$2"
                },
                "function-h1": {
                    search: /(.+)([\n]?)/g,
                    replace: "# $1$2"
                },
                "function-h2": {
                    search: /(.+)([\n]?)/g,
                    replace: "## $1$2"
                },
                "function-h3": {
                    search: /(.+)([\n]?)/g,
                    replace: "### $1$2"
                },
                "function-link": {
                    exec: function() {
                        e.GollumEditor.Dialog.init({
                            title: "Insert Link",
                            fields: [{
                                id: "text",
                                name: "Link Text",
                                type: "text"
                            }, {
                                id: "href",
                                name: "URL",
                                type: "text"
                            }],
                            OK: function(t) {
                                var o = "";
                                t.text && t.href && (o = "[" + t.text + "](" + t.href + ")"), e.GollumEditor.replaceSelection(o)
                            }
                        })
                    }
                },
                "function-image": {
                    exec: function() {
                        e.GollumEditor.Dialog.init({
                            title: "Insert Image",
                            fields: [{
                                id: "url",
                                name: "Image URL",
                                type: "text"
                            }, {
                                id: "alt",
                                name: "Alt Text",
                                type: "text"
                            }],
                            OK: function(t) {
                                var o = "";
                                t.url && (o = "![" + t.alt + "](" + t.url + ")"), e.GollumEditor.replaceSelection(o)
                            }
                        })
                    }
                }
            },
            o = [{
                menuName: "Block Elements",
                content: [{
                    menuName: "Paragraphs &amp; Breaks",
                    data: "<p>To create a paragraph, simply create a block of text that is not separated by one or more blank lines. Blocks of text separated by one or more blank lines will be parsed as paragraphs.</p><p>If you want to create a line break, end a line with two or more spaces, then hit Return/Enter.</p>"
                }, {
                    menuName: "Headers",
                    data: "<p>Markdown supports two header formats. The wiki editor uses the &ldquo;atx&rsquo;-style headers. Simply prefix your header text with the number of <code>#</code> characters to specify heading depth. For example: <code># Header 1</code>, <code>## Header 2</code> and <code>### Header 3</code> will be progressively smaller headers. You may end your headers with any number of hashes.</p>"
                }, {
                    menuName: "Blockquotes",
                    data: "<p>Markdown creates blockquotes email-style by prefixing each line with the <code>&gt;</code>. This looks best if you decide to hard-wrap text and prefix each line with a <code>&gt;</code> character, but Markdown supports just putting <code>&gt;</code> before your paragraph.</p>"
                }, {
                    menuName: "Lists",
                    data: "<p>Markdown supports both ordered and unordered lists. To create an ordered list, simply prefix each line with a number (any number will do &mdash; this is why the editor only uses one number.) To create an unordered list, you can prefix each line with <code>*</code>, <code>+</code> or <code>-</code>.</p> List items can contain multiple paragraphs, however each paragraph must be indented by at least 4 spaces or a tab."
                }, {
                    menuName: "Code Blocks",
                    data: "<p>Markdown wraps code blocks in pre-formatted tags to preserve indentation in your code blocks. To create a code block, indent the entire block by at least 4 spaces or one tab. Markdown will strip the extra indentation you&rsquo;ve added to the code block.</p>"
                }, {
                    menuName: "Horizontal Rules",
                    data: "Horizontal rules are created by placing three or more hyphens, asterisks or underscores on a line by themselves. Spaces are allowed between the hyphens, asterisks or underscores."
                }]
            }, {
                menuName: "Span Elements",
                content: [{
                    menuName: "Links",
                    data: "<p>Markdown has two types of links: <strong>inline</strong> and <strong>reference</strong>. For both types of links, the text you want to display to the user is placed in square brackets. For example, if you want your link to display the text &ldquo;GitHub&rdquo;, you write <code>[GitHub]</code>.</p><p>To create an inline link, create a set of parentheses immediately after the brackets and write your URL within the parentheses. (e.g., <code>[GitHub](http://github.com/)</code>). Relative paths are allowed in inline links.</p><p>To create a reference link, use two sets of square brackets. <code>[[my internal link|internal-ref]]</code> will link to the internal reference <code>internal-ref</code>.</p>"
                }, {
                    menuName: "Emphasis",
                    data: "<p>Asterisks (<code>*</code>) and underscores (<code>_</code>) are treated as emphasis and are wrapped with an <code>&lt;em&gt;</code> tag, which usually displays as italics in most browsers. Double asterisks (<code>**</code>) or double underscores (<code>__</code>) are treated as bold using the <code>&lt;strong&gt;</code> tag. To create italic or bold text, simply wrap your words in single/double asterisks/underscores. For example, <code>**My double emphasis text**</code> becomes <strong>My double emphasis text</strong>, and <code>*My single emphasis text*</code> becomes <em>My single emphasis text</em>.</p>"
                }, {
                    menuName: "Code",
                    data: "<p>To create inline spans of code, simply wrap the code in backticks (<code>`</code>). Markdown will turn <code>`myFunction`</code> into <code>myFunction</code>.</p>"
                }, {
                    menuName: "Images",
                    data: "<p>Markdown image syntax looks a lot like the syntax for links; it is essentially the same syntax preceded by an exclamation point (<code>!</code>). For example, if you want to link to an image at <code>http://github.com/unicorn.png</code> with the alternate text <code>My Unicorn</code>, you would write <code>![My Unicorn](http://github.com/unicorn.png)</code>.</p>"
                }]
            }, {
                menuName: "Miscellaneous",
                content: [{
                    menuName: "Automatic Links",
                    data: '<p>If you want to create a link that displays the actual URL, markdown allows you to quickly wrap the URL in <code>&lt;</code> and <code>&gt;</code> to do so. For example, the link <a href="javascript:void(0);">http://github.com/</a> is easily produced by writing <code>&lt;http://github.com/&gt;</code>.</p>'
                }, {
                    menuName: "Escaping",
                    data: "<p>If you want to use a special Markdown character in your document (such as displaying literal asterisks), you can escape the character with the backslash (<code>\\</code>). Markdown will ignore the character directly after a backslash."
                }]
            }];
        e.GollumEditor.defineLanguage("markdown", t), e.GollumEditor.defineHelp("markdown", o)
    }(jQuery),
    function(e) {
        var t = {
                "function-bold": {
                    search: /([^\n]+)([\n\s]*)/g,
                    replace: "*$1*$2"
                },
                "function-italic": {
                    search: /([^\n]+)([\n\s]*)/g,
                    replace: "/$1/$2"
                },
                "function-code": {
                    search: /(^[\n]+)([\n\s]*)/g,
                    replace: "=$1=$2"
                },
                "function-ul": {
                    search: /(.+)([\n]?)/g,
                    replace: "* $1$2"
                },
                "function-ol": {
                    search: /(.+)([\n]?)/g,
                    replace: "1. $1$2"
                },
                "function-blockquote": {
                    search: /(.+)([\n]?)/g,
                    replace: "#+BEGIN_QUOTE\n$1$2\n#+END_QUOTE\n"
                },
                "function-h1": {
                    search: /(.+)([\n]?)/g,
                    replace: "* $1$2"
                },
                "function-h2": {
                    search: /(.+)([\n]?)/g,
                    replace: "** $1$2"
                },
                "function-h3": {
                    search: /(.+)([\n]?)/g,
                    replace: "*** $1$2"
                },
                "function-link": {
                    exec: function() {
                        e.GollumEditor.Dialog.init({
                            title: "Insert Link",
                            fields: [{
                                id: "text",
                                name: "Link Text",
                                type: "text"
                            }, {
                                id: "href",
                                name: "URL",
                                type: "text"
                            }],
                            OK: function(t) {
                                var o = "";
                                t.text && t.href ? o = "[[" + t.href + "][" + t.text + "]]" : t.href && (o = "[[" + t.href + "]]"), e.GollumEditor.replaceSelection(o)
                            }
                        })
                    }
                },
                "function-image": {
                    exec: function() {
                        e.GollumEditor.Dialog.init({
                            title: "Insert Image",
                            fields: [{
                                id: "url",
                                name: "Image URL",
                                type: "text"
                            }],
                            OK: function(t) {
                                var o = "";
                                t.url && (o = "[[" + t.url + "]]"), e.GollumEditor.replaceSelection(o)
                            }
                        })
                    }
                }
            },
            o = [{
                menuName: "Block Elements",
                content: [{
                    menuName: "Paragraphs &amp; Breaks",
                    data: "<p>To create a paragraph, simply create a block of text that is not separated by one or more blank lines. Blocks of text separated by one or more blank lines will be parsed as paragraphs.</p>"
                }, {
                    menuName: "Headers",
                    data: "<p>Simply prefix your header text with the number of <code>*</code> characters to specify heading depth. For example: <code>* Header 1</code>, <code>** Header 2</code> and <code>*** Header 3</code> will be progressively smaller headers.</p>"
                }, {
                    menuName: "Blockquotes",
                    data: "<p>To create a blockquote, simple embed the text between <code>#+BEGIN_QUOTE</code> and <code>#+END_QUOTE</code>. An example quote block is displayed below:<br><code>#+BEGIN_QUOTE<br>This is my quote block. Quote something nice here, otherwise there is no point in quoting.<br>#+END_QUOTE</code></p>"
                }, {
                    menuName: "Lists",
                    data: "<p>Org-mode supports both ordered and unordered lists. To create an ordered list, simply prefix each line with a number (any number will do &mdash; this is why the editor only uses one number.) To create an unordered list, you can prefix each line with <code>+</code> or <code>-</code>.</p>"
                }, {
                    menuName: "Code Blocks",
                    data: "<p>Code Blocks are similar to blockquote, except that <code>#+BEGIN_EXAMPLE</code> and <code>#+END_EXAMPLE</code> are used.</p>"
                }, {
                    menuName: "Tables",
                    data: "<p>Org-mode supports simple tables (tables with equal number of cells in each row). To create a simple table, just separate the contents of each cell with a <code>|</code> character. For example, <br><br><code>|one|two|three|<br>|four|five|six|</code><br><br> will appear as a table with two rows and three columns.  Additionally, <br><br><code>|one|two|three|<br>|---+---+-----|<br>|four|five|six|</code><br><br> will also appear as a table, but the first row will be interpreted as a header row and the <code>&lt;th&gt;</code> tag will be used to render it. </p>"
                }]
            }, {
                menuName: "Span Elements",
                content: [{
                    menuName: "Links",
                    data: '<p>To create links to external pages, you need to enclose the URI in double square brackets. (i.e., <code>[[http://github.com/]]</code> will automatically be parsed to <a href="javascript:void(0);">http://github.com/</a>)If you want to add text, to be displayed to the user, you write the URI and the text next to each other, both enclosed in square brackets and both of them together enclosed in another pair of square brackets. For example, if you want your link to display the text &ldquo;GitHub&rdquo;, you write <code>[[http://github.com][GitHub]]</code>.</p>'
                }, {
                    menuName: "Emphasis",
                    data: "<p>Forward slashes (<code>/</code>) are treated as emphasis and are wrapped with an <code>&lt;i&gt;</code> tag. Asterisks (<code>*</code>) are treated as bold using the <code>&lt;b&gt;</code> tag.</p>"
                }, {
                    menuName: "Code",
                    data: "<p>To create inline spans of code, simply wrap the code in equal signs (<code>=</code>). Orgmode will turn <code>=myFunction=</code> into <code>myFunction</code>.</p>"
                }, {
                    menuName: "Images",
                    data: "<p>Org-mode image syntax is exactly same as the syntax that you would use for a URI to link to itself. The image URI is enclosed in double square brackets. Alt text on images is not currently supported by Gollum's Org-mode parser.</p>"
                }]
            }];
        e.GollumEditor.defineLanguage("org", t), e.GollumEditor.defineHelp("org", o)
    }(jQuery),
    function(e) {
        var t = {
            "function-bold": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "B<$1>$2"
            },
            "function-italic": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "I<$1>$2"
            },
            "function-code": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "C<$1>$2"
            },
            "function-h1": {
                search: /(.+)([\n]?)/gi,
                replace: "=head1 $1$2"
            },
            "function-h2": {
                search: /(.+)([\n]?)/gi,
                replace: "=head2 $1$2"
            },
            "function-h3": {
                search: /(.+)([\n]?)/gi,
                replace: "=head3 $1$2"
            },
            "function-link": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Link",
                        fields: [{
                            id: "text",
                            name: "Link Text",
                            type: "text"
                        }, {
                            id: "href",
                            name: "URL",
                            type: "text"
                        }],
                        OK: function(t) {
                            var o = "";
                            t.text && t.href && (o = "L<" + t.text + "|" + t.href + ">"), e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            }
        };
        e.GollumEditor.defineLanguage("pod", t);
        var o = [{
            menuName: "Command Paragraphs",
            content: [{
                menuName: "Headings",
                data: "<p>All command paragraphs start with <code>=</code> (equals sign).</p><p>To create headings 1 through 4, begin your command paragraph with <code>=headN</code>, where <code>N</code> is the number of the heading 1 through 4. For example, to make a first-order heading (the largest possible,) write <code>=head1</code>, then on the next line begin your paragraph that you want under the heading.</p>"
            }, {
                menuName: "Beginning &amp; Ending",
                data: "<p>Perl pod blocks should begin with <code>=pod</code> and end with <code>=cut</code>, signifying to Pod parsers that the pod block has begun and ended. These command paragraphs only signal the beginning and end of a pod block.</p>"
            }, {
                menuName: "Other Formats",
                data: "<p>pod also allows blocks in other formats, such as HTML or plain text. To create one of these blocks, use the <code>=format SYNTAX</code> command paragraph, where <code>SYNTAX</code> is the syntax of the block (e.g. <code>html</code> or <code>txt</code>). At the end of your block, use the <code>=end SYNTAX</code> block.</p>"
            }, {
                menuName: "Encoding",
                data: "<p>If you are having encoding troubles, use the <code>=encoding ENC_TYPE</code> command, where <code>ENC_TYPE</code> is the encoding type (e.g. <code>utf8</code>, <code>koi8-r</code>). This will affect the entire document, not just the block below the command.</p>"
            }]
        }, {
            menuName: "Formatting",
            content: [{
                menuName: "Text",
                data: "<p>Formatting text as <strong>bold</strong>, <em>italic</em> or <code>code</code> works in the <code>S&lt;word&gt;</code> syntax, where <code>S</code> is an abbreviation for the type of text you are trying to create. For example, <code>B&lt;my bold text&gt;</code> becomes <strong>my bold text</strong>,  <code>I&lt;italic text&gt;</code> becomes <em>italic text</em> and <code>C&lt;code here()&gt;</code> becomes <code>code here()</code>.</p>"
            }, {
                menuName: "Hyperlinks",
                data: "<p>Writing hyperlinks in pod is much like formatting text, using the same <code>S&lt;&gt;</code> syntax. Instead of <code>B</code>, <code>I</code> or <code>C</code>, use <code>L</code> to begin a hyperlink.</p><p>pod allows you to hyperlink to a <code>man</code> page, a Perl documentation page, or another web page. To link to a <code>man</code> or Perl documentation page, simply include the page name in the link (e.g. <code>L&lt;perl(1)&gt;</code> or <code>L&lt;Net::Ping&gt;</code>). If you want to link to a web page, separate the URL and the link text with a pipe (e.g. to link to github.com, write <code>L&lt;GitHub|http://github.com/&gt;</code>)."
            }]
        }];
        e.GollumEditor.defineHelp("pod", o)
    }(jQuery),
    function(e) {
        var t = {
            "function-bold": {
                search: /([^\n]+)([\n\s]*)/g,
                replace: "((*$1*))$2"
            },
            "function-code": {
                search: /([^\n]+)([\n\s]*)/g,
                replace: "(({$1}))$2"
            },
            "function-ul": {
                search: /(.+)([\n]?)/gi,
                replace: "* $1$2"
            },
            "function-ol": {
                exec: function(t, o) {
                    for (var n = "", a = o.split("\n"), i = /[\w]+/, l = 0; l < a.length; l++) i.test(a[l]) && (n += "(" + (l + 1).toString() + ") " + a[l]);
                    e.GollumEditor.replaceSelection(n)
                }
            },
            "function-h1": {
                search: /(.+)([\n]?)/gi,
                replace: "= $1$2"
            },
            "function-h2": {
                search: /(.+)([\n]?)/gi,
                replace: "== $1$2"
            },
            "function-h3": {
                search: /(.+)([\n]?)/gi,
                replace: "=== $1$2"
            }
        };
        e.GollumEditor.defineLanguage("rdoc", t)
    }(jQuery),
    function(e) {
        var t = {
            "function-bold": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "*$1*$2"
            },
            "function-italic": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "_$1_$2"
            },
            "function-hr": {
                append: "\n***\n"
            },
            "function-code": {
                search: /(^[\n]+)([\n\s]*)/g,
                replace: "<pre><code>$1</code></pre>$2"
            },
            "function-ul": {
                search: /(.+)([\n]?)/gi,
                replace: "* $1$2"
            },
            "function-ol": {
                search: /(.+)([\n]?)/gi,
                replace: "# $1$2"
            },
            "function-blockquote": {
                search: /(.+)([\n]?)/gi,
                replace: "bq. $1$2"
            },
            "function-link": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Link",
                        fields: [{
                            id: "text",
                            name: "Link Text",
                            type: "text",
                            help: "The text to display to the user."
                        }, {
                            id: "href",
                            name: "URL",
                            type: "text",
                            help: "The URL to link to."
                        }],
                        OK: function(t) {
                            var o = "";
                            t.text && t.href && (o = '"' + t.text + '":' + t.href), e.GollumEditor.replaceSelection(o)
                        }
                    })
                }
            },
            "function-image": {
                exec: function() {
                    e.GollumEditor.Dialog.init({
                        title: "Insert Image",
                        fields: [{
                            id: "url",
                            name: "Image URL",
                            type: "text"
                        }, {
                            id: "alt",
                            name: "Alt Text",
                            type: "text"
                        }],
                        OK: function(t) {
                            if (t.url) {
                                var o = "!" + t.url;
                                "" != t.alt && (o += "(" + t.alt + ")"), o += "!", e.GollumEditor.replaceSelection(o)
                            }
                        }
                    })
                }
            }
        };
        e.GollumEditor.defineLanguage("textile", t);
        var o = [{
            menuName: "Phrase Modifiers",
            content: [{
                menuName: "Emphasis / Strength",
                data: "<p>To place emphasis or strength on inline text, simply place <code>_</code> (underscores) around the text for emphasis or <code>*</code> (asterisks) around the text for strength. In most browsers, <code>_mytext_</code> will appear as italics and <code>*mytext*</code> will appear as bold.</p><p>To force italics or bold, simply double the characters: <code>__mytext__</code> will appear italic and <code>**mytext**</code> will appear as bold text.</p>"
            }, {
                menuName: "Citations / Editing",
                data: '<p>To display citations, wrap your text in <code>??</code> (two question marks).</p><p>To display edit marks such as deleted text (strikethrough) or inserted text (underlined text), wrap your text in <code>-</code> (minuses) or <code>+</code> (pluses). For example <code>-mytext-</code> will be rendered as <span style="text-decoration: line-through;">mytext</span> and <code>+mytext+</code> will be rendered as <span style="text-decoration: underline;">mytext</span></p>'
            }, {
                menuName: "Superscript / Subscript",
                data: "<p>To display superscript, wrap your text in <code>^</code> (carets). To display subscript, wrap your text in <code>~</code> (tildes).</p>"
            }, {
                menuName: "Code",
                data: "<p>To display monospace code, wrap your text in <code>@</code> (at symbol). For example, <code>@mytext@</code> will appear as <code>mytext</code>.</p>"
            }, {
                menuName: "Acronyms",
                data: '<p>To create an acronym, suffix the acronym with the definition in parentheses. For example, <code>JS(JavaScript)</code> will be displayed as <abbr title="JavaScript">JS</abbr>.</p>'
            }]
        }, {
            menuName: "Block Modifiers",
            content: [{
                menuName: "Headings",
                data: "<p>To display a heading in Textile, prefix your line of text with <code>hn.</code>, where <code>n</code> equals the heading size you want (1 is largest, 6 is smallest).</p>"
            }, {
                menuName: "Paragraphs / Quotes",
                data: "<p>To create a new paragraph, prefix your first line of a block of text with <code>p.</code>.</p><p>To create a blockquote, make sure at least one blank line exists between your text and any surrounding text, and then prefix that block with <code>bq.</code> If you need to extend a blockquote to more than one text block, write <code>bq..</code> (note the two periods) and prefix your next normal paragraph with <code>p.</code></p>"
            }, {
                menuName: "Code Blocks",
                data: "<p>Code blocks in textile are simply prefixed like any other block. To create a code block, place the beginning of the block on a separate line and prefix it with <code>bc.</code></p><p>To display a preformatted block, prefix the block with <code>pre.</code></p>"
            }, {
                menuName: "Lists",
                data: "<p>To create ordered lists, prefix each line with <code>#</code>. To create unordered lists, prefix each line with <code>*</code>.</p>"
            }]
        }, {
            menuName: "Links / Images",
            content: [{
                menuName: "Links",
                data: '<p>To display a link, put the text you want to display in quotes, then a colon (<code>:</code>), then the URL after the colon. For example <code>&quot;GitHub&quot;:http://github.com/</code> will appear as <a href="javascript:void(0);">GitHub</a>.</p>'
            }, {
                menuName: "Images",
                data: "<p>To display an image, simply wrap the image&rsquo;s URL in <code>!</code> (exclamation points). If you want to link the image to a URL, you can blend the image and link syntax: place your image URL in the exclamation points and suffix that with a colon and your URL. For example, an image at <code>http://myurl/image.png</code> that should link to <code>http://myurl/</code> should be written as <code>!http://myurl/image.png!:http://myurl/</code>.</p>"
            }]
        }];
        e.GollumEditor.defineHelp("textile", o)
    }(jQuery),
    function() {
        $.GollumEditor.WikiLanguage = {
            "function-internal-link": {
                exec: function() {
                    return $.GollumDialog.init({
                        title: "Insert Wiki Link",
                        fields: [{
                            id: "name",
                            name: "Link Name",
                            type: "text"
                        }],
                        OK: function(e) {
                            var t;
                            return t = e.name ? "[[" + e.name + "]]" : "", $.GollumEditor.replaceSelection(t)
                        }
                    })
                }
            }
        }, $(function() {
            var e, t;
            return (e = $("#gollum-editor")[0]) ? ($.GollumEditor({
                NoDefinitionsFor: ["mediawiki", "org"],
                NewFile: $(e).hasClass("create")
            }), t = $("#gollum-editor form"), t.one("change", function() {
                return window.onbeforeunload = function() {
                    return "Your changes will be lost."
                }
            }), t.on("submit", function() {
                return window.onbeforeunload = null
            })) : void 0
        }), $(document).on("click", ".js-wiki-toggle-collapse", function() {
            return $(this).closest(".js-wiki-pages-box").toggleClass("collapsed")
        }), $(document).on("click", ".js-wiki-more-pages-link", function(e) {
            return e.preventDefault(), $(this).closest(".js-wiki-pages-box").toggleClass("wiki-show-more")
        }), $(document).on("ajaxBeforeSend", ".js-previewable-comment-form", function(e, t, o) {
            var n;
            return n = $(this).find("#wiki_format").val(), o.data += "&wiki_format=" + n
        })
    }.call(this);