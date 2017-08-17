var cookie = function (window) {

	/** @type {String} 前缀 */
	var prefix = '';

	/** 去掉前后空格 */
	function trim (str) {
		str = '' + str + '';
		return str.replace(/(^\s*)|(\s*$)/, "");
	}

	/** 获取所有cookie */
	function allCookie () {
		var cookieData = {};
		var cookieString = window.document.cookie.split(';');
		for (var i = 0; i < cookieString.length; i++) {
			var cookie = cookieString[i].split('=');
			var key = trim(cookie[0]);
			var value = trim(cookie[1]);
			cookieData[key] = value;
		}
		if (prefix) {
			var cookieDataFilter = {}
			for (var key in cookieData) {
				if (key.indexOf(prefix) === 0) {
					var _key = key.replace(prefix, '');
					cookieDataFilter[_key] = cookieData[key];
				}
			}
			cookieData = cookieDataFilter;
		}
		return cookieData;
	};

	/** 获取指定的cookie */
	function getCookie (key) {
		var cookieData = allCookie();
		return cookieData[key];
	};

	/** 获取指设置cookie */
	function setCookie (key, value, opt) {
		key = trim(key);
		value = trim(value);

		var settingsStr = prefix + key + "=" + value;
		if (opt) {
			if (opt.expires) {
				var now = new Date();
				opt.expires = opt.expires * 24 * 60 * 60 * 1000;
				now.setTime(now.getTime() + opt.expires);
				settingsStr += " ;expires=" + now.toUTCString();
			}
			if (opt.path) str += " ;path=" + opt.path;
			if (opt.domanin) str += " ;domanin=" + opt.domanin;
			if (opt.secure) str += " ;secure=" + opt.secure;
		}

		window.document.cookie = settingsStr;

		return value;
	};

	/** 获取指删除cookie */
	function delCookie (key) {
		setCookie(key, '', { expires: -1 });
		return null;
	};

	/** 整合 */
	function cookie () {
		var params = arguments;
		if (params.length === 0) {
			return allCookie();
		} else if (params.length === 1) {
			return getCookie(params[0]);
		} else if (params[1] === null) {
			return delCookie(params[0]);
		} else {
			return setCookie(params[0], params[1], params[2]);
		}
	};

	/** 设置前缀 */
	cookie.setPrefix = function setPrefix (_prefix) {
		prefix = _prefix;
	};

	return cookie;
}(window);
