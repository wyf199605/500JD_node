'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    const {wechat, home} = controller;

    // 微信相关
    router.get('/', wechat.index);
    router.get('/check_sign', wechat.checkSign);
    router.get('/create_menu', wechat.createMenu);
    router.get('/wechat_config', wechat.wechatConfig);

    // 订单列表相关
    router.get('/order/list', home.list);
};
