import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[yearValidator][formControlName],[yearValidator][formControl],[yearValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => YearValidator), multi: true }
    ]
})
export class YearValidator implements Validator {
    constructor( @Attribute('yearValidator') public yearValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!(Number(v)>1000 && Number(v)<9999)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}