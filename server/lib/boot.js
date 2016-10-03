"use strict";
var root = require('root-path');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var ctx = require('./appcontext');
var store = require('../datastore/store');
var __sequel = require('sequelize');
function load_models() {
    var files = fs.readdirSync(root('/server/models'));
    _.each(files, function (fn) {
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
    __ctx.conn.sequelize.query("select * from item", { type: __sequel.QueryTypes.SELECT }).then(function (list) {
        var d = list;
    });
}
exports.init_datastore = init_datastore;
//# sourceMappingURL=boot.js.map