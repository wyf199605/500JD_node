'use strict';

module.exports = app => {
    const mongoose = app.mongoose,
        Schema = mongoose.Schema;

    const UserSchema = new Schema({
        openid: {type: String, required: true, unique: true, index: true},
        username: {type: String, required: true}, // 用户昵称
        sex: {type: Number, default: 0}, // 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        tel: {type: String}, // 手机号码
        province: {type: String}, // 省份
        city: {type: String}, // 城市
        country: {type: String}, // 国家
        avatar: {type: String}, // 头像地址
        privilege: {type: Array},
        unionid: {type: String},
    });

    return mongoose.model('User', UserSchema);
};
