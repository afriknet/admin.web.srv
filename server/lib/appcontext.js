/// <reference path="../datastore/store.ts" />
"use strict";
var root = require('root-path');
var fs = require('fs');
var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var sqlize = require('sequelize');
var con = require(root('/config/connections'));
var mysql = con.connections.mysql_connection;
var mssql = con.connections.mssql_connection;
var conn = null; // boot.start_db(null);
open_db_connection();
class AppContext {
    get conn() {
        return conn;
    }
}
exports.AppContext = AppContext;
function open_db_connection() {
    var __con = {
        dbName: mysql.database,
        user: mysql.user,
        password: mysql.password
    };
    //conn = new s_mgr(__con, {
    //    host: 'mysql5014.smarterasp.net',
    //    port: 3306
    //});
    conn = new s_mgr(mssql.config, mssql.extra);
    //conn.importMetadata(store.ModelStore.exportMetadata());
    conn.sequelize.query("select * from occp", { type: sqlize.QueryTypes.SELECT }).then(list => {
        var d = list;
    });
}
//# sourceMappingURL=appcontext.js.map