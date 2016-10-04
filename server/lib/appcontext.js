/// <reference path="../datastore/store.ts" />
"use strict";
var root = require('root-path');
var fs = require('fs');
var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var sqlize = require('sequelize');
var con = require(root('/config/connections'));
var mysql = con.connections.local_mysql;
var conn = null; // boot.start_db(null);
open_db_connection();
var AppContext = (function () {
    function AppContext() {
    }
    Object.defineProperty(AppContext.prototype, "conn", {
        get: function () {
            return conn;
        },
        enumerable: true,
        configurable: true
    });
    return AppContext;
}());
exports.AppContext = AppContext;
function open_db_connection() {
    var __con = {
        dbName: mysql.database,
        user: mysql.user,
        password: mysql.password
    };
    conn = new s_mgr(__con, {
        host: 'mysql5014.smarterasp.net'
    });
}
//# sourceMappingURL=appcontext.js.map