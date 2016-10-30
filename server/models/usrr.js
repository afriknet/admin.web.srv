/// <reference path="../../server/datastore/store.ts" />
"use strict";
var store = require('../../server/datastore/store');
var breeze = require('breeze-client');
store.add_to_Store({
    defaultResourceName: 'usrr',
    dataProperties: {
        ID: { dataType: breeze.DataType.String, isPartOfKey: true },
        USRRNAME: { dataType: breeze.DataType.String },
        USRRSURNAME: { dataType: breeze.DataType.String },
        USRRPASSWORD: { dataType: breeze.DataType.String },
        USRREMAIL: { dataType: breeze.DataType.String },
        USRRPHONE: { dataType: breeze.DataType.String },
        USRRCREATEDATE: { dataType: breeze.DataType.String },
        USRRTYPE: { dataType: breeze.DataType.String },
        USRRSTATUS: { dataType: breeze.DataType.String },
        USRRCITY: { dataType: breeze.DataType.String },
        USRRCOUNTRY: { dataType: breeze.DataType.String },
        COMPID: { dataType: breeze.DataType.String },
        USRRADDRESS: { dataType: breeze.DataType.String },
    }
});
//# sourceMappingURL=usrr.js.map