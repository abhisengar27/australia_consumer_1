import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[splitValidator][formControlName],[splitValidator][formControl],[splitValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => SplitValidator), multi: true }
    ]
})
export class SplitValidator implements Validator {
    constructor( @Attribute('splitValidator') public splitValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!(Number(v)>0 && Number(v)<100)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}