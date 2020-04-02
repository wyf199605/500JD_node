'use strict';

const Controller = require('egg').Controller;
const sha1 = require('sha1');

const wxConfig = {};

class WechatController extends Controller {
    // 首页，判断accessToken是否有效，无效则跳转到授权页
    async index() {
        const {ctx, service, app} = this,
            cookies = this.ctx.cookies,
            openid = cookies.get('openid', {signed: true, encrypt: true});
        if (openid) {
            const checked = await service.wechat.checkAuthAccessToken(openid);
            if (checked) {
                let register = false;
                try {
                    const {openid: userid} = await service.user.findUser(openid);
                    register = userid === openid;
                } catch (e) {
                    console.log(e);
                    register = false;
                }

                if (!register) {
                    try {
                        const data = await service.wechat.fetchUserInfo(openid);
                        await service.user.addUser({
                            openid,
                            username: data.nickname,
                            province: data.province,
                            sex: Number(data.sex),
                            city: data.city,
                            country: data.country,
                            unionid: data.unionid,
                            privilege: data.privilege,
                            avatar: data.headimgurl,
                        });
                    } catch (e) {
                        console.log(e);
                        ctx.body = '用户注册失败';
                        return;
                    }
                }

                cookies.set('openid', openid, {signed: true, encrypt: true});
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
        const {timestamp, nonce, echostr, signature} = this.ctx.query,
            token = this.app.config.wechatConfig.token,
            str = [token, timestamp, nonce].sort().join(''),
            sha = sha1(str);
        wxConfig.nonce = nonce;
        wxConfig.timestamp = timestamp;
        wxConfig.signature = signature;
        this.ctx.body = sha === signature ? echostr + '' : '';
    }

    // 创建菜单
    async createMenu() {
        this.ctx.body = await this.service.wechat.fetchCreateMenu([
            {name: '小众平台', type: 'view', url: 'http://129.204.246.38'},
        ]);
    }

    // 获取微信配置
    wechatConfig() {
        this.ctx.body = {...wxConfig, appid: this.app.config.wechatConfig.appid};
    }

    // 获取授权accessToken
    async auth() {
        const {ctx, service} = this;
        const {code} = ctx.query;
        const accessTokenData = await service.wechat.fetchAuthAccessToken(code);
        if (accessTokenData) {
            ctx.cookies.set('openid', accessTokenData.openid, {encrypt: true, signed: true});
            ctx.redirect('/');
        }
    }
}

module.exports = WechatController;
