﻿/// <reference path="../../typings/tsd.d.ts" />

var root = require('root-path');
var metadata = require(root('/server/datastore/meta'));
var breeze_sequel = require(root('/server/breeze_sequel/main'));
import breeze = require('breeze-client');

import _ = require('lodash');

var DT = breeze.DataType;
var Identity = breeze.AutoGeneratedKeyType.Identity;
var Validator = breeze.Validator;
var camelCaseConvention: breeze.NamingConvention = breeze.NamingConvention.none;

// Breeze Labs: breeze.metadata.helper.js
var helper = new breeze_sequel.breeze.config.MetadataHelper();

// Helper convenience methods
var addDataService = helper.addDataService.bind(helper);
var addTypeToStore = helper.addTypeToStore.bind(helper);
var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);

var dataNameSpace = 'StampDev';

export interface DataProperties {
    [name: string]: DataPropertyDefinition
}

export interface DataPropertyDefinition {    
    
    dataType: breeze.DataTypeSymbol;    
    isNullable?: boolean;
    isPartOfKey?: boolean;
    isUnmapped?: boolean;

    maxLength?: number;
    name?: string;
}


export interface Extensions {
    [name: string]: DataPropertyExtension
}
export interface DataPropertyExtension {
    description: string
}
export interface EntityTypeDefinition {
    namespace?: string;
    shortName?: string;
    defaultResourceName: string,
    autoGeneratedKeyType?: breeze.AutoGeneratedKeyType,
    dataProperties: DataProperties;
    complexProperties?: breeze.DataProperty[];
    unmappedProperties?: breeze.DataProperty[];
    validators?: breeze.Validator[];
    //navigationProperties?: breeze.NavigationProperty[];
    navigationProperties?:any,
    custom?: Extensions
}

function __addEntityType(store: breeze.MetadataStore, type: EntityTypeDefinition) {

    var _type = _.extend(type, {
        namespace: dataNameSpace,
        shortName: type.defaultResourceName,
        autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
    });

    addTypeToStore(store, _type);
}
function __createDataStore(storeName: string): breeze.MetadataStore {

    var store: breeze.MetadataStore = new breeze.MetadataStore({
        namingConvention: camelCaseConvention
    });
    addDataService(store, storeName);
    
    return store;
}


interface Schema {
    srvName: string,
    store: breeze.MetadataStore
}
var dbSchema: Schema[] = [];


function __regsiterSchema(srvName: string, store: breeze.MetadataStore) {

    dbSchema.push({
        srvName: srvName,
        store: store
    });
}
export var ModelStore: breeze.MetadataStore = new breeze.MetadataStore({ namingConvention: camelCaseConvention });
export function add_to_Store(entity_type: EntityTypeDefinition) {

    var _type = _.extend(entity_type, {
        namespace: dataNameSpace,
        shortName: entity_type.defaultResourceName,
        autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
    });

    addTypeToStore(ModelStore, _type);
}


addDataService(ModelStore, 'DataStore');
setDefaultNamespace(dataNameSpace);
    







