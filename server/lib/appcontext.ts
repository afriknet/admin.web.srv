/// <reference path="../datastore/store.ts" />

import _ = require('lodash');
import express = require('express');

var root = require('root-path');
import path = require('path');
var fs = require('fs');

var bs = require(root('/server/breeze_sequel/main'));
var s_mgr = bs.SequelizeManager;
import sqlz = require('sequelize');
import Q = require('q');

import store = require('../datastore/store');
var con = require(root('/config/connections'));
var mysql = con.connections.local_mysql;
var mssql = con.connections.mssql_connection;
var conn = null;// boot.start_db(null);


open_db_connection();


export class AppContext {

    constructor() {
        this.tx_count = 0;
    }

    get conn(): any {

        if (!conn['appcontext']) {
            conn['appcontext'] = this;
        }
        
        return conn;
    }

    private tx: any;
    private tx_count: number;


    begin_transaction(): Q.Promise<any> {

        this.tx_count++;

        if (this.tx_count === 1) {

            this.tx = this.conn.sequelize.transaction();            
        }        

        return this.tx;
    }


    transactional(callback: any) {
        
        if (!this.tx) {

            return this.conn.sequelize.transaction(tx => {

                this.tx = tx;

                return callback(tx);

            }).catch(e => {

                throw e

            }).finally(() => {

                this.tx = undefined;
            });

        } else {

            return callback(this.tx);
        }
        
    }


    end_transaction() {

        if (this.tx_count > 0) {
            this.tx_count--;
        }

        if (this.tx_count === 0) {
            this.tx = undefined;
        }
    }


    transactional2( ctx, trx, callback: any) {

        return callback().then((r) => {

            return null;// this.end_transaction(ctx, trx, r);

        }).catch(e => {

            //this.end_transaction(ctx, trx, null, e);

            throw e;

        });
        
    }


    end_transaction1(context, trx: any, r: any, e?: any) {
        
        try {

            this.tx_count--;

            if ( e || r.errors) {

                trx.rollback();

                return r;

            } else {

                if (this.tx_count === 0) {

                    trx.commit();
                }

                return { entities: r, keyMappings: context['_keyMappings'] }

            }

        } finally {

            if (this.tx_count === 0) {

                this.tx = undefined;
            }

        }
        
    }



    get_transaction(sequelize: any): Q.Promise<sqlz.Transaction> {

        if (this.tx) {
            return Q.resolve(this.tx);
        }

        var d = Q.defer<sqlz.Transaction>();

        this.tx = sequelize['transaction']();
        
        return this.tx;
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