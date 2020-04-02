'use strict';

const Service = require('egg').Service;

let accessToken,
    authAccessToken,
    refreshToken;

class WechatService extends Service {
    async fetchAccessToken() {
        const {ctx, app} = this;
        const {wechatApi, wechatConfig} = app.config;
        const res = await ctx.curl(wechatApi.accessTokenUrl, {
            dataType: 'json',
            data: {
                grant_type: 'client_credential',
                appid: wechatConfig.appid,
                secret: wechatConfig.appsecret,
            },
        });

        if (res.status === 200 && res.data.access_token) {
            accessToken = res.data.access_token;
            return res.data.access_token;
        }
        return null;
    }

    /**
     * 获取授权网页的accessToken
     * @param {string} code
     * @returns {Promise<{
     *  access_token: string,
     *  expires_in: number,
     *  refresh_token: string,
     *  openid: string,
     *  scope: string
     * }>}
     */
    async fetchAuthAccessToken(code) {
        const {ctx, app} = this;
        const {wechatApi, wechatConfig} = app.config;

        const res = await ctx.curl(wechatApi.authAccessTokenUrl, {
            method: 'GET',
            dataType: 'json',
            data: {
                appid: wechatConfig.appid,
                secret: wechatConfig.appsecret,
                grant_type: 'authorization_code',
                code,
            },
        });
        if (res.status === 200 && res.data) {
            authAccessToken = res.data.access_token;
            refreshToken = res.data.refresh_token;
            return res.data;
        }
        return null;
    }

    /**
     * 校验授权Token是否过期，已过期则刷新，若refreshToken也过期则返回false
     * @param {string} openid
     * @returns {Promise<boolean>}
     */
    async checkAuthAccessToken(openid) {
        if (!authAccessToken) {
            return false;
        }

        const {ctx, app} = this;
        const {wechatApi} = app.config;
        const res = await ctx.curl(wechatApi.checkAccessTokenUrl, {
            dataType: 'json',
            data: {
                access_token: authAccessToken,
                openid,
            },
        });
        if (res.status === 200 && res.data.errorCode === 0) {
            return true;
        }
        return this.refreshToken();
    }

    /**
     * 根据refreshToken刷新accessToken
     * @returns {Promise<boolean>}
     */
    async refreshToken() {
        if (!refreshToken) {
            return false;
        }

        const {ctx, app} = this;
        const {wechatApi, wechatConfig} = app.config;

        const res = await ctx.curl(wechatApi.refreshTokenUrl, {
            dataType: 'json',
            data: {
                appid: wechatConfig.appid,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
        });

        if (res.status === 200 && res.data.access_token) {
            authAccessToken = res.data.access_token;
            refreshToken = res.data.refresh_token;
            return true;
        }
        return false;
    }

    /**
     * 获取用户信息
     * @param {string} openid 用户的openid
     * @return {Promise<null | {
     *     openid: string,
     *     nickname: string,
     *     sex: string,
     *     province: string,
     *     city: string,
     *     country: string,
     *     headimgurl: string,
     *     privilege: Array,
     *     unionid: string,
     * }>}
     */
    async fetchUserInfo(openid) {
        const {ctx, app} = this;
        const {wechatApi} = app.config;

        const res = await ctx.curl(wechatApi.userInfoUrl, {
            dataType: 'json',
            data: {
                access_token: authAccessToken,
                openid,
                lang: 'zh_CN',
            },
        });
        if (res.status === 200 && res.data) {
            return res.data;
        }
        return null;
    }

    /**
     * 创建公众号菜单
     * @param {Array} button
     * @returns {Promise<any> | Promise<HttpClientResponse<any>> | void}
     */
    fetchCreateMenu(button) {
        const {ctx, app} = this;
        const url = app.config.wechatApi.createMenuUrl.replace('ACCESS_TOKEN', accessToken);
        return ctx.curl(url, {
            method: 'POST',
            data: {
                button,
            },
        });
    }
}

module.exports = WechatService;
