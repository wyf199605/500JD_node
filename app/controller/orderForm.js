'use strict';

const Controller = require('egg').Controller;

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
}

module.exports = OrderFormController;
