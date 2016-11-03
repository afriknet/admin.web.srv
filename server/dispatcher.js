/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
/// <reference path="lib/dataservice.ts" />
/// <reference path="datastore/store.ts" />
"use strict";
var ctx = require('./lib/appcontext');
var breeze = require('breeze-client');
var dal = require('./lib/dataservice');
var store = require('./datastore/store');
var f = require('string-format');
var root = require('root-path');
var fexists = require('file-exists');
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
    return JSON.parse(str_qry, function (key, val) {
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
    var qry = new breeze.EntityQuery(__qry);
    var srv = get_service(qry.resourceName);
    srv.fetch(qry).then(function (data) {
        var rsp = {
            payload: srv.datasource.exportEntities()
        };
        res.send(rsp);
    }).fail(function (err) {
        res.status(500).send(JSON.stringify(err));
    });
}
function fetch_metadata(req, res, next) {
    res.send(store.ModelStore.exportMetadata());
}
function save_changes(req, res, next) {
    var srv = get_service(req.body['service']);
    srv.savechanges(req.body['entities']).then(function (rst) {
        var response = {
            payload: rst
        };
        res.send(response);
    }).fail(function (err) {
        res.status(500).send(JSON.stringify(err));
    });
}
function raw(req, res, next) {
    var srv = get_service(req.body['service']);
    srv.exec_sql({
        sql: req.body['sql']
    }).then(function (data) {
        res.send(data);
    }).fail(function (err) {
        res.status(500).send(JSON.stringify(err));
    });
}
function call(req, res, next) {
}
function get_service(srvname) {
    var _ctx = new ctx.AppContext();
    if (fexists(root('/server/services/' + srvname + '.js'))) {
        var srv = require(root('/server/services/' + srvname));
        var _fn_name = Object.keys(srv)[0];
        try {
            return (new srv[_fn_name](_ctx, srvname));
        }
        catch (e) {
            throw _fn_name;
        }
    }
    else {
        return new dal.DataService(_ctx, srvname);
    }
}
//# sourceMappingURL=dispatcher.js.map