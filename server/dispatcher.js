/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
/// <reference path="lib/dataservice.ts" />
/// <reference path="datastore/store.ts" />
"use strict";
const ds = require('./lib/dataservice');
const ctx = require('./lib/appcontext');
const breeze = require('breeze-client');
const dal = require('./lib/dataservice');
const store = require('./datastore/store');
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
    return JSON.parse(str_qry, (key, val) => {
        if (val === '___NULL___') {
            return null;
        }
        return val;
    });
}
function fetch_data(req, res, next) {
    var __qry = format_qry(req.body);
    var qry = new breeze.EntityQuery(__qry);
    var _ctx = new ctx.AppContext();
    var srv = new dal.DataService(_ctx, qry.resourceName);
    srv.fetch(qry).then(rst => {
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
    var s = new ds.DataService(app_ctx, 'occp');
    var qry = breeze.EntityQuery.from('occp').where('ID', 'eq', '00031847-D980-41E5-A39D-F5ABFCF0A5E2');
    s.fetch(qry).then(data => {
        var list = s.datasource.getEntities('occp');
        res.send(list.length);
    }).fail(err => {
        res.send(JSON.stringify(err));
    });
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map