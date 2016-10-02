/// <reference path="../typings/lodash/lodash.d.ts" />
"use strict";
var root = require('root-path');
var fs = require('fs');
var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var squlize = require('sequelize');
var con = require(root('/config/connections'));
var dbconn = con.connections.active_connection;
var conn = null; // boot.start_db(null);
open_db_connection();
class AppContext {
    get conn() {
        return conn;
    }
}
exports.AppContext = AppContext;
function open_db_connection() {
    conn = new s_mgr(dbconn.config, dbconn.extra);
    //conn.sequelize.query("select top 10 * from occp", { type: squlize.QueryTypes.SELECT }).then(list => {
    //    var d = list;
    //});
}
//# sourceMappingURL=appcontext.js.map