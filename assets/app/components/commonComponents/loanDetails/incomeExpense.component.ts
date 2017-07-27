import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service"
import { CommonUtils } from '../../../validators/commonUtils';
import { AlphanumericValidator } from "../../../validators/alphanumeric_validator";
declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'income-expense',
    templateUrl: './incomeExpense.component.html'

})
export class IncomeExpenseComponent {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    configMsg: ConfigDetails;
    employmentFlag: Boolean = true;
    isLoading: Boolean = false;
    wrongnumber: Boolean = false;
    otherIncomeSources: any[] = [];
    incomeFrequencies: any[] = [];
    numberOfPeople: any[] = [];
    relationshipStatuslist: any[] = [];
    livingTypelist: any[] = [];
    default_tab: boolean = false;
    frequencyOfRentlist: any[] = [];
    showCalculator: boolean = false;
    employmentTypeList: any[] = [];
    public updateSec_id: string;
    public checkResult1: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    //private forwardProgressDataHML = ['completed','completed','active','N','N'];
    private backwardProgressDataHML = ['completed', 'active', '', '', 'N', 'Y'];

    // private forwardProgressDataPRL = ['completed','completed','active','N','N'];
    private backwardProgressDataPRL = ['completed', 'active', '', '', 'N', 'Y'];
    public MaxLimit: Number;
    public otherIncomeLength: Number = 0;
    public otherIncomeDetails: any;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute, private chRef: ChangeDetectorRef) {
        this.otherIncomeDetails = [];
        console.log("IncomeExpenseComponent  constructor()")
        this.showCalculator = false;
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.applicantType == "incomeExpense") {
            this.model = this.oaoService.getPersonalDetailsObject();
        } else if (this.applicantType == "incomeExpenseTwo") {
            this.model = this.oaoService.getJointPersonalDetailsObject();
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
        }
        if (this.model.otherIncomeData != undefined) {
            this.otherIncomeDetails = this.model.otherIncomeData;
        }
        if (this.model.otherIncomeEarning == null || this.model.otherIncomeEarning == undefined) {
            this.model.otherIncomeEarning = '0.0';
        }
        if (this.model.otherIncomeSource == null) {
            this.model.otherIncomeSource = '';
        }
        if (this.model.otherIncomeFrequency == null) {
            this.model.otherIncomeFrequency = '';
        }
        
        if (this.model.retirementYears == undefined) {
            this.model.retirementYears = "";
        }
        if (this.model.retirementMonths == undefined) {
            this.model.retirementMonths = ""
        }
        console.log(this.model);
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
        this.oaoService.GetPropertyDetails('commonCodes', 'frequency_type')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.incomeFrequencies.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].property_value
                    })
                }

            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'otherIncomeSource')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.otherIncomeSources.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].propertyValue
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'financially_support')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.numberOfPeople.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].propertyValue
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'relationship')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.relationshipStatuslist.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].propertyValue
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'frequencyOfRent')
            .subscribe(
            data => {

                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.frequencyOfRentlist.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].property_value
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'livingType')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.livingTypelist.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].propertyValue
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'employment_status')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.employmentTypeList.push({
                        property_desc: data.result[i].property_desc,
                        property_val: data.result[i].property_value
                    });
                }
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'ASSET_LIABILITY_MAX')
            .subscribe(
            data => {

                this.MaxLimit = data.result[0].property_value;
            }
            );
    }
    ngAfterViewInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
        if (this.model.incomeExpenseTab1 === true) {
            jQuery('#calculator_details-tab').trigger('click');
            this.default_tab = true;

        } else {
            this.default_tab = false;
        }
        if (this.model.employed == "SELF-EMPLOYED"){
            this.employmentFlag = false;
        }
        else{
            this.employmentFlag = true;
        }
        jQuery("#radio1").click(() => {

            if (this.employmentFlag == false) {
                this.employmentFlag = !this.employmentFlag;
                this.model.employed = "EMPLOYED"

            }
            return false;


        })
        jQuery("#radio2").click(() => {
            if (this.employmentFlag == true) {
                this.employmentFlag = !this.employmentFlag;
                this.model.employed = "SELF-EMPLOYED";

            }
            return false;

        })
    }
    addClass() {
        jQuery('#employer').blur();
        jQuery('#relationshipStatus').focus();
        if (this.applicantType == "incomeExpense") {
            console.log("primary called ");
            this.model.incomeExpenseTab1 = true;
            this.oaoService.setPersonalDetailsObject(this.model);
            this.router.navigate(['../incomeExpenseTwo'], { relativeTo: this.route });
        } else if (this.applicantType == "incomeExpenseTwo") {
            console.log("secondary called ");
            this.model.incomeExpenseTab1 = true;
            this.oaoService.setJointPersonalDetailsObject(this.model);
            this.router.navigate(['../incomeExpense'], { relativeTo: this.route });
        } else {
            this.model.incomeExpenseTab1 = true;
            this.default_tab = true
            this.oaoService.setPersonalDetailsObject(this.model);
            jQuery('#calculator_details-tab').trigger('click');
        }
    }
    moveToDefault() {
        if (this.applicantType == "incomeExpense") {
            console.log("primary called ");
            this.model.incomeExpenseTab1 = false;
            this.oaoService.setPersonalDetailsObject(this.model);
            this.router.navigate(['../incomeExpenseTwo'], { relativeTo: this.route });
        } else if (this.applicantType == "incomeExpenseTwo") {
            console.log("secondary called ");
            this.model.incomeExpenseTab1 = false;
            this.oaoService.setJointPersonalDetailsObject(this.model);
            this.router.navigate(['../incomeExpense'], { relativeTo: this.route });
        } else {
            this.oaoService.setPersonalDetailsObject(this.model);
            this.default_tab = false;
        }
    }
    ngOnInit() {
        CommonUtils.trimWhiteSpacesOnBlur();
        CommonUtils.completedProgressBarStep(2);
        CommonUtils.activeMobileProgressBar(2);
        CommonUtils.activeProgressBarStep(3);
        jQuery('input:visible:first').focus();
        if (this.model.employed == null) {
            this.model.employed = "Full_time";
        }
        if (this.model.incomeFrequency == null) {
            this.model.incomeFrequency = "";
        }
        if (this.model.expenseFrequency == null) {
            this.model.expenseFrequency = "";
        }
        if (this.model.secondJob == null) {
            this.model.secondJob = false;
        }
        if (this.model.secondJobIncomeFrequency == null) {
            this.model.secondJobIncomeFrequency = "";
        }
        if (this.model.supportFinancially == null) {
            this.model.supportFinancially = "";
        }
        if (this.model.relationshipStatus == null) {
            this.model.relationshipStatus = "";
        }
        if (this.model.livingType == null) {
            this.model.livingType = "";
        }
        if (this.model.frequencyOfRent == null) {
            this.model.frequencyOfRent = "";
        }
    }
    clearCalculator() {
        this.model.foodExpense = "";
        this.model.foodExpenseFrequency = "";
        this.model.travelExpense = "";
        this.model.travelExpenseFrequency = "";
        this.model.transportExpense = "";
        this.model.transportExpenseFrequency = "";
        this.model.otherExpense = "";
        this.model.otherExpenseFrequency = "";
        this.model.healthCareExpense = "";
        this.model.healthCareExpenseFrequency = "";
        this.model.childcareExpense = "";
        this.model.childcareExpenseFrequency = "";
        this.model.clothingExpense = "";
        this.model.clothingExpenseFrequency = "";
        this.model.billsExpense = "";
        this.model.billsExpenseFrequency = "";

    }
    clearData(change: string) {

        switch (change) {
            case 'secondJob': if (this.model.secondJob == false) {
                this.model.secondJobEarning = "";
                this.model.secondJobIncomeFrequency = "";
            }
                break;
            case 'otherIncome': if (this.model.otherIncome == false && this.otherIncomeLength > 0) {
                this.model.otherIncomeData.splice(0, this.model.otherIncomeData.length);
                this.otherIncomeDetails.splice(0, this.otherIncomeDetails.length)
            }
                break;
        }

    }
    addOtherIncomeSource() {
        var otherIncome = {
            'otherIncomeSource': this.model.otherIncomeSource,
            'otherIncomeEarning': this.model.otherIncomeEarning.replace(/\,/g, ""),
            'otherIncomeFrequency': this.model.otherIncomeFrequency
        };

        if (this.otherIncomeLength <= this.MaxLimit) {
            this.otherIncomeDetails.push(otherIncome);
        }


        this.model.otherIncomeData = this.otherIncomeDetails;

        this.otherIncomeLength = this.otherIncomeDetails.length;
        this.oaoService.setPersonalDetailsObject(this.model);
        this.model.otherIncomeSource = ''
        this.model.otherIncomeEarning = '0'
        this.model.otherIncomeFrequency = ''

    }
    deleteOtherIncome(index) {
        this.otherIncomeDetails.splice(index, 1);
        this.otherIncomeLength = this.otherIncomeDetails.length;
    }
    onSubmit() {

        this.isLoading = !this.isLoading;
        this.model.skip = false;
        this.model.asset_liability = false
        if (String(this.model.earnPerMonth).match(/\,/g)) {
            var earnPerMonth = this.model.earnPerMonth.replace(/\,/g, "");
            this.model.earnPerMonth = earnPerMonth;
        }
        if (String(this.model.monthlyLivingExpenses).match(/\,/g)) {
            var monthlyLivingExpenses = this.model.monthlyLivingExpenses.replace(/\,/g, "");
            this.model.monthlyLivingExpenses = monthlyLivingExpenses;
        }
        if (String(this.model.secondJobEarning).match(/\,/g)) {
            var secondJobEarning = this.model.secondJobEarning.replace(/\,/g, "");
            this.model.secondJobEarning = secondJobEarning;
        }
        if (String(this.model.rentShare).match(/\,/g)) {
            var rentShare = this.model.rentShare.replace(/\,/g, "");
            this.model.rentShare = rentShare;
        }
        if (String(this.model.otherIncomeEarning).match(/\,/g)) {
            var otherIncomeEarning = this.model.otherIncomeEarning.replace(/\,/g, "");
            this.model.otherIncomeEarning = otherIncomeEarning;
        }
        if (this.applicantType == "incomeExpense") {
            console.log("primary called ");
            this.oaoService.setPersonalDetailsObject(this.model);
        } else if (this.applicantType == "incomeExpenseTwo") {
            console.log("secondary called ");
            this.oaoService.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoService.setPersonalDetailsObject(this.model);
        }
        switch (this.model.product_type_code) {
            case 'HML':
                this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                    .subscribe(
                    data => {
                        if (data.message == "Failed") {
                            console.log("validation failed", data.Result);
                            this.isLoading = false;
                            jQuery("#validation").modal('show');
                        }
                        else {
                            jQuery("#validation").hide();
                            if (this.applicantType === "incomeExpense" && this.model.jointEmailOrComp === true) {
                                this.router.navigate(['../incomeExpenseTwo'], { relativeTo: this.route });
                            } else {
                                this.router.navigate(['../assets'], { relativeTo: this.route });
                            }
                        }
                    }
                    );
                break;
            case 'PRL':
                console.log("Inside PRl");
                this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                    .subscribe(
                    data => {
                        if (data.message == "Failed") {
                            console.log("validation failed", data.Result);
                            this.isLoading = false;
                            jQuery("#validation").modal('show');
                        }
                        else {
                            jQuery("#validation").hide();
                            if (this.applicantType === "incomeExpense" && this.model.jointEmailOrComp === true) {
                                this.router.navigate(['../incomeExpenseTwo'], { relativeTo: this.route });
                            } else {
                                this.router.navigate(['../assets'], { relativeTo: this.route });
                            }
                        }
                    }
                    );
                break;
            default: console.log("Page not found");

        }
    }

    updateSection() {
        CommonUtils.completedProgressBarStep(1);
        CommonUtils.removeMobileProgressBar(2);
        var sec;
        if (this.applicantType == "incomeExpense") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
            if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                sec = "section_1";
            } else {
                sec = "section_2";
            }
            this.oaoService.updatesection(sec, this.model.application_id).subscribe(
                data => {
                    switch (this.model.product_type_code) {

                        case 'HML': if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        } else {

                            this.router.navigate(['../loanSummary'], { relativeTo: this.route });
                        }

                            break;
                        case 'PRL': if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        } else {
                            this.router.navigate(['../personalLoanDetails'], { relativeTo: this.route });
                        }

                            break;
                        default: console.log("Page not found");

                    }
                }
            );
        } else if (this.applicantType == "incomeExpenseTwo") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.model.incomeExpenseTab1 = false;
            this.oaoService.setPersonalDetailsObject(this.model);
            this.router.navigate(['../incomeExpense'], { relativeTo: this.route });

        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.updateSec_id = this.model.application_id;
            if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                sec = "section_1";
            } else {
                sec = "section_2";
            }
            this.oaoService.updatesection(sec, this.model.application_id).subscribe(
                data => {
                    switch (this.model.product_type_code) {

                        case 'HML': if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        } else {

                            this.router.navigate(['../loanSummary'], { relativeTo: this.route });
                        }

                            break;
                        case 'PRL': if (this.model.applicant == "secondary" && this.model.jointEmailOrComp === false) {
                            this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                        } else {
                            this.router.navigate(['../personalLoanDetails'], { relativeTo: this.route });
                        }

                            break;
                        default: console.log("Page not found");

                    }
                }
            );
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
            var finalString = formatter.format(amountvalue);

            finalString = finalString.replace('A$', '');
            this.model[var_v] = finalString.replace('$', '');

        } else {
            this.model[var_v] = "0.00";
            this.chRef.detectChanges();
        }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');

            this.model[var_v] = tmpOldvalue

        }
    }
    validatenumber(i: number) {

        if (i > 999)
            this.wrongnumber = true;
        else
            this.wrongnumber = false;
    }

}