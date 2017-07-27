import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[MedicareValidator][formControlName],[MedicareValidator][formControl],[MedicareValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MedicareValidator), multi: true }
    ]
})
export class MedicareValidator implements Validator {
    constructor( @Attribute('MedicareValidator') public MedicareValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
         if(!String(v).match(/^[0-9]{10}$/)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}