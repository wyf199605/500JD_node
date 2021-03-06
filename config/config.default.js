/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1585204952055_7878';

    // 中间件
    config.middleware = ['validate'];

    config.static = {
        dir: path.join(appInfo.baseDir, 'public'),
    };

    config.validate = {
        enable: true,
        match: ['/order'],
    };

    // 微信公众号配置
    config.wechatConfig = {
        token: 'XHjukdsmx1996', // 微信Token
        appid: 'wx054da3b3ab19327a', // 公众号appid
        encodingAESKey: 'Hg63MnKlHz1mMy1Nfb9ON9gWWVQGPGR6d7dYyKOlrha',
        appsecret: '2409907af82a42093e09a87dcaee21d5',
    };

    // 微信API
    config.wechatApi = {
        // 获取accessToken get
        accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
        // 获取授权accessToken get
        authAccessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
        // 校验授权accessToken
        checkAccessTokenUrl: 'https://api.weixin.qq.com/sns/auth',
        // 刷新授权accessToken
        refreshTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
        // 获取用户信息 get
        userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
        // 创建菜单 post
        createMenuUrl: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN',
        // 授权地址 get
        authUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE#wechat_redirect',
    };

    // mongodb配置
    config.mongoose = {
        client: {
            url: 'mongodb://localhost:27017/xz',
            options: {
                auth: {authSource: 'admin'},
                user: 'admin',
                pass: 'XHjukdsmx1996',
                // useUnifiedTopology: true,
                // useNewUrlParser: true,
            },
        },
    };

    config.security = {
        csrf: {
            enable: false,
        },
    };

    // if (appInfo.env === 'local') {
    config.cors = {
        origin(ctx) {
            // 表示允许的源
            return ctx.request.headers.origin;
        },
        credentials: true,
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH', // 表示允许的http请求方式
    };
    // }

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    };
};
