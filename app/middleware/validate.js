'use strict';

module.exports = () => {
    /**
     * @param {egg.Context} ctx
     * @param next
     */
    return async function(ctx, next) {
        const {app, cookies} = ctx;
        let openid = ctx.request.headers.openid;
        if (app.config.env === 'prod') {
            openid = cookies.get('openid', {
                encrypt: true,
                signed: true,
            });
        } else {
            openid = ctx.request.headers.openid;
        }
        if (!openid) {
            const result = new app.Result();
            result.userError(`请求：${ctx.request.path} 失败，用户不存在`);
            ctx.body = result.toJSON();
            return;
        }
        app.openid = openid;
        await next();
    };
};
