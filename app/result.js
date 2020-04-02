'use strict';

/**
 * 获取返回值类
 * @param {egg.EggApplication} app
 * @return {{new(*=): Result, code: number, data: null, msg: string, prototype: Result}}
 */
module.exports = app => {
    const logger = app.logger;

    return class Result {
        constructor() {
            this.code = 0;
            this.data = null;
            this.msg = '';
        }

        // 返回数据
        toJSON() {
            return {
                code: this.code,
                data: this.data,
                msg: this.msg,
            };
        }

        /**
         * 设置成功返回数据
         * @param {Array | Object} data
         * @param {string} [msg]
         */
        setSuccessData(data, msg = '请求成功') {
            this.code = 200;
            this.data = data;
            this.msg = msg;
            // logger.info('请求成功');
        }

        /**
         * 主动设置错误信息
         * @param {string} msg
         * @param {number} code
         */
        setError(msg, code = 0) {
            this.code = code;
            this.data = null;
            this.msg = msg;
            logger.error(new Error(msg));
        }

        /**
         * 请求参数出错
         * @param [error]
         * @param [msg]
         */
        paramError(error, msg = '请求参数错误') {
            this.code = 400;
            this.data = null;
            this.msg = msg;
            logger.error(new Error(error || msg));
        }

        /**
         * 数据库错误
         * @param [error]
         * @param [msg]
         */
        databaseError(error, msg = '数据库执行出错') {
            this.code = 500;
            this.data = null;
            this.msg = msg;
            logger.error(new Error(error || msg));
        }

        /**
         * 用户信息错误
         * @param [error]
         * @param [msg]
         */
        userError(error, msg = '无效的用户') {
            this.code = 10000;
            this.data = null;
            this.msg = msg;
            logger.error(new Error(error || msg));
        }
    };
};
