/// <reference path="../lib/dataservice.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var srv = require('../lib/dataservice');
var Q = require('q');
var guid = require('guid');
var _ = require('lodash');
var CompSrv = (function (_super) {
    __extends(CompSrv, _super);
    function CompSrv() {
        _super.apply(this, arguments);
    }
    CompSrv.prototype.register_company = function (info) {
        var _this = this;
        var d = Q.defer();
        this.context.transactional(function (tx) {
            var p = Q.defer();
            _this.create_company(info).then(function (compid) {
                _this.create_primary_department(compid, info).then(function (deptid) {
                    _this.invite_user(compid, deptid, info).then(function (usr_data) {
                        var usr = srv.GetService(_this.context, 'emp');
                        usr.ds.importEntities(usr_data);
                        var usrid = _.result(usr.ds.getEntities('emp')[0], 'usrid');
                        p.resolve({
                            compid: compid,
                            deptid: deptid,
                            usrid: usrid
                        });
                    });
                });
            });
            return p.promise;
        }).then(function () {
            d.resolve();
        });
        return d.promise;
    };
    CompSrv.prototype.create_company = function (info) {
        var comp = srv.GetService(this.context, 'comp');
        var compid = guid.raw();
        comp.ds.createEntity('comp', {
            ID: compid,
            COMPNAME: info.compname,
            COMPEMAIL: info.email,
            COMPCOUNTRY: 'GR',
            COMPADDRESS: ''
        });
        return comp.postchanges().then(function () {
            return compid;
        });
    };
    CompSrv.prototype.create_primary_department = function (compid, info) {
        var dept = srv.GetService(this.context, 'compdept');
        var __id = guid.raw();
        dept.ds.createEntity('compdept', {
            id: __id,
            compid: compid,
            deptname: 'Main department'
        });
        return dept.postchanges().then(function () {
            return __id;
        });
    };
    CompSrv.prototype.invite_user = function (compid, deptid, info) {
        var emp = srv.GetService(this.context, 'emp');
        return emp['invite_new_user']({
            backendid: info.backendid,
            compid: compid,
            deptid: deptid,
            usremail: info.email,
            usrname: info.name,
            usrsurname: info.surname,
            usrstatus: 1
        });
    };
    return CompSrv;
}(srv.DataService));
exports.CompSrv = CompSrv;
//# sourceMappingURL=comp.js.map