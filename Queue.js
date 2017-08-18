/**
 * 队列
 *
 * 创建具有指定并发性的队列对象。 添加到队列中的任务并行处理（达到并发限制）。 
 * 如果所有工作人员都在进行中，则任务将排队等候，直到可用。 一旦工作人员完成任务，就会调用该任务的回调。
 *
 * // 示例
 * var queue = new Queue(function (task, next) { next(task); });
 * queue.push({name: 'bar'}, function (task) {});
 *
 *
 * 
 * @param  {Function}  worker         用于处理排队任务的异步功能。
 *                                    如果要处理单个任务中的错误，请将回调传递给q.push()，
 *                                    用(task, callback)调用。
 * @param  {Number}    concurrencyopt 用于确定应并行运行多少个工作函数的整数。默认为1
 * @return {Queue}                    用于管理任务的队列对象。
 * 
 */
var Queue = (function () {

	function Queue (worker, concurrency) {
		this.tasks = [];
		this.worker = typeof worker === 'function' ? worker : null;
		this.concurrencyMax = typeof concurrency === 'number' && concurrency > 0 ? concurrency : 1;
		this.concurrencyCut = 0;
		this.drain = null;
	}

	Queue.prototype._start = function () {
		if (this.tasks.length === 0 || this.concurrencyCut >= this.concurrencyMax) {
			return ;
		}
		var taskData = this.tasks.shift();
		this.concurrencyCut += 1;
		this.worker && this.worker(taskData.task, this._next.bind({ taskData: taskData, self: this }));
	};

	Queue.prototype._next = function () {
		var self = this.self;
		var taskData = this.taskData;
		taskData.callback && taskData.callback.apply(this, arguments);
		self.concurrencyCut -= 1;
		if ( self.tasks.length > 0 ) { return self._start(); }
		if ( self.concurrencyCut === 0 ) { return self.drain && self.drain(); }
	};

	Queue.prototype.push = function (task, callback) {
		this.tasks.push({ task: task, callback: callback });
		if ( this.concurrencyCut < this.concurrencyMax ) { return this._start(); }
	};

	return Queue;
})();
