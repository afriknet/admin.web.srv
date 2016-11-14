/// <reference path="../../server/datastore/store.ts" />

import store = require('../../server/datastore/store');
import breeze = require('breeze-client');



module.exports = function () {

    store.add_to_Store({
        defaultResourceName: 'emp_usr_view',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            empid: { dataType: breeze.DataType.String },
            compid: { dataType: breeze.DataType.String },
            deptid: { dataType: breeze.DataType.String },
            empemail: { dataType: breeze.DataType.String },
            usrid: { dataType: breeze.DataType.String },
            usremail: { dataType: breeze.DataType.String },
            usrname: { dataType: breeze.DataType.String },
            usrsurname: { dataType: breeze.DataType.String },
            usrstatus: { dataType: breeze.DataType.String },
            usrpic: { dataType: breeze.DataType.String },
        }
    });


}