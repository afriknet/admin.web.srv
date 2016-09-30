/// <reference path="lib/dataservice.ts" />
"use strict";
var ds = require('./lib/dataservice');
function test(req, res) {
    var _ds = new ds.DataService();
    res.send('test');
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map