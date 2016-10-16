/// <reference path="../../server/datastore/store.ts" />

import store = require('../../server/datastore/store');
import breeze = require('breeze-client');

module.exports = function () {

    store.add_to_Store({
        defaultResourceName: 'occp',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            OCCPCONCEPT_EN: { dataType: breeze.DataType.String },
            OCCPURI: { dataType: breeze.DataType.String },
            OCCPTYPE: { dataType: breeze.DataType.String },
            OCCPISCO: { dataType: breeze.DataType.String },
            OCCPPARENTID: { dataType: breeze.DataType.String, isNullable: true }
        }
    });


    store.add_to_Store({
        defaultResourceName: 'acts',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            ACTSDESCR_EN: { dataType: breeze.DataType.String },            
            ACTSISCO: { dataType: breeze.DataType.String },            
        }
    });

}