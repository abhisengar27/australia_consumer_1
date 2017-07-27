import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'

import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../../interfaces/userDetails.interface";
import { OAOService } from "../../services/OAO.Service"
import { CommonUtils } from "../../validators/commonUtils";
declare var jQuery:any;
declare var Ladda
@Component({
    selector: 'passwordSet',
    templateUrl: './passwordSetup.component.html'
    
})
export class PasswordSetupComponent{
       
        private check:boolean=false;

        model = new UserDetailsObject('','');
        personalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
        pwd;
        rpwd;
        status;
    constructor(private oaoService: OAOService,private router:Router){
        console.log("PasswordSetupComponent  constructor()")
                this.personalDetailsObject=this.oaoService.getPersonalDetailsObject();
                console.log(this.oaoService.getPersonalDetailsObject())
    }
    onSubmit(){

        if(this.pwd==this.rpwd)
        {
             this.model.password =this.pwd;
             this.oaoService.registerInternetBanking(this.model).subscribe(
                data => {
                    this.status=data;  
                });
            jQuery('#success-modal').modal('show'); //chandan
        }
    }

    onKeyUp()
    {
        console.log("onKeyUp");

          if(this.pwd==this.rpwd)
        {
            console.log("pwd==rpwd");
             jQuery('#continue').prop('disabled', false);
             jQuery('#rpwd').css('border-color', 'green');
        }else{
            jQuery('#rpwd').css('border-color', 'red');
            jQuery('#continue').prop('disabled', true);
        }

    }

   changeLoginFlag()
  {
      this.oaoService.setLoginFlag(false);

  }

  ngOnInit()
  {
      CommonUtils.activeProgressBar();
       this.oaoService.setLoginFlag(false);
       jQuery('#continue').prop('disabled', true);
       this.oaoService.GetApplicantsDetail(this.personalDetailsObject.application_id).subscribe(
            data => {
                this.model.userId = data.result[0].core_customer_id;
                this.model.userName = data.result[0].core_customer_id;
                this.model.title = data.result[0].title;
                this.model.fName = data.result[0].fname;
                this.model.mName = data.result[0].mname;
                this.model.lName = data.result[0].lname;
                this.model.dob = data.result[0].dob;
                this.model.age=this.getAge((data.result[0].dob)).toString();
                this.model.email = data.result[0].email;
                this.model.mobile = data.result[0].mobile;
                this.model.TFN = data.result[0].tfn
                this.model.exemptionReason = data.result[0].exemption;
                this.model.homeAddress= data.result[0].address;
                this.model.houseNum=data.result[0].housenum;
                this.model.streetName=data.result[0].streetname;
                 this.model.streetNum=data.result[0].streetnum;
                  this.model.postCode=data.result[0].postcode;
                   this.model.state=data.result[0].state;
                    this.model.streetType=data.result[0].streettype;
                     this.model.suburb=data.result[0].suburb;

                    this.model.phouseNum=data.result[0].phousenum;
                this.model.pstreetName=data.result[0].pstreetname;
                 this.model.pstreetNum=data.result[0].pstreetnum;
                  this.model.ppostCode=data.result[0].ppostcode;
                   this.model.pstate=data.result[0].pstate;
                this.model.postalAddress= data.result[0].paddress
                 this.model.pstreetType=data.result[0].pstreettype;
                     this.model.psuburb=data.result[0].psuburb;
            });  
  }
    

    reload(){
         window.location.reload();
    }

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}