/// <reference path="appcontext.ts" />
/// <reference path="../datastore/store.ts" />

var root = require('root-path');

import ctx = require('./appcontext');
import Q = require('q');
var br_sequel = require(root('/server/breeze_sequel/main'));
var sequel_manager = br_sequel.SequelizeManager;
var sequel_query = br_sequel.SequelizeQuery;
var sequel_save = br_sequel.SequelizeSaveHandler;
var __sequel = require('sequelize');
import utils = require('./utils');
import _ = require('lodash');
import store = require('../datastore/store');
import breeze = require('breeze-client');
require('./adapter');
var file_exists = require('file-exists');

br_sequel.breeze.config.initializeAdapterInstance('dataService', 'adapter_webApi', true);


export interface CallParams {
    method: string,
    params: any
}


export class DataService {

    context: ctx.AppContext;
    private model: string;

    constructor(context: ctx.AppContext, model: string) {
        this.context = context;
        this.model = model;
    }


    private __dm: breeze.EntityManager;
    get ds(): breeze.EntityManager {

        if (!this.__dm) {
            this.__dm = new breeze.EntityManager({
                dataService: new breeze.DataService({
                    serviceName: this.model,
                    hasServerMetadata: false
                })
            });
            this.__dm.metadataStore.importMetadata(store.ModelStore.exportMetadata());
        }
        return this.__dm;
    }


    private __fill_entityManager(data: any[]) {

        var that = this;

        data.forEach(entity => {

            this.ds.createEntity(this.model, entity, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);

        });
    }


    private __execQuery(query: breeze.EntityQuery): Q.Promise<any> {

        var d = Q.defer<any>();
        
        var qry = new sequel_query(this.context.conn, query);
        
        qry.execute().then(rst => {
            d.resolve(rst);
        });


        return d.promise;
    }


    fetch(query: breeze.EntityQuery): Q.Promise<any[]> {

        var d = Q.defer<any[]>();

        this.__execQuery(query).then(result => {

            var __results = result;

            if (result['results']) {
                __results = result['results'];
            }

            if (result) {
                this.__fill_entityManager(__results);
            }

            d.resolve(result);

        });

        return d.promise;

    }


    private exec_raw_sql(sql: string): Q.Promise<any[]> {

        var d = Q.defer<any[]>();

        this.context.conn.sequelize.query(sql, { type: __sequel.QueryTypes.SELECT }).then((list: any[]) => {
            d.resolve(list);
        });

        return d.promise;
    }

    
    exec_sql(input: any): Q.Promise<any[]> {

        return this.exec_raw_sql(input.sql);

    }


    private __saveChanges(saveBundle: any): Q.Promise<any> {

        var d = Q.defer<any>();

        try {

            sequel_save.save(this.context, {
                body: {
                    entities: JSON.parse(saveBundle).entities
                }
            }).then((r) => {

                d.resolve(r);

            }).catch(err => {

                d.reject(err)

            });

        } catch (e) {

            d.reject(e)
        }
        
        return d.promise;

    }



    savechanges(data: string): Q.Promise<any> {

        return this.context.transactional(tx => {

            this.ds.importEntities(data, { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
            
            return this.postchanges()

        });
        
    }
    

    before_post(): Q.Promise<any> {
        return Q.resolve(true);
    }


    after_post(): Q.Promise<any> {
        return Q.resolve(true);
    }


    private internal_post() {

        var dataservice: any = br_sequel.breeze.config.getAdapterInstance('dataService');
        
        var savecontext = {
            entityManager: this.ds,
            dataService: dataservice,
            resourceName: this.model
        }


        var bundle = { entities: this.ds.getEntities(), saveOptions: {} };


        var saveBundle = dataservice.saveChanges(savecontext, bundle);


        return this.__saveChanges(saveBundle);
    }


    postchanges(): Q.Promise<any> {

        return this.before_post().then(() => {

            return this.internal_post().then(() => {

                return this.after_post();
            });

        });

        
    }


    // generic call
    call(args: CallParams): Q.Promise<any> {

        return this[args.method].call(this, args.params);

    }
}


export function GetService(_ctx: ctx.AppContext, srvname: string): DataService {
    
    if (file_exists(root('/server/services/' + srvname + '.js'))) {

        var srv: any = require(root('/server/services/' + srvname));

        var _fn_name = Object.keys(srv)[0];

        try {
            return (new srv[_fn_name](_ctx, srvname));

        } catch (e) {

            throw e;
        }

    } else {

        return new DataService(_ctx, srvname)
    }

}