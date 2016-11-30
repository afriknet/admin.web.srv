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
    AppContext.prototype.begin_transaction = function () {
        this.tx_count++;
        if (this.tx_count === 1) {
            this.tx = this.conn.sequelize.transaction();
        }
        return this.tx;
    };
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
    AppContext.prototype.end_transaction = function () {
        if (this.tx_count > 0) {
            this.tx_count--;
        }
        if (this.tx_count === 0) {
            this.tx = undefined;
        }
    };
    AppContext.prototype.transactional2 = function (ctx, trx, callback) {
        return callback().then(function (r) {
            return null; // this.end_transaction(ctx, trx, r);
        }).catch(function (e) {
            //this.end_transaction(ctx, trx, null, e);
            throw e;
        });
    };
    AppContext.prototype.end_transaction1 = function (context, trx, r, e) {
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
                this.tx = undefined;
            }
        }
    };
    AppContext.prototype.get_transaction = function (sequelize) {
        if (this.tx) {
            return Q.resolve(this.tx);
        }
        var d = Q.defer();
        this.tx = sequelize['transaction']();
        return this.tx;
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