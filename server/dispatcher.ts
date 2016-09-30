/// <reference path="lib/dataservice.ts" />

import express = require('express');
import ds = require('./lib/dataservice');

export function test(req: express.Request, res: express.Response) {

    var _ds: ds.DataService = new ds.DataService();
    
    res.send('test');

}