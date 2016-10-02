/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />

import express = require('express');
import ds = require('./lib/dataservice');
import ctx = require('./lib/appcontext');
import breeze = require('breeze-client');


export function test(req: express.Request, res: express.Response) {

    var app_ctx = new ctx.AppContext();

    var s: ds.DataService = new ds.DataService(app_ctx, 'item');

    var qry = new breeze.EntityQuery({ where: { id: 'aaa' } });

    s.fetch(qry).then(data => {

    }).fail(err => {


    });
    
    res.send('test');

}