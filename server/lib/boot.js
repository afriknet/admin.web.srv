"use strict";
var root = require('root-path');
var fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ctx = require('./appcontext');
const store = require('../datastore/store');
var __sequel = require('sequelize');
function load_models() {
    var files = fs.readdirSync(root('/server/models'));
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
exports.load_models = load_models;
function init_datastore() {
    var __ctx = new ctx.AppContext();
    __ctx.conn.importMetadata(store.ModelStore.exportMetadata());
}
exports.init_datastore = init_datastore;
//# sourceMappingURL=boot.js.map