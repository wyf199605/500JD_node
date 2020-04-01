'use strict';

const Controller = require('egg').Controller;
const Resule = require('../result');

class OrderFormController extends Controller {
    async index() {
        const {service} = this,
            orderForm = service.orderForm;
        console.log(new Date().toLocaleString());
        this.ctx.body = await orderForm.insertOrder({
            title: '测试标题1111',
            details: '测试数据2222',
            codeType: 'JavaScript',
            budget: 100,
            deadline: new Date('2020/05/20'),
            publisher: 'wyf',
        });
    }

    list() {
        const {ctx} = this;
        let {page, pageSize} = ctx.query;
        page = Number(page);
        pageSize = Number(pageSize);
        console.log(pageSize, page);
        ctx.body = new Resule(ctx);
    }
}

module.exports = OrderFormController;
