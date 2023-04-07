(function () {
    if (!Element.prototype.append_) {
        Element.prototype.append_ = Element.prototype.append;
    }
    
    let B = (a, b, el) => {
        let selectors = a.split(">");
        for (var i = 0; i < selectors.length; i++) {
            let select = selectors[i].trim();
            let param = select.slice(1);
            switch (select.charAt(0)) {
                // id selector
                case "#":
                    if (typeof el === "object" && el.length) {
                        let newEl = [];
                        for (let i = 0; i < el.length; i++) {
                            newEl.push(el.getElementById(param));
                        }
                        el = newEl;
                    } else {
                        el = (el ?? document).getElementById(param);
                    }
                break;

                // class selector
                case ".":
                    if (typeof el === "object" && el.length) {
                        let newEl = [];
                        for (let i = 0; i < el.length; i++) {
                            let res = el[i].getElementsByClassName(param);
                            for (let j = 0; j < res.length; j++) {
                                newEl.push(res[j]);
                            }
                        }
                        el = newEl;
                    } else {
                        el = (el ?? document).getElementsByClassName(param);
                    }
                break;

                // element selector
                case "*":
                    if (typeof el === "object" && el.length) {
                        let newEl = [];
                        for (let i = 0; i < el.length; i++) {
                            let res = el[i].getElementsByTagName(param);
                            for (let j = 0; j < res.length; j++) {
                                newEl.push(res[j]);
                            }
                        }
                        el = newEl;
                    } else {
                        el = (el ?? document).getElementsByTagName(param);
                    }
                break;

                default:
                    let components = B.components;
                    // does the component exist?   
                    if (components[select]) {
                        el = document.createElement("div");
                        let componentCode = components[select];
        
                        // set id and class if given
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
                        
                        let code = B.template(componentCode, b, "\\");
                        
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
                                
                                code =  code.slice(0, compIdx) + 
                                        B("div").append(B(comp, inputObj)).html() +
                                        code.slice(j + 1);
                                compIdx = B.noStringIdxOf(code, "<" + comp);
                            }
                        }
                        
                        el.html(code);
                        el = el.children[0];
                    } else {
                        el = document.createElement(select);
                    }
                break;
            }
        }
        
        return el;
    };

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
        append(...args) {
            this.append_(...args);
            return this;
        },
        $(a, b) {
            return B(a, b, this);
        }
    });
    
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
    
    B.template = (str, obj, specialChar) => {
        let newStr = "";
        let i = 0;
        let escapeChar = specialChar ?? "$";
        let currChar;
        while (i < str.length) {
            currChar = str.charAt(i);
            if (currChar === escapeChar && str.charAt(i + 1) === "{") {
                let props = "";
                i += 2;
                while (str.charAt(i) !== "}" && i < str.length) {
                    props += str.charAt(i);
                    i++;
                }
                props = props.split(".");
                let val = obj;
                for (var n = 0; n < props.length; n++) {
                    val = val?.[props[n]];
                }
                if (typeof val === "string") {
                    val = val
                    .replaceAll("&", "&amp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll('"', "&quot;");
                }
                newStr += val;
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
    
    B.getJSONP = (url, callback) => {
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
