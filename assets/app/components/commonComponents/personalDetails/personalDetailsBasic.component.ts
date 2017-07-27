import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { AlphanumericValidator } from "../../../validators/alphanumeric_validator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { CommonUtils } from '../../../validators/commonUtils';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { Observable, Subscription } from 'rxjs/Rx';
declare var jQuery: any;
declare var Ladda: any;
@Component({
    selector: 'personaldetailsbasic',
    templateUrl: './personalDetailsBasic.component.html',
    providers: [DatePipe]
})
export class PersonalDetailsBasicComponent implements AfterViewInit, OnInit {

    public freetext1status: string="false";
    public freetext1label: string;
    public freetext1placeholder: string;
    public freetext2status: string="false";
    public freetext2label: string;
    public freetext2placeholder: string;
    public validation:string;
    public details: any;
    public static previousEmailAddress;
    public static previousMobileNumber;
    public inf_008: String;
    public items: number[] = [];
    public application_id: any;
    public validationerror: any[] = [];
    public date_v = new Date();
    public min_year: number;
    public max_year: number;
    public min_age: number;
    public inf_001: string;
    public configMsg: ConfigDetails;
    public test: boolean;
    public prod_code: string;
    public singleORjoint: string;
    public myForm: FormGroup;
    public isLoading: boolean = false;
    public hold: boolean = false;
    public check: boolean = false;//to display modal
    public checkDupStatus: boolean = false; //chandan
    public userExistingFlag: boolean; //chandan
    public wrn_001: string;
    public model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public jointModel = new PersonalDetailsObject('', '', '', '', '', '', '');
    public jmobile: string;
    public jemail: string;
    public maxDate: string;
    public mobileDup: boolean = false;
    public emailDup: boolean = false;
    public showDateError: boolean = false;
    public isRequired = false;
    public isDisabled = false;
    public isOpenOnFocus = false;
    public isOpen = false;
    public today: Date = new Date();
    public type: string = 'date';
    public types: Array<any> = [
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Date Time', value: 'datetime' }];

    public mode: string = 'auto';
    public modes: Array<any> = [
        { text: 'Auto', value: 'auto' },
        { text: 'Portrait', value: 'portrait' },
        { text: 'Landscape', value: 'landscape' }];

    public container: string = 'inline';
    public containers: Array<any> = [
        { text: 'Inline', value: 'inline' },
        { text: 'Dialog', value: 'dialog' }];

    public date: Date = null;
    public minDate: Date = null;
    // maxDate: Date =  new Date(this.today.getFullYear()-18, this.today.getMonth(), this.today.getDate());
    public ticks = 60;
    public timer;
    public sub: Subscription;
    public sub1: Subscription;
    public resend: boolean = false;
    public resendEmailOTP: boolean = false;
    public showMobileOTPError: boolean = false;
    public verifyEmail: boolean = false;
    public showEmailOTPError: boolean = false;
    public isEmailVerified: boolean = false;

    /*end of md2 component */
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public mobileDupCheck: string;
    public emailDupCheck: string;
    public prod_code_sec_app: string;
    public prod_name_sec_app: string;
    public primaryApplicantID: string;
    public jointType: boolean;
    public dob_valid: number;
    public dob_err: string;
    private applicantOne = new PersonalDetailsObject('', '', '', '', '', '', '');
    private applicantTwo = new PersonalDetailsObject('', '', '', '', '', '', '');

    constructor(private oaoService: OAOService, private router: Router, private fb: FacebookService, private route: ActivatedRoute, private datePipe: DatePipe) {
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        console.log(componenturl);
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log(this.applicantType);
        this.model = this.oaoService.getPersonalDetailsObject();
        this.prod_code = this.model.product_type_code;
        this.prod_code_sec_app = this.model.product_code;
        this.prod_name_sec_app = this.model.product_name;
        this.primaryApplicantID = this.model.application_id;
        this.jointType = this.model.jointEmailOrComp;
        if (this.applicantType === "applicantOneComponent") {
            this.model = this.oaoService.getPersonalDetailsObject();
        } else if (this.applicantType === "applicantTwoComponent") {
            this.mobileDupCheck = this.model.mobile;
            this.emailDupCheck = this.model.email;
            this.model = this.oaoService.getJointPersonalDetailsObject();
            this.model.applicant = "secondary";
            this.model.singleORjoint = "joint";
            this.model.product_type_code = this.prod_code;
            this.model.product_code = this.prod_code_sec_app;
            this.model.product_name = this.prod_name_sec_app;
            this.model.jointEmailOrComp = this.jointType;
            console.log("joint model ", this.model);
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
        }
        jQuery('#content1').css('overflow', 'hidden');
        console.log("PersonalDetailsBasic Component constructor()");
        this.maxDate = this.datePipe.transform(this.today.getFullYear() - this.model.minimumAge + '-' + this.today.getMonth() + '-' + this.today.getDate(), 'yyyy-MM-dd');
        this.oaoService.GetPropertyDetails('commonCodes', 'SAL')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push(data.result[i].property_desc);
                }
            }
            );
        this.oaoService.getFreeFieldDetails().subscribe(
            (data: any) => {
                console.log(data.result);
                console.log("status", this.freetext1status);
                try {

                
                this.freetext1label = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext1'][0].label
                this.freetext1placeholder = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext1'][0].placeholder
                this.freetext1status = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext1'][0].status
                 this.freetext2label = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext2'][0].label
                this.freetext2placeholder = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext2'][0].placeholder
                this.freetext2status = data.result[0][this.model.product_type_code][0]['section_1'][0]['basic'][0]['freetext2'][0].status
               
                console.log("status", this.freetext1status)
                }catch(e){
                    console.log(e);
                }
            }
        );
        if (this.model.dob) {
            this.model.dob = this.datePipe.transform(this.model.dob, 'yyyy-MM-dd');
        }
        if (this.jointModel.dob) {
            this.jointModel.dob = this.datePipe.transform(this.jointModel.dob, 'yyyy-MM-dd');
        }
        if (this.model.postcode == undefined) {
            this.model.postcode = "0000";
            this.model.ppostcode = "0000";
        }
        if (this.model.application_id != undefined) {
            this.hold = true;
        }
        console.log(this.model);

        this.min_age = 0;
        this.test = false;
        this.date_v = new Date();
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'MIN_YEAR')
            .subscribe(
            data => {
                this.min_year = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'DOB')
            .subscribe(data => {
                this.min_age = data.result[0].property_value;
                var mon = this.date_v.getMonth() + 1;
                var year = this.date_v.getFullYear() - this.min_age;
                this.max_year = year;
            });
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_008')
            .subscribe(
            data => {
                this.inf_008 = data.result[0].property_value;
            }
            );

        if (this.model.title === null || this.model.title === '') {
            this.model.title = '0';
        }

        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }
    public handleError(error) {
        console.error('Error processing action', error);
    }
    public openDatepicker() {
        this.isOpen = true;
        setTimeout(() => {
            this.isOpen = false;
        }, 1000);
    }
    public fillwithFB() {
        console.log('Initializing Facebook');
        this.fb.login()
            .then((res: LoginResponse) => {
                console.log('Logged in', res);
                //to get profile data
                this.fb.api('/me', 'get', { fields: ['first_name', 'last_name', 'birthday', 'id', 'email', 'location'] })
                    .then((res: any) => {
                        console.log('Got the users profile', res);
                        if (res.first_name == null) { } else { this.model.fname = res.first_name; }
                        if (res.last_name == null) { } else { this.model.lname = res.last_name; }
                        if (res.email == null) { } else { this.model.email = res.email; }
                        if (res.birthday == null) { } else { this.model.dob = res.birthday; }
                        if (res.location == null) { } else { this.model.address = res.location; }
                        this.oaoService.setData(this.model);

                    })
                    .catch(this.handleError);
            })
            .catch(this.handleError);
    }

    public onSubmit() {
        var formatedDate = this.datePipe.transform(this.model.dob, 'MM/dd/yyyy');
        this.model.dob = formatedDate;
        formatedDate = this.datePipe.transform(this.maxDate, 'MM/dd/yyyy');
        this.maxDate = formatedDate;

        var parts = this.maxDate.split("/");
        var partsOfDob = this.model.dob.split("/");
        if ((partsOfDob[2] > parts[2]) || (partsOfDob[2] == parts[2] && partsOfDob[0] > parts[0]) || (partsOfDob[0] == parts[0] && partsOfDob[1] > parts[1])) {
            this.showDateError = true;
            return;
        }
        this.showDateError = false;
        this.model.sec_1_v = false;
        console.log("onsubmit()");
       

        if (this.userExistingFlag) {
            console.log("existing user directly creating appliction")
            this.model.existing_cust_status = "Y";

            if (this.model.singleORjoint == 'joint' && this.model.jointEmailOrComp == false && this.model.applicant == "primary") {

                this.enableJointApplication();
            } else {
                this.submitSection();
            }
        }
        else {
            this.model.existing_cust_status = "N";
            console.log("New  user ")
            if (!this.oaoService.getCallMatchingCustomerFlag()) {
                console.log("checkMatchingCustomer() called");
                this.oaoService.checkMatchingCustomer(this.model)
                    .subscribe(data => {
                        if (data.status) {
                            jQuery('#matching-customer-modal').modal('show');
                        }
                        else {
                            this.oaoService.setCallMatchingCustomerFlag(true);
                            if (this.model.singleORjoint == 'joint' && this.model.jointEmailOrComp == false && this.model.applicant == "primary") {

                                this.enableJointApplication()
                            } else {
                                this.submitSection();
                            }

                        }
                    });
            }
            else {
                console.log("checkMatchingCustomer() not called");
                if (this.model.singleORjoint == 'joint' && this.model.jointEmailOrComp == false && this.model.applicant == "primary") {

                    this.enableJointApplication()
                } else {

                    this.submitSection();
                }
            }
        }

        if (this.applicantType === "applicantOneComponent") {
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType === "applicantTwoComponent") {
            this.oaoService.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoService.setPersonalDetailsObject(this.model);
        }
    }

    public checkMobileDup() {
        if (this.model.jointEmailOrComp == true) {
            if (this.model.mobile === this.mobileDupCheck) {
                this.mobileDup = true;
            } else {
                this.mobileDup = false;
            }
        } else {
            if (this.model.mobile === this.jointModel.mobile) {
                this.mobileDup = true;
            } else {
                this.mobileDup = false;
            }
        }

    }
    public checkEmailDup() {
        if (this.model.jointEmailOrComp == true) {
           if (this.model.email === this.emailDupCheck) {
                this.emailDup = true;
            } else {
                this.emailDup = false;
            }
        } else {
            if (this.model.email === this.jointModel.email) {
                this.emailDup = true;
            } else {
                this.emailDup = false;
            }
        }
    }
    public setJointType(type: string) {
        if (type === 'yes') {
            this.model.jointEmailOrComp = true;
            this.router.navigate(["../jointApplicants/applicantOneComponent"], { relativeTo: this.route });
        } else {
            this.model.jointEmailOrComp = false;
            // this.router.navigate(["../../../personalBasicInfo"]);
        }
    }
    public enableJointDiv(val: string) {
        this.model.singleORjoint = val;
        if (val === 'joint') {
            this.model.jointEmailOrComp = true;
            // jQuery('#jointSwitch').modal('show');
            this.router.navigate(["../jointApplicants/applicantOneComponent"], { relativeTo: this.route });
        } else {
            this.model.jointEmailOrComp = false;
            this.router.navigate(["/completeInformation/personalBasicInfo"]);
        }
    }
        public back() {
       if (this.model.drivinglicense != null && this.model.jointEmailOrComp == true) {
            this.router.navigate(['../drivingLicenseInfoTwo'], { relativeTo: this.route });
        } else if (this.model.drivinglicense != null && this.model.jointEmailOrComp == false) {
            this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
        // }
        // else if (this.model.drivinglicense == null && this.model.singleORjoint == 'single') {
        //    this.router.navigate(['../fillWithFacebook'], { relativeTo: this.route });
         } else if (this.model.drivinglicense == null) {
             this.router.navigate(['../documentCheck'], { relativeTo: this.route });
         }
    }
    public enableJointApplication() {
        var JointformatedDate = this.datePipe.transform(this.jointModel.dob, 'MM/dd/yyyy');
        this.jointModel.dob = JointformatedDate;
        this.jointModel.product_code = this.model.product_code;
        this.jointModel.product_name = this.model.product_name;
        this.jointModel.product_type_code = this.model.product_type_code;
        // this.jointModel.email=this.jemail;
        // this.jointModel.mobile=this.jmobile;
        this.jointModel.primaryApplicantName = this.model.fname + " " + this.model.lname;
        this.jointModel.applicant = "secondary";
        this.jointModel.singleORjoint = "joint";
        console.log(this.jointModel);
        switch (this.model.product_type_code) {
            case 'SAV': this.oaoService.OAOCreateOrUpdateApplicant(this.jointModel)
                .subscribe(
                data => {
                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        // for (var j = 0; j < data.Result.length; j++) {
                        //   //  this.validationerror.push(data.Result[j].msg);
                        // }
                       // this.validationerror.push("sasa");
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        //this.validationerror = [];
                        jQuery("#validation").hide();
                    this.model.secondaryApplicantRefID = data.Result.application_id;
                    this.jointModel.application_id = data.Result.application_id;
                    this.oaoService.setJointPersonalDetailsObject(this.jointModel);
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.submitSection();
                    }
                });
                break;
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.jointModel)
                .subscribe(
                data => {
                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        // for (var j = 0; j < data.Result.length; j++) {
                        //   //  this.validationerror.push(data.Result[j].msg);
                        // }
                       // this.validationerror.push("sasa");
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        //this.validationerror = [];
                        jQuery("#validation").hide();
                    this.model.secondaryApplicantRefID = data.Result.application_id;
                    this.jointModel.application_id = data.Result.application_id;
                    this.oaoService.setJointPersonalDetailsObject(this.jointModel);
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.submitSection();
                    }
                });
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.jointModel)
                .subscribe(
                data => {
                    this.model.secondaryApplicantRefID = data.Result.application_id;
                    this.jointModel.application_id = data.Result.application_id;
                    this.oaoService.setJointPersonalDetailsObject(this.jointModel);
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.submitSection();

                });
                break;
            default: console.log("Page not found");

        }

    }
    public changeCallMatchingCustomerFlag() {
        this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    }
    public submitSection() {

        console.log("inside submit section");

        console.log(this.model);
        this.isLoading = !this.isLoading;
        this.model.app_id = this.model.application_id;
        if (this.applicantType === "applicantOneComponent") {
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType === "applicantTwoComponent") {
            console.log("check for joint record for insert");
            this.oaoService.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoService.setPersonalDetailsObject(this.model);
        }
        switch (this.model.product_type_code) {
            case 'SAV': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        jQuery("#validation").hide();
                        this.check = true;
                        // if (this.hold === false) {

                        //     this.showSave();
                        // }
                        // if (this.hold === true) {
                        //     if (PersonalDetailsBasicComponent.previousEmailAddress != this.model.email || PersonalDetailsBasicComponent.previousMobileNumber != this.model.mobile) {
                        //         this.showSave();
                        //         return;
                        //     }
                        //     this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        // }
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            console.log("in secondary");
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            //  console.log("secondary routing");

                            this.applicantOne = this.oaoService.getPersonalDetailsObject();
                            this.applicantOne.secondaryApplicantRefID = this.model.application_id;
                            this.oaoService.OAOCreateOrUpdateApplicant(this.applicantOne)
                                .subscribe((data) => {
                                    console.log("got updated");
                                }, (error) => {

                                }, () => {
                                    this.oaoService.setPersonalDetailsObject(this.applicantOne);
                                    if (this.hold === false) {
                                        this.showSave();
                                    }

                                    if (this.hold === true) {
                                        if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                            this.showSave();
                                            return;
                                        }
                                        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                                    }
                                });

                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                this.showSave();
                                return;
                            }
                            this.router.navigate(['../applicantTwoComponent'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            if (this.hold === false) {
                                this.showSave();
                            }
                            if (this.hold === true) {
                                if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                    this.showSave();
                                    return;
                                }
                                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                            }
                        }

                    }
                });
                break;
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                .subscribe(
                data => {
                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        jQuery("#validation").hide();
                        this.check = true;

                        // if (this.hold == false) {
                        //     this.showSave();
                        // }
                        // if (this.hold == true) {
                        //     this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        // }
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            console.log("in secondary");
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            this.applicantOne = this.oaoService.getPersonalDetailsObject();
                            this.applicantOne.secondaryApplicantRefID = this.model.application_id;
                            this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.applicantOne)
                                .subscribe((data) => {
                                    console.log("got updated");
                                }, (error) => {

                                }, () => {
                                    this.oaoService.setPersonalDetailsObject(this.applicantOne);
                                    if (this.hold === false) {
                                        this.showSave();
                                    }

                                    if (this.hold === true) {
                                        if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                            this.showSave();
                                            return;
                                        }
                                        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                                    }
                                });

                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                this.showSave();
                                return;
                            }
                            this.router.navigate(['../applicantTwoComponent'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            this.check = true;

                            if (this.hold == false) {
                                this.showSave();
                            }
                            if (this.hold == true) {
                                if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                    this.showSave();
                                    return;
                                }
                                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                            }
                        }
                    }
                });
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        jQuery("#validation").hide();
                        this.check = true;
                        // if (this.hold == true) {
                        //     if (PersonalDetailsBasicComponent.previousEmailAddress != this.model.email || PersonalDetailsBasicComponent.previousMobileNumber != this.model.mobile) {
                        //         this.showSave();
                        //         return;
                        //     }
                        //     this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        // }
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            this.applicantOne = this.oaoService.getPersonalDetailsObject();
                            this.applicantOne.secondaryApplicantRefID = this.model.application_id;
                            this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.applicantOne)
                                .subscribe((data) => {
                                    console.log("got updated");
                                }, (error) => {

                                }, () => {
                                    this.oaoService.setPersonalDetailsObject(this.applicantOne);
                                    if (this.hold == false) {
                                        this.showSave();
                                    }

                                    if (this.hold == true) {
                                        if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                            this.showSave();
                                            return;
                                        }
                                        this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                                    }
                                });

                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                this.showSave();
                                return;
                            }
                            this.router.navigate(['../applicantTwoComponent'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            this.check = true;

                            if (this.hold === false) {
                                this.showSave();
                            }
                            if (this.hold === true) {
                                if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email || PersonalDetailsBasicComponent.previousMobileNumber !== this.model.mobile) {
                                    this.showSave();
                                    return;
                                }
                                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                            }
                        }
                    }
                    
                });
                break;
            default: console.log("Page not found");

        }

    }//submitSection1

    public checkOTP() {
        this.oaoService.checkOTP(this.model.mobileOTP).subscribe(data => {
            console.log("verify: ", data);
            if (data.success) {
                this.verifyEmail = true;
                if(this.isEmailVerified == false){
                this.sendOTPToVerifyEmail();
                }
                //jQuery('#verifyMobile').modal('hide');
            }
            else {
                this.showMobileOTPError = true;
            }
        });
    }
    public showSuccessModal() {
        jQuery('#verifyMobile').modal('hide');
        if (this.applicantType === "applicantOneComponent") {
            this.router.navigate(['../applicantTwoComponent'], { relativeTo: this.route });
        } else if (this.applicantType === "applicantTwoComponent") {
            if (this.hold) {
                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
            }
            else {
                jQuery('#success').modal('show');
            }
        } else {
            if (this.hold) {
                this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
            }
            else {
                jQuery('#success').modal('show');
            }
        }
    }
    public checkEmailOTP() {

        this.oaoService.checkOTP(this.model.emailOTP).subscribe(data => {
            if (data.success) {

                this.isEmailVerified = true;
                // this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });

            } else {
                this.showEmailOTPError = true;
            }
        });
    }
    public tickerFunc(tick) {
        this.ticks -= 1;
        if (this.ticks <= 0) {

            //if (this.verifyEmail == false) {
            this.resend = true;
            this.sub.unsubscribe();
            // }
            // else{
            //   this.resendEmailOTP = true;
            //  this.sub1.unsubscribe();
            // }
            this.ticks = 60;
        }
    }
    public sendOTPToVerifyMobile() {
        this.oaoService.getOTPToVerifyMobileNumber(this.model.mobile).subscribe(data => {
            console.log("OTP mobile: ", data);
        });
        if (this.sub) {
            this.sub.unsubscribe();
            this.ticks = 60;
        }
        this.resend = false;
        this.timer = Observable.timer(1000, 1000);
        this.sub = this.timer.subscribe(t => this.tickerFunc(t));

    }
    public sendOTPToVerifyEmail() {
        this.oaoService.getOTPToVerifyEmail(this.model.email, this.model.fname).subscribe(data => {
            console.log("OTP email: ", data);
        });
        this.resend = false;
        if (this.sub) {
            this.sub.unsubscribe();
            this.ticks = 60;
        }
        this.timer = Observable.timer(1000, 1000);
        this.sub = this.timer.subscribe(t => this.tickerFunc(t));

    }
    public hideVerificationModal() {
        jQuery('#verifyMobile').modal('hide');
        this.isLoading = false;
    }
    public showSave() {
        if (this.check == true) {
            jQuery('#verifyMobile').modal('show');
            this.showEmailOTPError = false;
            this.showMobileOTPError = false;
            this.model.mobileOTP = undefined;
            this.model.emailOTP = undefined;
            if (PersonalDetailsBasicComponent.previousEmailAddress !== this.model.email && this.hold && PersonalDetailsBasicComponent.previousMobileNumber == this.model.mobile) {
                this.verifyEmail = true;
            }
            if (PersonalDetailsBasicComponent.previousMobileNumber != this.model.mobile) {
                PersonalDetailsBasicComponent.previousMobileNumber = this.model.mobile;
                if( this.hold && PersonalDetailsBasicComponent.previousEmailAddress==this.model.email){
                    this.isEmailVerified= true;
                }
                this.verifyEmail = false;
                this.sendOTPToVerifyMobile();
            }
            if (PersonalDetailsBasicComponent.previousEmailAddress != this.model.email) {
                PersonalDetailsBasicComponent.previousEmailAddress = this.model.email;
                this.isEmailVerified = false;
                if (this.verifyEmail == true) {
                    this.sendOTPToVerifyEmail();
                }
            }
            //jQuery('#success').modal('show');
        }
    }

    public laddaclose() {
        this.isLoading = false;
    }

    public ngOnInit() {
        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.activeProgressBar();
        CommonUtils.completedProgressBarStep(0);
        //for fb data
        if (this.oaoService.getFbData() == true) {
            console.log("fb")
            this.model = this.oaoService.getData();
            if (this.model.title == null || this.model.title == '') {
                this.model.title = '0';
            }
        }
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_001')
            .subscribe(
            data => {
                this.inf_001 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_001')
            .subscribe(
            data => {
                this.wrn_001 = data.result[0].property_value;
            }
            );


        //chandan
        console.log("PersonaldetailsBasicComponent ngOnInit()")
        this.userExistingFlag = this.oaoService.getUserExistingFlag();
        if (this.userExistingFlag) //pre-populating userDetails
        {
            console.log("Existing User ");
            jQuery('#title').attr("style", "pointer-events: none;");
            this.isDisabled = true;
            jQuery('#fname,#mname,#lname,#email,#mobile').attr('readonly', 'true');
        }
        else {
            console.log("New User")
        }
        //chandan

        this.test = true;


    }

    public clear() {
        console.log("clear");
    }

    public dispDate(dob: any) {
        this.model.dob = dob;
    }
    public ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));

        if (!this.userExistingFlag) {
            jQuery('select:first').focus();
        }
        var options = {
            format: "dd/mm/yyyy",
        };
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#dob', function () {
            jQuery('#dob').trigger('click');
        });
    }

    public onClickOfPage1() {
        console.log("onClickOfPage1()");
        jQuery("#page1").animate({ 'marginTop': "-=45%" }, "slow", "linear");
    }

}
