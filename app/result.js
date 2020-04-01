'use strict';

class Result {
    constructor(ctx) {
        this.code = 0;
        this.data = null;
        this.msg = '';
        Object.defineProperty(this, 'ctx', {
            configurable: false,
            enumerable: false,
            value: ctx,
            writable: false,
        });
    }

    /**
     * 设置成功返回数据
     * @param {Array | Object} data
     */
    setSuccessData(data) {
        this.code = 200;
        this.data = data;
        this.msg = 'Request succeeded';
    }

    paramError() {
        this.code = 400;
        this.data = null;
        this.msg = '参数错误';
    }
}

module.exports = Result;
