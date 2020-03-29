'use strict';

const Controller = require('egg').Controller;
const sha1 = require('sha1');

const wxConfig = {};

class WechatController extends Controller {
  // 首页，判断accessToken是否有效，无效则跳转到授权页
  async index() {
    const { ctx, service, app } = this;
    const cookies = this.ctx.cookies,
      openid = cookies.get('openid', { encrypt: true });
    console.log(ctx.request);
    if (openid) {
      const checked = await service.wechat.checkAuthAccessToken(openid);
      if (checked) {
        cookies.set('openid', openid, { encrypt: true });
        ctx.redirect('/public/index.html');
        return;
      }
    }

    const req = ctx.request,
      config = app.config,
      redirectUrl = `http://${req.host}/auth`;

    ctx.redirect(
      app.config.wechatApi.authUrl
        .replace('APPID', config.wechatConfig.appid)
        .replace('REDIRECT_URI', encodeURI(redirectUrl))
        .replace('SCOPE', 'snsapi_userinfo')
    );
  }

  // 微信公众号校验
  checkSign() {
    const { timestamp, nonce, echostr, signature } = this.ctx.query,
      token = this.app.config.wechatConfig.token,
      str = [ token, timestamp, nonce ].sort().join(''),
      sha = sha1(str);
    wxConfig.nonce = nonce;
    wxConfig.timestamp = timestamp;
    wxConfig.signature = signature;
    this.ctx.body = sha === signature ? echostr + '' : '';
  }

  // 创建菜单
  async createMenu() {
    this.ctx.body = await this.service.wechat.fetchCreateMenu([
      { name: '小众平台', type: 'view', url: 'http://129.204.246.38' },
    ]);
  }

  // 获取微信配置
  wechatConfig() {
    this.ctx.body = { ...wxConfig, appid: this.app.config.wechatConfig.appid };
  }

  // 获取授权accessToken
  async auth() {
    const { ctx, service } = this;
    const { code } = ctx.query;
    const accessTokenData = await service.wechat.fetchAuthAccessToken(code);
    if (accessTokenData) {
      // const res = await service.wechat.fetchUserInfo(accessTokenData.access_token, accessTokenData.openid);
      ctx.cookies.set('openid', accessTokenData.openid, { encrypt: true });
      ctx.redirect('/');
    }
  }
}

module.exports = WechatController;
