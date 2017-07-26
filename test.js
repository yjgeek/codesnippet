var test = function () {

	/** @type {Object} 存储扩展验证 */
	var fvalue = {};

	/** 验证值是否相等 */
	function testEqual (test, value) {
		return test === value;
	};

	/** 验证正则表达式是否匹配 */
	function testRegexp (regexp, value) {
		return regexp.test(''+value+'');
	};

	/** 验证数字规则是否匹配 */
	function testNumber (test, value) {
		if (test.indexOf('>=') === 0) {
			const condition = Number(test.replace(/\>=\s*?([-+]?[0-9]*(?:\.?[0-9]+)?)/, '$1'));
			return value >= condition;
		} else if (test.indexOf('>') === 0) {
			const condition = Number(test.replace(/\>\s*?([-+]?[0-9]*(?:\.?[0-9]+)?)/, '$1'));
			return value > condition;
		} else if (test.indexOf('<=') === 0) {
			const condition = Number(test.replace(/\<=\s*?([-+]?[0-9]*(?:\.?[0-9]+)?)/, '$1'));
			return value <= condition;
		} else if (test.indexOf('<') === 0) {
			const condition = Number(test.replace(/\<\s*?([-+]?[0-9]*(?:\.?[0-9]+)?)/, '$1'));
			return value < condition;
		} else if (test.indexOf('=') === 0) {
			const condition = Number(test.replace(/\=\s*?([-+]?[0-9]*(?:\.?[0-9]+)?)/, '$1'));
			return value === condition;
		} else {
			const condition = Number(test);
			return value === condition;
		}
	};

	/** 自定义function验证是否匹配 */
	function testFn (fn, value) {
		return fn(value) ? true : false;
	};

	/** 验证 */
	function testItem (verification, value) {
		if (typeof verification === 'string' && fvalue[verification]) { verification = fvalue[verification]; }
		if (typeof verification === 'string' && typeof value === 'number') {
			return testNumber(verification, value);
		} else if (verification instanceof RegExp) {
			return testRegexp(verification, value);
		} else if (typeof verification === 'function') {
			return testFn(verification, value);
		} else {
			return testEqual(verification, value);
		}
	};

	/** 验证结果数组 */
	function toArrayResult (verifications, value) {
		var arr = [];
		for (var k = 0, length = verifications.length; k < length; k++) {
			arr.push(testItem(verifications[k], value));
		}
		return arr;
	};

	/** and模式验证 */
	function testArrayAnd (verifications, value) {
		const results = toArrayResult(verifications, value);
		var passed = true;
		for (var k = 0, length = results.length; k < length; k++) {
			if (passed === false) break;
			passed = results[k]===true;
		}
		return passed;
	};

	/** or模式验证 */
	function testArrayOr (verifications, value) {
		const results = toArrayResult(verifications, value);
		var passed = false;
		for (var k = 0, length = results.length; k < length; k++) {
			if (passed === true) break;
			passed = results[k] === true;
		}
		return passed;
	};

	function test (value, verifications, isAnd) {
		if(!(verifications instanceof Array)) verifications = [verifications];
		if (isAnd !== false && isAnd !== true) {isAnd = true; }
		if (isAnd) {
			return testArrayAnd(verifications, value);
		}
		return testArrayOr(verifications, value);
	};

	test.and = function (value, verifications) {
		return test(value, verifications, true);
	};

	test.or = function (value, verifications) {
		return test(value, verifications, false);
	};

	test.results = function (value, verifications) {
		if(!(verifications instanceof Array)) verifications = [verifications];
		return toArrayResult(verifications, value);
	};

	test.streamline = function (key, value, del) {
		if (del) { return delete fvalue['{{'+key+'}}']; }
		return fvalue['{{'+key+'}}'] = value;
	};

	return test;
}();
