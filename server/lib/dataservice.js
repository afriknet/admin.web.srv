/// <reference path="appcontext.ts" />
/// <reference path="../datastore/store.ts" />
"use strict";
var root = require('root-path');
var Q = require('q');
var br_sequel = require(root('/server/breeze_sequel/main'));
var sequel_manager = br_sequel.SequelizeManager;
var sequel_query = br_sequel.SequelizeQuery;
var sequel_save = br_sequel.SequelizeSaveHandler;
var __sequel = require('sequelize');
var store = require('../datastore/store');
var breeze = require('breeze-client');
require('./adapter');
var file_exists = require('file-exists');
br_sequel.breeze.config.initializeAdapterInstance('dataService', 'adapter_webApi', true);
var DataService = (function () {
    function DataService(context, model) {
        this.context = context;
        this.model = model;
    }
    Object.defineProperty(DataService.prototype, "ds", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    DataService.prototype.__fill_entityManager = function (data) {
        var _this = this;
        var that = this;
        data.forEach(function (entity) {
            _this.ds.createEntity(_this.model, entity, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);
        });
    };
    DataService.prototype.__execQuery = function (query) {
        var d = Q.defer();
        var qry = new sequel_query(this.context.conn, query);
        qry.execute().then(function (rst) {
            d.resolve(rst);
        });
        return d.promise;
    };
    DataService.prototype.fetch = function (query) {
        var _this = this;
        var d = Q.defer();
        this.__execQuery(query).then(function (result) {
            var __results = result;
            if (result['results']) {
                __results = result['results'];
            }
            if (result) {
                _this.__fill_entityManager(__results);
            }
            d.resolve(result);
        });
        return d.promise;
    };
    DataService.prototype.exec_raw_sql = function (sql) {
        var d = Q.defer();
        this.context.conn.sequelize.query(sql, { type: __sequel.QueryTypes.SELECT }).then(function (list) {
            d.resolve(list);
        });
        return d.promise;
    };
    DataService.prototype.exec_sql = function (input) {
        return this.exec_raw_sql(input.sql);
    };
    DataService.prototype.__saveChanges = function (saveBundle) {
        var d = Q.defer();
        try {
            sequel_save.save(this.context, {
                body: {
                    entities: JSON.parse(saveBundle).entities
                }
            }).then(function (r) {
                d.resolve(r);
            }).catch(function (err) {
                d.reject(err);
            });
        }
        catch (e) {
            d.reject(e);
        }
        return d.promise;
    };
    DataService.prototype.savechanges = function (data) {
        var _this = this;
        return this.context.transactional(function (tx) {
            _this.ds.importEntities(data, { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
            _this.on_savingChanges();
            return _this.postchanges();
        });
    };
    DataService.prototype.on_savingChanges = function () {
    };
    DataService.prototype.postchanges = function () {
        var dataservice = br_sequel.breeze.config.getAdapterInstance('dataService');
        var savecontext = {
            entityManager: this.ds,
            dataService: dataservice,
            resourceName: this.model
        };
        var bundle = { entities: this.ds.getEntities(), saveOptions: {} };
        var saveBundle = dataservice.saveChanges(savecontext, bundle);
        return this.__saveChanges(saveBundle);
    };
    // generic call
    DataService.prototype.call = function (args) {
        return this[args.method].call(this, args.params);
    };
    return DataService;
}());
exports.DataService = DataService;
function GetService(_ctx, srvname) {
    if (file_exists(root('/server/services/' + srvname + '.js'))) {
        var srv = require(root('/server/services/' + srvname));
        var _fn_name = Object.keys(srv)[0];
        try {
            return (new srv[_fn_name](_ctx, srvname));
        }
        catch (e) {
            throw _fn_name;
        }
    }
    else {
        return new DataService(_ctx, srvname);
    }
}
exports.GetService = GetService;
//# sourceMappingURL=dataservice.js.map