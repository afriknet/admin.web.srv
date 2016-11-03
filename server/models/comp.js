/// <reference path="../../server/datastore/store.ts" />
"use strict";
var store = require('../../server/datastore/store');
var breeze = require('breeze-client');
module.exports = function () {
    store.add_to_Store({
        defaultResourceName: 'comp',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            COMPNAME: { dataType: breeze.DataType.String },
            COMPEMAIL: { dataType: breeze.DataType.String },
            COMPCOUNTRY: { dataType: breeze.DataType.String },
            COMPADDRESS: { dataType: breeze.DataType.String },
            COMPPASSWORD: { dataType: breeze.DataType.String }
        }
    });
};
//# sourceMappingURL=comp.js.map