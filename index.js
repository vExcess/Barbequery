(function () {
    if (!Element.prototype.append_) {
        Element.prototype.append_ = Element.prototype.append;
    }
    
    Object.assign(Element.prototype, {
        appendTo(a) {
            a.appendChild(this);
            return this;
        },
        addClass(...args) {
            this.classList.add(...args);
            return this;
        },
        removeClass(...args) {
            this.classList.remove(...args);
            return this;
        },
        setId(a) {
            this.id = a;
            return this;
        },
        html(a) {
            if (a === undefined) {
                return this.innerHTML;
            }
            
            this.innerHTML = a;
            return this;
        },
        text(a) {
            if (a === undefined) {
                return this.innerText;
            }
            
            this.innerText = a;
            return this;
        },
        on(a, b, c) {
            this.addEventListener(a, b, c);
            return this;
        },
        css(c) {
            if (typeof c === "string") {
                let m;
                let r = /([\w-]*)\s*:\s*([^;]*)/g;
                while(m = r.exec(c)) {
                    this.style[m[1]] = m[2].trim();
                }
            } else {
                for (let p in c) {
                    this.style[p] = c[p];
                }
            }
            return this;
        },
        attr(a, b) {
            if (b === undefined) {
                for (let p in a) {
                    this[p] = a[p];
                }
            } else {
                this[a] = b;
            }
            return this;
        },
        append(a) {
            this.append_(a);
            return this;
        }
    });
    
    let B = (a, b, c) => {
        let el;
        if (a.charAt(0) === "#") {
            el = document.getElementById(a.slice(1));
        } else if (a.charAt(0) === ".") {
            el = document.getElementsByClassName(a.slice(1), b, c);
        } else {
            let components = B.components;
            // does the component exist?   
            if (components[a]) {
                el = document.createElement("div");
                let componentCode = components[a];
                if (b && (b.id || b.class)) {
                    let openTagIdx = B.noStringIdxOf(componentCode, "<");
                    let spaceIdx = openTagIdx + componentCode.slice(openTagIdx).indexOf(" ");
                    if (b.id) {
                        componentCode = componentCode.slice(0, spaceIdx) + ` id="${b.id}"` + componentCode.slice(spaceIdx);
                    }
                    if (b.class) {
                        if (componentCode.includes("class=")) {
                            let classIdx = B.noStringIdxOf(componentCode, "class=") + 7;
                            componentCode = componentCode.slice(0, classIdx) + `${b.class} ` + componentCode.slice(classIdx);
                        } else {
                            componentCode = componentCode.slice(0, spaceIdx) + ` class="${b.class}"` + componentCode.slice(spaceIdx);
                        }
                    }
                }
                let code = B.template(componentCode, b, true);
                for (let comp in components) {
                    let compIdx = B.noStringIdxOf(code, "<" + comp);
                    while (compIdx > -1) {
                        let j = B.noStringIdxOf(code, ">", compIdx);
                        let inputData = code.slice(compIdx, j);
                        inputData = inputData.slice(inputData.indexOf(" "));
                        let inputObj = {};
                        let m;
                        let r = /([\w-]*)\s*=\s*([^ ]*)/g;
                        while(m = r.exec(inputData)) {
                            inputObj[m[1]] = m[2].trim();
                            inputObj[m[1]] = inputObj[m[1]].slice(1, inputObj[m[1]].length - 1);
                        }
                        // console.log(inputObj)
                        
                        code =  code.slice(0, compIdx) + 
                                B("div").append(B(comp, inputObj)).html() +
                                code.slice(j + 1);
                        compIdx = B.noStringIdxOf(code, "<" + comp);
                    }
                }
                el.html(code);
                el = el.children[0];
            } else {
                el = document.createElement(a);
            }
        }
        return el;
    };
    
    B.html = String.raw;

    B.noStringIdxOf = (str, targetStr, start) => {
        let i = start || 0, inString = false, strType = "", strTypes = ['"', "'", "`"];
        while (i < str.length) {
            let c = str.charAt(i);
            if (strTypes.includes(c)) {
                if (inString) {
                    if (c === strType) {
                        inString = false;
                    }
                } else {
                    inString = true;
                    strType = c;
                }
            }
            if (str.slice(i, i + targetStr.length) === targetStr && !inString) {
                return i;
            }
            i++;
        }
        return -1;
    }
    
    B.template = (str, obj, useBackSlash) => {
        let newStr = "";
        let i = 0;
        let escapeChar = useBackSlash ? "\\" : "$";
        let currChar;
        while (i < str.length) {
            currChar = str.charAt(i);
            if (currChar === escapeChar && str.charAt(i + 1) === "{") {
                let name = "";
                i += 2;
                while (str.charAt(i) !== "}" && i < str.length) {
                    name += str.charAt(i);
                    i++;
                }
                newStr += obj[name];
            } else {
                newStr += currChar;
            }
            i++;
        }
        return newStr;
    }
    
    B.getJSON = (url, callback) => {
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
    
    B.getJSONLegacy = (url, callback) => {
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
    
    B.createComponent = (name, code) => {
        B.components[name] = code;
        return options => B(name, options);
    };
    
    B.deleteComponent = (...args) => {
        for (var i = 0; i < args.length; i++) {
            delete B.components[args[i]];
        }
    };
    
    window.$ = B;
})();
