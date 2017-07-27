import { Component } from '@angular/core';
import {Router} from '@angular/router'
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import {checkbox} from '../interfaces/checkboxinterface';
import { ConfigDetails } from "../interfaces/configinterface";
import {OAOService} from "../services/OAO.Service"
declare var google:any;
declare var googleLoaded:any;

declare var jQuery:any;
declare var moment: any;

@Component({
    selector: 'common',
    template:''
})
export class Common {
    model = new PersonalDetailsObject('','','','','','','')
  AmountFormatter(amountvalue: any, var_v: any) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
    //     this.testmodel[var_v]="";
    //  this.testmodel[var_v]=amountvalue;
        var finalString = formatter.format(amountvalue);
		finalString = finalString.replace('A$','');
        this.model[var_v] = finalString.replace('$','');
    }

   revert(oldvalue:any,var_v: any){
        var tmpOldvalue;
       if(oldvalue!=null && String(oldvalue).match(/\,/g)){
        tmpOldvalue=oldvalue.replace(/\,/g,'');
        console.log(tmpOldvalue);
        this.model[var_v]=tmpOldvalue.substr(0,tmpOldvalue.length-3);
        console.log(this.model[var_v]);
        }
    }
 
}