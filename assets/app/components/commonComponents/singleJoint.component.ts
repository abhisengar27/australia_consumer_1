import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from "../../validators/commonUtils";

declare var jQuery: any;
@Component({
  selector: 'single-joint',
  templateUrl: './singleJoint.component.html'
})
export class SingleJointComponent implements OnInit {
  model = new PersonalDetailsObject('', '', '', '', '', '', '');
  name: string;
  constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
    console.log("SingleJointComponent constructor()");
    this.model = this.oaoService.getPersonalDetailsObject();
    console.log("Getting model from Object");
    console.log(this.model);
    if (this.model.fname != "") {
      this.name = "Hi.." + this.model.fname;
    }
  }

  public setSingleOrJoint(single_joint: string) {
    this.model.singleORjoint = single_joint;
      this.model.applicant="primary";
    this.oaoService.setPersonalDetailsObject(this.model);
    console.log(this.oaoService.getPersonalDetailsObject());
    if(single_joint=='joint'){
      // jQuery('#jointSwitch').modal('show');
      this.model.jointEmailOrComp = true;
      this.oaoService.setPersonalDetailsObject(this.model);
      this.router.navigate(["../jointApplicants"], { relativeTo: this.route });
    }else{
      this.model.jointEmailOrComp = false;
      this.oaoService.setPersonalDetailsObject(this.model);
    this.router.navigate(["../documentCheck"], { relativeTo: this.route });
    }

  }
  public setJointType(type:string){
if (type == 'yes') {
      this.model.jointEmailOrComp = true;
      this.router.navigate(["../jointApplicants"], { relativeTo: this.route });
    } else {
      this.model.jointEmailOrComp = false;
      this.router.navigate(["../documentCheck"], { relativeTo: this.route });
    }
}
  ngOnInit() {
    CommonUtils.activeProgressBarStep(1);
  }
}
