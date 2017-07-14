var dateformat = function () {

	function dateformat (format, date, isUTC) {
		format = format || '{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}:{{ss}}.{{mmmsss}}';
		date = (typeof date === 'number' ? new Date(date) : date ) || new Date();
		isUTC = isUTC || false;
		var string = format.replace(/\{\{(.+?)\}\}/g, function(all, key) {
			if (dateformat[key]) {
				return dateformat[key](date, isUTC);
			} else {
				return all;
			}
		});
		return string;
	};

	/** 获取date年份(2位) */
	dateformat['YY'] = function (date) {
		return date.getYear();
	};
	/** 获取完整的年份(4位,1970-????) */
	dateformat['YYYY'] = function (date) {
		return date.getFullYear();
	};
	/** 获取date月份(1-12) */
	dateformat['M'] = function (date) {
		return date.getMonth() + 1;
	};
	/** 获取date月份(01-12) */
	dateformat['MM'] = function (date) {
		return ('0' + (date.getMonth() + 1)).slice(-2);
	};
	/** 获取date日(1-31) */
	dateformat['D'] = function (date) {
		return date.getDate();
	};
	/** 获取date日(01-31) */
	dateformat['DD'] = function (date) {
		return ('0' + date.getDate()).slice(-2);
	};
	/** 获取date小时数(0-23) */
	dateformat['h'] = function (date, isUTC) {
		return isUTC ? date.getUTCHours() : date.getHours();
	};
	/** 获取date小时数(00-23) */
	dateformat['hh'] = function (date, isUTC) {
		return ('0' + (isUTC ? date.getUTCHours() : date.getHours())).slice(-2);
	};
	/** 获取date分钟数(0-59) */
	dateformat['m'] = function (date) {
		return date.getMinutes();
	};
	/** 获取date分钟数(00-59) */
	dateformat['mm'] = function (date) {
		return ('0' + date.getMinutes()).slice(-2);
	};
	/** 获取date秒数(0-59) */
	dateformat['s'] = function (date) {
		return date.getSeconds();
	};
	/** 获取date秒数(00-59) */
	dateformat['ss'] = function (date) {
		return ('0' + date.getSeconds()).slice(-2);
	};
	/** 获取date毫秒数(0-999) */
	dateformat['msss'] = function (date) {
		return date.getMilliseconds();
	};
	/** 获取date毫秒数(0-99) */
	dateformat['mss'] = function (date) {
		return date.getMilliseconds().toString().slice(0, 2);
	};
	/** 获取date毫秒数(0-9) */
	dateformat['ms'] = function (date) {
		return date.getMilliseconds().toString().slice(0, 1);
	};
	/** 获取date毫秒数(00-99) */
	dateformat['mmss'] = function (date) {
		return ('0' + date.getMilliseconds()).slice(-3).slice(0, 2);
	};
	/** 获取date毫秒数(000-999) */
	dateformat['mmmsss'] = function (date) {
		return ('00' + date.getMilliseconds()).slice(-3);
	};
	/** 获取date时间戳 */
	dateformat['timestamp'] = function (date) {
		return date.getTime();
	};
	/** date与new Date(0)的天数差 */
	dateformat['!D'] = function (date) {
		return Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
	};
	/** date与new Date(0)的小时差 */
	dateformat['!h'] = function (date) {
		return Math.floor(date.getTime() / (60 * 60 * 1000));
	};
	/** date与new Date(0)的分钟差 */
	dateformat['!m'] = function (date) {
		return Math.floor(date.getTime() / (60 * 1000));
	};
	/** date与new Date(0)的秒差 */
	dateformat['!s'] = function (date) {
		return Math.floor(date.getTime() / 1000);
	};

	return dateformat;
}();
