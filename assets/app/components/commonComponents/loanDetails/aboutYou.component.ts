import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Assetdetails } from "../../../interfaces/assetsInterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { CommonUtils } from '../../../validators/commonUtils';
import { AlphanumericValidator } from "../../../validators/alphanumeric_validator";
import { google } from "../../../interfaces/configinterface";
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';



declare var jQuery: any;
declare var Ladda;
@Component({
    selector: 'aboutYou',
    templateUrl: 'aboutYou.component.html'
})
export class AboutYouComponent {
    public verification_auto: boolean;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public Your_address: String;
    addressDiv: boolean = true;
    anotheraddressDiv: boolean = false;
    longLiveDiv: boolean = false;
    anotherlongLiveDiv: boolean = false;
    thirdlessyear_v: boolean = false;
    isLoading: Boolean = false;
    public application_id: any;
    private check: boolean = false;//to display modal
    private hold: boolean = false;
    public state_drop: String[] = [];
    public street: String[] = [];
    public showAddress: String = "true"
    public showCustomAddr: String = "true"
    public thirdshowAddress: String = "true"
    public thirdshowCustomAddr: String = "true"
    public inf_001: String
    public wrn_001: String
    configMsg: ConfigDetails
    nextflag: boolean = true;
    public paddrShow: boolean = false;
    public addrErr = false;
    public paddrErr = false;
    public no_address_found_flag: string = "N"
    public third_no_address_found_flag: string = "N"
    public idCheck_v: String;
    public inf_loan: string;
    public checkResult1: string;
    public yesvalue: string;
    public novalue: any;
    public noaddress: string;
    public yesaddress: string;
    userExistingFlag: boolean; //chandan  //No changes in html page
    checkDupStatus: boolean = false; //chandan
    public setSameAddressError: boolean = false
    public checkaddress: string;
    public total: number = 0;
    public totalYears: number = 0;
    public totalMonths: number = 0;
    public StabilityMinYrs:number=0;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        this.model = this.oaoService.getPersonalDetailsObject();
       
        if (this.model.address != undefined && this.model.address != '') {
            this.Your_address = this.model.address;
        } else {
            this.Your_address = this.model.housenum + " " + this.model.streetnum + " " + this.model.streetname + " " + this.model.streettype + " " + this.model.suburb + " " + this.model.state + " " + this.model.postcode;
        }
       
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.model.newpostcode == undefined) {
            this.model.newpostcode = "0000"
        }
        if (this.model.thirdpostcode == undefined) {
            this.model.thirdpostcode = "0000"
        }
        if (this.model.newstate == undefined) {
            this.model.newstate = "";
        }
        if (this.model.newstreettype == undefined) {
            this.model.newstreettype = "";
        }
        if (this.model.thirdstate == undefined) {
            this.model.thirdstate = "";
        }
        if (this.model.thirdstreettype == undefined) {
            this.model.thirdstreettype = "";
        }
        if (this.model.years == undefined) {
            this.model.years = "0";
        }
        if (this.model.anotheryears == undefined) {
            this.model.anotheryears = "0";
        }
        if (this.model.anothermonths == undefined) {
            this.model.anothermonths = "0";
        }
        if (this.model.thirdyears == undefined) {
            this.model.thirdyears = "0";
        }
        if (this.model.thirdmonths == undefined) {
            this.model.thirdmonths = "0";
        }
        if (this.model.months == undefined) {
            this.model.months = "0";
        }

        console.log(this.oaoService.getPersonalDetailsObject())
        if  (this.model.newhousenum != null && this.model.newhousenum != undefined && this.model.newhousenum!="") {
            console.log("isme aya");
            console.log("new housenum: ",this.model.newhousenum);
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";
        }
        if  (this.model.thirdhousenum != null && this.model.thirdhousenum != undefined && this.model.thirdhousenum!="") {
            this.third_no_address_found_flag = "Y";
            this.thirdshowCustomAddr = "";
        }

        this.oaoService.getProductDetails(this.model.product_code).subscribe(
            data => {
                console.log("product details", data[0])
                console.log(data[0].verification_mode);
                this.verification_auto = data[0].verification_mode;
            }
        )
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
        //for idCheck
        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(data)
            }
            );
            this.oaoService.GetPropertyDetails('GENERIC_PROP', 'RES_STABILITY_MIN_YEARS')
            .subscribe(
            data => {
                this.StabilityMinYrs = parseInt(data.result[0].property_value);
                console.log(data)
                var x = parseInt(this.model.years)
                var y = parseInt(this.model.months) / 12;
                var a = parseInt(this.model.anotheryears)
                var b = parseInt(this.model.anothermonths) / 12;
                if((x+y)<this.StabilityMinYrs && this.model.totalYears !=undefined){
                    this.anotherlongLiveDiv=true
                }
                if(((a+b)+(x+y))<this.StabilityMinYrs && this.model.totalYears !=undefined){
                    this.thirdlessyear_v=true
                }
            }
            );
	    

    }
    
    lessYears() {
        console.log("seelcted year", this.model.years);
        var x = parseInt(this.model.years)
        var y = parseInt(this.model.months) / 12;
        this.total = (x + y)
        if (this.total < this.StabilityMinYrs) {
            this.totalYears = x
            this.totalMonths = (y * 12);
            this.anotherlongLiveDiv = true;
        }
        else {
            this.totalYears = x
            this.totalMonths = (y * 12);
            this.anotherlongLiveDiv = false;
        }
    }
    thirdlessyear() {
        var x = parseInt(this.model.anotheryears)
        var y = parseInt(this.model.anothermonths) / 12;
        var z = this.total + x + y;
        console.log("in thirdlessyear ", this.total)
        if (z < this.StabilityMinYrs) {
            this.totalYears = parseInt(this.model.years) + x
            this.totalMonths = (parseInt(this.model.months) + (y * 12));
            this.thirdlessyear_v = true;
        }
        else {
            this.totalYears = parseInt(this.model.years) + x
            this.totalMonths = (parseInt(this.model.months) + (y * 12));
            this.thirdlessyear_v = false;
        }

    }
    calcTotalYears() {
        var x = parseInt(this.model.thirdyears)
        var y = parseInt(this.model.thirdmonths) / 12;
        this.totalYears = parseInt(this.model.years) + parseInt(this.model.anotheryears) + x
        this.totalMonths = (parseInt(this.model.months) + parseInt(this.model.anothermonths) + (y * 12));
        var temp=this.totalMonths
        while(temp>0){
            if(this.totalMonths>=12){
                this.totalYears+=1;
                this.totalMonths-=12;
            }
                temp-=12;
            
        }
    }
    ButtonYes(value: string) {
        this.yesvalue = value;
        //this.addressDiv = true;
        this.longLiveDiv = true;

    }

    ButtonNo(value: string) {
        this.novalue = value;
        //this.addressDiv = false;
        this.anotherlongLiveDiv = true;
    }


    ok(value: string) {
        this.noaddress = value;
        //this.anotherlongLiveDiv = false;
        this.anotheraddressDiv = true;
    }

    moveToAddress() {
        this.longLiveDiv = false;
        this.anotherlongLiveDiv = false;
        //this.anotheraddressDiv= false;
        //this.addressDiv = true;
    }

    Backbutton() {
        this.model.pageName="";
        if (this.noaddress == 'noAddress') {
            this.anotherlongLiveDiv = true
            this.longLiveDiv = false;
        }
        if (this.yesaddress == 'yesAddress') {
            this.longLiveDiv = true;
            this.anotherlongLiveDiv = false;
        }
        this.anotheraddressDiv = false;
    }

    MoveToYear() {
        if (this.yesvalue == 'yes') {
            this.longLiveDiv = true;
            this.addressDiv = false;
        }
        if (this.novalue == 'no') {
            this.addressDiv = true;
            this.longLiveDiv = false;
        }

        this.anotherlongLiveDiv = false;
    }

    changeCallMatchingCustomerFlag() {
        this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    }

    emptyPostCode() {

        if (this.model.newaddress == "" || this.model.newaddress == null) {

            this.model.newpostcode = '0000';
        }
    }
    onSubmitMain() {
        CommonUtils.completedProgressBarStep(3);
        console.log("in submit")
        this.isLoading = !this.isLoading;
        this.model.skip = false;
        this.model.totalYears = this.totalYears;
        this.model.totalMonths = this.totalMonths;
        this.model.verification_auto = this.verification_auto;
        this.model.pageName="aboutus";
        if (this.model.no_address_found_flag == "Y") {
            this.checkaddress = this.model.newhousenum + " " + this.model.newstreetnum + " " + this.model.newstreetname + " " + this.model.newstreettype + " " + this.model.newsuburb + " " + this.model.newstate + " " + this.model.newpostcode;
            if (this.Your_address == this.checkaddress) {
                this.isLoading = !this.isLoading;
                this.setSameAddressError=true;
                //jQuery('#error-modal').modal('show')
                return
            } else {
                this.setSameAddressError = false
            }
        } else {
            if (this.Your_address == this.model.newaddress) {
                this.isLoading = !this.isLoading;
                this.setSameAddressError=true;
               // jQuery('#error-modal').modal('show');
                return
            } else {
                this.setSameAddressError = false
            }
        }

        console.log(this.model);
        if (this.userExistingFlag) {
            this.successAccount();
        } else {

            console.log(this.model);
            switch (this.model.product_type_code) {
                case 'HML':
                    this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
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
                            console.log(data);
                            if (this.idCheck_v == "O") {
                                this.showSave();
                            } else if (this.idCheck_v == "M") {
                                this.router.navigate(['../onlineIdCheck'], { relativeTo: this.route });
                            } else {
                                this.successAccount();
                            }
                        }
                        }
                        );
                    break;
                case 'PRL':
                    this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
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
                            console.log(data);
                            if (this.idCheck_v == "O") {
                                this.showSave();
                            } else if (this.idCheck_v == "M") {
                                this.router.navigate(['../onlineIdCheck'], { relativeTo: this.route });
                            } else {

                                this.successAccount();
                            }
                        }}
                        );
                    break;
                default: console.log("Page not found");
            }

        }//else

    }
    showSave() {
        jQuery('#onlineid-check').modal('show');

    }
    public inf_code: string = '';

    successAccount() {

        this.model.skip = true;
        this.model.verification_auto = this.verification_auto;
        console.log(this.model);
        switch (this.model.product_type_code) {
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
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
                    console.log(data);
                    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
                        .subscribe(
                        data => {
                            this.inf_loan = data.result[0].property_value;
                            jQuery('#success').modal('show');
                        }
                        );

                }
                }
                );
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
                    console.log(data);
                    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_005')
                        .subscribe(
                        data => {
                            this.inf_loan = data.result[0].property_value;
                            jQuery('#success').modal('show');
                        }
                        );

                }}
                );
                break;
            default: console.log("Page not found");

        }


    }



    showCustomAddressFields() {
        this.addrErr = false;

        if (this.showCustomAddr == "true") {
            this.showCustomAddr = "";
            this.no_address_found_flag = "Y";
            this.model.newstate = "";
            this.model.newstreettype = "";
            this.model.newstreetname = "";
            this.model.newstreetnum = "";
            this.model.newsuburb = "";
            this.model.newhousenum = "";
            this.model.newaddress = '';
        } else {
            this.thirdshowCustomAddr = "";
            this.third_no_address_found_flag = "Y";
            this.model.thirdstate = "";
            this.model.thirdstreettype = "";
            this.model.thirdstreetname = "";
            this.model.thirdstreetnum = "";
            this.model.thirdsuburb = "";
            this.model.thirdhousenum = "";
            this.model.thirdaddress = '';
        }
    }
    hideaddress() {


        this.showCustomAddr = "true";
        this.model.newaddress = '';
        this.no_address_found_flag = "N";
        this.model.newpostcode = '0000';
        this.model.newhousenum = "";

    }
    thirdhideaddress() {


        this.thirdshowCustomAddr = "true";
        this.model.thirdaddress = '';
        this.third_no_address_found_flag = "N";
        this.model.thirdpostcode = '0000';
        this.model.thirdhousenum = "";

    }
    addressSelect() {
        var saveFlag = false;
        var id;
        jQuery(".saveClose").click(function () {
            saveFlag = true;
        });

        jQuery('#addline1,#addline2').on("focus", function () {
            id = jQuery(this).attr("id");
            console.log(id);
        });

        jQuery('#addline1,#addline2').on("keyup", function () {
            id = jQuery(this).attr("id");
            console.log(id + "" + "aa gya re aa gya");
        });


        jQuery('#addline1,#addline2').autocomplete(
            {

                source: (request, response) => {
                    console.log("id ", id);
                    jQuery.ajax(
                        {

                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                            dataType: "jsonp",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            data: { OutputFormat: "json", ResultLimit: 1000, AddressLine: request.term, Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress", RequestKey: "RK-93046-290D5-8CC6B-0D9DC-17F3C-BF4B3-427EC-58A53" },
                            success: (data) => {
                                console.log("data ki length: ", data.DtResponse.Result.length);
                                if (id == 'addline1' && data.DtResponse.ResultCount == 0) {
                                    this.model.newpostcode = "";
                                }
                                if (id == 'addline2' && data.DtResponse.ResultCount == 0) {
                                    this.model.thirdpostcode = "";
                                }

                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function (item) {
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
                            data: { OutputFormat: "json", RecordId: ui.item.RecordId, Method: "DataTools.Capture.Address.Predictive.AuPaf.RetrieveAddress", RequestKey: "RK-93046-290D5-8CC6B-0D9DC-17F3C-BF4B3-427EC-58A53" },
                            success: (data) => {

                                jQuery.map(data.DtResponse.Result, (item) => {
                                    console.log("in select ", item)
                                    console.log(id);
                                    console.log(id, "addline1");
                                    console.log('if m aya');
                                    if (id == "addline1") {
                                        this.model.newstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.newstreetname = item.StreetName;
                                        this.model.newsuburb = item.Locality;
                                        this.model.newpostcode = item.Postcode;
                                        this.model.newstreettype = item.StreetType;
                                        this.model.newstate = item.State;
                                        this.model.newaddress = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.postcode;
                                    } else {
                                        this.model.thirdstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                        this.model.thirdstreetname = item.StreetName;
                                        this.model.thirdsuburb = item.Locality;
                                        this.model.thirdpostcode = item.Postcode;
                                        this.model.thirdstreettype = item.StreetType;
                                        this.model.thirdstate = item.State;
                                        this.model.thirdaddress = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.postcode;
                                    }



                                });
                            }
                        });
                },
            });
    }
    clear() {
        window.location.href = this.oaoService.baseURL;
        localStorage.clear();
    }

    ngOnInit() {

        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.activeProgressBarStep(3);
        CommonUtils.completedProgressBarStep(2)
        this.isLoading = false;
        this.showAddress = ""
        this.thirdshowAddress = ""
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
                    this.state_drop.push(data.result[i].property_desc)
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'STREET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.street.push(data.result[i].property_desc)
                }
            }
            );



        if (this.model.newaddress != null) {
            this.showAddress = ""
            this.hold = true;
        } else if (this.model.thirdaddress != null) {
            this.thirdshowAddress = ""
        }
    }

    updateSection() {

        this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
            data => {
                switch (this.model.product_type_code) {

                    case 'HML':
                        this.router.navigate(["../expense_graph"], { relativeTo: this.route });

                        this.router.navigate(['../loanSummary'], { relativeTo: this.route });


                        break;
                    case 'PRL':
                        this.router.navigate(['../assets'], { relativeTo: this.route });
                        break;
                    default: console.log("Page not found");

                }
            });

    }


    laddaclose() {
        this.isLoading = false;
    }
}