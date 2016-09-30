"use strict";
var root = require('root-path');
var br_sequel = require(root('/server/breeze_sequel/main'));
var sequel_manager = br_sequel.SequelizeManager;
var sequel_query = br_sequel.SequelizeQuery;
var sequel_save = br_sequel.SequelizeSaveHandler;
var __sequel = require('sequelize');
require('./adapter');
br_sequel.breeze.config.initializeAdapterInstance('dataService', 'adapter_webApi', true);
var DataService = (function () {
    function DataService() {
    }
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=dataservice.js.map