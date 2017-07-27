/**
 * 
 * 文件选择器
 * 
 * 例子：
 * var fileSelection = new FileSelection({
 *     limitExt: '.jpg,.png.gif', // 限制文件的后缀名,逗号分开，例子：".jpg,.png.gif"
 *     suffix: '.jpg,.png.gif', // 本地文件选择器只能显示的文件类型（如果设置了limitExt，该值无效）
 *     multiple: true, // 本地文件选择器是否允许多选文件
 *     maxSize: 0, // 文件大小的最大限制
 *     minSize: 0, // 文件大小的最小限制
 *     parseImgBase64: true, // 择图片文件时是否自动解析Base64值
 *     forcedChange: true, // 选择文件后是否强制刷新El(强制刷新El可以选择同一个文件)
 *     onChange: function (cutFileDatas, fileDatas) { // 监听选择文件事件
 *         // cutFileDatas: 当前选择的解析过的文件数据
 *         // fileDatas: 所以已经选择的解析过的文件数据
 *     },
 *     onError: function (errType, errFileData, cutFileDatas, fileDatas) { // 监听选择文件出错事件
 *         // errType: 错误类型，支持 limitExt, maxSize, minSize
 *         // errFileData: 出错的文件数据
 *         // cutFileDatas: 当前选择的解析过的文件数据
 *         // fileDatas: 所以已经选择的解析过的文件数据
 *     }
 * });
 *
 * fileSelection.$values     // 获取当前所有选择的文件数据
 * fileSelection.select()    // 打开选择文件窗口
 * fileSelection.push()      // 打开添加文件窗口
 * fileSelection.files()     // 获取当前所有选择的文件对象
 * fileSelection.remove(id)  // 根据fileData中id删除已经选择的文件
 * 
 */
var FileSelection = (function() {

	function FileSelection(opt) {
		// 多选文件
		this.$multiple = !!opt.multiple;
		// 限制选择的文件后缀类型
		this.$limitExt = typeof opt.limitExt === 'string' ? opt.limitExt.split(',') : undefined;
		// 选择文件时限制选择的文件类型
		this.$suffix = this.$limitExt ? this.$limitExt.join(',') : (typeof opt.suffix === 'string' ? opt.suffix : undefined);
		// 限制选择的文件大小的最大值
		this.$maxSize = typeof opt.maxSize === 'number' ? opt.maxSize : undefined;
		// 限制选择的文件大小的最小值
		this.$minSize = typeof opt.minSize === 'number' ? opt.minSize : undefined;
		// 选择图片文件时自动获取base64值
		this.$parseImgBase64 = !!opt.parseImgBase64;
		// 强制更新选择事件
		this.$forcedChange = !!opt.forcedChange;
		// 注册选择事件
		this.$onChange = typeof opt.onChange === 'function' ? opt.onChange : undefined;
		// 注册选择错误事件
		this.$onError = typeof opt.onError === 'function' ? opt.onError : undefined;
		// 当前选择模式
		this.$action = 'select';
		// 当前选择的文件状态
		this.$values = [];

		this.$$createInputFileBox();
		this.$$createInputFile();
	}

	/** 创建存放input标签的容器 */
	FileSelection.prototype.$$createInputFileBox = function() {
		if (!this.$$eInputFileBox) {
			FileSelection.prototype.$$eInputFileBox = document.createElement('div');
			document.body.appendChild(FileSelection.prototype.$$eInputFileBox);
		}
	};

	/** 创建input标签 */
	FileSelection.prototype.$$createInputFile = function() {
		if (this.$eInputFile && this.$$eInputFileBox) {
			this.$$eInputFileBox.removeChild(this.$eInputFile);
		}
		this.$eInputFile = document.createElement('input');
		this.$eInputFile.type = 'file';
		this.$eInputFile.style.display = 'none';
		this.$eInputFile.onchange = this.$$onChange.bind(this);

		if (this.$multiple) { this.$eInputFile.multiple = "multiple"; }
		if (this.$suffix) { this.$eInputFile.accept = this.$suffix; }

		this.$$eInputFileBox.appendChild(this.$eInputFile);
	};

	/** 获取一个随机的 ID */
	FileSelection.prototype.$$getId = function() {
		var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var result = ''
		for (var i = 0; i < 8; i++) {
			result += str[Math.floor(Math.random() * str.length)];
		}
		return result;
	};

	/** 根据image file对象获取base64值 */
	FileSelection.prototype.$$parseImgBase64 = function(file, callback) {
		if (typeof FileReader !== 'function') { return callback && callback(''); }
		var reader = new FileReader();
		reader.onload = function() {
			callback && callback(this.result);
		}
		reader.readAsDataURL(file);
	};

	/** 根据file对象生成fileValue */
	FileSelection.prototype.$$parseFileData = function(file) {
		var fileData = {};
		fileData.id = this.$$getId();
		fileData.path = file.name;
		fileData.path.replace(/^(((?:[a-zA-Z]):)?[\\\/]?(?:[\s\S]+?[\\\/])*)([\s\S]+?(\.[\s\S]+?)?)$/, function(all, dirname, drive, basename, extname) {
			fileData.drive = drive || undefined;
			fileData.dirname = dirname || undefined;
			fileData.basename = basename || undefined;
			fileData.extname = extname || undefined;
		});
		fileData.size = file.size;
		fileData.type = file.type;
		fileData.lastModified = file.lastModified;
		fileData.lastModifiedDate = file.lastModifiedDate;
		fileData.$file = file;
		return fileData;
	};

	/** 任务队列 */
	FileSelection.prototype.$$queue = function(tasks, callback, success) {
		var tasksLen = tasks.length;
		var successNum = 0;
		var next = function() {
			successNum += 1;
			if (successNum >= tasksLen) {
				success && success();
			}
		}
		for (var i = 0; i < tasksLen; i++) {
			callback && callback(tasks[i], next);
		}
	};

	/** input选择更改事件 */
	FileSelection.prototype.$$onChange = function() {
		var self = this;
		var files = self.$eInputFile.files;
		var cutFileDatas = [];
		self.$$queue(files, function(file, next) {
			var fileData = self.$$parseFileData(file);
			cutFileDatas.push(fileData);
			if (!self.$parseImgBase64 || ['.jpg', '.png', '.gif'].indexOf(fileData.extname) < 0) {
				return next();
			}
			self.$$parseImgBase64(file, function(result) {
				fileData.result = result
				return next();
			});
		}, function() {
			var err = null;
			cutFileDatas.forEach(function(fileData) {
				if (self.$maxSize && fileData.size > self.$maxSize) {
					return err = { type: 'maxSize', fileData: fileData };
				} else if (self.$minSize && fileData.size < self.$minSize) {
					return err = { type: 'minSize', fileData: fileData };
				} else if (self.$limitExt && self.$limitExt.indexOf(fileData.extname) < 0) {
					return err = { type: 'limitExt', fileData: fileData };
				}
			});
			if (self.$forcedChange) { self.$$createInputFile(); }
			if (err) { return self.$onError && self.$onError(err.type, err.fileData, cutFileDatas, self.$values); }
			if (self.$action !== 'push') { self.$values = []; }
			self.$values.push.apply(self.$values, cutFileDatas);
			self.$onChange && self.$onChange(cutFileDatas, self.$values);
		});
	};

	/** 注册事件 */
	FileSelection.prototype.on = function(eType, callback) {
		if (typeof callback !== 'function') { return; }
		if (eType === 'change') {
			this.$onChange = callback;
		} else if (eType === 'error') {
			this.$onError = callback;
		}
	};

	/** 打开选择文件窗口 */
	FileSelection.prototype.select = function() {
		this.$action = 'select';
		this.$eInputFile.click();
	};

	/** 打开添加文件窗口 */
	FileSelection.prototype.push = function() {
		this.$action = 'push';
		this.$eInputFile.click();
	};

	/** 获取所有已选择的file对象 */
	FileSelection.prototype.files = function() {
		return this.$values.map(function(item) {
			return item.$file;
		});
	};

	/** 根据id删除fileValue */
	FileSelection.prototype.remove = function(id) {
		var fileIndex = this.$values.findIndex(function(item) {
			return item.id === id;
		});
		if (fileIndex < 0) { return; }
		this.$values.splice(fileIndex, 1);
	};

	return FileSelection;
})();
