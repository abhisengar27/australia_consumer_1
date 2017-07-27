import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[alphanumericValidate][formControlName],[alphanumericValidate][formControl],[alphanumericValidate][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AlphanumericValidator), multi: true }
    ]
})
export class AlphanumericValidator implements Validator {
   
    constructor( @Attribute('alphanumericValidate') public alphanumericValidate: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)

    // if(v!="" && !isNaN(Number(char_at_val))){
        if(!String(v).match(/^([a-zA-Z0-9'.-]+ ?)+$/)){
         
        return {"startwithnumber":true}
    }
        return null;
          
    
         
    }
}