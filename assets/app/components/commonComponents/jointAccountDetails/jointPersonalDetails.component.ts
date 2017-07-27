import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service";

@Component({
  selector: 'jointapplicants',
  templateUrl: './jointPersonalDetails.component.html',
  styleUrls: ['./JointAccDetailsCss.css'],
})
export class JointApplicantComponent {

  public test: string = "test";
  public applicantType;
  public urlString;
  public HideShowFlag: boolean;
  public model = new PersonalDetailsObject('', '', '', '', '', '', '');
  constructor(private oaoService: OAOService, private router: Router) {
    this.HideShowFlag = true;

    // this.model=this.oaoService.getPersonalDetailsObject();
  }
  //     public doSomething(date:String) {
  //     // 	console.log("sample");
  //     console.log('Picked date: ', date);
  //     this.test=date;
  //     alert("sampler");
  // }

  public changeOfRoutes() {
    this.urlString = this.router.url;
    var componenturl: string[] = this.urlString.split('/');
    this.applicantType = componenturl[3];
    console.log(this.applicantType);
    this.test = this.applicantType;
    if (this.applicantType === "applicantOneComponent") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "personalContactInfo") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }

    if (this.applicantType === "onlineIdCheck") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "propertyDetails") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "loanDetails") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "personalLoanDetails") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "incomeExpense") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    if (this.applicantType === "assets") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
      if (this.applicantType === "aboutYou") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
       if (this.applicantType === "expense_graph") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
     if (this.applicantType === "documentCheck") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
     if (this.applicantType === "drivingLicenseInfo") {
      this.model = this.oaoService.getPersonalDetailsObject();
    } else {
      this.model = this.oaoService.getJointPersonalDetailsObject();
    }
    console.log("JOint FlagSet Object");
    console.log(this.model);
    console.log("Chck END");
    if (this.model.applicant === "secondary") {
      this.HideShowFlag = false;
    }
  }

}
