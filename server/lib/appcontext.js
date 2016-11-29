/// <reference path="../datastore/store.ts" />
"use strict";
var root = require('root-path');
var fs = require('fs');
var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var Q = require('q');
var con = require(root('/config/connections'));
var mysql = con.connections.local_mysql;
var mssql = con.connections.mssql_connection;
var conn = null; // boot.start_db(null);
open_db_connection();
var AppContext = (function () {
    function AppContext() {
        this.tx_count = 0;
    }
    Object.defineProperty(AppContext.prototype, "conn", {
        get: function () {
            if (!conn['appcontext']) {
                conn['appcontext'] = this;
            }
            return conn;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.start_transaction = function () {
        this.tx_count++;
        if (this.tx_count === 1) {
            this.tx_fn = this.conn.sequelize.transaction();
        }
        return this.tx_fn;
    };
    AppContext.prototype.transactional = function (ctx, trx, callback) {
        var _this = this;
        return callback().then(function (r) {
            return _this.end_transaction(ctx, trx, r);
        }).catch(function (e) {
            _this.end_transaction(ctx, trx, null, e);
            throw e;
        });
    };
    AppContext.prototype.end_transaction = function (context, trx, r, e) {
        try {
            this.tx_count--;
            if (e || r.errors) {
                trx.rollback();
                return r;
            }
            else {
                if (this.tx_count === 0) {
                    trx.commit();
                }
                return { entities: r, keyMappings: context['_keyMappings'] };
            }
        }
        finally {
            if (this.tx_count === 0) {
                this.tx_fn = undefined;
            }
        }
    };
    AppContext.prototype.get_transaction = function (sequelize) {
        if (this.tx_fn) {
            return Q.resolve(this.tx_fn);
        }
        var d = Q.defer();
        this.tx_fn = sequelize['transaction']();
        return this.tx_fn;
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