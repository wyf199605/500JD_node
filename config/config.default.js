/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585204952055_7878';

  // add your middleware config here
  config.middleware = [];

  // 微信公众号配置
  config.wechatConfig = {
    token: 'XHjukdsmx1996',
    appid: 'wxb06b7d00b70a3f95',
    encodingAESKey: 'Hg63MnKlHz1mMy1Nfb9ON9gWWVQGPGR6d7dYyKOlrha',
    appsecret: '2409907af82a42093e09a87dcaee21d5',
  };

  // 微信API
  config.wechatApi = {
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
  };

  // mongodb配置
  config.mongoose = {
    client: {

    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
