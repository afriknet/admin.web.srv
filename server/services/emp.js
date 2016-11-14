/// <reference path="../lib/dataservice.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dx = require('../lib/dataservice');
var Q = require('q');
var guid = require('guid');
var breeze = require('breeze-client');
var EmpSrv = (function (_super) {
    __extends(EmpSrv, _super);
    function EmpSrv() {
        _super.apply(this, arguments);
    }
    EmpSrv.prototype.invite_new_user = function (args) {
        var d = Q.defer();
        var emp_srv = new dx.DataService(this.context, 'emp');
        var qry = new breeze.EntityQuery({
            from: 'emp',
            where: {
                'empemail': { eq: args.email }
            }
        });
        //1. check if email exists already
        emp_srv.fetch(qry).then(function (data) {
            if (data.length > 0) {
                d.reject({
                    error: 'This email is already registered'
                });
            }
            else {
                //2. create usr
                var usr_srv = dx.GetService('usr');
                var usrid = guid.raw();
                usr_srv.ds.createEntity('usr', {
                    id: usrid,
                    usrname: args.email,
                    usremail: args.email,
                    usrpassword: '123456789'
                });
                usr_srv.postchanges().then(function () {
                    emp_srv.ds.createEntity('emp', {
                        id: guid.raw(),
                        usrid: usrid,
                        empemail: args.email,
                        compid: args.compid,
                        deptid: args.deptid,
                    });
                    emp_srv.postchanges().then(function () {
                        d.resolve(emp_srv.ds.exportEntities());
                    }).fail(function (err) {
                        d.reject(err);
                    });
                })
                    .fail(function (err) {
                    d.reject(err);
                });
            }
        });
        return d.promise;
    };
    return EmpSrv;
}(dx.DataService));
exports.EmpSrv = EmpSrv;
//# sourceMappingURL=emp.js.map