/// <reference path="../../server/datastore/store.ts" />

import store = require('../../server/datastore/store');
import breeze = require('breeze-client');

module.exports = function () {

    store.add_to_Store({
        defaultResourceName: 'item',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemname: { dataType: breeze.DataType.String },
            itemdescr: { dataType: breeze.DataType.String },
            itemcreated: { dataType: breeze.DataType.DateTime },
            itemcode: { dataType: breeze.DataType.String },
            catid: { dataType: breeze.DataType.String },
            partnerid: { dataType: breeze.DataType.String },
            itemprice: { dataType: breeze.DataType.Decimal },
            amazon: { dataType: breeze.DataType.Int16 },
        }
    });


}