import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { google } from "../../../interfaces/configinterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { CommonUtils } from '../../../validators/commonUtils';




declare var jQuery: any;
declare var Ladda;
@Component({
    selector: 'personaldetailscontact',
    templateUrl: './personalDetailsContact.component.html'

})
export class PersonalDetailsContactComponent implements AfterViewInit, OnInit {
    public freetext1status: string = "false";
    public freetext1label: string;
    public freetext1placeholder: string;
    public freetext2status: string = "false";
    public freetext2label: string;
    public freetext2placeholder: string;
    public application_id: any;
    public state_drop: string[] = [];
    public street: string[] = [];
    public showAddress: string = "true";
    public showCustomAddr: string = "true";
    public showCustomPAddr: string = "true";
    public inf_001: string;
    public wrn_001: string;
    public configMsg: ConfigDetails;
    public isLoading: boolean = false;
    public paddrShow: boolean = false;
    public addrErr = false;
    public paddrErr = false;
    public no_address_found_flag: string;
    public checkResult1: string;
    public model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public userExistingFlag: boolean; //chandan  //No changes in html page
    public checkDupStatus: boolean = false; //chandan
    public updateSec_id: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    private check: boolean = false;//to display modal
    private hold: boolean = false;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
       
         this.model.postal_home_address_flag = false;
       this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        console.log(componenturl);
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log("PersonalDetailsContactComponent  constructor()");
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.applicantType === "personalContactInfo") {
            this.model = this.oaoService.getPersonalDetailsObject();
        } else if (this.applicantType === "personalContactInfoTwo") {
            this.model = this.oaoService.getJointPersonalDetailsObject();
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
        }
        this.oaoService.getFreeFieldDetails().subscribe(
            (data: any) => {
                console.log(data.result);
                console.log("status", this.freetext1status);
                try {


                    this.freetext1label = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext1'][0].label
                    this.freetext1placeholder = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext1'][0].placeholder
                    this.freetext1status = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext1'][0].status
                    this.freetext2label = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext2'][0].label
                    this.freetext2placeholder = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext2'][0].placeholder
                    this.freetext2status = data.result[0][this.model.product_type_code][0]['section_1'][0]['contactinfo'][0]['freetext2'][0].status

                    console.log("status", this.freetext1status)
                } catch (e) {
                    console.log(e);
                }
            }
        );
        if (this.model.postal_home_address_flag == undefined) {
            this.model.postal_home_address_flag = false;
        }
        if (this.model.postcode == undefined) {
            this.model.postcode = "0000";

        }
        if (this.model.ppostcode == undefined) {

            this.model.ppostcode = "0000";
        }
        if (this.model.address == undefined) {
            this.model.address = "";
        }
        if (this.model.paddress == undefined) {
            this.model.paddress = "";
        }
        if (this.model.state == undefined) {
            this.model.state = "";
        }
        if (this.model.streettype == undefined) {
            this.model.streettype = "";
        }
        if (this.model.pstate == undefined) {
            this.model.pstate = "";
        }
        if (this.model.pstreettype == undefined) {
            this.model.pstreettype = "";
        }
        if(this.model.months==undefined){
            this.model.months="";
        }
        if(this.model.years==undefined){
            this.model.years=""
        }
        console.log(this.oaoService.getPersonalDetailsObject())
        this.no_address_found_flag = "N";
        if (this.model.housenum != "" && this.model.housenum != "undefined" && this.model.housenum != null) {
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";
        }
        if (this.model.phousenum != "" && this.model.phousenum != "undefined" && this.model.phousenum != null) {
            this.paddrShow = true;
            this.showCustomPAddr = "";
        }
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan
        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log("RequestKey: ", this.configMsg.dataToolsRequestKey);
            });


    }

    public onSubmit() {

        CommonUtils.completedProgressBarStep(1);
        console.log("onsubmit() personal details contact", this.model);
        if (this.userExistingFlag) {
            console.log("existing user directly creating appliction");
            this.submitSection();
        }
        else {
            console.log("New  user ");
            if (!this.oaoService.getCallMatchingCustomerFlag()) {
                console.log("checkMatchingCustomer() called");
                this.oaoService.checkMatchingCustomer(this.model)
                    .subscribe(data => {
                        if (data.status) {
                            jQuery('#matching-customer-modal').modal('show');
                        }
                        else {
                            this.oaoService.setCallMatchingCustomerFlag(true);
                            this.submitSection();
                        }
                    });
            }
            else {
                console.log("checkMatchingCustomer() not called");
                this.submitSection();
            }
        }
    }

    public emptyPostCode() {

        if (this.model.address == "" || this.model.address == null) {

            this.model.postcode = '0000';
        }
        if (this.model.paddress == "" || this.model.paddress == null) {
            this.model.ppostcode = '0000';
        }
    }
    public changeCallMatchingCustomerFlag() {
        this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    }
    public submitSection() {
        this.isLoading = !this.isLoading;
        this.model.no_address_found_flag = this.no_address_found_flag;

        if (this.model.postcode != null && this.model.postcode != '0000' && this.model.postcode != "") {
            if (this.model.postcode.length != 4) {
                return;
            }
            this.addrErr = false;
            if (this.no_address_found_flag == 'Y') {
                // this.model.address = this.model.streetnum + " " + this.model.streetname + " " + this.model.suburb + " " + this.model.state + " " + this.model.postcode;
            }
        } else {
            console.log("1");
            this.isLoading = false;
            this.addrErr = true;
            return;
        }


        if ((this.model.ppostcode != null && this.model.ppostcode != '0000' && this.model.ppostcode != "") || this.model.postal_home_address_flag == false) {
            if (this.model.ppostcode.length != 4) {
                return;
            }
            this.paddrErr = false;
            if (this.paddrShow == true && this.model.postal_home_address_flag == true) {
                //  this.model.paddress = this.model.pstreetnum + " " + this.model.pstreetname + " " + this.model.psuburb + " " + this.model.pstate + " " + this.model.ppostcode;
            }
        }
        else {
            this.isLoading = false;
            this.paddrErr = true;
            return
        }

        if (this.model.postal_home_address_flag == false) {
            this.paddrErr = false;
            this.model.phousenum = this.model.housenum;
            this.model.pstreetnum = this.model.streetnum;
            this.model.pstreettype = this.model.streettype;
            this.model.psuburb = this.model.suburb;
            this.model.paddress = this.model.address;
            this.model.pstreetname = this.model.streetname;
            this.model.ppostcode = this.model.postcode;
            this.model.pstate = this.model.state;
        }
        this.model.app_id = this.model.application_id;
        this.model.sec_1_v = true;
        if (this.applicantType === "personalContactInfo") {
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType === "personalContactInfoTwo") {
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
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            this.router.navigate(['../taxInformation'], { relativeTo: this.route });
                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            console.log("primary routing" + this.hold);
                            this.router.navigate(['../personalContactInfoTwo'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            this.router.navigate(['../taxInformation'], { relativeTo: this.route });
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
                    else{
                        // this.validationerror=[];
                        jQuery("#validation").hide();
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            this.router.navigate(['../propertyDetails'], { relativeTo: this.route });
                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            console.log("primary routing" + this.hold);
                            this.router.navigate(['../personalContactInfoTwo'], { relativeTo: this.route });
                        } else if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../incomeExpense'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            this.router.navigate(['../propertyDetails'], { relativeTo: this.route });
                        }
                    }

                });
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
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
                        if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setJointPersonalDetailsObject(this.model);
                            this.router.navigate(['../personalLoanDetails'], { relativeTo: this.route });
                        } else if (this.model.jointEmailOrComp === true) {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            console.log("primary routing" + this.hold);
                            this.router.navigate(['../personalContactInfoTwo'], { relativeTo: this.route });
                        } else if (this.model.applicant === "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../incomeExpense'], { relativeTo: this.route });
                        } else {
                            this.model.application_id = data.Result.application_id;
                            this.oaoService.setPersonalDetailsObject(this.model);
                            this.router.navigate(['../personalLoanDetails'], { relativeTo: this.route });
                        }
                    }
                });
                break;
            default: console.log("Page not found");

        }
        //this.application_id=this.model.application_id;
        //localStorage.setItem('application_id',this.application_id); //for fb
    }//submitSection1

    public showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.state = "";
        this.model.streettype = "";
        this.model.streetname = "";
        this.model.streetnum = "";
        this.model.suburb = "";
        this.model.housenum = "";
        this.model.address = '';
        //this.model.streettype = '';
        //this.model.suburb = '';
    }
    public showCustomPostalAddressFields() {
        this.paddrErr = false;
        this.showCustomPAddr = "";
        this.no_address_found_flag = "Y";
        this.paddrShow = true;
        this.model.phousenum = "";
        this.model.pstate = "";
        this.model.pstreetname = "";
        this.model.pstreettype = "";
        this.model.pstreetnum = "";
        this.model.psuburb = "";
        this.model.paddress = '';

        // this.model.pstreettype = '';
        // this.model.psuburb = '';
    }
    public hideaddress() {
        this.showCustomAddr = "true";
        this.model.address = '';
        this.no_address_found_flag = "N";
        this.model.postcode = '0000';
        this.model.housenum = "";
    }
    public hidePaddress() {
        this.showCustomPAddr = "true";
        this.paddrShow = false;
        this.model.ppostcode = '0000';
        this.model.paddress = '';
        this.no_address_found_flag = "N";
        this.model.phousenum = "";
    }

    public showSave() {
        if (this.check === true) {
            this.router.navigate(["../taxInformation"], { relativeTo: this.route });
        }
    }

    public ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
        var saveFlag = false;
        var id;
        jQuery(".saveClose").click(function () {
            saveFlag = true;
        });
        jQuery('#addline1').on("focus", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });
        jQuery('#addline2').on("focus", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });

        jQuery('#addline1').on("keyup", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });

        jQuery('#addline1,#addline2').autocomplete(
            {

                source: (request, response) => {
                    // jQuery("ul.ui-autocomplete li").css("background", "green");
                    console.log("id ", id);
                    jQuery.ajax(
                        {

                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            data: { OutputFormat: "json", ResultLimit: 1000, 
                            AddressLine: request.term, Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress", RequestKey: this.configMsg.dataToolsRequestKey },
                            success: (data) => {
                                console.log("data ki length: ", data.DtResponse.Result.length);
                                if (id == 'addline1' && data.DtResponse.ResultCount == 0) {
                                    this.model.postcode = "";
                                } else if (id == 'addline2' && data.DtResponse.ResultCount == 0) {
                                    this.model.ppostcode = "";
                                }
                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function (item) {
                                    //  console.log("in source ", item)
                                    console.log("item is empty: ", item.length);
                                    var Output = (item.AddressLine + ", " + item.Locality + ", " + item.State + ", " + item.Postcode);

                                    return { label: Output, value: Output, Output: Output, RecordId: item.RecordId, AddressLine: item.AddressLine };
                                }));
                            }
                        });
                },

                select: (event, ui) => {
                    jQuery.ajax(
                        {
                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",

                            crossDomain: true,
                            data: { OutputFormat: "json", RecordId: ui.item.RecordId,
                             Method: "DataTools.Capture.Address.Predictive.AuPaf.RetrieveAddress", RequestKey: this.configMsg.dataToolsRequestKey },
                            success: (data) => {

                                jQuery.map(data.DtResponse.Result, (item) => {
                                    console.log("data table response", item);
                                    console.log(id);
                                    console.log(id == "addline1");
                                    if (id == "addline1") {
                                        this.model.streetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.streetname = item.StreetName;
                                        this.model.suburb = item.Locality;
                                        this.model.postcode = item.Postcode;
                                        this.model.streettype = item.StreetType;
                                        this.model.state = item.State;
                                        this.model.address = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.postcode;
                                    } else if (id == "addline2") {
                                        // console.log("aya");
                                        this.model.pstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.pstreetname = item.StreetName;
                                        this.model.psuburb = item.Locality;
                                        this.model.ppostcode = item.Postcode;
                                        this.model.pstreettype = item.StreetType;
                                        this.model.pstate = item.State;
                                        this.model.paddress = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.ppostcode;

                                    }
                                    //this.model.address=this.model.streetnum + " " + this.model.streetname + " " + this.model.suburb + " " + this.model.state + " " + this.model.postcode;

                                    //jQuery('#addline1').val(ui.item.AddressLine);
                                    //displayMapAddress(ui.item.AddressLine + ", " + item.Locality + " " + item.State + " " + item.Postcode);     
                                });
                            }
                        });
                },
            });
    }

    public ngOnInit() {
        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.completedProgressBarStep(0);
        CommonUtils.activeProgressBar();
        this.isLoading = false;
        this.showAddress = "";
        this.hold = true;
        jQuery('input:visible:first').focus();
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
        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state_drop.push(data.result[i].property_desc);
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'STREET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.street.push(data.result[i].property_desc);
                }
            }
            );
        //for fb data
        if (this.oaoService.getFbData() == true) {
            this.model = this.oaoService.getData();
        }
        if (this.model.address != null || this.model.paddress != null) {
            this.showAddress = "";
            this.hold = true;
        }
    }

    public updateSection() {
        CommonUtils.activeProgressBar();
        if (this.applicantType === "personalContactInfo") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else if (this.applicantType === "personalContactInfoTwo") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
        }

        this.oaoService.updatesection("section_1", this.updateSec_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                if (this.applicantType === "personalContactInfo") {
                    this.router.navigate(["../applicantTwoComponent"], { relativeTo: this.route });
                } else if (this.applicantType === "personalContactInfoTwo") {
                    this.router.navigate(["../personalContactInfo"], { relativeTo: this.route });
                } else {
                    this.router.navigate(["../personalBasicInfo"], { relativeTo: this.route });
                }

            });

    }

    public laddaclose() {
        this.isLoading = false;
    }

}
