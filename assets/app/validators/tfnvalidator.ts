import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[tfnValidator][formControlName],[tfnValidator][formControl],[tfnValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => TFNValidator), multi: true }
    ]
})
export class TFNValidator implements Validator {
    constructor( @Attribute('tfnValidator') public tfnValidator: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^[0-9]\d{8}$/g)){
        return {"startwithnumber":true}
    }
        return null;
             
    }
}