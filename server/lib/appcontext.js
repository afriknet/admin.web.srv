/// <reference path="../datastore/store.ts" />
"use strict";
var root = require('root-path');
var fs = require('fs');
var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var con = require(root('/config/connections'));
var mysql = con.connections.local_mysql;
var mssql = con.connections.mssql_connection;
var conn = null; // boot.start_db(null);
open_db_connection();
var AppContext = (function () {
    function AppContext() {
    }
    Object.defineProperty(AppContext.prototype, "conn", {
        get: function () {
            if (!this.__conn) {
                this.__conn = conn;
            }
            return this.__conn;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.transactional = function (callback) {
        var _this = this;
        if (!this.tx) {
            return this.conn.sequelize.transaction(function (tx) {
                _this.tx = tx;
                return callback(tx);
            }).catch(function (e) {
                throw e;
            }).finally(function () {
                _this.tx = undefined;
            });
        }
        else {
            return callback(this.tx);
        }
    };
    return AppContext;
}());
exports.AppContext = AppContext;
function open_db_connection() {
    //var __con = {
    //    dbName: mysql.database,
    //    user: mysql.user,
    //    password: mysql.password
    //}
    //conn = new s_mgr(__con, {
    //    host:'mysql5014.smarterasp.net'
    //});
    conn = new s_mgr(mssql.config, mssql.extra);
}
//# sourceMappingURL=appcontext.js.map