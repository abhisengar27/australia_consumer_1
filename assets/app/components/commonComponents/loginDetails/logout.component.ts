import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { OAOService } from "../../../services/OAO.Service"
@Component({
    selector: 'logout',
	template:``
})
export class LogoutComponent
{
  constructor(private oaoService:OAOService,private router:Router)
  {
    console.log("logoutComponent constructor()");
    this.logout();
  }

    private logout()
    {
        this.oaoService.setUserExistingFlag(false);
        this.oaoService.logout().subscribe(
            data => {console.log(data);});
            console.log("loged out");
            this.router.navigate(['/home']);
    }  
}