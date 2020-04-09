'use strict';

const Service = require('egg').Service;

class OrderFormService extends Service {
    /**
     * 查询订单列表
     * @param {number} page 当前第几页
     * @param {number} pageSize 一个几张
     * @param {Object} [queryCond] 查询条件
     * @param {Object | string} [sort] 排序
     * @return {Promise<*>}
     */
    async getOrderList(page, pageSize, queryCond = {}, sort = '-status time') {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.find(queryCond)
            .select('_id title codeType budget deadline status details createTime')
            .sort(sort)
            .skip(page * pageSize)
            .limit(pageSize);
    }

    /**
     * 获取订单列表总数
     * @param {Object} [queryCond] 查询条件
     * @return {IDBRequest<number> | void}
     */
    getOrderListTotal(queryCond = {}) {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.countDocuments(queryCond);
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
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.updateOne({...data, _id: id});
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
        console.log({
            ...data,
            status: 0,
        });
        const order = new OrderForm({
            ...data,
            status: 0,
        });
        console.log('success');
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

    /**
     * 设置订单状态
     * @param {string} orderId
     * @param {number} status
     * @param {string} openid
     * @return {Promise<Result|Result>}
     */
    async setOrderStatus(orderId, status, openid) {
        const {service, app} = this;
        const result = new app.Result();
        const orderForm = service.orderForm;

        try {
            const orderData = await orderForm.selectOrder(orderId);
            if (!orderData) {
                result.paramError(null, '参数无效，未找到对应的订单');
                return result;
            }

            switch (status) {
                case 0:
                    // 取消接单
                    if (orderData.status === 1 && orderData.developer === openid) {
                        const data = await orderData.updateOrder(orderId, {
                            status: 0,
                            developer: null,
                        });
                        result.setSuccessData(data, '取消接单成功');
                    } else {
                        result.setError('该订单已取消或者您没有权限操作该订单', 404);
                    }
                    break;
                case 1:
                    // 开发者接单
                    if (orderData.status === 0 && !orderData.developer) {
                        const data = await orderData.updateOrder(orderId, {
                            status: 1,
                            developer: openid,
                        });
                        result.setSuccessData(data, '接单成功');
                    } else {
                        result.setError('当前订单已被接单', 404);
                    }
                    break;
                case 2:
                    // 开发者完成订单
                    if (orderData.status === 1 && orderData.developer === openid) {
                        const data = await orderData.updateOrder(orderId, {
                            status: 2,
                        });
                        result.setSuccessData(data, '完成订单');
                    } else {
                        result.setError('该订单已取消或者您没有权限操作该订单', 503);
                    }
                    break;
                case 3:
                    // 发布者取消订单
                    if (orderData.status !== 2 && orderData.publisher === openid) {
                        const data = await orderData.updateOrder(orderId, {
                            status: 3,
                        });
                        result.setSuccessData(data, '取消订单成功');
                    } else {
                        result.setError('该订单已完成或者您没有权限操作该订单', 503);
                    }
                    break;
                default:
                    result.setError('未知订单状态', 404);
                    break;
            }
        } catch (e) {
            result.databaseError(e);
        }

        return result;
    }
}

module.exports = OrderFormService;
