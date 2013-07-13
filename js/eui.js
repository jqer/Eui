(function (window, undefined) {
    /* Eui 命名空间  */
    var _Eui = window.Eui,

        Eui = {};

    /*
    * 工具包
    */
    // Util基本工具
    Eui.U = {
        // 掺元扩展函数
        extend: function (receivingObj) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                var givingObj = arguments[i];

                for (var prop in givingObj) {
                    if (!givingObj.hasOwnProperty(prop)) continue;
                    receivingObj[prop] = givingObj[prop];
                }
            }
        },

        // 继承函数
        inheritProto: function (subClass, superClass) {
            function F() { };
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;

            subClass.superclass = superClass.prototype;
            if (superClass.prototype.constructor === Object.prototype.constructor) {
                superClass.prototype.constructor = superClass;
            }
        },

        // 取消Eui
        noConflict: function () {
            window.Eui = _Eui;
        },

        // 字符串去除全部空白
        trimAll: function (str) {
            return str.replace(/\s+/g, '');
        },

        // 字符串左边去除空白
        trimLeft: function (str) {
            return str.replace(/^\s+/g, '');
        },

        // 字符串右边去除空白
        trimRight: function (str) {
            return str.replace(/\s+$/g, '');
        },

        // 字符串去除左边和右边空白
        trim: function (str) {
            return Eui.U.trimLeft(Eui.U.trimRight(str));
        },

        getElemLeft: function (element) {
            var currentLeft = element.offsetLeft;
            var current = element.offsetParent;

            while (current) {
                currentLeft += current.offsetLeft;
                current = current.offsetParent;
            }

            return currentLeft;
        },

        getElemTop: function (element) {
            var currentTop = element.offsetTop;
            var current = element.offsetParent;

            while (current) {
                currentTop += current.offsetTop;
                current = current.offsetParent;
            }

            return currentTop;
        },

        // 为元素添加类名
        addClass: function (elem, name) {
            if (!Eui.U.hasClass(elem, name)) {
                elem.className += ' ' + name + ' ';
                elem.className = Eui.U.trim(elem.className);
            }
        },

        // 为元素移除类名
        removeClass: function (elem, name) {
            if (Eui.U.hasClass(elem, name)) {
                name = ' ' + name + ' ';
                elem.className = (' ' + elem.className + ' ').replace(name, ' ');
                elem.className = Eui.U.trim(elem.className);
            }
        },

        // 判断元素拥有类名
        hasClass: function (elem, name) {
            name = ' ' + name + ' ';
            return (' ' + elem.className + ' ').indexOf(name) > -1;
        },

        // 基于CSS选择器查询单个元素
        qElem: function (selector, context) {
            return context.querySelector(selector);
        },

        // 基于CSS选择器查询多个元素
        qElems: function (selector, context) {
            return context.querySelectorAll(selector);
        }
    };

    // EventUtil事件兼容工具
    Eui.EU = {
        // 基于委托提升速度的事件兼容函数
        on: function (currentTarget, target, type, handler) {
            if (!handler) {
                handler = type;
                type = target;
                Eui.EU.addHandler(currentTarget, type, function (e) {
                    handler.call(currentTarget);
                });
            } else {
                Eui.EU.addHandler(currentTarget, type, function (e) {
                    e = Eui.EU.getEvent(e);
                    var current = Eui.EU.getTarget(e);
                    if (target === current) {
                        handler.call(target);
                    }
                });
            }
        },

        // 添加监听器
        addHandler: function (elem, type, handler) {
            if (elem.addEventListener) {
                elem.addEventListener(type, handler, false);
            } else if (elem.attachEvent) {
                elem.attachEvent('on' + type, handler);
            } else {
                elem['on' + type] = handler;
            }
        },

        // 卸载监听器
        removeHandler: function (elem, type, handler) {
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handler, false);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + type, handler);
            } else {
                elem['on' + type] = null;
            }
        },

        // 事件对象兼容函数
        getEvent: function (e) {
            return e ? e : window.event;
        },

        // 触发事件的元素目标 
        getTarget: function (e) {
            return e.target || e.srcElement;
        },

        // 阻止默认事件兼容函数
        preventDefault: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                event.returnValue = false;
            }
        },

        // 阻止冒泡
        stopPropagation: function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
    };

    window.Eui = Eui;
})(window);


(function () {
    /* polyfill */

    // 原型式继承
    if (!Object.create) {
        Object.create = function (object) {
            var F = function () { };
            F.prototype = object;
            return new F;
        }
    }

    // 遍历数组,执行函数
    if(!Array.prototype.forEach){
        Array.prototype.forEach = function(fn){
            for(var i = 0, len = this.length; i < len; i++){
                fn(this[i], i, this);
            }
        }
    }

    // 遍历数组,过滤选项
    if(!Array.prototype.filter){
        Array.prototype.filter = function(fn){
            var result = [];
            for(var i = 0, len = this.length; i < len; i++){
                if(fn(this[i], i, this)){
                    result.push(this[i]);
                }
            }
            return result;
        }
    }

    // 遍历数组,返回规则匹配的数组
    if(!Array.prototype.map){
        Array.prototype.map = function(fn){
            var result = [];
            for(var i = 0, len = this.length; i < len; i++){
                result.push(fn(this[i], i, this));
            }
            return result;
        }
    }

    // 遍历数组,如果按照规则所有项返回true，则返回true
    if(!Array.prototype.every){
        Array.prototype.every = function(fn){
            var bool = true;
            for(var i = 0, len = this.length; i < len; i++){
                if(fn(this[i], i, this) == false){
                    bool = false;
                    break;
                }
            }
            return bool;
        }
    }

    // 遍历数组,如果按照规则有一个选项返回true，则返回true
    if(!Array.prototype.some){
        Array.prototype.some = function(fn){
            var bool = false;
            for(var i = 0, len = this.length; i < len; i++){
                if(fn(this[i], i, this) == true){
                    bool = true;
                    break;
                }
            }
            return bool;
        }
    }
})();

/*
* class C
* 
*/
(function ($) { // class C
    var s,
        w,
        a = 0,
        b = 'no';

    function C(s, w) {
        s = s;
        w = w;
    }
    C.prototype = {

    }

    $.C = C;
})(Eui);






