/// <reference path="../lib/dataservice.ts" />

import _ = require('lodash');
var f = require('string-format');


import srv = require('../lib/dataservice');

export class CompdeptSrv extends srv.DataService {

    //on_savingChanges() {

    //    super.on_savingChanges();

    //    this.fix_outlines();

    //}


    //fix_outlines() {

    //    var that = this;

    //    var index: any = 1;

    //    function do_fix_outline(ent: any, count: number) {

    //        var _outline:any = '{outline}.'.replace('{outline}', (index++ as any));
            
    //        var parent = _.find(that.datasource.getEntities('compdept'), d => {
    //            return _.result(ent, 'deptparentid') === _.result(d, 'id');
    //        });

    //        if (parent) {

    //            _outline = _.result(parent, 'deptoutline') + _outline;
    //        }
            

    //        ent['deptoutline'] = _outline;

    //        var children = _.filter(that.datasource.getEntities('compdept'), d => {
    //            return _.result(d, 'deptparentid') === _.result(ent, 'id');
    //        });

    //        _.each(children, child => {

    //            do_fix_outline(child, index);
    //        });

    //    }

    //    var root = _.find(this.datasource.getEntities('compdept'), ent => {
    //        return _.result(ent, 'deptparentid') === undefined
    //            || _.result(ent, 'deptparentid') === null;
    //    });

    //    if (root) {

    //        do_fix_outline(root, 1);
    //    }


    //}

}