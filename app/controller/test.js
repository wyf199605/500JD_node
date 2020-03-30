'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
    async index() {
        this.ctx.cookies.set('openid', '123', {
            encrypt: true,
        });
        // this.ctx.redirect('/test1');
        console.log(this.ctx.request.URL);
        this.ctx.body = this.ctx.request.URL;
    }

    test() {
        console.log(this.ctx.params);
        this.ctx.redirect('/public/index.html#wyf');
    }
}

module.exports = TestController;
