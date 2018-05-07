/***
 * 日历组件calendar v0.1
 * author hurenweb
 * @param {str} id input的id(必填)
 * @param {str} time 显示年月(格式为2018-04)(可选)
 * 使用方法:页面初始化的时候传入id,默认显示当前时间，如下：
 * 1. calendar.init(id);
 * 2. calendar.init(id,"2016-06");
 * 注意事项：input的定位最好设置成绝对定位
 * 原生css/js开发
 * 兼容其它ui框架
 */
var calendar = {
    dg: function (id) {
        return document.getElementById(id);
    },
    getStyle: function (obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    },
    isLeap: function (year) {
        return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
    },
    timef: function (val) {
        if (parseInt(val) < 10) {
            return "0" + val;
        }
        return val;
    },
    addEvent: function (dom, eType, func) {
        if (dom.addEventListener) {  // DOM 2.0
            dom.addEventListener(eType, function (e) {
                func(e);
            });
        } else if (dom.attachEvent) {  // IE5+
            dom.attachEvent('on' + eType, function (e) {
                func(e);
            });
        } else {  // DOM 0
            dom['on' + eType] = function (e) {
                func(e);
            }
        }
    },
    insertAfter: function (newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    },
    init: function (id, time) {
        this.addEvent(this.dg(id), 'click', function () {
            calendar.main(id, time);
        });
    },
    prev: function (id, time) {
        var timeArr = time.split("-");
        var year = parseInt(timeArr[0]);
        var month = parseInt(timeArr[1]);
        if (month == 1) {
            year -= 1;
            time = year + "-12";
        } else {
            month--;
            time = year + "-" + calendar.timef(month);
        }
        calendar.main(id, time);
    },
    next: function (id, time) {
        var timeArr = time.split("-");
        var year = parseInt(timeArr[0]);
        var month = parseInt(timeArr[1]);
        if (month == 12) {
            year += 1;
            time = year + "-01";
        } else {
            month++;
            time = year + "-" + calendar.timef(month);
        }
        calendar.main(id, time);
    },
    afn: function (id, time) {
        this.dg(id).value = time;
        this.dg("calendar_h").style.display = "none";
    },
    main: function (id, time) {
        var inputobj = this.dg(id);
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        if (typeof time != "undefined") {
            var tArr = time.split("-");
            y = tArr[0];
            m = parseInt(tArr[1]);
        }
        var time2 = y + '-' + this.timef(m);
        var d1 = new Date(y, m - 1, 1); //当月第一天
        var week1 = d1.getDay(); //第一天是星期几0-6，0为星期天
        var mArr = [31, 28 + this.isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var obj;
        if (this.dg("calendar_h")) {
            var ele = this.dg("calendar_h");
            ele.parentNode.removeChild(ele);
        }
        obj = document.createElement("div");
        obj.className = "calendar_h";
        obj.id = "calendar_h";
        this.insertAfter(obj, inputobj);
        obj = this.dg("calendar_h");
        obj.style.display = "block";
        obj.style.left = parseInt(this.getStyle(inputobj, "left")) + "px";
        obj.style.top = parseInt(this.getStyle(inputobj, "top")) + parseInt(this.getStyle(inputobj, "height")) + 5 + "px";
        var html = '<div class="three"></div><div class="top"><a href="javascript:calendar.prev(\'' + id + '\',\'' + time2 + '\');">&lt</a><span>' + time2 + '</span><a href="javascript:calendar.next(\'' + id + '\',\'' + time2 + '\');">&gt</a></div><div class="week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div><div class="main">';
        //前一个月
        var d3, y3, m3;
        if (m == 1) {
            y3 = y - 1;
            m3 = 12;
            d3 = 31;
        } else {
            y3 = y;
            m3 = m - 1;
            d3 = mArr[m3 - 1];
        }
        for (var i = 0; i < week1; i++) {
            var time3 = y3 + "-" + this.timef(m3) + "-" + this.timef(d3 - week1 + i + 1);
            html += '<a class="more" href="javascript:calendar.afn(\'' + id + '\',\'' + time3 + '\');">' + (d3 - week1 + i + 1) + '</a>';
        }
        //当月的
        for (var j = 0; j < mArr[m - 1]; j++) {
            if (j + 1 == today.getDate()) {
                html += '<a class="this" href="javascript:calendar.afn(\'' + id + '\',\'' + (time2 + '-' + this.timef(j + 1)) + '\');">' + (j + 1) + '</a>';
            } else {
                html += '<a href="javascript:calendar.afn(\'' + id + '\',\'' + (time2 + '-' + this.timef(j + 1)) + '\');">' + (j + 1) + '</a>';
            }
        }
        //后一个月
        var y4, m4;
        if (m == 12) {
            y4 = y + 1;
            m4 = 1;
        } else {
            y4 = y;
            m4 = m + 1;
        }
        var week4 = 42 - week1 - mArr[m - 1];
        for (var z = 0; z < week4; z++) {
            var time4 = y4 + "-" + this.timef(m4) + "-" + this.timef(z + 1);
            html += '<a class="more" href="javascript:calendar.afn(\'' + id + '\',\'' + time4 + '\');">' + (z + 1) + '</a>';
        }
        html += '</div>';
        obj.innerHTML = html;
    }
};