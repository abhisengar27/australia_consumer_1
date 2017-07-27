import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[mobValidator][formControlName],[mobValidator][formControl],[mobValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MobileNumberValidator), multi: true }
    ]
})
export class MobileNumberValidator implements Validator {
    constructor( @Attribute('mobValidator') public mobValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^[04][0-9]\d{8}$/g)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}