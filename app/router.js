'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.wechat.index);
    router.get('/check_sign', controller.wechat.checkSign);
    router.get('/create_menu', controller.wechat.createMenu);
    router.get('/wechat_config', controller.wechat.wechatConfig);
    router.get('/test', controller.orderForm.index);
    console.log(Date.now().toLocaleString());
};
