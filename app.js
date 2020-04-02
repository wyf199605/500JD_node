'use strict';

const result = require('./app/result');

class AppBootHook {
    constructor(app) {
        this.app = app;
        this.app.Result = result(app);
    }
}

module.exports = AppBootHook;
