
/// <reference path="../lib/dataservice.ts" />

import dx = require('../lib/dataservice');
import Q = require('q');
var guid = require('guid');
import breeze = require('breeze-client');


export class EmpSrv extends dx.DataService {
    
    invite_new_user(args: {
        compid: string,
        deptid: string,
        usremail: string,
        usrname: string,
        usrsurname: string,
        usrstatus: number
    }) {

        var d = Q.defer();

        var emp_srv = new dx.DataService(this.context, 'emp');

        var qry = new breeze.EntityQuery({
            from: 'emp',
            where: {
                'empemail': { eq: args.usremail }
            }
        });
        
        //1. check if email exists already
        emp_srv.fetch(qry).then((data: any[]) => {

                if (data.length > 0) {

                    d.reject({
                        error:'This email is already registered'
                    });

                } else {
                    
                    //2. create usr  
                    var usr_srv: dx.DataService = dx.GetService('usr');

                    var usrid = guid.raw();

                    usr_srv.ds.createEntity('usr', {
                        id: usrid,
                        usrname: args.usrname,
                        usrsurname: args.usrsurname,
                        usremail: args.usremail,
                        usrpassword: '123456789',
                        usrstatus: parseInt(args.usrstatus as any) // pending invitation
                    });


                    usr_srv.postchanges().then(() => {


                        emp_srv.ds.createEntity('emp', {
                            id: guid.raw(),
                            usrid: usrid,
                            empemail: args.usremail,
                            compid: args.compid,
                            deptid: args.deptid,                            
                        });

                        emp_srv.postchanges().then(() => {

                            d.resolve(emp_srv.ds.exportEntities());

                        }).fail(err => {

                            d.reject(err);

                        });

                    })
                    .fail(err => {

                        d.reject(err);
                    });
                }
            })

        return d.promise;
    }

}