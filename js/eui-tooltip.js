(function ($) {
    /*
    * class Tooltip
    * 
    */

    // 私有变量
    var 
        elem,               // tooltip控件容器
        inner,              // tooltip内容容器
        msgtail,            // tooltip尾巴装饰件
        delay,              // 动画帧时间
        delayTimeout,       // 动画追踪
        delayCount,         // 动画次数
        delayNum,           // 动画起始状态值
        state;              // 当前的状态是显示或者隐藏

    // 私有函数
    var 
    // 设置滑动条的信息内容
        setInformation = function (information) {
            inner.innerHTML = information;
        },

    // 根据滑动条出现的位置, 选取相应的外观装饰
        setStyle = function (location) {
            $.U.removeClass(msgtail, 'msgtail-left, msgtail-right, msgtail-top, msgtail-bottom');
            switch (location) {
                case 'left':
                    $.U.addClass(msgtail, 'msgtail-left');
                    break;
                case 'right':
                    $.U.addClass(msgtail, 'msgtail-right');
                    break;
                case 'top':
                    $.U.addClass(msgtail, 'msgtail-top');
                    break;
                case 'bottom':
                    $.U.addClass(msgtail, 'msgtail-bottom');
                    break;
            }
        },

    // 根据滑动条出现的位置, 定位滑动条
        setPosition = function (position, location) {
            var offLeft = 0,
                offTop = 0;
            switch (location) {
                case 'left':
                    offLeft = elem.offsetWidth;
                    offTop = elem.offsetHeight / 2;
                    break;
                case 'right':
                    offLeft = 0;
                    offTop = elem.offsetHeight / 2;
                    break;
                case 'top':
                    offLeft = elem.offsetWidth / 2;
                    offTop = elem.offsetHeight;
                    break;
                case 'bottom':
                    offLeft = elem.offsetWidth / 2;
                    offTop = 0;
                    break;
            }
            elem.style.left = position.left - offLeft + 'px';
            elem.style.top = position.top - offTop + 'px';
        },

    // 滑动条出现时使用动画
        animate = function (location) {
            switch (location) {
                case 'left':
                    elem.style.left = parseInt(elem.style.left) - 1 + 'px';
                    break;
                case 'right':
                    elem.style.left = parseInt(elem.style.left) + 1 + 'px';
                    break;
                case 'top':
                    elem.style.top = parseInt(elem.style.top) - 1 + 'px';
                    break;
                case 'bottom':
                    elem.style.top = parseInt(elem.style.top) + 1 + 'px';
                    break;
            }

            elem.style.opacity = parseFloat(elem.style.opacity) + 0.2;

            delayTimeout = setTimeout(function () {
                if (delayNum < delayCount) {
                    animate(location);
                    delayNum++;
                } else if (delayNum == delayCount) {
                    clearTimeout(delayTimeout);
                    delayTimeout = null;
                    delayNum = 0;
                }
            }, delay);
        },

    // 转换当前tooltip显示状态
        changeState = function () {
            if (state === 'none') {
                state = 'display';
            } else if (state === 'display') {
                state = 'none';
            } 
        };

    function Tooltip(s, w) {
        elem = document.createElement('div');
        elem.style.position = 'absolute';
        elem.style.display = 'none';
        elem.className = 'tooltip';
        document.body.appendChild(elem);

        inner = document.createElement('div');
        elem.appendChild(inner);

        msgtail = document.createElement('span');
        msgtail.className = 'msgtail';
        elem.appendChild(msgtail);

        delay = 20;
        delayTimeout = null;
        delayCount = 5;
        delayNum = 0;

        state = 'none';
    }
    // 公有函数
    Tooltip.prototype = {
        //显示滑动条
        show: function (information, position, location) {
            clearTimeout(delayTimeout);
            delayTimeout = null;

            setInformation(information);
            setStyle(location);
            elem.style.opacity = '0';
            elem.style.display = 'block';
            setPosition(position, location);
            animate(location);
            changeState();
        },

        // 隐藏滑动条
        hide: function () {
            clearTimeout(delayTimeout);
            delayTimeout = null;
            elem.style.display = 'none';
            changeState();
        },

        // 获取当前tooltip显示状态
        getState: function () {
            return state;
        }
    }

    $.Tooltip = Tooltip;
})(Eui);


(function($){
    var 
        staticTooltip,
        tooltips;

    var 
        createStaticTooltip = function () {
            if (!staticTooltip) {
                staticTooltip = new $.Tooltip();
            }
        },

        createTooltip = function () {
            return new $.Tooltip();
        },

        config = function (option) {
            var left = $.U.getElemLeft(option.target),
                top = $.U.getElemTop(option.target),
                width = option.target.offsetWidth,
                height = option.target.offsetHeight;
                
            switch (option.location) {
                case 'left':
                    left = left;
                    top = top + height / 2;
                    break;
                case 'right':
                    left = left + width;
                    top = top + height / 2;
                    break;
                case 'top':
                    left = left + width / 2;
                    break;
                case 'bottom':
                    left = left + width / 2;
                    top = top + height;
                    break;
            }

            return {
                position: {
                    left:left,
                    top:top
                },
                information: option.information,
                location: option.location
            }
        },

        addEvents = function (options) {
            options.forEach(function(item, i){
                var result = config(item);

                if (item.type && item.type === 'click') {
                    tooltips[i] = createTooltip();
                    $.EU.on(document, item.target, 'click', function (e) {
                        var state = tooltips[i].getState();
                        
                        if (state === 'none') {
                            tooltips[i].show(result.information, result.position, result.location);
                        } else if (state === 'display') {
                            tooltips[i].hide();
                        }
                    });
                } else {
                    $.EU.on(document, item.target, 'mouseover', function (e) {
                        createStaticTooltip();
                        staticTooltip.show(result.information, result.position, result.location);
                    });

                    $.EU.on(document, item.target, 'mouseout', function (e) {
                        staticTooltip.hide();
                    });
                }
            });
        };

    function TooltipManager(options) {
        staticTooltip = null;
        tooltips = [];
        addEvents(options);
    }
    TooltipManager.prototype = {
    };

    Eui.TooltipManager = TooltipManager;
})(Eui);


(function($){
    $.EU.on(window, 'load', function(){
        var t = new Eui.TooltipManager([
            {
                target:document.getElementById('te'),
                information:'测试上边浮动出现的滑动条',
                location:'right'
            }
            ]);
    });
})(Eui);