'use strict';

const Service = require('egg').Service;

class WechatService extends Service {
  async fetchAccessToken() {
    const { ctx, app } = this;
    const { wechatApi, wechatConfig } = app;
    const res = await ctx.curl(wechatApi.accessTokenUrl, {
      dataType: 'json',
      data: {
        grant_type: 'client_credential',
        appid: wechatConfig.appid,
        secret: wechatConfig.appsecret,
      },
    });

    if (res.status === 200 && res.data.access_token) {
      return res.data.access_token;
    }
    return null;
  }
}

module.exports = WechatService;
