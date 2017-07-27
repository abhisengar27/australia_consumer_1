import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface";
import { OAOService } from "../services/OAO.Service";


declare var jQuery: any;
@Component({
  selector: 'complete-information',
  templateUrl: './completeInformation.component.html'
})
export class CompleteInformationComponent  implements OnInit, AfterViewInit{
	
	private setProductBckColor:any;
		
private setProductBtnColor:any;

  private model: PersonalDetailsObject  = new PersonalDetailsObject('', '', '', '', '', '', '');

  private stepStatus: string[] = [];
  // private width1: String = '0';
  // private width2: String = '0';
  private constWidth: number = 25;
  private sectionCount: number = 4;

  private limit1: number = 0;
  private width1: number = 0;
  private limit2: number = -25;
  private width2: number = 0;
  private id1;
  private id2;
  private idn;
  private progressBarConfig;
public validationerror:any[] =[];

 ascFrame1() {
    if (this.width1 >= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1++;
    }
  }

moveForward1() {
   this.limit1 += this.constWidth;
  this.id1 = setInterval(()=>{this.ascFrame1();}, 10);

}

ascFrame2() {


    if (this.width2 >= this.limit2) {
      console.log("Clear interval 2");
      clearInterval(this.idn);
      return;
    }
    else {
      this.width2++;
    }
  }

moveForward2() {
	this.limit2 += this.constWidth;

  this.idn = setInterval(()=>{this.ascFrame2();}, 25);


}


descFrame1() {
    if (this.width1 <= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1--;
    }
  }


moveBack1() {

	this.limit1-=this.constWidth;
  this.id1 = setInterval( ()=>{ this.descFrame1(); }, 10);

}



 descFrame2() {

    if (this.width2 <= this.limit2) {
      clearInterval(this.id2);
    } else {

      this.width2--;

    }

  }

moveBack2() {

  this.limit2 -=this.constWidth;
  if(this.width2 == 0){
    return;
  }
  var id2 = setInterval(() => { this.descFrame2(); }, 25);

}





  updateProgressBar(data: string[]){

      this.stepStatus = data;

      if(data[this.sectionCount] == 'Y'){
        this.moveForward1();
        this.moveForward2();
      }
      if(data[this.sectionCount + 1] == 'Y'){
        this.moveBack1();
        this.moveBack2();
      }

  }


  constructor(private oaoService: OAOService, private router: Router)
  {
	  
	  var customeStyleRecord=this.oaoService.getCustomeStyleGetter();
	// 		  this.setProductBckColor={
	// 	'background':customeStyleRecord.background_color
	// };
	
	// this.setProductBtnColor={
	// 	'background':customeStyleRecord.bck_btn_color
	// };
      jQuery('#content1').css('overflow','hidden');
      //console.log("CompleteInformationComponent constructor()");
      this.model=this.oaoService.getPersonalDetailsObject();

       console.log("0.1");
       console.log("adminID from model---"+ this.model.adminId);
       console.log("asmind isd is=====" + this.model.adminId);
       console.log(this.model);
       if(!this.oaoService.getResumeStatus()){
        this.oaoService.getConfigByKey(this.model.product_type_code,"null","null")
            .subscribe((response) => {
               this.progressBarConfig = JSON.parse(JSON.stringify(response.data));
               this.sectionCount = Object.keys(this.progressBarConfig).length;
               this.constWidth = 100/this.sectionCount;
               this.limit2 = -1*this.constWidth;
            });
       }
       else{
               this.sectionCount = this.model.sectionCount;
               this.progressBarConfig = this.model.progressBarConfig;
               console.log("Resume section count is ", this.sectionCount);
               this.constWidth = 100/this.sectionCount;
                console.log("stepstatus",this.stepStatus);
                this.limit1 = parseInt(this.stepStatus[this.sectionCount]);
                this.limit2 = this.limit1-this.constWidth;
       }
      console.log(this.model);
  }
  ngOnInit(){
    jQuery('.number-progress-bar ul').children().find('span.stepvalue').eq(0).addClass('active');
  }
  ngAfterViewInit() {
    if(this.oaoService.getResumeStatus()){
       this.moveForward1();
      this.moveForward2();
      this.oaoService.setResumeStatus(false);
    }

  }
  closeValidation()
{
  console.log("sa");
  jQuery("#validation").hide();
  
}

}
