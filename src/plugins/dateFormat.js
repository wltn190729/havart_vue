import vue from 'vue'

/* eslint-disable */
Date.prototype.dateFormat = function(f) {
    if (!this.valueOf()) return " ";
    if (!f) return this;

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        shortWeekName = ["일", "월", "화", "수", "목", "금", "토"],
        d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "e": return shortWeekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
String.prototype.dateFormat = function(f) {
    var d = new Date(this);
    return ( d == 'Invalid Date') ? '' : d.dateFormat(f);
}

vue.prototype.numberFormat = (num) => {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}


Date.prototype.addDays = function (days) {
    var date = this;
    return new Date(date.setDate(date.getDate() + days));
};

// 현재 년월일에서 월을 +- 월 한 결과 리턴.
Date.prototype.addMonth = function (month) {
    var date = this;
    return new Date(date.setMonth(date.getMonth() + month));
};

// 현재 년월일에서 년을 +- 월 한 결과 리턴.
Date.prototype.addYear = function (year) {
    var date = this;
    return new Date(date.setFullYear(date.getFullYear() + year));
};

vue.prototype.dayList = {
    today: new Date().dateFormat('yyyy-MM-dd'),
    yesterday: ((new Date()).addDays(-1)).dateFormat('yyyy-MM-dd'),
    weekAgo: ((new Date()).addDays(-7)).dateFormat('yyyy-MM-dd'),
    monthAgo: ((new Date()).addMonth(-1)).dateFormat('yyyy-MM-dd'),
    month3Ago: ((new Date()).addMonth(-3)).dateFormat('yyyy-MM-dd')
}
