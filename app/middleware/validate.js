'use strict';

module.exports = () => {
    /**
     * @param {egg.Context} ctx
     * @param next
     */
    return async function(ctx, next) {
        const {app, cookies} = ctx;
        const openid = cookies.get('openid', {
            encrypt: true,
        });
        if (!openid) {
            const result = new app.Result();
            result.userError(`请求：${ctx.request.path} 失败，用户不存在`);
            ctx.body = result.toJSON();
            return;
        }
        await next();
    };
};
