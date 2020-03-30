'use strict';

// 订单详细
module.exports = app => {
    const mongoose = app.mongoose,
        Schema = mongoose.Schema;

    const OrderFormSchema = new Schema({
        title: {type: String, required: true}, // 订单标题
        details: {type: String, required: true}, // 订单详细内容
        codeType: {type: String, required: true}, // 代码类型，如Python/Javascript/Java/C/C++等
        pictures: {type: [String]}, // 附件图片
        budget: {type: Number}, // 预算金额，null：未知（需面谈）
        deadline: {type: Date, required: true}, // 截止时间
        // 以上内容为用户填写内容
        // 以下内容为非用户填写内容（系统自动生成）
        releaseTime: {type: Date, default: Date.now}, // 订单发布时间，不可修改
        time: {type: Date, default: Date.now}, // 订单最近发布时间or修改时间
        status: {type: Number, default: 0}, // 订单状态 0-已发布 1-已被接单 2-已完成 3-已取消
        publisher: {type: String}, // 发布人
        developer: {type: String}, // 开发者，接单人
    });
    return mongoose.model('OrderForm', OrderFormSchema);
};
