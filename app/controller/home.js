'use strict';

const Controller = require('egg').Controller;
const sha1 = require('sha1');

class HomeController extends Controller {
  async index() {
    const obj = this.ctx.query,
      token = this.ctx.app.config.wechatConfig.token,
      timestamp = obj.timestamp,
      nonce = obj.nonce,
      echostr = obj.echostr,
      signature = obj.signature,
      str = [ token, timestamp, nonce ].sort().join(''),
      sha = sha1(str);
    if (sha === signature) {
      this.ctx.body = echostr + '';
    }
  }
}

module.exports = HomeController;
