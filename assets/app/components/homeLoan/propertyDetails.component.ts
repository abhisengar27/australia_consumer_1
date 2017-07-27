import { Component, AfterViewInit, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from "../../validators/commonFunc";
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from '../../validators/commonUtils';

declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'property-details',
    templateUrl: './propertyDetails.component.html'

})
export class PropertyDetailsComponent implements OnInit {
    public application_id: any;
    configMsg: ConfigDetails;
    radioflag: boolean = true;
    yesNoflag: boolean = false;
    ownershipTypeFlag: boolean = true;
    public model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model1 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public propType: any[] = [];
    public showCustomAddr: string = "true";
    public paddrShow: boolean = false;
    public street: string[] = [];
    public state_drop: string[] = [];
    public no_address_found_flag: string;
    public addrErr = false;
    public updateSec_id: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    isLoading: boolean = false;
    private isPropertyChecked: boolean = false;


    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute,private chRef: ChangeDetectorRef) {
        console.log("PropertyDetailsComponent  constructor()")
          this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        this.model = this.oaoService.getPersonalDetailsObject();
        if(this.applicantType=="propertyDetails"){
            this.model = this.oaoService.getPersonalDetailsObject();
        }
      
        if (this.model.proppostcode == undefined) {
            this.model.proppostcode = "0000";

        }
        if (this.model.propstate == undefined) {
            this.model.propstate = "";
        }
        if (this.model.propstreettype == undefined) {
            this.model.propstreettype = "";
        }
        this.no_address_found_flag = "N";
        if (this.model.prophousenum != "" && this.model.prophousenum != "undefined" && this.model.prophousenum != null) {
            this.no_address_found_flag = "Y";
            this.showCustomAddr = "";
        }
        console.log(this.model);
        if (this.model.property == undefined) {
            this.model.property = false;
            this.oaoService.setPersonalDetailsObject(this.model);
            //jQuery('#property1').prop('checked',false);
        }
       
    }
    showCustomAddressFields() {
        this.addrErr = false;
        this.showCustomAddr = "";
        this.no_address_found_flag = "Y";
        this.model.propaddr = '';
        this.model.propstreettype = '';
        this.model.propsuburb = '';

    }

    changeRadio() {
        console.log("halua", this.radioflag);
        this.radioflag = !(this.radioflag);
    }
    ngOnInit() {
      
        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.completedProgressBarStep(1);
        CommonUtils.activeProgressBar();
        jQuery('select:first').focus();
        if (this.model.loantype == null) {
            this.model.loantype = "REFINANCE";
        }
        if (this.model.ownership == null) {
            this.model.ownership = "OWNER OCCUPIER";
        }
        if (this.model.proptype == null) {
            this.model.proptype = '';
        }
        if (this.model.payoutbal == null) {
            this.model.payoutbal = "";
        }
        this.oaoService.getConfig()
            .subscribe((data) => {
                this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log(this.configMsg)
            });

        this.oaoService.GetPropertyDetails('commonCodes', 'PROP_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.propType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
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

        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state_drop.push(data.result[i].property_desc)
                }
            }
            );
            if(this.model.property){
                jQuery('#property-refinance').addClass('info-loan');
            }
             

    }

    clik(e: any) {
        var curObj = e.currentTarget;


        var currentElement = '#' + jQuery(curObj).attr('id');
        var selectedItem = '.' + jQuery(currentElement).prev().attr('class');
        console.log('current..', jQuery(this).prev().attr('class'))




    }
    ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));

          if(this.model.loantype == "NEW PURCHASE")
        {
           // jQuery('#property1').prop('checked',false);
            //this.model.property = false;
            this.radioflag=false;
            if(this.model.property)
                this.yesNoflag= true;
            else
            this.yesNoflag=false;
        }
        else
        {
          this.model.property = true;
        this.model.loantype = "REFINANCE";
        }
        if(this.model.rentalincome != undefined && parseInt(this.model.rentalincome) > 0 )
        this.ownershipTypeFlag=false;
        else
        this.ownershipTypeFlag=true;
        jQuery("#radio1").unbind('click');
        jQuery("#radio1").click(() => {
            console.log("halua", this.radioflag);
            if (this.radioflag == false) {
                this.radioflag = !this.radioflag;
                this.model.loantype = "REFINANCE";
            }
            return false;


        })
        jQuery("#radio2").click(() => {
            console.log("halua", this.radioflag);
            if (this.radioflag == true) {
                this.radioflag = !this.radioflag;
                this.model.loantype = "NEW PURCHASE";
                this.model.property = false;
                this.model.payoutbal = "0.00";
                this.yesNoflag = false;
            }
            return false;

        })

        jQuery("#radio3").click(() => {
            console.log("halua", this.yesNoflag);
            if (this.yesNoflag == false) {
                this.yesNoflag = !this.yesNoflag;
                this.model.property = false;
                this.model.propaddr="";
                this.model.prophousenum="";
                this.model.propstreetnum="";
                this.model.propstreetname="";
                this.model.propstreettype="";
                this.model.propsuburb="";
                this.model.propstate="";
                this.model.proppostcode="";
            }
            return false;


        })
        jQuery("#radio4").click(() => {
            console.log("halua", this.yesNoflag);
            if (this.yesNoflag == true) {
                this.yesNoflag = !this.yesNoflag;
                this.model.property = false;
            }
            return false;

        })

        jQuery("#radio5").click(() => {
            console.log("halua", this.ownershipTypeFlag);
            if (this.ownershipTypeFlag == false) {
                this.ownershipTypeFlag = !this.ownershipTypeFlag;
                this.model.ownership = "OWNER OCCUPIER"
                this.model.rentalincome="0.00";
            }
            return false;


        })
        jQuery("#radio6").click(() => {
            console.log("halua", this.ownershipTypeFlag);
            if (this.ownershipTypeFlag == true) {
                this.ownershipTypeFlag = !this.ownershipTypeFlag;
                this.model.ownership = "INVESTMENT";
            }
            return false;

        })
        /*jQuery('span.list-item-selected').hide();
        jQuery('.list-item has-icon').click( () => {
            alert("click hua")
            var input_class = jQuery(this).attr('id');
            console.log("input_class: ",input_class);
            jQuery('#' + input_class +'> .list-item-select-text').hide();


           
        });*/
        /*  jQuery('input:checkbox').change(function(event){
              var curObj = jQuery(event.currentTarget);
              console.log(curObj);
          if(jQuery(this).is(":checked")) {
             // jQuery('div.menuitem').addClass("menuitemshow");
            jQuery('.list-item-select-text').hide();
            jQuery('.list-item-selected').show();
            jQuery('.list-item has-icon').css('border-color', '#60D154');
             console.log('true');
          } else {
                   jQuery('.list-item-select-text').show();
            jQuery('.list-item-selected').hide();
                
                console.log('false');
          }
      });*/
        jQuery('#addline1').autocomplete(
            {
                source: (request, response) => {

                    jQuery.ajax(
                        {

                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQuerystringRequest",
                            dataType: "jsonp",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            data: { OutputFormat: "json", ResultLimit: 1000, AddressLine: request.term, Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress", RequestKey: this.configMsg.dataToolsRequestKey },
                            success: (data) => {
                                if (data.DtResponse.ResultCount == 0) {
                                    this.model.proppostcode = "";
                                }
                                jQuery('#dpid').val("");
                                response(jQuery.map(data.DtResponse.Result, function (item) {
                                    //  console.log("in source ", item)
                                    var Output = (item.AddressLine + ", " + item.Locality + ", " + item.State + ", " + item.Postcode);
                                    return { label: Output, value: Output, Output: Output, RecordId: item.RecordId, AddressLine: item.AddressLine };
                                }));
                            }
                        });
                },

                select: (event, ui) => {
                    jQuery.ajax(
                        {
                            url: "https://Kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQuerystringRequest",
                            dataType: "jsonp",
                            crossDomain: true,
                            data: { OutputFormat: "json", RecordId: ui.item.RecordId, Method: "DataTools.Capture.Address.Predictive.AuPaf.RetrieveAddress", RequestKey: this.configMsg.dataToolsRequestKey },
                            success: (data) => {
                                jQuery.map(data.DtResponse.Result, (item) => {
                                    //console.log("in select ", item)

                                    this.model.propstreetnum = item.StreetNumber1 + "-" + item.StreetNumber2;
                                    this.model.propstreetname = item.StreetName;
                                    this.model.propsuburb = item.Locality;
                                    this.model.proppostcode = item.Postcode;
                                    this.model.propstreettype = item.StreetType;
                                    this.model.propstate = item.State;
                                    this.model.propaddr = item.BuildingName + "," + item.AddressLine + "," + item.Locality + "," + item.State + "," + this.model.proppostcode;

                                });
                            }
                        });
                },
            });
    }
    disableButton() {
        if (this.model.loantype == "REFINANCE" && this.model.proptype != '' && this.model.purchaseprice != "0.00" && this.model.purchaseprice != "" && this.model.payoutbal != "" && this.model.payoutbal != '0.00') {
            return false;
        }
        if (this.model.loantype == "NEW PURCHASE" && this.model.proptype != '' && this.model.purchaseprice != "0.00" && this.model.purchaseprice != "" && (!this.model.property || this.model.propaddr !=null)) {
            return false;
        }
        if (this.model.loantype == "NEW PURCHASE" && this.model.proptype != '' && this.model.purchaseprice != "0.00" && this.model.purchaseprice != "" && this.model.proppostcode != "0000" && this.model.proppostcode != "" && this.model.proppostcode != null && (!this.model.property || this.model.propaddr !=null)) {
            return false;
        }

        // else if (this.model.proppostcode == null || this.model.proppostcode == "" || this.model.proppostcode == "0000") {
        // return true;
        // }
        return true;
    }
    onSubmit() {
        this.isLoading = !this.isLoading;
        this.model.app_id = this.model.application_id;
        this.model.sec_2_v = false;
        if (String(this.model.payoutbal).match(/\,/g)) {
            var payoutbal = this.model.payoutbal.replace(/\,/g, "");
            this.model.payoutbal = payoutbal;
        }
        if (String(this.model.rentalincome).match(/\,/g)) {
            var rentalincome = this.model.rentalincome.replace(/\,/g, "");
            this.model.rentalincome = rentalincome;
        }
        if (String(this.model.purchaseprice).match(/\,/g)) {
            var purchaseprice = this.model.purchaseprice.replace(/\,/g, "");
            this.model.purchaseprice = purchaseprice;
        }
        if (this.model.property && this.model.loantype != "NEW PURCHASE") {
            this.model.no_address_found_flag = this.no_address_found_flag;
            if (this.model.proppostcode != null && this.model.proppostcode != '0000' && this.model.proppostcode != "") {
                if (this.model.proppostcode.length != 4) {
                    return;
                }
                this.addrErr = false;

            } else {
                this.isLoading = false
                this.addrErr = true;
                return
            }
        }


        console.log("updated" + this.model);
        console.log(this.model);
        this.oaoService.setPersonalDetailsObject(this.model);



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
                console.log("sample" , data);


                this.router.navigate(['../loanDetails'], { relativeTo: this.route });
                    }
            }
            );


    }//onSubmit

    emptyPostCode() {

        if (this.model.propaddr == "" || this.model.propaddr == null) {

            this.model.proppostcode = "0000";
        }
    }
    updateSection() {

        CommonUtils.removeMobileProgressBar(1);

 if (this.applicantType == "propertyDetails") {
            this.model1 = this.oaoService.getJointPersonalDetailsObject();
            this.updateSec_id = this.model1.application_id;
            this.oaoService.updatesection("section_1", this.updateSec_id).subscribe(
                data => { }
            );
        }
        this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
            data => {
                if (this.applicantType == "propertyDetails") {
                    this.router.navigate(['../personalContactInfoTwo'], { relativeTo: this.route });
                } else {
                    this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                }
            }
        );
    }

    clear(radio_var: any) {
        switch (radio_var) {
            case 'REFINANCE': this.model.property = false;
                break;
            case 'NEW PURCHASE': this.model.property = true;
                this.model.payoutbal = '';
                break;
            case 'OWNEROCCUPIER': this.model.rentalincome = null;
                break;
        }
    }
    AmountFormatter(amountvalue: any, var_v: any) {
        if (amountvalue != undefined && amountvalue != null && amountvalue != '') {
            console.log("asd " + amountvalue + " " + var_v)
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 2,
            });
            //     this.testmodel[var_v]="";
            //  this.testmodel[var_v]=amountvalue;
            var finalstring = formatter.format(amountvalue);
            finalstring = finalstring.replace('A$', '');
            this.model[var_v] = finalstring.replace('$', '');
        } else {
            this.model[var_v] = "0.00";
            this.chRef.detectChanges();
        }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue;
            console.log(this.model[var_v]);
        }
    }
    hideaddress() {
        this.showCustomAddr = "true";
        this.model.propaddr = '';
        this.model.proppostcode = '0000';
        this.no_address_found_flag = "N";
        this.model.prophousenum = "";
    }

    setProperty(event){
        console.log("Clicked");
        if(event.target.checked) {
            console.log('Checked');
             this.model.property = true;
            // jQuery('#property1').prop('checked',true);
               this.oaoService.setPersonalDetailsObject(this.model);
             jQuery('#property-refinance').addClass('info-loan');
        }else{
             console.log('UnChecked');
             this.model.property = false;
             //jQuery('#property1').prop('checked',false);
                this.oaoService.setPersonalDetailsObject(this.model);
             jQuery('#property-refinance').removeClass('info-loan');
        }
       
     
    }

 

}