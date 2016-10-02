/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
"use strict";
var ds = require('./lib/dataservice');
var ctx = require('./lib/appcontext');
function test(req, res) {
    var appctx = new ctx.AppContext();
    var _ds = new ds.DataService(appctx);
    res.send('test');
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map