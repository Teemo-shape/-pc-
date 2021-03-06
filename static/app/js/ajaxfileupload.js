/*!
 * jQuery Form Plugin
 * version: 3.32.0-2013.04.09
 * @requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
(function(f) {
    var c = {};
    c.fileapi = f("<input type='file'/>").get(0).files !== undefined;
    c.formdata = window.FormData !== undefined;
    var e = !!f.fn.prop;
    f.fn.attr2 = function() {
        if(!e) {
            return this.attr.apply(this, arguments)
        }
        var g = this.prop.apply(this, arguments);
        if((g && g.jquery) || typeof g === "string") {
            return g
        }
        return this.attr.apply(this, arguments)
    };
    f.fn.ajaxSubmit = function(i) {
        if(!this.length) {
            d("ajaxSubmit: skipping submit process - no element selected");
            return this
        }
        var h, z, l, n = this;
        if(typeof i == "function") {
            i = {success: i}
        }
        h = this.attr2("method");
        z = this.attr2("action");
        l = (typeof z === "string") ? f.trim(z) : "";
        l = l || window.location.href || "";
        if(l) {
            l = (l.match(/^([^#]+)/) || [])[1]
        }
        i = f.extend(true, {
            url: l,
            success: f.ajaxSettings.success,
            type: h || "GET",
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, i);
        var t = {};
        this.trigger("form-pre-serialize", [this, i, t]);
        if(t.veto) {
            d("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
            return this
        }
        if(i.beforeSerialize && i.beforeSerialize(this, i) === false) {
            d("ajaxSubmit: submit aborted via beforeSerialize callback");
            return this
        }
        var m = i.traditional;
        if(m === undefined) {
            m = f.ajaxSettings.traditional
        }
        var r = [];
        var C, D = this.formToArray(i.semantic, r);
        if(i.data) {
            i.extraData = i.data;
            C = f.param(i.data, m)
        }
        if(i.beforeSubmit && i.beforeSubmit(D, this, i) === false) {
            d("ajaxSubmit: submit aborted via beforeSubmit callback");
            return this
        }
        this.trigger("form-submit-validate", [D, this, i, t]);
        if(t.veto) {
            d("ajaxSubmit: submit vetoed via form-submit-validate trigger");
            return this
        }
        var x = f.param(D, m);
        if(C) {
            x = (x ? (x + "&" + C) : C)
        }
        if(i.type.toUpperCase() == "GET") {
            i.url += (i.url.indexOf("?") >= 0 ? "&" : "?") + x;
            i.data = null
        } else {
            i.data = x
        }
        var F = [];
        if(i.resetForm) {
            F.push(function() {
                n.resetForm()
            })
        }
        if(i.clearForm) {
            F.push(function() {
                n.clearForm(i.includeHidden)
            })
        }
        if(!i.dataType && i.target) {
            var j = i.success || function() {
            };
            F.push(function(q) {
                var k = i.replaceTarget ? "replaceWith" : "html";
                f(i.target)[k](q).each(j, arguments)
            })
        } else {
            if(i.success) {
                F.push(i.success)
            }
        }
        i.success = function(I, q, J) {
            var H = i.context || this;
            for(var G = 0, k = F.length; G < k; G++) {
                F[G].apply(H, [I, q, J || n, n])
            }
        };
        var B = f('input[type=file]:enabled[value!=""]', this);
        var o = B.length > 0;
        var A = "multipart/form-data";
        var w = (n.attr("enctype") == A || n.attr("encoding") == A);
        var v = c.fileapi && c.formdata;
        d("fileAPI :" + v);
        var p = (o || w) && !v;
        var u;
        if(i.iframe !== false && (i.iframe || p)) {
            if(i.closeKeepAlive) {
                f.get(i.closeKeepAlive, function() {
                    u = E(D)
                })
            } else {
                u = E(D)
            }
        } else {
            if((o || w) && v) {
                u = s(D)
            } else {
                u = f.ajax(i)
            }
        }
        n.removeData("jqxhr").data("jqxhr", u);
        for(var y = 0; y < r.length; y++) {
            r[y] = null
        }
        this.trigger("form-submit-notify", [this, i]);
        return this;
        
        function g(I) {
            var J = f.param(I).split("&");
            var q = J.length;
            var k = [];
            var H, G;
            for(H = 0; H < q; H++) {
                J[H] = J[H].replace(/\+/g, " ");
                G = J[H].split("=");
                k.push([decodeURIComponent(G[0]), decodeURIComponent(G[1])])
            }
            return k
        }
        
        function s(q) {
            var k = new FormData();
            for(var G = 0; G < q.length; G++) {
                k.append(q[G].name, q[G].value)
            }
            if(i.extraData) {
                var J = g(i.extraData);
                for(G = 0; G < J.length; G++) {
                    if(J[G]) {
                        k.append(J[G][0], J[G][1])
                    }
                }
            }
            i.data = null;
            var I = f.extend(true, {}, f.ajaxSettings, i, {
                contentType: false,
                processData: false,
                cache: false,
                type: h || "POST"
            });
            if(i.uploadProgress) {
                I.xhr = function() {
                    var K = jQuery.ajaxSettings.xhr();
                    if(K.upload) {
                        K.upload.addEventListener("progress", function(O) {
                            var N = 0;
                            var L = O.loaded || O.position;
                            var M = O.total;
                            if(O.lengthComputable) {
                                N = Math.ceil(L / M * 100)
                            }
                            i.uploadProgress(O, L, M, N)
                        }, false)
                    }
                    return K
                }
            }
            I.data = null;
            var H = I.beforeSend;
            I.beforeSend = function(L, K) {
                K.data = k;
                if(H) {
                    H.call(this, L, K)
                }
            };
            return f.ajax(I)
        }
        
        function E(ad) {
            var J = n[0], I, Z, T, ab, W, L, O, M, N, X, aa, R;
            var ag = f.Deferred();
            if(ad) {
                for(Z = 0; Z < r.length; Z++) {
                    I = f(r[Z]);
                    if(e) {
                        I.prop("disabled", false)
                    } else {
                        I.removeAttr("disabled")
                    }
                }
            }
            T = f.extend(true, {}, f.ajaxSettings, i);
            T.context = T.context || T;
            W = "jqFormIO" + (new Date().getTime());
            if(T.iframeTarget) {
                L = f(T.iframeTarget);
                X = L.attr2("name");
                if(!X) {
                    L.attr2("name", W)
                } else {
                    W = X
                }
            } else {
                L = f('<iframe name="' + W + '" src="' + T.iframeSrc + '" />');
                L.css({position: "absolute", top: "-1000px", left: "-1000px"})
            }
            O = L[0];
            M = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {
                },
                getResponseHeader: function() {
                },
                setRequestHeader: function() {
                },
                abort: function(ah) {
                    var ai = (ah === "timeout" ? "timeout" : "aborted");
                    d("aborting upload... " + ai);
                    this.aborted = 1;
                    try {
                        if(O.contentWindow.document.execCommand) {
                            O.contentWindow.document.execCommand("Stop")
                        }
                    } catch(aj) {
                    }
                    L.attr("src", T.iframeSrc);
                    M.error = ai;
                    if(T.error) {
                        T.error.call(T.context, M, ai, ah)
                    }
                    if(ab) {
                        f.event.trigger("ajaxError", [M, T, ai])
                    }
                    if(T.complete) {
                        T.complete.call(T.context, M, ai)
                    }
                }
            };
            ab = T.global;
            if(ab && 0 === f.active++) {
                f.event.trigger("ajaxStart")
            }
            if(ab) {
                f.event.trigger("ajaxSend", [M, T])
            }
            if(T.beforeSend && T.beforeSend.call(T.context, M, T) === false) {
                if(T.global) {
                    f.active--
                }
                ag.reject();
                return ag
            }
            if(M.aborted) {
                ag.reject();
                return ag
            }
            N = J.clk;
            if(N) {
                X = N.name;
                if(X && !N.disabled) {
                    T.extraData = T.extraData || {};
                    T.extraData[X] = N.value;
                    if(N.type == "image") {
                        T.extraData[X + ".x"] = J.clk_x;
                        T.extraData[X + ".y"] = J.clk_y
                    }
                }
            }
            var S = 1;
            var P = 2;
            
            function Q(aj) {
                var ai = null;
                try {
                    if(aj.contentWindow) {
                        ai = aj.contentWindow.document
                    }
                } catch(ah) {
                    d("cannot get iframe.contentWindow document: " + ah)
                }
                if(ai) {
                    return ai
                }
                try {
                    ai = aj.contentDocument ? aj.contentDocument : aj.document
                } catch(ah) {
                    d("cannot get iframe.contentDocument: " + ah);
                    ai = aj.document
                }
                return ai
            }
            
            var H = f("meta[name=csrf-token]").attr("content");
            var G = f("meta[name=csrf-param]").attr("content");
            if(G && H) {
                T.extraData = T.extraData || {};
                T.extraData[G] = H
            }
            
            function Y() {
                var aj = n.attr2("target"), ah = n.attr2("action");
                J.setAttribute("target", W);
                if(!h) {
                    J.setAttribute("method", "POST")
                }
                if(ah != T.url) {
                    J.setAttribute("action", T.url)
                }
                if(!T.skipEncodingOverride && (!h || /post/i.test(h))) {
                    n.attr({encoding: "multipart/form-data", enctype: "multipart/form-data"})
                }
                if(T.timeout) {
                    R = setTimeout(function() {
                        aa = true;
                        V(S)
                    }, T.timeout)
                }
                
                function ak() {
                    try {
                        var ao = Q(O).readyState;
                        d("state = " + ao);
                        if(ao && ao.toLowerCase() == "uninitialized") {
                            setTimeout(ak, 50)
                        }
                    } catch(ap) {
                        d("Server abort: ", ap, " (", ap.name, ")");
                        V(P);
                        if(R) {
                            clearTimeout(R)
                        }
                        R = undefined
                    }
                }
                
                var ai = [];
                try {
                    if(T.extraData) {
                        for(var an in T.extraData) {
                            if(T.extraData.hasOwnProperty(an)) {
                                if(f.isPlainObject(T.extraData[an]) && T.extraData[an].hasOwnProperty("name") && T.extraData[an].hasOwnProperty("value")) {
                                    ai.push(f('<input type="hidden" name="' + T.extraData[an].name + '">').val(T.extraData[an].value).appendTo(J)[0])
                                } else {
                                    ai.push(f('<input type="hidden" name="' + an + '">').val(T.extraData[an]).appendTo(J)[0])
                                }
                            }
                        }
                    }
                    if(!T.iframeTarget) {
                        L.appendTo("body");
                        if(O.attachEvent) {
                            O.attachEvent("onload", V)
                        } else {
                            O.addEventListener("load", V, false)
                        }
                    }
                    setTimeout(ak, 15);
                    try {
                        J.submit()
                    } catch(al) {
                        var am = document.createElement("form").submit;
                        am.apply(J)
                    }
                } finally {
                    J.setAttribute("action", ah);
                    if(aj) {
                        J.setAttribute("target", aj)
                    } else {
                        n.removeAttr("target")
                    }
                    f(ai).remove()
                }
            }
            
            if(T.forceSync) {
                Y()
            } else {
                setTimeout(Y, 10)
            }
            var ae, af, ac = 50, K;
            
            function V(an) {
                if(M.aborted || K) {
                    return
                }
                af = Q(O);
                if(!af) {
                    d("cannot access response document");
                    an = P
                }
                if(an === S && M) {
                    M.abort("timeout");
                    ag.reject(M, "timeout");
                    return
                } else {
                    if(an == P && M) {
                        M.abort("server abort");
                        ag.reject(M, "error", "server abort");
                        return
                    }
                }
                if(!af || af.location.href == T.iframeSrc) {
                    if(!aa) {
                        return
                    }
                }
                if(O.detachEvent) {
                    O.detachEvent("onload", V)
                } else {
                    O.removeEventListener("load", V, false)
                }
                var al = "success", ap;
                try {
                    if(aa) {
                        throw"timeout"
                    }
                    var ak = T.dataType == "xml" || af.XMLDocument || f.isXMLDoc(af);
                    d("isXml=" + ak);
                    if(!ak && window.opera && (af.body === null || !af.body.innerHTML)) {
                        if(--ac) {
                            d("requeing onLoad callback, DOM not available");
                            setTimeout(V, 250);
                            return
                        }
                    }
                    var aq = af.body ? af.body : af.documentElement;
                    M.responseText = aq ? aq.innerHTML : null;
                    M.responseXML = af.XMLDocument ? af.XMLDocument : af;
                    if(ak) {
                        T.dataType = "xml"
                    }
                    M.getResponseHeader = function(au) {
                        var at = {"content-type": T.dataType};
                        return at[au]
                    };
                    if(aq) {
                        M.status = Number(aq.getAttribute("status")) || M.status;
                        M.statusText = aq.getAttribute("statusText") || M.statusText
                    }
                    var ah = (T.dataType || "").toLowerCase();
                    var ao = /(json|script|text)/.test(ah);
                    if(ao || T.textarea) {
                        var am = af.getElementsByTagName("textarea")[0];
                        if(am) {
                            M.responseText = am.value;
                            M.status = Number(am.getAttribute("status")) || M.status;
                            M.statusText = am.getAttribute("statusText") || M.statusText
                        } else {
                            if(ao) {
                                var ai = af.getElementsByTagName("pre")[0];
                                var ar = af.getElementsByTagName("body")[0];
                                if(ai) {
                                    M.responseText = ai.textContent ? ai.textContent : ai.innerText
                                } else {
                                    if(ar) {
                                        M.responseText = ar.textContent ? ar.textContent : ar.innerText
                                    }
                                }
                            }
                        }
                    } else {
                        if(ah == "xml" && !M.responseXML && M.responseText) {
                            M.responseXML = U(M.responseText)
                        }
                    }
                    try {
                        ae = k(M, ah, T)
                    } catch(aj) {
                        al = "parsererror";
                        M.error = ap = (aj || al)
                    }
                } catch(aj) {
                    d("error caught: ", aj);
                    al = "error";
                    M.error = ap = (aj || al)
                }
                if(M.aborted) {
                    d("upload aborted");
                    al = null
                }
                if(M.status) {
                    al = (M.status >= 200 && M.status < 300 || M.status === 304) ? "success" : "error"
                }
                if(al === "success") {
                    if(T.success) {
                        T.success.call(T.context, ae, "success", M)
                    }
                    ag.resolve(M.responseText, "success", M);
                    if(ab) {
                        f.event.trigger("ajaxSuccess", [M, T])
                    }
                } else {
                    if(al) {
                        if(ap === undefined) {
                            ap = M.statusText
                        }
                        if(T.error) {
                            T.error.call(T.context, M, al, ap)
                        }
                        ag.reject(M, "error", ap);
                        if(ab) {
                            f.event.trigger("ajaxError", [M, T, ap])
                        }
                    }
                }
                if(ab) {
                    f.event.trigger("ajaxComplete", [M, T])
                }
                if(ab && !--f.active) {
                    f.event.trigger("ajaxStop")
                }
                if(T.complete) {
                    T.complete.call(T.context, M, al)
                }
                K = true;
                if(T.timeout) {
                    clearTimeout(R)
                }
                setTimeout(function() {
                    if(!T.iframeTarget) {
                        L.remove()
                    }
                    M.responseXML = null
                }, 100)
            }
            
            var U = f.parseXML || function(ah, ai) {
                if(window.ActiveXObject) {
                    ai = new ActiveXObject("Microsoft.XMLDOM");
                    ai.async = "false";
                    ai.loadXML(ah)
                } else {
                    ai = (new DOMParser()).parseFromString(ah, "text/xml")
                }
                return (ai && ai.documentElement && ai.documentElement.nodeName != "parsererror") ? ai : null
            };
            var q = f.parseJSON || function(ah) {
                return window["eval"]("(" + ah + ")")
            };
            var k = function(am, ak, aj) {
                var ai = am.getResponseHeader("content-type") || "", ah = ak === "xml" || !ak && ai.indexOf("xml") >= 0,
                    al = ah ? am.responseXML : am.responseText;
                if(ah && al.documentElement.nodeName === "parsererror") {
                    if(f.error) {
                        f.error("parsererror")
                    }
                }
                if(aj && aj.dataFilter) {
                    al = aj.dataFilter(al, ak)
                }
                if(typeof al === "string") {
                    if(ak === "json" || !ak && ai.indexOf("json") >= 0) {
                        al = q(al)
                    } else {
                        if(ak === "script" || !ak && ai.indexOf("javascript") >= 0) {
                            f.globalEval(al)
                        }
                    }
                }
                return al
            };
            return ag
        }
    };
    f.fn.ajaxForm = function(g) {
        g = g || {};
        g.delegation = g.delegation && f.isFunction(f.fn.on);
        if(!g.delegation && this.length === 0) {
            var h = {s: this.selector, c: this.context};
            if(!f.isReady && h.s) {
                d("DOM not ready, queuing ajaxForm");
                f(function() {
                    f(h.s, h.c).ajaxForm(g)
                });
                return this
            }
            d("terminating; zero elements found by selector" + (f.isReady ? "" : " (DOM not ready)"));
            return this
        }
        if(g.delegation) {
            f(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, a).on("submit.form-plugin", this.selector, g, b).on("click.form-plugin", this.selector, g, a);
            return this
        }
        return this.ajaxFormUnbind().bind("submit.form-plugin", g, b).bind("click.form-plugin", g, a)
    };
    
    function b(h) {
        var g = h.data;
        if(!h.isDefaultPrevented()) {
            h.preventDefault();
            f(this).ajaxSubmit(g)
        }
    }
    
    function a(k) {
        var j = k.target;
        var h = f(j);
        if(!(h.is("[type=submit],[type=image]"))) {
            var g = h.closest("[type=submit]");
            if(g.length === 0) {
                return
            }
            j = g[0]
        }
        var i = this;
        i.clk = j;
        if(j.type == "image") {
            if(k.offsetX !== undefined) {
                i.clk_x = k.offsetX;
                i.clk_y = k.offsetY
            } else {
                if(typeof f.fn.offset == "function") {
                    var l = h.offset();
                    i.clk_x = k.pageX - l.left;
                    i.clk_y = k.pageY - l.top
                } else {
                    i.clk_x = k.pageX - j.offsetLeft;
                    i.clk_y = k.pageY - j.offsetTop
                }
            }
        }
        setTimeout(function() {
            i.clk = i.clk_x = i.clk_y = null
        }, 100)
    }
    
    f.fn.ajaxFormUnbind = function() {
        return this.unbind("submit.form-plugin click.form-plugin")
    };
    f.fn.formToArray = function(x, g) {
        var w = [];
        if(this.length === 0) {
            return w
        }
        var l = this[0];
        var p = x ? l.getElementsByTagName("*") : l.elements;
        if(!p) {
            return w
        }
        var r, q, o, y, m, t, k;
        for(r = 0, t = p.length; r < t; r++) {
            m = p[r];
            o = m.name;
            if(!o || m.disabled) {
                continue
            }
            if(x && l.clk && m.type == "image") {
                if(l.clk == m) {
                    w.push({name: o, value: f(m).val(), type: m.type});
                    w.push({name: o + ".x", value: l.clk_x}, {name: o + ".y", value: l.clk_y})
                }
                continue
            }
            y = f.fieldValue(m, true);
            if(y && y.constructor == Array) {
                if(g) {
                    g.push(m)
                }
                for(q = 0, k = y.length; q < k; q++) {
                    w.push({name: o, value: y[q]})
                }
            } else {
                if(c.fileapi && m.type == "file") {
                    if(g) {
                        g.push(m)
                    }
                    var h = m.files;
                    if(h.length) {
                        for(q = 0; q < h.length; q++) {
                            w.push({name: o, value: h[q], type: m.type})
                        }
                    } else {
                        w.push({name: o, value: "", type: m.type})
                    }
                } else {
                    if(y !== null && typeof y != "undefined") {
                        if(g) {
                            g.push(m)
                        }
                        w.push({name: o, value: y, type: m.type, required: m.required})
                    }
                }
            }
        }
        if(!x && l.clk) {
            var s = f(l.clk), u = s[0];
            o = u.name;
            if(o && !u.disabled && u.type == "image") {
                w.push({name: o, value: s.val()});
                w.push({name: o + ".x", value: l.clk_x}, {name: o + ".y", value: l.clk_y})
            }
        }
        return w
    };
    f.fn.formSerialize = function(g) {
        return f.param(this.formToArray(g))
    };
    f.fn.fieldSerialize = function(h) {
        var g = [];
        this.each(function() {
            var m = this.name;
            if(!m) {
                return
            }
            var k = f.fieldValue(this, h);
            if(k && k.constructor == Array) {
                for(var l = 0, j = k.length; l < j; l++) {
                    g.push({name: m, value: k[l]})
                }
            } else {
                if(k !== null && typeof k != "undefined") {
                    g.push({name: this.name, value: k})
                }
            }
        });
        return f.param(g)
    };
    f.fn.fieldValue = function(m) {
        for(var l = [], j = 0, g = this.length; j < g; j++) {
            var k = this[j];
            var h = f.fieldValue(k, m);
            if(h === null || typeof h == "undefined" || (h.constructor == Array && !h.length)) {
                continue
            }
            if(h.constructor == Array) {
                f.merge(l, h)
            } else {
                l.push(h)
            }
        }
        return l
    };
    f.fieldValue = function(g, o) {
        var j = g.name, u = g.type, w = g.tagName.toLowerCase();
        if(o === undefined) {
            o = true
        }
        if(o && (!j || g.disabled || u == "reset" || u == "button" || (u == "checkbox" || u == "radio") && !g.checked || (u == "submit" || u == "image") && g.form && g.form.clk != g || w == "select" && g.selectedIndex == -1)) {
            return null
        }
        if(w == "select") {
            var p = g.selectedIndex;
            if(p < 0) {
                return null
            }
            var r = [], h = g.options;
            var l = (u == "select-one");
            var q = (l ? p + 1 : h.length);
            for(var k = (l ? p : 0); k < q; k++) {
                var m = h[k];
                if(m.selected) {
                    var s = m.value;
                    if(!s) {
                        s = (m.attributes && m.attributes.value && !(m.attributes.value.specified)) ? m.text : m.value
                    }
                    if(l) {
                        return s
                    }
                    r.push(s)
                }
            }
            return r
        }
        return f(g).val()
    };
    f.fn.clearForm = function(g) {
        return this.each(function() {
            f("input,select,textarea", this).clearFields(g)
        })
    };
    f.fn.clearFields = f.fn.clearInputs = function(g) {
        var h = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function() {
            var j = this.type, i = this.tagName.toLowerCase();
            if(h.test(j) || i == "textarea") {
                this.value = ""
            } else {
                if(j == "checkbox" || j == "radio") {
                    this.checked = false
                } else {
                    if(i == "select") {
                        this.selectedIndex = -1
                    } else {
                        if(j == "file") {
                            if(/MSIE/.test(navigator.userAgent)) {
                                f(this).replaceWith(f(this).clone(true))
                            } else {
                                f(this).val("")
                            }
                        } else {
                            if(g) {
                                if((g === true && /hidden/.test(j)) || (typeof g == "string" && f(this).is(g))) {
                                    this.value = ""
                                }
                            }
                        }
                    }
                }
            }
        })
    };
    f.fn.resetForm = function() {
        return this.each(function() {
            if(typeof this.reset == "function" || (typeof this.reset == "object" && !this.reset.nodeType)) {
                this.reset()
            }
        })
    };
    f.fn.enable = function(g) {
        if(g === undefined) {
            g = true
        }
        return this.each(function() {
            this.disabled = !g
        })
    };
    f.fn.selected = function(g) {
        if(g === undefined) {
            g = true
        }
        return this.each(function() {
            var h = this.type;
            if(h == "checkbox" || h == "radio") {
                this.checked = g
            } else {
                if(this.tagName.toLowerCase() == "option") {
                    var i = f(this).parent("select");
                    if(g && i[0] && i[0].type == "select-one") {
                        i.find("option").selected(false)
                    }
                    this.selected = g
                }
            }
        })
    };
    f.fn.ajaxSubmit.debug = false;
    
    function d() {
        if(!f.fn.ajaxSubmit.debug) {
            return
        }
        var g = "[jquery.form] " + Array.prototype.join.call(arguments, "");
        if(window.console && window.console.log) {
            window.console.log(g)
        } else {
            if(window.opera && window.opera.postError) {
                window.opera.postError(g)
            }
        }
    }
})(jQuery);
