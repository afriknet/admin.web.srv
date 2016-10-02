/// <reference path="lib/dataservice.ts" />
/// <reference path="lib/appcontext.ts" />

import express = require('express');
import ds = require('./lib/dataservice');
import ctx = require('./lib/appcontext');

export function test(req: express.Request, res: express.Response) {

    var appctx = new ctx.AppContext();

    var _ds: ds.DataService = new ds.DataService(appctx);
    
    res.send('test');

}