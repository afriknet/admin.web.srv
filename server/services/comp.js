/// <reference path="../lib/dataservice.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var srv = require('../lib/dataservice');
var CompSrv = (function (_super) {
    __extends(CompSrv, _super);
    function CompSrv() {
        _super.apply(this, arguments);
    }
    return CompSrv;
}(srv.DataService));
exports.CompSrv = CompSrv;
//# sourceMappingURL=comp.js.map