/// <reference path="../../server/datastore/store.ts" />
"use strict";
var store = require('../../server/datastore/store');
var breeze = require('breeze-client');
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
};
//# sourceMappingURL=occp.js.map