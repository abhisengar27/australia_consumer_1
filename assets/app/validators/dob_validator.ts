import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[dobvalidator][formControlName],[dobvalidator][formControl],[dobvalidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => dobvalidator), multi: true }
    ]
})
export class dobvalidator implements Validator {
    constructor( @Attribute('dobvalidator') public dobvalidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    if(v!="" && !isNaN(Number(char_at_val))){

        	var date = Number(v.substring(8, 10));
            var month = Number(v.substring(5, 7));
            var year = Number(v.substring(0,4));

            var myDate = new Date(year, month - 1, date);

            var today = new Date();

      	   var age =   today.getFullYear() - myDate.getFullYear();

            if (myDate > today) {
                return {"startwithnumber":true}
            }
             if (age < 18) {
                return {"startwithnumber":true}
            }
          console.log("sfadhgaf")
            if(!String(v).match(/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/)){
                return {"startwithnumber":true}
            }

            return null;
           
    }
       
    }
}