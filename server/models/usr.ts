
import store = require('../../server/datastore/store');
import breeze = require('breeze-client');


store.add_to_Store({
    defaultResourceName: 'usr',
    dataProperties: {
        id: { dataType: breeze.DataType.String, isPartOfKey: true },
        usrname: { dataType: breeze.DataType.String },
        usrsurname: { dataType: breeze.DataType.String },
        backendid: { dataType: breeze.DataType.String },
        usremail: { dataType: breeze.DataType.String },
        usrpic: { dataType: breeze.DataType.String },
        usrstatus: { dataType: breeze.DataType.Int32 },
        usrtype: { dataType: breeze.DataType.Int32 },
        usrlinkedin: { dataType: breeze.DataType.String },
        usrgoogleplus: { dataType: breeze.DataType.String } ,
        usrfacebook: { dataType: breeze.DataType.String }
    },
    navigationProperties: {
            usra: {
                entityTypeName: "usra",
                associationName: "rel_usr_usra",
                isScalar: false
            },
            usrs: {
                entityTypeName: "usrs",
                associationName: "rel_usr_usrs",
                isScalar: false
            }            
    }
});


store.add_to_Store({
    defaultResourceName: 'usra',
    dataProperties: {
        id: { dataType: breeze.DataType.String, isPartOfKey: true },
        usrid: { dataType: breeze.DataType.String },
        actid: { dataType: breeze.DataType.String }        
    },
    navigationProperties: {
            item: {
                type: "usr",
                assoc: "rel_usr_usra",
                foreignKeyNames: ["usrid"]
            }
    }
});


store.add_to_Store({
    defaultResourceName: 'usrs',
    dataProperties: {
        id: { dataType: breeze.DataType.String, isPartOfKey: true },
        usrid: { dataType: breeze.DataType.String },
        sklsid: { dataType: breeze.DataType.String }        
    },
    navigationProperties: {
            item: {
                type: "usr",
                assoc: "rel_usr_usrs",
                foreignKeyNames: ["usrid"]
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
        jbrcomp: { dataType: breeze.DataType.String },
        jbrlocation: { dataType: breeze.DataType.String },
        jobstartdate: { dataType: breeze.DataType.DateTime },
        jobenddate: { dataType: breeze.DataType.DateTime },
        jobnotes: { dataType: breeze.DataType.String }
    },

    navigationProperties: {
        emp: {
            type: "usr",
            assoc: "rel_usr_jbr",
            foreignKeyNames: ["usrid"]
        }
    }
});