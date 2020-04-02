'use strict';

const Controller = require('egg').Controller;

class OrderFormController extends Controller {
    /**
     * 获取订单列表
     * @return {Promise<void>}
     */
    async list() {
        const {ctx, service, app} = this;
        const orderForm = service.orderForm;
        const result = new app.Result();

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
            const total = await orderForm.getOrderListTotal();
            const data = await orderForm.getOrderList(page, pageSize);
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
     * 获取订单详情
     * @return {Promise<void>}
     */
    async getOrder() {
        const {ctx, service, app} = this;
        const result = new app.Result();
        const orderForm = service.orderForm;
        const {orderId} = ctx.query;

        // 判断参数是否有效
        if (!orderId) {
            // 参数无效
            result.paramError();
            ctx.body = result.toJSON();
            return;
        }

        try {
            const data = await orderForm.selectOrder(orderId);
            result.setSuccessData(data);
        } catch (e) {
            // 执行数据库失败
            result.databaseError(e, '获取订单详情失败');
        }
        ctx.body = result.toJSON();
    }

    /**
     * 新增订单
     * @return {Promise<void>}
     */
    async addOrder() {
        const {ctx, service, app} = this;
        const isLocal = app.config.env === 'local';
        const result = new app.Result();
        const orderForm = service.orderForm;
        const requestData = ctx.request.body;
        const openid = ctx.cookies.get('openid', {signed: !isLocal, encrypt: !isLocal});

        try {
            const res = await orderForm.insertOrder({
                publisher: openid,
                title: requestData.title,
                details: requestData.details,
                codeType: requestData.codeType,
                pictures: requestData.pictures,
                attachment: requestData.attachment,
                budget: requestData.budget,
                deadline: requestData.deadline,
            });
            result.setSuccessData(res, '新增订单成功');
        } catch (e) {
            result.databaseError(e, '新增订单失败');
        }

        ctx.body = result.toJSON();
    }
}

module.exports = OrderFormController;
