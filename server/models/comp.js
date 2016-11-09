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
    store.add_to_Store({
        defaultResourceName: 'compdept',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            compid: { dataType: breeze.DataType.String, isPartOfKey: true },
            deptname: { dataType: breeze.DataType.String },
            deptparentid: { dataType: breeze.DataType.String }
        }
    });
    store.add_to_Store({
        defaultResourceName: 'emp',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            usrid: { dataType: breeze.DataType.String },
            compid: { dataType: breeze.DataType.String },
            deptid: { dataType: breeze.DataType.String },
            empemail: { dataType: breeze.DataType.String },
        }
    });
};
//# sourceMappingURL=comp.js.map