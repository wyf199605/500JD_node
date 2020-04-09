'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    const {wechat, home, developer, publisher} = controller;

    // 首页
    router.get('/', wechat.index);
    // 微信相关
    router.get('/wechat/check_sign', wechat.checkSign); // 微信认证
    router.get('/wechat/create_menu', wechat.createMenu); // 创建公众号菜单
    router.get('/wechat/wechat_config', wechat.wechatConfig); // 获取微信配置

    // 订单列表相关 - 通用
    router.get('/order/list', home.list); // 获取订单列表
    router.get('/order/detail', home.getOrder); // 获取订单详情
    router.post('/order/insert', home.addOrder); // 新增订单

    // 发布者相关功能
    router.get('/order/publisher/list', publisher.list); // 获取已发布的订单列表
    router.post('/order/publisher/update', publisher.updateOrder); // 修改订单
    router.post('/order/publisher/cancel', publisher.cancelOrder); // 取消订单

    // 开发者相关功能
    router.get('/order/developer/list', developer.list); // 获取开发者开发的订单列表
    router.get('/order/developer/tack', developer.tackOrder); // 开发者接单
    router.get('/order/developer/cancel', developer.cancelOrder); // 开发者取消订单
    router.get('/order/developer/finish', developer.finishOrder); // 开发者完成订单
};
