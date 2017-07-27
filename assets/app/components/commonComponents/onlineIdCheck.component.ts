import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { OAOService } from "../../services/OAO.Service"
import { CommonUtils } from '../../validators/commonUtils';
import {GoogleAnalyticsEventsService } from "../../services/GoogleAnalyticsEvents.Service";
//import { CrossSellDetailsObject } from "../../interfaces/crossSellDetails.interface";
declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'onlineidcheck',
    templateUrl: './onlineIdCheck.component.html',
    providers: [DatePipe]

})
export class OnlineIdCheckComponent implements OnInit {

    public model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public crossmodel = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model1 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model2 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public items: any[] = [];
    public cardColor: any[] = [];
    public idCheck_v: string;
    public inf_002: string;
    public inf_006: string;
    public inf_007: string;
    public passport_check: string;
    public DL_check: string;
    public Medicare_check: string;
    public max_year: number;
    public inf_003: string;
    public wrn_002: string;
    public application_id: any;
    public configMsg: ConfigDetails;
    public prod_type: string;
    public product_type_code: string;
    public cs_product_type_code: string;
    public inf_loan: string;
    public date_v = new Date();
    public isLoading: boolean = false;
    public products: Array<any> = [];
    public isCrossSell: boolean;
    public isAdmin: boolean;
    public inf_code: string = '';
    public verification_auto: boolean;
    //public onboard_auto:boolean
    public isRequired = false;
    public isDisabled = false;
    public isOpenOnFocus = false;
    public isOpen = false;
    public today: Date = new Date();
    public ype: string = 'date';
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
    public maxDate: string;
    public file_type: string;
    public state: any[] = [];
    public updateSec_id: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public singleORjoint: string;
    private check: boolean = false;
    constructor(private oaoService: OAOService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService) {
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log(" sample check \t" + this.applicantType);
        console.log("onlineIdCheck  constructor()");
        this.model = this.oaoService.getPersonalDetailsObject();
        console.log("out first", this.model);
        if (this.applicantType === "onlineIdCheck") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        } else if (this.applicantType === "onlineIdCheckTwo") {
            this.model = this.oaoService.getJointPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        }
        this.maxDate = this.datePipe.transform(this.today.getFullYear() + 100 + '-' + this.today.getMonth() + '-' + this.today.getDate(), 'yyyy-MM-dd');
        this.file_type = "Passport";
        this.isCrossSell = false;
        this.isAdmin = this.model.is_admin;
        this.product_type_code = this.model.product_type_code;
        this.oaoService.GetProduct(this.model.product_code)
            .subscribe(data => {
                console.log('Product', data.result[0]);
                if (data.result[0] === undefined) {
                    this.products = [];
                } else {
                    this.products = data.result[0].display_text;
                    this.cs_product_type_code = data.result[0].product_type_code;
                }

            });
        this.oaoService.getProductDetails(this.model.product_code).subscribe(
            data => {
                console.log("product details", data[0]);
                console.log(data[0].verification_mode);
                this.verification_auto = data[0].verification_mode;
            }
        );


        this.max_year = 0;
        this.oaoService.getConfig()
            .subscribe((data) => {
                this.configMsg = JSON.parse(JSON.stringify(data.data));
            }
            );

    }
    public openDatepicker() {
        this.isOpen = true;
        setTimeout(() => {
            this.isOpen = false;
        }, 1000);
    }
    //file type
    public setFileType(type: string) {
        this.file_type = type;
        switch (this.file_type) {
            case 'Passport': this.router.navigate(["../onlineIdCheck/Passport"], { relativeTo: this.route });
                console.log('Passport Selected');
                // jQuery('#fileupload-modal').modal('show');
                break;
            case 'Medicare': this.router.navigate(["../onlineIdCheck/Medicare"], { relativeTo: this.route });
                console.log('Medicare Selected');
                //jQuery('#fileupload-modal').modal('show');
                break;
            case 'DrivingLicense': this.router.navigate(["../onlineIdCheck/DrivingLicense"], { relativeTo: this.route });
                console.log('DrivingLicense Selected');
                //jQuery('#fileupload-modal').modal('show');
                break;
        }

    }
    public changeType() {
        console.log("this.file_type");
        console.log(this.file_type);
    }

    public onidcheck() {

        console.log("onidcheck()");
        this.isLoading = !this.isLoading;

        this.model.skip = true;
        var formatedDate = this.datePipe.transform(this.model.validTo, 'MM/dd/yyyy');
        console.log('Formated date id Check', formatedDate);
        this.model.validTo = formatedDate;
        this.oaoService.onlineIdcheck(this.model)
            .subscribe(
            data => {
                if (data.pass === "success" || data.dl === "success" || data.mc === "success") {
                    this.passport_check = data.pass;
                    this.DL_check = data.dl;
                    this.Medicare_check = data.mc;
                    jQuery('#onlineidcheck').modal('show');
                }
                else if (data.server === "error") {
                    jQuery('#servererror').modal('show');
                }
                else {
                    this.passport_check = "passport not verified";
                    this.DL_check = "Dl not verified";
                    this.Medicare_check = "medicare not verified";
                    jQuery('#error').modal('show');
                }
            }
            );
    }

    public onSubmit() {
        this.model.skip = true;
        this.model.verification_auto = this.verification_auto;
        if (this.applicantType === "onlineIdCheck") {
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType === "onlineIdCheckTwo") {
            this.oaoService.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoService.setPersonalDetailsObject(this.model);
        }
        switch (this.model.product_type_code) {

            case 'SAV': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    if (this.applicantType === "onlineIdCheck" && this.model.jointEmailOrComp === true) {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.router.navigate(['../onlineIdCheckTwo'], { relativeTo: this.route });
                    }else if(this.applicantType === "onlineIdCheckTwo"){
                        this.check = true;
                        this.showSave();
                    } else {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.check = true;
                        this.showSave();
                    }
                }
                );
                break;
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                .subscribe(
                data => {
                    if (this.applicantType === "onlineIdCheck" && this.model.jointEmailOrComp === true) {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.router.navigate(['../onlineIdCheckTwo'], { relativeTo: this.route });
                    }else if(this.applicantType === "onlineIdCheckTwo"){
                        this.successLoan();
                    } else {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.successLoan();
                    }
                }
                );
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    if (this.applicantType === "onlineIdCheck" && this.model.jointEmailOrComp === true) {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.router.navigate(['../onlineIdCheckTwo'], { relativeTo: this.route });
                    } else if(this.applicantType === "onlineIdCheckTwo"){
                        this.successLoan();
                    }else {
                        if (this.isCrossSell) {
                            this.gaEventsService.emitEvent('OAO_CrossSell', this.crossmodel.product_name, window.location.pathname, 1);
                            this.createCrossSellApplicants();
                        }
                        this.successLoan();
                    }
                }
                );
                break;
            default: console.log("Page not found");

        }
    }
    public onSave() {
        console.log("onsave()");
        this.oaoService.OAOSaveApplicant(this.model)
            .subscribe(
            data => {
                console.log(data);
                jQuery('#success-admin').modal('show');
            }
            );
    }

    public showSave() {
        if (this.check == true) {
            this.oaoService.GetApplicantsDetail(this.model.application_id)
                .subscribe(
                data => {
                    this.model = data.result[0];
                    if (this.isCrossSell) {
                        this.createCrossSellApplicants();
                    }
                    //localStorage.clear();

                    if (this.isAdmin == true) {
                        console.log("application successfully saved by admin");
                        jQuery('#success-admin').modal('show');
                    } else if (data.result[0].application_status == 'ONB') {
                        jQuery('#success-1').modal('show');
                    }else{
                         jQuery('#success_loan').modal('show');
                    }

                });

        }
    }

    public successLoan() {
        if (this.applicantType === "onlineIdCheck") {
            this.oaoService.getPersonalDetailsObject();
        } else if (this.applicantType === "onlineIdCheckTwo") {
            this.oaoService.getJointPersonalDetailsObject();
        } else {
            this.oaoService.getPersonalDetailsObject();
        }
        if (this.model.product_code === 'HML') {
            this.inf_code = 'INF_004';
        } else {
            this.inf_code = 'INF_005';
        }

        //Info message 004
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', this.inf_code)
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
                if (this.isAdmin == true) {
                    console.log("application successfully saved by admin");
                    jQuery('#success-admin').modal('show');
                } else {
                    jQuery('#success_loan').modal('show');
                }

            }
            );

    }

    public ngOnInit() {
        if (this.model.product_type_code === 'SAV') {
            CommonUtils.activeProgressBarStep(3);
            CommonUtils.completedProgressBarStep(2);

        }else{
             CommonUtils.activeProgressBarStep(4);
            CommonUtils.completedProgressBarStep(3);
        }

        if (this.model.idstate == null) {
            this.model.idstate = '0';
        }
        if (this.model.color == null) {
            this.model.color = '0';
        }
        if (this.model.DLidState == null) {
            this.model.DLidState = '0';
        }

        this.oaoService.GetPropertyDetails('commonCodes', 'COUNTRY')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    });
                }
                this.items.sort();
            }
            );

        this.oaoService.GetPropertyDetails('commonCodes', 'CRDCLR')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.cardColor.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    });
                }
            }
            );

        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    });
                }
            }
            );

        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(this.idCheck_v);
            }
            );
        //Info message 003
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );
        //Info message 002
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_002')
            .subscribe(
            data => {
                this.inf_002 = data.result[0].property_value;
            }
            );
        //Info message 006
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_006')
            .subscribe(
            data => {
                this.inf_006 = data.result[0].property_value;
            }
            );
        //Info message 007
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_007')
            .subscribe(
            data => {
                this.inf_007 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'VALID_TO_MEDI')
            .subscribe(
            data => {
                this.max_year = data.result[0].property_value;
                console.log(this.max_year);
            }
            );

        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );

    }//ngOnInit

    public getAccno() {
        console.log("in acc");
        // this.model=this.oaoService.getData();
        this.model.skip = true;
        // this.onSubmit(this.model);
        if (this.applicantType === "onlineIdCheck") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.model.app_id = this.model.application_id;
            this.model.verification_auto = this.verification_auto;
        } else if (this.applicantType === "onlineIdCheckTwo") {
            this.model = this.oaoService.getJointPersonalDetailsObject();
            this.model.skip = true;
            this.model.app_id = this.model.application_id;
            this.model.verification_auto = this.verification_auto;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.model.skip = true;
            this.model.app_id = this.model.application_id;
            this.model.verification_auto = this.verification_auto;
        }
        this.model.verification_auto = this.verification_auto;
        //this.model.onboard_auto=this.onboard_auto;
          this.oaoService.GetPropertyDetails('INFO_MESSAGE','INF_004')
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
            });
        console.log(this.model);
        // this.oaoService.OAOCreateOrUpdateApplicant(this.model)
        //     .subscribe(
        //     data => {
        //         console.log('data', data);
        //         // this.oaoService.setData(data.Result);
        //         //  this.model=this.oaoService.getData();
        //         this.oaoService.GetApplicantsDetail(this.model.app_id)
        //             .subscribe(
        //             data => {
        //                 this.model = data.result[0];
        //                 console.log('cross sell check', this.isCrossSell);
        //                 if (this.isCrossSell) {
        //                     this.createCrossSellApplicants();
        //                 }
        //                 if (data.result[0].application_status === 'ONB') {
        //                     jQuery('#success').modal('show');
        //                 } else {
        //                     jQuery('#success_loan').modal('show');
        //                 }
        //                 //localStorage.clear();
        //             });

        //     }
        //     );
        if (this.singleORjoint === 'single') {

            this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    this.oaoService.GetApplicantsDetail(this.model.application_id)
                        .subscribe(
                        data => {
                            this.model = data.result[0];
                            console.log('cross sell check', this.isCrossSell);
                            if (this.isCrossSell) {
                                this.createCrossSellApplicants();
                            }
                            if (data.result[0].application_status === 'ONB') {
                                jQuery('#success').modal('show');
                            } else {
                                jQuery('#success_loan').modal('show');
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
                                console.log("Account Details:");
                                console.log(data.result[0]);
                                this.model1 = data.result[0];
                                console.log('cross sell check', this.isCrossSell);
                                if (this.isCrossSell) {
                                    this.createCrossSellApplicants();
                                }
                                if (this.isCrossSell) {
                                    this.createCrossSellApplicants();
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
                                this.model2 = data.result[0];
                                if (data.result[0].application_status === 'ONB') {
                                    jQuery('#success').modal('show');
                                } else {
                                    jQuery('#success_loan').modal('show');
                                }

                            });

                    });
                resolve();
            });
        }

    }

    public updateSection() {
        //CommonUtils.completedProgressBarStep(1);
        CommonUtils.removeMobileProgressBar(2);
        if (this.applicantType === "onlineIdCheck") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else if (this.applicantType === "onlineIdCheckTwo") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        }
        // switch (this.model.product_type_code) {
        //     case 'SAV':
        //         this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
        //             data => {
        //                 this.router.navigate(["../taxInformation"], { relativeTo: this.route });
        //             })
        //         break;
        //     case 'HML':
        //         this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
        //             data => {
        //                 this.router.navigate(['../aboutYou'], { relativeTo: this.route });
        //             });
        //         break;
        //     case 'PRL':
        //         this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
        //             data => {
        //                 this.router.navigate(['../aboutYou'], { relativeTo: this.route });
        //             });
        //         break;
        //     default: console.log("Page not found");
        // }
         switch (this.model.product_type_code) {

            case 'SAV':
                this.oaoService.updatesection("section_2", this.updateSec_id).subscribe(
                    data => {
                        if(this.applicantType === "onlineIdCheck" && this.model.jointEmailOrComp===true){
                            console.log("inside switch case sav product type..");
                            this.router.navigate(["../taxInformationTwo"], { relativeTo: this.route});
                        }else{
                             this.router.navigate(["../taxInformation"], { relativeTo: this.route});
                        }
                    });

                break;
            case 'HML':
                this.oaoService.updatesection("section_3", this.updateSec_id).subscribe(
                    data => {
                        this.router.navigate(['../expense_graph'], { relativeTo: this.route });
                    });
                break;
            case 'PRL':
                this.oaoService.updatesection("section_3", this.updateSec_id).subscribe(
                    data => {
                        this.router.navigate(['../expense_graph'], { relativeTo: this.route });
                    });
                break;
            default: console.log("Page not found");

        }
    }

    public dispDate(validto: any) {
        this.model.validTo = validto;
    }
    public ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
        var mon = this.date_v.getMonth() + 1;
        var year = this.date_v.getFullYear();
        //this.model.validTo = this.date_v.getDate() + "/" + mon + "/" + year;
        var options = {
            format: "dd/mm/yyyy"
        };
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#validTo', function () {
            jQuery('#validTo').trigger('click');
        });
    }

    public clear() {
        window.location.href = this.oaoService.baseURL;
        localStorage.clear();
    }

    public back() {
        this.isLoading = false;
    }

    public moveForward() {
        CommonUtils.completedProgressBarStep(3);
    }

    public createCrossSellApplicants() {
        console.log('Inside Cross applicants...');
        this.crossmodel = this.oaoService.getPersonalDetailsObject();
        this.crossmodel.main_app_no = this.model.application_id;
        this.crossmodel.main_prod_type = this.model.product_type_code;
        this.crossmodel.main_prod = this.model.product_code;
        console.log('CS Main Prod', this.crossmodel.main_prod_type);
        console.log("main Prod type", this.model.product_type_code);
        this.oaoService.GetProduct(this.model.product_code)
            .subscribe(data => {
                console.log(data);
                console.log(this.cs_product_type_code);
                this.crossmodel.product_type_code = data.result[0].child_of;
                this.crossmodel.product_code = data.result[0].product_code;
                console.log('Cross Model', JSON.stringify(this.crossmodel));
                this.oaoService.OAOCrossSellCreate(this.crossmodel)
                    .subscribe(
                    data => { console.log("main model", this.model.application_id); }

                    );

            });

    }

    public setCrossSell(event) {
        console.log(JSON.stringify(event));
        console.log('Cross sell chekbox clicked', event.target.checked);
        this.gaEventsService.emitEvent('OAO_CrossSell',window.location.pathname, this.crossmodel.product_name,1);
        this.isCrossSell = event.target.checked;
    }

    public openTerms() {
        var shareLink = '/crossSellTerms';
        window.open(shareLink, 'mywin',
            'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');

    }
}