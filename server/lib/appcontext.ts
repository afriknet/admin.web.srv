/// <reference path="../datastore/store.ts" />

import _ = require('lodash');
import express = require('express');

var root = require('root-path');
import path = require('path');
var fs = require('fs');

var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
var sqlize = require('sequelize');

import store = require('../datastore/store');
var con = require(root('/config/connections'));
var mysql = con.connections.local_mysql;
var mssql = con.connections.mssql_connection;
var conn = null;// boot.start_db(null);


open_db_connection();


export class AppContext {

    get conn(): any {
        return conn;
    }
    
}


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