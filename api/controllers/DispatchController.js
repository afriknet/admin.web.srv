

var root = require('root-path');
var dispatcher = require(root('/server/dispatcher'));

module.exports = {

    fetch_data: function (req, res) {
        dispatcher.dispatch_call(dispatcher.operationtype.fetch, req, res);
    },


    fetch_metadata: function (req, res) {

        dispatcher.dispatch_call(dispatcher.operationtype.metadata, req, res);
    },


    raw: function (req, res) {
        
        dispatcher.dispatch_call(dispatcher.operationtype.raw,req, res);
    },


    save: function (req, res) {

        dispatcher.dispatch_call(dispatcher.operationtype.save, req, res);
    },

    call: function (req, res) {

        dispatcher.dispatch_call(dispatcher.operationtype.save, req, res);
    }

};
