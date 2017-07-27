import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
   
    templateUrl: './crossTerms.html'

})

export class CrossSellTerms {
    setAgree(){
        console.log('agree clicked');
    }
    setDisagree(){
        window.close();
    }

}