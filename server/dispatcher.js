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
var f = require('string-format');
function sendResponse(data, res) {
    res.send(data);
}
exports.operationtype = {
    fetch: 'fetch',
    metadata: 'metadata',
    raw: 'raw',
    save: 'save',
    call: 'call'
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
        case exports.operationtype.raw:
            {
                raw(req, res, next);
            }
            break;
        case exports.operationtype.save:
            {
                save_changes(req, res, next);
            }
            break;
        case exports.operationtype.call:
            {
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
        if (key === 'take') {
            return parseInt(val);
        }
        return val;
    });
}
function fetch_data(req, res, next) {
    var __qry = format_qry(req.body);
    var _ctx = new ctx.AppContext();
    var qry = new breeze.EntityQuery(__qry);
    var srv = new dal.DataService(_ctx, qry.resourceName);
    srv.fetch(qry).then(data => {
        var rsp = {
            payload: srv.datasource.exportEntities()
        };
        res.send(rsp);
    }).fail(err => {
        res.status(500).send(JSON.stringify(err));
    });
}
function fetch_metadata(req, res, next) {
    res.send(store.ModelStore.exportMetadata());
}
function save_changes(req, res, next) {
    var _ctx = new ctx.AppContext();
    var srv = new dal.DataService(_ctx, req.body['service']);
    srv.savechanges(req.body['entities']).then(rst => {
        var response = {
            payload: rst
        };
        res.send(response);
    }).fail(err => {
        res.status(500).send(JSON.stringify(err));
    });
}
function raw(req, res, next) {
    var _ctx = new ctx.AppContext();
    var srv = new dal.DataService(_ctx, req.body['service']);
    srv.exec_sql({
        sql: req.body['sql']
    }).then(data => {
        res.send(data);
    }).fail(err => {
        res.status(500).send(JSON.stringify(err));
    });
}
function call(req, res, next) {
}
function test(req, res) {
    var app_ctx = new ctx.AppContext();
    var s = new ds.DataService(app_ctx, 'prof');
    var qry = breeze.EntityQuery.from('prof');
    s.fetch(qry).then(data => {
        var list = s.datasource.getEntities('prof');
        res.send(f("count: {0}", list.length));
    }).fail(err => {
        res.send(JSON.stringify(err));
    });
}
exports.test = test;
//# sourceMappingURL=dispatcher.js.map