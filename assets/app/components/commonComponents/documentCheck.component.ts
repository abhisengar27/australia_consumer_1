import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOService } from "../../services/OAO.Service";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
declare var jQuery: any;
declare var Ladda: any;
@Component({
    selector: 'document-check',
    templateUrl: './documentCheck.component.html'
})
export class DocumentCheck implements OnInit {
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public singleORjoint: string;
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private Jointmodel: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private isLoading: boolean = false;
    constructor(private oaoservice: OAOService, private router: Router, private route: ActivatedRoute) {
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        console.log(componenturl);
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        this.model = this.oaoservice.getPersonalDetailsObject();
        console.log("out first", this.model)
        if (this.applicantType == "documentCheck") {
            this.model = this.oaoservice.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        } else {
            this.model = this.oaoservice.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        }
    }
    public ngOnInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
    }

    public setDocumentCheck(is_doc_upload: boolean) {
        this.model.is_doc_upload = is_doc_upload;

        if (is_doc_upload) {

            if (this.model.app_id || this.model.application_id) {

                this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
                return;
            }
            this.isLoading = true;
            if (this.model.singleORjoint == "joint") {
                this.oaoservice.generateApplicationID().subscribe(res => {
                    if (!res.error) {
                        console.log('generated app id ', res.data);
                        this.model.app_id = res.data;
                        this.model.application_id = res.data;
                        this.model.jointEmailOrComp=true;
                        this.model.applicant="primary"
                        this.oaoservice.setPersonalDetailsObject(this.model);
                        this.oaoservice.generateApplicationID().subscribe(res => {
                            if (!res.error) {
                                console.log('generated app id ', res.data);
                                this.Jointmodel.app_id = res.data;
                                this.Jointmodel.application_id = res.data;
                                this.Jointmodel.jointEmailOrComp=true;
                                this.Jointmodel.applicant="secondary"
                                this.oaoservice.setJointPersonalDetailsObject(this.Jointmodel);
                                this.model.secondaryApplicantRefID=this.Jointmodel.application_id;
                                this.oaoservice.setPersonalDetailsObject(this.model);
                            }
                            else {
                                console.log('Error ocurred while generating app id', res.error);
                            }
                        });
                    }
                    else {
                        console.log('Error ocurred while generating app id', res.error);
                    }
                    this.isLoading = false;

                    this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
                });
            } else {
                this.oaoservice.generateApplicationID().subscribe(res => {
                    if (!res.error) {
                        console.log('generated app id ', res.data);
                        this.model.app_id = res.data;
                        this.model.application_id = res.data;
                        this.oaoservice.setPersonalDetailsObject(this.model);
                    }
                    else {
                        console.log('Error ocurred while generating app id', res.error);
                    }
                    this.isLoading = false;

                    this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
                });
            }
        } else {
                        if (this.applicantType == 'documentCheck') {
                this.router.navigate(['../applicantOneComponent'], { relativeTo: this.route });
            } else {
                // this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
                  this.router.navigate(['../fillWithFacebook'], { relativeTo: this.route });
            }

        //     //this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
        //      if (this.model.singleORjoint == "single") {
        //         this.router.navigate(['../fillWithFacebook'], { relativeTo: this.route });
        //     }
        //     else if(this.model.singleORjoint =="joint"){
        //         this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
        //     }
        //     if (this.applicantType == 'documentCheck') {
        //         this.router.navigate(['../applicantOneComponent'], { relativeTo: this.route });
        //     } else {
        //     this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
        // }
    }
    }
}
