/// <reference path="../lib/dataservice.ts" />

import srv = require('../lib/dataservice');
import dx = require('../lib/dataservice');
import Q = require('q');
import breeze = require('breeze-client');
var guid = require('guid');
import _ = require('lodash');


interface RegisterInfo {
    backendid: string,
    name: string,
    surname: string,
    email: string,
    compname: string,
    password: string
}

export class CompSrv extends srv.DataService {


    register_company(info: RegisterInfo): Q.Promise<any> {

        var d = Q.defer();

        this.context.transactional(tx => {

            var p = Q.defer();

            this.create_company(info).then( compid => {


                this.create_primary_department(compid, info).then(deptid => {


                    this.invite_user(compid, deptid, info).then((usr_data) => {


                        var usr = srv.GetService(this.context, 'usr');

                        usr.ds.importEntities(usr_data);

                        var usrid = _.result(usr.ds.getEntities('usr')[0], 'id');

                        p.resolve({
                            compid: compid,
                            deptid: deptid,
                            usrid: usrid
                        });


                    });

                });

            });

            return p.promise;
        });

        return d.promise;
    }
    

    private create_company(info: RegisterInfo) {
        
        var comp = srv.GetService(this.context, 'comp');

        var compid = guid.raw();

        comp.ds.createEntity('comp', {
            ID: compid,
            COMPNAME: info.compname,
            COMPEMAIL: info.email,
            COMPCOUNTRY: 'GR',
            COMPADDRESS: ''
        });

        return comp.postchanges().then(() => {
            return compid;
        })
    }


    private create_primary_department(compid: string, info: RegisterInfo) {

        var dept = srv.GetService(this.context, 'compdept');

        var __id = guid.raw();

        dept.ds.createEntity('compdept', {
            id: __id,
            compid: compid,
            deptname: 'Primary department'
        });

        return dept.postchanges().then(() => {

            return __id;
        });
        
    }


    private invite_user(compid: string, deptid: string, info: RegisterInfo): Q.Promise<any> {

        var emp = srv.GetService(this.context, 'compdept');

        return emp['invite_new_user']({
            backendid: info.backendid,
            compid: compid,
            deptid: deptid,
            usremail: info.email,
            usrname: info.name,
            usrsurname: info.surname,
            usrstatus: 1
        })
    }


}