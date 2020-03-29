'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async index() {
    this.ctx.cookies.set('openid', '123', {
      encrypt: true,
    });
    this.ctx.redirect('/test1');
  }
  test() {
    console.log(this.ctx.cookies.get('openid', {
      encrypt: true,
    }));
    this.ctx.redirect('/public/index.html');
  }
}

module.exports = TestController;
