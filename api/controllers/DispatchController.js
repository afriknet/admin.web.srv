

var root = require('root-path');
var dispatcher = require(root('/server/dispatcher'));

module.exports = {

    test: function (req, res) {
        dispatcher.test(req, res);
    }
    
};