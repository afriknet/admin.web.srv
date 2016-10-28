import store = require('../../server/datastore/store');
import breeze = require('breeze-client');

module.exports = function () {

    store.add_to_Store({
        defaultResourceName: 'prof',

        dataProperties: {

            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            COMPID: { dataType: breeze.DataType.String },
            OCCPID: { dataType: breeze.DataType.String },
            PROFTITLE: { dataType: breeze.DataType.String },
            PROFDESCRIPTION: { dataType: breeze.DataType.String },
            PROFCREATEDATE: { dataType: breeze.DataType.DateTime },
            PROFISPUBLIC: { dataType: breeze.DataType.Int16 },
            PROFACTIVE: { dataType: breeze.DataType.Int16 },
            PROFCOUNTRY: { dataType: breeze.DataType.String },
        },

        navigationProperties: {
            proa: {
                entityTypeName: "proa",
                associationName: "rel_prof_proa",
                isScalar: false
            },
            pros: {
                entityTypeName: "pros",
                associationName: "rel_prof_pros",
                isScalar: false
            }            
        }
    });


    store.add_to_Store({
        defaultResourceName: 'proa',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            PROFID: { dataType: breeze.DataType.String },
            OCCPID: { dataType: breeze.DataType.String },
            ACTSID: { dataType: breeze.DataType.String },
            PROAWEIGHT: { dataType: breeze.DataType.String }
        },
        navigationProperties: {
            item: {
                type: "prof",
                assoc: "rel_prof_proa",
                foreignKeyNames: ["PROFID"]
            }
        }
    });


    store.add_to_Store({
        defaultResourceName: 'pros',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            PROFID: { dataType: breeze.DataType.String },
            OCCPID: { dataType: breeze.DataType.String },
            SKLSID: { dataType: breeze.DataType.String },
            PROSWEIGHT: { dataType: breeze.DataType.String }
        },
        navigationProperties: {
            item: {
                type: "prof",
                assoc: "rel_prof_pros",
                foreignKeyNames: ["PROFID"]
            }
        }
    });


    store.add_to_Store({
        defaultResourceName: 'comp',
        dataProperties: {
            ID: { dataType: breeze.DataType.String, isPartOfKey: true },
            COMPANYNAME: { dataType: breeze.DataType.String },
            COMPEMAIL: { dataType: breeze.DataType.String },
            COMPCOUNTRY: { dataType: breeze.DataType.String },
            COMPADDRESS: { dataType: breeze.DataType.String },
            COMPPASSWORD: { dataType: breeze.DataType.String }
        }
    });
}