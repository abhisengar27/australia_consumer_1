import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { UserDetailsObject } from "../../../interfaces/userDetails.interface"; 
import { OAOService } from "../../../services/OAO.Service"
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.Component.html'
    
})
export class DashboardComponent
{
     userDetailsObject=new UserDetailsObject('',''); //chandan
     fName;
     userId;
     btn:boolean;
     constructor(private oaoService:OAOService,private router:Router){  }
     
  ngOnInit() 
 {    
     console.log( this.btn)
   
    if(this.oaoService.getUserExistingFlag()){
        console.log( this.btn)
         this.btn=true;
        this.oaoService.GetLoginUserDetails(this.oaoService.getUserDetailsObject()).subscribe(
            data => {
                    this.oaoService.setUserDetailsObject(data.result);
                    this.userDetailsObject=this.oaoService.getUserDetailsObject();
                    console.log(this.userDetailsObject);
                
                    this.userId=this.userDetailsObject.userId;
                    var str=this.userDetailsObject.fName
                    str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                    return letter.toUpperCase();
                        });
                    this.fName=str;
                });      
    }      
 }
  logout()
    {
        console.log(this.btn)
       
        this.oaoService.setUserExistingFlag(false); 
        this.oaoService.logout().subscribe(
        data => {
            this.btn=false;
            console.log(data);});
        console.log("loged out")
    }
}