'use strict';

const result = require('./app/result');
const mongoose = require('mongoose');

class AppBootHook {
    constructor(app) {
        this.app = app;
        this.app.Result = result(app);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
    }
}

module.exports = AppBootHook;
