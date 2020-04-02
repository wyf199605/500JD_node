'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class PublisherController extends Controller {
    async list() {
        const {ctx, service, app} = this;
        const isLocal = app.config.env === 'local';
        const orderForm = service.orderForm;
        const result = new app.Result();
        const openid = ctx.cookies.get('openid', {signed: !isLocal, encrypt: !isLocal});

        let {page, pageSize} = ctx.query;
        page = Number(page);
        pageSize = Number(pageSize);

        // 判断参数是否有效
        if (isNaN(page) || isNaN(pageSize)) {
            // 参数无效
            result.paramError();
            ctx.body = result.toJSON();
            return;
        }

        try {
            // 执行数据库操作
            const total = await orderForm.getOrderListTotal({publisher: openid});
            const data = await orderForm.getOrderList(page, pageSize, {publisher: openid}, 'time');
            result.setSuccessData({
                total,
                data,
            });
        } catch (e) {
            // 执行数据库失败
            result.databaseError(e, '获取订单列表失败');
        }
        ctx.body = result.toJSON();
    }


    /**
     * 更新订单内容
     * @return {Promise<void>}
     */
    async updateOrder() {
        const {ctx, service, app} = this;
        const isLocal = app.config.env === 'local';
        const result = new app.Result();
        const orderForm = service.orderForm;
        const {orderId, ...updateData} = ctx.request.body;
        const openid = ctx.cookies.get('openid', {signed: !isLocal, encrypt: !isLocal});

        if (!orderId) {
            // 参数无效
            result.paramError();
            ctx.body = result.toJSON();
            return;
        }

        try {
            const orderData = await orderForm.selectOrder(orderId);
            if (!orderData) {
                result.paramError(null, '参数无效，未找到对应的订单');
                ctx.body = result.toJSON();
                return;
            }

            // 判断提交人是否是自己，并且状态是发布中的状态
            if (orderData.status !== 0 || orderData.publisher !== openid) {
                result.paramError(null, '订单状态无法修改');
                ctx.body = result.toJSON();
                return;
            }

            // 判断是否有数据改变
            if (['title', 'details', 'deadline', 'budget', 'codeType'].every(key => {
                const oldData = orderData[key],
                    newData = updateData[key];

                if (typeof oldData === 'number') {
                    return oldData === Number(newData);
                }
                if (oldData instanceof Date) {
                    return moment(oldData).toDate().getTime() === moment(newData).toDate().getTime();
                }
                return Object.is(oldData, newData);
            })) {
                result.paramError(null, '数据没有发生改变');
                ctx.body = result.toJSON();
                return;
            }

            const res = await orderForm.updateOrder(orderId, {
                title: updateData.title,
                details: updateData.details,
                deadline: updateData.deadline,
                budget: updateData.budget,
                codeType: updateData.codeType,
            });

            result.setSuccessData(res, '更新订单成功');
        } catch (e) {
            result.databaseError(e, '数据更新失败');
        }

        ctx.body = result.toJSON();
    }

    /**
     * 取消订单
     * @return {Promise<void>}
     */
    async cancelOrder() {
        const {ctx, service, app} = this;
        const isLocal = app.config.env === 'local';
        const orderForm = service.orderForm;
        const {orderId} = ctx.query;
        const openid = ctx.cookies.get('openid', {signed: !isLocal, encrypt: !isLocal});

        const result = await orderForm.setOrderStatus(orderId, 3, openid);

        ctx.body = result.toJSON();
    }
}

module.exports = PublisherController;
