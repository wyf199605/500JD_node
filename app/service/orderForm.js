'use strict';

const Service = require('egg').Service;

class OrderFormService extends Service {
    /**
     * 查询订单列表
     * @param {number} page 当前第几页
     * @param {number} pageSize 一个几张
     * @param {Object} queryCond 查询条件
     * @param {Object | string} sort 排序
     * @return {Promise<*>}
     */
    async getOrderList(page, pageSize, queryCond = {}, sort = '-status time') {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.find(queryCond)
            .select('_id title codeType budget deadline status details')
            .sort(sort)
            .skip(page * pageSize)
            .limit(pageSize);
    }

    getListTotal(queryCond = {}) {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.count(queryCond);
    }

    /**
     * 根据ID查找订单
     * @param id
     * @returns {void | (DocumentQuery<DocType | null, DocType, QueryHelpers> & QueryHelpers) | (DocumentQuery<T | null, T, QueryHelpers> & QueryHelpers) | Promise<TSchema | null>}
     */
    selectOrder(id) {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.findOne({_id: id});
    }

    /**
     * 更新订单
     * @param {string} id
     * @param {{}} data
     * @returns {Query<any> | void | (Query<any> & QueryHelpers) | Promise<UpdateWriteOpResult> | OrderedBulkOperation | UnorderedBulkOperation}
     */
    updateOrder(id, data) {
        return this.selectOrder(id).update(data);
    }

    /**
     * 新增订单
     * @param {{
     *     title: string,
     *     details: string,
     *     codeType: string,
     *     budget: number,
     *     deadline: Date,
     *     publisher: string,
     *     pictures?: string,
     *     attachment?: string,
     * }} data
     * @returns {void | Promise<WriteOpResult> | Promise<this>}
     */
    insertOrder(data) {
        const OrderForm = this.ctx.model.OrderForm;
        const order = new OrderForm({
            ...data,
            status: 0,
        });
        return order.save();
    }

    /**
     * 根据ID删除订单
     * @param {string} id
     * @returns {void | (Query<DeleteWriteOpResultObject["result"] & {deletedCount?: number}> & QueryHelpers) | Promise<DeleteWriteOpResultObject> | OrderedBulkOperation}
     */
    deleteOrder(id) {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.deleteOne({_id: id});
    }
}

module.exports = OrderFormService;
