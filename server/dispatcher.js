/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
/// <reference path="lib/dataservice.ts" />
/// <reference path="datastore/store.ts" />
"use strict";
var ds = require('./lib/dataservice');
var ctx = require('./lib/appcontext');
var breeze = require('breeze-client');
var dal = require('./lib/dataservice');
var store = require('./datastore/store');
var f = require('string-format');
function sendResponse(data, res) {
    res.send(data);
}
exports.operationtype = {
    fetch: 'fetch',
    metadata: 'metadata',
};
function dispatch_call(operation, req, res, next) {
    switch (operation) {
        case exports.operationtype.metadata:
            {
                fetch_metadata(req, res, next);
            }
            break;
        case exports.operationtype.fetch:
            {
                fetch_data(req, res, next);
            }
            break;
    }
}
exports.dispatch_call = dispatch_call;
function format_qry(qry) {
    var str_qry = JSON.stringify(qry);
    return JSON.parse(str_qry, function (key, val) {
        if (val === '___NULL___') {
            return null;
        }
        return val;
    });
}
function fetch_data(req, res, next) {
    var __qry = format_qry(req.body);
    var qry = new breeze.EntityQuery(__qry);
    var query = new breeze.EntityQuery({
        from: qry.resourceName, __qry: __qry
    });
    var _ctx = new ctx.AppContext();
    var srv = new dal.DataService(_ctx, qry.resourceName);
    srv.fetch(qry).then(function (rst) {
        var response = {
            payload: srv.datasource.exportEntities()
        };
        res.send(response);
    });
}
function fetch_metadata(req, res, next) {
    res.send(store.ModelStore.exportMetadata());
}
function test(req, res) {
    var app_ctx = new ctx.AppContext();
    var s = new ds.DataService(app_ctx, 'prof');
    var qry = breeze.EntityQuery.from('prof');
    s.fetch(qry).then(function (data) {
        var list = s.datasource.getEntities('prof');
        res.send(f("count: {0}", list.length));
    }).fail(function (err) {
        res.send(JSON.stringify(err));
    });
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map