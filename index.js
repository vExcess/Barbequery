(function () {
    if (!Element.prototype.append_) {
        Element.prototype.append_ = Element.prototype.append;
    }
    
    Object.assign(Element.prototype, {
        appendTo: function (a) {
            a.appendChild(this);
            return this;
        },
        addClass: function (...args) {
            this.classList.add(...args);
            return this;
        },
        removeClass: function (...args) {
            this.classList.remove(...args);
            return this;
        },
        setId: function (a) {
            this.id = a;
            return this;
        },
        html: function (a) {
            if (a === undefined) {
                return this.innerHTML;
            }
            
            this.innerHTML = a;
            return this;
        },
        text: function (a) {
            if (a === undefined) {
                return this.innerText;
            }
            
            this.innerText = a;
            return this;
        },
        on: function (a, b, c) {
            this.addEventListener(a, b, c);
            return this;
        },
        css: function (c) {
            if (typeof c === "string") {
                c.split(";").forEach(s => {
                    s = s.split(":");
                    if (s.length > 1) {
                        this.style[s[0].trim()] = s[1].trim();
                    }
                });
            } else if (typeof c === "object") {
                for (let p in c) {
                    this.style[p] = c[p];
                }
            }
            return this;
        },
        attr: function (a, b) {
            if (b === undefined) {
                for (let p in a) {
                    this[p] = a[p];
                }
            } else {
                this[a] = b;
            }
            return this;
        },
        append: function (a) {
            this.append_(a);
            return this;
        }
    });
    
    function doEl (e, b, c) {
        if (b) {
            e.html(b);
        }
        if (c) {
            e.css(c);
        }
        return e;
    }
    
    let B = function (a, b, c) {
        let o;
        if (a.charAt(0) === "#") {
            o = doEl(document.getElementById(a.slice(1)), b, c);
        } else if (a.charAt(0) === ".") {
            o = document.getElementsByClassName(a.slice(1), b, c);
            o.forEach(e => doEl(e));
        } else {
            let d = B.components;
            // does the component exist?   
            if (d[a]) {
                o = document.createElement("div");
                o.html(B.template(d[a], b, true));
                o = o.children[0];
            } else {
                o = doEl(document.createElement(a), b, c);
            }
        }
        return o;
    };
    
    B.html = String.raw;
    
    B.template = function (a, b, c) {
        // a is string
        // b is object
        var s = "";
        var i = 0;
        var e = c ? "\\" : "$"; // template escape char
        var c;
        while (i < a.length) {
            c = a.charAt(i);
            if (c === e && a.charAt(i + 1) === "{") {
                var n = "";
                i += 2;
                while (a.charAt(i) !== "}" && i < a.length) {
                    n += a.charAt(i);
                    i++;
                }
                s += b[n];
            } else {
                s += c;
            }
            i++;
        }
        return s;
    }
    
    B.getJSON = function (url, callback) {
        let prom = fetch(url).then(res => res.json());
    
        if (callback === undefined) {
            return prom;
        } else {
            return prom.then(res => {
                callback(res);
                return res;
            });
        }
    };
    
    B.getJSONLegacy = function (url, callback) {
        let callbackId = Math.random().toString().replace(".", "");
        let script = document.createElement("script");
        B.getJSON["c" + callbackId] = function (json) {
            script.remove();
            callback(json);
        };
        script.src = url + (url.match(/\?/) ? "&" : "?") + "callback=$.getJSON.c" + callbackId;
        document.body.appendChild(script);
    };
    
    B.components = {};
    
    B.createComponent = function (a, b) {
        B.components[a] = b;
        return function (b) {
            return B(a, b);
        };
    };
    
    B.deleteComponent = function (a) {
        delete B.components[a];
    };
    
    window.$ = B;
})();
