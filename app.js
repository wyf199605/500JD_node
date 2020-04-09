'use strict';

const result = require('./app/result');
const mongoose = require('mongoose');
const moment = require('moment');

process.env.TZ = 'Asia/Shanghai';

console.log(moment().format('YYYY-MM-DD HH:mm'));

class AppBootHook {
    constructor(app) {
        this.app = app;
        this.app.Result = result(app);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
    }
}

module.exports = AppBootHook;
