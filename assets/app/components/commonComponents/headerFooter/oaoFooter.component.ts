import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'

import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service"

import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
declare var jQuery:any;
@Component({
    selector: 'oao-footer',
    templateUrl: './oaoFooter.component.html'
    
})
export class oaoFooterComponent
{
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
	application_id:any
constructor(private fb: FacebookService,private oaoService:OAOService){
   this.model=this.oaoService.getPersonalDetailsObject();
    if(this.model.application_id!=null){
	    this.application_id= this.model.application_id;
    }
    else{
    this.application_id='na';
    }
 
  }
}