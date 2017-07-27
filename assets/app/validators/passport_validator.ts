import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[PassportValidator][formControlName],[PassportValidator][formControl],[PassportValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PassportValidator), multi: true }
    ]
})
export class PassportValidator implements Validator {
    constructor( @Attribute('PassportValidator') public PassportValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^[a-zA-Z]{1}[0-9]{7}$/)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}