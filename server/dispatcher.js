/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
"use strict";
var ds = require('./lib/dataservice');
var ctx = require('./lib/appcontext');
var breeze = require('breeze-client');
function test(req, res) {
    var app_ctx = new ctx.AppContext();
    var s = new ds.DataService(app_ctx, 'item');
    var qry = breeze.EntityQuery.from('item'); //.where('id', 'eq', 'dhfgdfadklgfl');
    s.fetch(qry).then(function (data) {
        var list = s.datasource.getEntities('item');
        res.send(list);
    }).fail(function (err) {
    });
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map