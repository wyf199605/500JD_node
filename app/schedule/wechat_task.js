'use strict';

const Subscription = require('egg').Subscription;

class GetAccessToken extends Subscription {
  static get schedule() {
    return {
      immediate: true,
      interval: '7200s',
      type: 'all',
    };
  }

  async subscribe() {
    const { app, ctx, service } = this;
    ctx.logger.info('【项目运行环境】：' + app.config.env);
    await service.wechat.fetchAccessToken();
  }
}

module.exports = GetAccessToken;
