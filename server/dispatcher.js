/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
"use strict";
var ds = require('./lib/dataservice');
var ctx = require('./lib/appcontext');
var breeze = require('breeze-client');
function test(req, res) {
    var app_ctx = new ctx.AppContext();
    var s = new ds.DataService(app_ctx, 'item');
    var qry = new breeze.EntityQuery({ where: { id: 'aaa' } });
    s.fetch(qry).then(function (data) {
    }).fail(function (err) {
    });
    res.send('test');
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map