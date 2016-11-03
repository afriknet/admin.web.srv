
var root = require('root-path');
var fs = require('fs');
import path = require('path')
import _ = require('lodash');

import ctx = require('./appcontext');
import store = require('../datastore/store');
var __sequel = require('sequelize');


export function load_models() {

    var files: string[] = fs.readdirSync(root('/server/models'));
    
    _.each(files, fn => {

        var ext = path.extname(fn);

        if (ext === '.js') {

            var model = require(root('/server/models/' + fn));

            if (_.isFunction(model)) {
                model();
            }
        }
    });    
}



export function load_services() {

    var files: string[] = fs.readdirSync(root('/server/services'));

    _.each(files, fn => {

        var ext = path.extname(fn);

        if (ext === '.js') {

            var model = require(root('/server/models/' + fn));

            if (_.isFunction(model)) {
                model();
            }
        }
    });    

}



export function init_datastore() {

    var __ctx = new ctx.AppContext();

    __ctx.conn.importMetadata(store.ModelStore.exportMetadata());
    
}


