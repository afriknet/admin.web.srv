/// <reference path="../../server/datastore/store.ts" />

import store = require('../../server/datastore/store');
import breeze = require('breeze-client');


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
            compid: { dataType: breeze.DataType.String },
            deptname: { dataType: breeze.DataType.String },
            deptparentid: { dataType: breeze.DataType.String },
            deptoutline: { dataType: breeze.DataType.String }
        }
    });


    store.add_to_Store({
        defaultResourceName: 'emp',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            usrid: { dataType: breeze.DataType.String },
            compid: { dataType: breeze.DataType.String },
            deptid: { dataType: breeze.DataType.String },
            empemail: { dataType: breeze.DataType.String }            
        },
        navigationProperties: {
            jbr: {
                entityTypeName: "jbr",
                associationName: "rel_emp_jbr",
                isScalar: false
            }
        }
    });


    store.add_to_Store({
        defaultResourceName: 'jbr',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            compid: { dataType: breeze.DataType.String },
            empid: { dataType: breeze.DataType.String },
            deptid: { dataType: breeze.DataType.String },
            jobdescr: { dataType: breeze.DataType.String },
            jobstartdate: { dataType: breeze.DataType.DateTime },
            jobenddate: { dataType: breeze.DataType.DateTime },
            jobnotes: { dataType: breeze.DataType.String }
        },

        navigationProperties: {
            emp: {
                type: "emp",
                assoc: "rel_emp_jbr",
                foreignKeyNames: ["empid"]
            }
        }
    });
    
}

