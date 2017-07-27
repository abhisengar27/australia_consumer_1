import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { UserDetailsObject } from "../../../interfaces/userDetails.interface"; 
import { OAOService } from "../../../services/OAO.Service"
declare var jQuery:any;
declare var Ladda;
@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent
{
  model = new UserDetailsObject('', '');
  error_message;
  constructor(private oaoService:OAOService,private router:Router)
  {
        console.log("LoginComponent constructor()" )
        this. onkeyUp();
  }
  onSubmit()
  {
         this.oaoService.Login(this.model).subscribe(
            data => {
                 this.model=data;
                 console.log( this.model);
               if(data.userName==null)
               { 
                    this.error_message="Enter the valid user name and password"
                    console.log("failed");
                    jQuery('#userName,#password').css('border-color', 'red');
                    jQuery('#loginSubmit').prop('disabled', true);
               }
               else
               {
                    console.log("success")
                    this.oaoService.setUserDetailsObject(this.model);
                    this.oaoService.setUserExistingFlag(true);
                    if(this.oaoService.getLoginFlag())
                    { 
                        console.log("navigate to home")
                        this.router.navigate(['/home']);
                    }else{
                          console.log(" navigate to dashboard")
                          this.router.navigate(['/dashboard']);
                    }
               }
            },
            error => console.log("ERROR:"+error),
            () => console.log());
    }

    ngOnInit(){
        this. onkeyUp();
    }

    onkeyUp()
    {  
      if(this.model.userName==null || this.model.userName=="" || this.model.password==null ||this.model.password=="" )
      {    
            jQuery('#loginSubmit').prop('disabled', true);
      }
      else{
             jQuery('#loginSubmit').prop('disabled', false);
      }
    }

}
