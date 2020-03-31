'use strict';

const Service = require('egg').Service;

class OrderFormService extends Service {
    async getList(page, pageSize) {
        const OrderForm = this.ctx.model.OrderForm;
        const data = await OrderForm.find({})
            .select('_id title codeType budget deadline status details')
            .sort('-status time')
            .skip(page * pageSize)
            .limit(pageSize);

        return data;
    }

    findById(id) {
        const OrderForm = this.ctx.model.OrderForm;
        return OrderForm.findOne({_id: id});
    }
}

module.exports = OrderFormService;
