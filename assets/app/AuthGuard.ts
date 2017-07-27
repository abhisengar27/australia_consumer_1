import { Injectable  } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { CanActivate } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from "rxjs";

import {OAOService} from "./services/OAO.Service";
import { Router } from "@angular/router";
import { ConfigDetails } from "./interfaces/configinterface";

@Injectable()
export class AuthGuard implements  CanActivate {
    configMsg:ConfigDetails
	//office365LoginEnabled="N";
	
    constructor(private http: Http,private oaoService: OAOService,private router: Router) {
		//this.oaoService.setOfficeAccountLoggedIn(true); 
		
				
     }

     
	

canActivate() {
	return new Promise((resolve, reject) => {
			//console.log("Constructor");
		this.oaoService.getConfig().subscribe((data) => {
			//console.log("in subscribe"); 
		this.configMsg = JSON.parse(JSON.stringify(data.data)); 
		//console.log("office365LoginEnabled >>",this.configMsg.office365LoginEnabled)
			if(this.configMsg.office365LoginEnabled=="N"){
				this.oaoService.setOfficeAccountLoggedIn(true); 
			}
			//console.log("CanActivate >>");
	if(!this.oaoService.getOfficeAccountLoggedIn()){
		if(this.configMsg.office365LoginEnabled=="Y"){
					window.location.href=this.oaoService.baseURL;
		}
				//console.log("False ");
				//return false;
				resolve(false);
				
			}
		   else{
			   //console.log("True ");
			   resolve(true);
		   }
		});
		
		
		
		
		});
		
	
   
			
  }

 
}