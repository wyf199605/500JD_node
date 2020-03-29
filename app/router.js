'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.wechat.index);
  router.get('/check_sign', controller.wechat.checkSign);
  router.get('/create_menu', controller.wechat.createMenu);
  router.get('/wechat_config', controller.wechat.wechatConfig);
  router.get('/auth', controller.wechat.auth);
  router.get('/test', controller.test.index);
  router.get('/test1', controller.test.test);
};
