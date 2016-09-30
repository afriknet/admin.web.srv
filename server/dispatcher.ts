
import express = require('express');


export function test(req: express.Request, res: express.Response) {

    res.send('test');

}