import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service";
import { CommonUtils } from '../../../validators/commonUtils';
import { GoogleAnalyticsEventsService } from "../../../services/GoogleAnalyticsEvents.Service";
declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'taxinfo',
    templateUrl: './taxInformation.component.html'

})
export class TaxInformationComponent implements OnInit {
    public freetext1status: string = "false";
    public freetext1label: string;
    public freetext1placeholder: string;
    public freetext2status: string = "false";
    public freetext2label: string;
    public freetext2placeholder: string;
    public tfnval = '';
    public reasonval = '';
    public items: any[] = [];
    public nextflag: boolean = true;
    public idCheck_v: string;
    public wrn_002: string;
    public wrn_003: string;
    public inf_002: string;
    public inf_003: string;
    public skip: boolean = false;
    public section_2: boolean;
    public prod_type: string;
    public err: string;
    public prod_code: string;
    public configMsg: ConfigDetails;
    public NA: string;
    public isLoading: boolean = false;
    public userExistingFlag: boolean; //chandan
    public model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model1 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model2 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public inf_loan: string;
    public verification_auto: boolean;
    private flagStatus:string;
    public urlString: any;
    public applicantType: string;
    public product_type: string;
    public product_code: string;
    public singleORjoint: string;
    public applicantTypeNormalFunc: string;
    public updateSec_id: string;
    //public onboard_auto: boolean
    private check: boolean = false;
    private hold: boolean = false;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService) {
        console.log("TaxInformationComponent constructor()");
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log(this.applicantType);
        console.log("TaxInformationComponent constructor()");
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.applicantType === "taxInformation") {
            console.log("comp 1");
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        } else if (this.applicantType === "taxInformationTwo") {
            console.log("comp 2");
            this.model = this.oaoService.getJointPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        } else {
            console.log("default");
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        }
        this.oaoService.getFreeFieldDetails().subscribe(
            (data: any) => {
                try {
                    this.freetext1label = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext1'][0].label
                    this.freetext1placeholder = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext1'][0].placeholder
                    this.freetext1status = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext1'][0].status
                    this.freetext2label = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext2'][0].label
                    this.freetext2placeholder = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext2'][0].placeholder
                    this.freetext2status = data.result[0][this.model.product_type_code][0]['section_2'][0]['taxinfo'][0]['freetext2'][0].status

                    console.log("status", this.freetext1status);
                } catch (e) {
                    console.log(e);
                }
            }
        )
        if ((this.model.exemption != undefined || this.model.exemption != undefined) && (this.model.tfn == null || this.model.tfn == '' || this.model.tfn == undefined)) {
            console.log("inside tfn dissable")
            console.log(this.model.exemption != '0');

            this.reasonval = "abc";
        }
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan     
        this.NA = null;
        this.oaoService.getConfig()
            .subscribe((data) => {
                this.configMsg = JSON.parse(JSON.stringify(data.data));
            });
        this.oaoService.getProductDetails(this.model.product_code).subscribe(
            data => {
                console.log("product details", data[0]);
                console.log(data[0].verification_mode);
                this.verification_auto = data[0].verification_mode;
            }
        );

        this.flagStatus = "yes"
    }

    public tfnfunc(event: any) { // without type info
        console.log("tfnfunc()");
        this.tfnval = event.target.value;
        // this.model.exemption = '0'
        // this.err = "";
    }

    public reasonfunc(event: any) { // without type info
        console.log("reasonfunc()");
        this.gaEventsService.emitEvent('OAO_TaxInformation', this.model.tfn, event.target.value, 5);
        if (event.target.value == '0') {
            this.reasonval = '';
            // this.err = "";
            // this.model.exemption = '0'
        }
        else {
            this.reasonval = event.target.value;
            // this.model.exemption = '0'
            // this.err = "";
        }

    }
    public clear() {
        this.oaoService.setPersonalDetailsObject(null);
        this.oaoService.setLoginFlag(false);//chandan
        this.oaoService.setUserExistingFlag(false);//chandan
        window.location.href = this.oaoService.baseURL;
    }

    public reload() {
        window.location.href = this.oaoService.baseURL;
    }
    public onSubmit() {

        CommonUtils.completedProgressBarStep(2);
        this.isLoading = !this.isLoading;
        if (this.model.skip == false) {
            this.model.skip = false;
        } else {
            this.model.skip = true;
        }

        if ((this.model.tfn == null || this.model.tfn == "") && this.model.exemption == '0') {
            console.log(1);
            this.err = "err";
            return;
        }
        else {
	this.model.pageName="taxInfo";
            if (this.applicantType === "taxInformation") {
                console.log("primary called ");
                this.oaoService.setPersonalDetailsObject(this.model);
            } else if (this.applicantType === "taxInformationTwo") {
                console.log("secondary called ");
                this.oaoService.setJointPersonalDetailsObject(this.model);
            } else {
                this.oaoService.setPersonalDetailsObject(this.model);
            }
            console.log("Tax info Personal data", this.model);
            this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);

                    if (data.message == "Failed") {
                        console.log("validation failed", data.Result);
                        this.isLoading = false;
                        jQuery("#validation").modal('show');
                    }
                    else {
                        jQuery("#validation").hide();
                        if (this.model.applicant === "primary" && this.model.jointEmailOrComp === true) {
                            console.log("move to secondary with ");
                            this.router.navigate(["../taxInformationTwo"], { relativeTo: this.route });
                        } else {
                            this.check = true;
                            if (this.idCheck_v === "O") {
                                if (this.userExistingFlag) {
                                    this.getAccno();
                                } else {
                                    this.showSave();
                                }
                            }
                            else if (this.idCheck_v === "M") {
                                if (this.model.product_code === 'EVR') {
                                    this.router.navigate(["../onlineIdCheck"], { relativeTo: this.route });
                                }
                            }
                            else {
                                this.getAccno();
                            }
                        }
                    }
                });
        }
    }

    public showSave() {
        if (this.check === true) {
            jQuery('#onlineid-check').modal('show');
        }
    }
    public updateSection() {
        this.model.pageName="";
        CommonUtils.removeMobileProgressBar(1);
        // this.router.navigate(['../personalContactInfo'], {relativeTo: this.route});
        // this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
        //     data => {
        //         console.log("updated");
        //         this.router.navigate(["../personalContactInfo"], { relativeTo: this.route });
        //     }
        // );
        if (this.applicantType === "taxInformation") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else if (this.applicantType === "taxInformationTwo") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        }
        this.oaoService.updatesection("section_1", this.updateSec_id).subscribe(
            data => {
                console.log("updated");
                if (this.applicantType === "taxInformation") {
                    this.router.navigate(["../personalContactInfoTwo"], { relativeTo: this.route });
                } else if (this.applicantType === "taxInformationTwo") {
                    this.router.navigate(["../taxInformation"], { relativeTo: this.route });
                } else {
                    this.router.navigate(["../personalContactInfo"], { relativeTo: this.route });
                }
            }
        );
    }

    public ngOnInit() {
        jQuery('input:visible:first').focus();
        jQuery('#mlogin').hide();//chandan
        CommonUtils.activeProgressBar();
        CommonUtils.completedProgressBarStep(1);
        this.oaoService.GetPropertyDetails('commonCodes', 'EXRSN')
            .subscribe(data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    });
                }
            });

        this.model.skip = this.skip;
        //chandan
        if (this.userExistingFlag) {
            jQuery('#reb').hide();//chandan
            jQuery('#mlogin').show();//chandan
            jQuery('#exemption').attr("style", "pointer-events: none;");
            jQuery('#tfn').attr('readonly', 'true');
        }
        //chandan
        if (this.model.exemption == null) {
            this.NA = null;
            this.model.exemption = '0';
        }
        if (this.applicantType === "taxInformation") {
            console.log("comp 1");
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType === "taxInformationTwo") {
            console.log("comp 2");
            this.oaoService.setJointPersonalDetailsObject(this.model);
        } else {
            console.log("default");
            this.oaoService.setPersonalDetailsObject(this.model);
        }
        //for idCheck
        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(data);
            }
            );
        //warning message 002
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );
        //warning message 003
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_003')
            .subscribe(
            data => {
                this.wrn_003 = data.result[0].property_value;
            }
            );
        //Info message 002
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_002')
            .subscribe(
            data => {
                this.inf_002 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );
    }//ngOnInit

    public ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
    }

    public getAccno() {
        CommonUtils.activeMobileProgressBar(3);
        if (this.applicantType === "taxInformation") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.model.app_id = this.model.application_id;
        } else if (this.applicantType === "taxInformationTwo") {
            this.model = this.oaoService.getJointPersonalDetailsObject();
            this.model.skip = true;
            this.model.app_id = this.model.application_id;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.model.skip = true;
            this.model.app_id = this.model.application_id;
        }
        this.model.verification_auto = this.verification_auto;
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
            });
        // this.oaoService.OAOCreateOrUpdateApplicant(this.model)
        //     .subscribe(
        //     data => {
        //         this.oaoService.GetApplicantsDetail(this.model.application_id)
        //             .subscribe(
        //             data => {
        //                 if (data.message === "Failed") {
        //                     console.log("validation failed", data.Result);
        //                     this.isLoading = false;
        //                     jQuery("#validation").modal('show');
        //                 }
        //                 else {
        //                     //this.validationerror = [];
        //                     jQuery("#validation").hide();
        //                     console.log("Account Details:")
        //                     console.log(data.result[0])
        //                     this.model = data.result[0];
        //                     this.oaoService.setPersonalDetailsObject(this.model);
        //                     // if (this.idCheck_v == "O") {
        //                     //     jQuery('#success').modal('show');
        //                     // }
        //                     // if (this.idCheck_v == "N") {
        //                     //     jQuery('#success').modal('show');
        //                     // }

        //                     if (data.result[0].application_status === 'ONB') {
        //                         jQuery('#success').modal('show');
        //                     } else {
        //                         jQuery('#success_loan').modal('show');
        //                     }
        //                 }
        //             });
        //     });
        if (this.singleORjoint === 'single') {

            this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    this.oaoService.GetApplicantsDetail(this.model.application_id)
                        .subscribe(
                        data => {
                            if (data.message === "Failed") {
                                console.log("validation failed", data.Result);
                                this.isLoading = false;
                                jQuery("#validation").modal('show');
                            }
                            else {
                                jQuery("#validation").hide();
                                console.log("Account Details:");
                                console.log(data.result[0]);
                                this.model = data.result[0];
                                this.oaoService.setPersonalDetailsObject(this.model);

                                if (data.result[0].application_status === 'ONB') {
                                    jQuery('#success').modal('show');
                                } else {
                                    jQuery('#success_loan').modal('show');
                                }
                            }

                        });
                });

        } else {
            const promise = new Promise((resolve, reject) => {
                this.model1 = this.oaoService.getPersonalDetailsObject();
                this.model1.skip = true;
                this.oaoService.OAOCreateOrUpdateApplicant(this.model1)
                    .subscribe(
                    data => {
                        this.oaoService.GetApplicantsDetail(this.model1.application_id)
                            .subscribe(
                            data => {
                                if (data.message === "Failed") {
                                    console.log("validation failed", data.Result);
                                    this.isLoading = false;
                                    jQuery("#validation").modal('show');
                                }
                                else {
                                    jQuery("#validation").hide();
                                    console.log("Account Details:");
                                    console.log(data.result[0]);
                                    this.model1 = data.result[0];
                                }
                            });
                    });
                resolve();
            });
            const promise1 = new Promise((resolve, reject) => {
                this.model2 = this.oaoService.getJointPersonalDetailsObject();
                this.model2.skip = true;
                this.oaoService.OAOCreateOrUpdateApplicant(this.model2)
                    .subscribe(
                    data => {
                        this.oaoService.GetApplicantsDetail(this.model2.application_id)
                            .subscribe(
                            data => {
                                console.log("Account Details:");
                                console.log(data.result[0]);
                                this.model2 = data.result[0];
                                if (data.message === "Failed") {
                                    console.log("validation failed", data.Result);
                                    this.isLoading = false;
                                    jQuery("#validation").modal('show');
                                }
                                else {
                                    jQuery("#validation").hide();
                                    console.log("Account Details:");
                                    console.log(data.result[0]);
                                    this.model2 = data.result[0];
                                    this.oaoService.setPersonalDetailsObject(this.model2);

                        if (data.result[0].application_status == 'ONB') {
                            jQuery('#success').modal('show');
                        } else {
                            jQuery('#success_loan').modal('show');
                        }
                    }
                    });
            });
                resolve();
            });
        }
    }//getAccno() 

    public moveToNetBankingReg() {
        CommonUtils.completedProgressBarStep(3);
    }

    setNextFlag(flag){
        this.flagStatus = flag;
    }

}