"use strict";
var store = require('../../server/datastore/store');
var breeze = require('breeze-client');
store.add_to_Store({
    defaultResourceName: 'usr',
    dataProperties: {
        id: { dataType: breeze.DataType.String, isPartOfKey: true },
        usrname: { dataType: breeze.DataType.String },
        usrsurname: { dataType: breeze.DataType.String },
        usrpassword: { dataType: breeze.DataType.String },
        usremail: { dataType: breeze.DataType.String },
        usrpic: { dataType: breeze.DataType.String },
        usrstatus: { dataType: breeze.DataType.Int32 },
    }
});
//# sourceMappingURL=usr.js.map