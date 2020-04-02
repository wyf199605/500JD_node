'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    /**
     * 添加用户
     * @param {{
     *     openid: string,
     *     username: string,
     *     sex: number,
     *     tel: string,
     *     province: string,
     *     city: string,
     *     country: string,
     *     avatar: string,
     *     privilege: Array,
     *     unionid: string,
     * }} userInfo
     */
    addUser(userInfo) {
        const User = this.ctx.model.User;
        const user = new User(userInfo);
        return user.save();
    }

    /**
     * 查找用户
     * @param {string} openid
     * @return {*}
     */
    findUser(openid) {
        const User = this.ctx.model.User;
        return User.findOne({openid});
    }
}

module.exports = UserService;
