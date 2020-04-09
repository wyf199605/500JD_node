'use strict';

const Controller = require('egg').Controller;

class DeveloperController extends Controller {
    async list() {
        const {ctx, service, app} = this;
        const orderForm = service.orderForm;
        const result = new app.Result();
        const openid = app.openid;

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
            const total = await orderForm.getOrderListTotal({developer: openid});
            const data = await orderForm.getOrderList(page, pageSize, {developer: openid}, 'time');
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
     * 接单
     * @return {Promise<void>}
     */
    async tackOrder() {
        const {ctx, service, app} = this;
        const orderForm = service.orderForm;
        const {orderId} = ctx.query;
        const openid = app.openid;

        const result = await orderForm.setOrderStatus(orderId, 1, openid);

        ctx.body = result.toJSON();
    }

    /**
     * 取消订单
     * @return {Promise<void>}
     */
    async cancelOrder() {
        const {ctx, service, app} = this;
        const orderForm = service.orderForm;
        const {orderId} = ctx.query;
        const openid = app.openid;

        const result = await orderForm.setOrderStatus(orderId, 0, openid);

        ctx.body = result.toJSON();
    }

    /**
     * 完成订单
     * @return {Promise<void>}
     */
    async finishOrder() {
        const {ctx, service, app} = this;
        const orderForm = service.orderForm;
        const {orderId} = ctx.query;
        const openid = app.openid;

        const result = await orderForm.setOrderStatus(orderId, 2, openid);

        ctx.body = result.toJSON();
    }
}

module.exports = DeveloperController;
