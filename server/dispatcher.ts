/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />
/// <reference path="lib/dataservice.ts" />
/// <reference path="datastore/store.ts" />

import express = require('express');
import ds = require('./lib/dataservice');
import ctx = require('./lib/appcontext');
import breeze = require('breeze-client');
import Q = require('q');
import _ = require('lodash');
import dal = require('./lib/dataservice');
import store = require('./datastore/store');
var f = require('string-format');
var root = require('root-path');
var fexists = require('file-exists');

//import FileUploader = require('./lib/fileupload');
//import localDB = require('./local/localdb');
//import dal = require('./lib/dataservice');


export interface srvCallResult {
    success: boolean,
    payload?: any,
    error?: any
}


function sendResponse(data: srvCallResult, res: express.Response) {

    res.send(data);
}


export var operationtype = {
    fetch: 'fetch',
    metadata: 'metadata',
    raw: 'raw',
    save: 'save',
    call: 'call'
}


export function dispatch_call(operation: string, req: express.Request, res: express.Response, next: any) {

    switch (operation) {

        case operationtype.metadata: {

            fetch_metadata(req, res, next);

        } break;

        case operationtype.fetch: {

            fetch_data(req, res, next);

        } break;


        case operationtype.raw: {

            raw(req, res, next);

        } break;


        case operationtype.save: {

            save_changes(req, res, next);

        } break;
            
        case operationtype.call: {

        } break;
    }
}


function format_qry(qry: any) {

    var str_qry = JSON.stringify(qry);

    return JSON.parse(str_qry, (key: any, val: any) => {

        if (val === '___NULL___') {
            return null;
        }

        if (key === 'take') {
            return parseInt(val);
        }

        return val;
    });

}


function fetch_data(req: express.Request, res: express.Response, next: any) {
        
    var __qry: any = format_qry(req.body);    
    var qry = new breeze.EntityQuery(__qry);
    
    var srv = get_service(qry.resourceName);
    srv.fetch(qry).then(data => {

        var rsp = {
            payload: srv.datasource.exportEntities() 
        }

        res.send(rsp);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });
}


function fetch_metadata(req: express.Request, res: express.Response, next: any) {

    res.send(store.ModelStore.exportMetadata());
}


function save_changes(req: express.Request, res: express.Response, next: any) {
    
    var srv = get_service(req.body['service']);

    srv.savechanges(req.body['entities']).then(rst => {

        var response = {
            payload: rst
        }

        res.send(response);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });

}


function raw(req: express.Request, res: express.Response, next: any) {
    
    var srv = get_service(req.body['service']);

    srv.exec_sql({
        sql: req.body['sql']
    }).then(data => {

        res.send(data);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });

    
}


function call(req: express.Request, res: express.Response, next: any) {



}


function get_service(srvname: string) {

    var _ctx = new ctx.AppContext();

    if (fexists(root('/server/services/' + srvname + '.js'))) {

        var srv: any = require(root('/server/services/' + srvname));

        var _fn_name = Object.keys(srv)[0];

        try {
            return (new srv[_fn_name](_ctx, srvname));

        } catch(e){

            throw _fn_name;
        }

    } else {

        return new dal.DataService(_ctx, srvname)
    }
    
}