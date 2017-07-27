import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[emailValidator][formControlName],[emailValidator][formControl],[emailValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
    ]
})
export class EmailValidator implements Validator {
    constructor( @Attribute('emailValidator') public emailValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}