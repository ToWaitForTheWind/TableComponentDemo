class RequestLimit {
    constructor (limit) {
        this.limit = Number(limit) || 6; // 浏览器默认最大并行6个
        this.blockQueue = [];
        this.currentReqNumber = 0;
    }

    /**
   * 请求
   * @param {*} req
   */
    async request (req) {
        if (!req) {
            throw new Error('req is required.');
        }
        if (Object.prototype.toString.call(req) !== '[object Function]') {
            throw new Error('req must be a function.');
        }
        if (this.currentReqNumber >= this.limit) {
            await new Promise(resolve => this.blockQueue.push(resolve)); // 阻塞队列增加一个 Pending 状态的 Promise
        }

        return this._handlerReq(req);
    }

    /**
   * 内部方法处理请求
   * @param {*} req
   */
    async _handlerReq (req) {
        this.currentReqNumber++;
        try {
            return await req();
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this.currentReqNumber--;
            if (this.blockQueue.length) {
                // 每完成一个就从阻塞队列里剔除一个
                this.blockQueue[0](); // 将最先进入阻塞队列的 Promise 从 Pending 变为 Fulfilled
                this.blockQueue.shift();
            }
        }
    }
}

export default RequestLimit;
