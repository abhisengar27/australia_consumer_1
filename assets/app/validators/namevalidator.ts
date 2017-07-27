import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[nameValidate][formControlName],[nameValidate][formControl],[nameValidate][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => FirstNameValidator), multi: true }
    ]
})
export class FirstNameValidator implements Validator {
    constructor( @Attribute('nameValidate') public nameValidate: string,
        @Attribute('reverse') public reverse: string) {

    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
    let v = c.value;
    let char_at_val=String(v).charAt(0)
   
    if(char_at_val == "." || char_at_val == "'"  )
    return {"startwithnumber":true}
  
    // if(v.length <=3)
    //  return {"startwithnumber":true}
    // if(v!="" && !isNaN(Number(char_at_val))){
        //if(!String(v).match(/^[a-zA-Z'.-]+(\w+ ?)*$/)){
           
            if(!String(v).match(/^([a-zA-Z'.-]+ ?)+$/))
            {
            
        return {"startwithnumber":true}
    }
        return null;
             
    }
}