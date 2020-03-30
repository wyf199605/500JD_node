'use strict';

const Service = require('egg').Service;

class OrderFormService extends Service {
    find() {
        console.log(this.ctx.model);
        return this.ctx.model.Test.findOne({username: 'wyf'}, 'username');
    }
}

module.exports = OrderFormService;
