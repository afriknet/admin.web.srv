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
import dx = require('./lib/dataservice');
import store = require('./datastore/store');
var f = require('string-format');
var root = require('root-path');
var file_exists = require('file-exists');

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

    var _ctx = new ctx.AppContext();

    switch (operation) {

        case operationtype.metadata: {

            fetch_metadata(_ctx, req, res, next);

        } break;


        case operationtype.fetch: {

            fetch_data( _ctx, req, res, next);

        } break;


        case operationtype.raw: {

            raw(_ctx, req, res, next);

        } break;


        case operationtype.save: {

            save_changes( _ctx, req, res, next);

        } break;


        case operationtype.call: {

            call( _ctx, req, res, next);

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


function fetch_data(ctx: ctx.AppContext, req: express.Request, res: express.Response, next: any) {
        
    var __qry: any = format_qry(req.body);  

    if(!__qry){

        if(!__qry){

        }

    }  

    var qry = new breeze.EntityQuery(__qry);

    var srv: dx.DataService = dx.GetService(ctx, qry.resourceName);

    srv.fetch(qry).then(data => {

        var rsp = {
            payload: srv.ds.exportEntities() 
        }

        res.send(rsp);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });
}


function fetch_metadata(ctx: ctx.AppContext, req: express.Request, res: express.Response, next: any) {

    res.send(store.ModelStore.exportMetadata());
}


function save_changes(ctx: ctx.AppContext, req: express.Request, res: express.Response, next: any) {
    
    var srv = get_service(ctx, req.body['service']);

    srv.savechanges(req.body['entities']).then(rst => {

        var response = {
            payload: rst
        }

        res.send(response);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });

}


function raw(ctx: ctx.AppContext, req: express.Request, res: express.Response, next: any) {
    
    var srv = get_service(ctx, req.body['service']);

    srv.exec_sql({
        sql: req.body['sql']
    }).then(data => {

        res.send(data);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });

    
}


function call(ctx: ctx.AppContext, req: express.Request, res: express.Response, next: any) {
    
    var srv: dx.DataService = get_service(ctx, req.body['service']);

    srv.call({
        method: req.body['method'],
        params: req.body['params']
    }).then(rst => {

        res.send(rst);

    }).fail(err => {

        res.status(500).send(JSON.stringify(err));

    });
}


function get_service(ctx: ctx.AppContext, srvname: string) {

    return dx.GetService(ctx, srvname);
    
}