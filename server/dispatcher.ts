﻿/// <reference path="lib/dataservice.ts" />
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
}


export function dispatch_call(operation: string, req: express.Request, res: express.Response, next: any) {

    switch (operation) {

        case operationtype.metadata: {

            fetch_metadata(req, res, next);

        } break;

        case operationtype.fetch: {

            fetch_data(req, res, next);

        } break;
    }
}


function format_qry(qry: any) {

    var str_qry = JSON.stringify(qry);

    return JSON.parse(str_qry, (key: any, val: any) => {

        if (val === '___NULL___') {
            return null;
        }

        return val;
    });

}


function fetch_data(req: express.Request, res: express.Response, next: any) {

    var __qry: any = format_qry(req.body);

    var qry = new breeze.EntityQuery(__qry);

    var _ctx = new ctx.AppContext();

    var srv = new dal.DataService(_ctx, qry.resourceName);

    srv.fetch(qry).then(rst => {

        var response = {
            payload: srv.datasource.exportEntities()
        }

        res.send(response);
    });
}


function fetch_metadata(req: express.Request, res: express.Response, next: any) {

    res.send(store.ModelStore.exportMetadata());
}


export function test(req: express.Request, res: express.Response) {

    var app_ctx = new ctx.AppContext();

    var s: ds.DataService = new ds.DataService(app_ctx, 'occp');

    var qry = breeze.EntityQuery.from('occp').where('ID', 'eq', '00031847-D980-41E5-A39D-F5ABFCF0A5E2');

    s.fetch(qry).then(data => {

        var list = s.datasource.getEntities('occp');

        res.send(list.length);

    }).fail(err => {

        res.send(JSON.stringify(err));
    });
    
}