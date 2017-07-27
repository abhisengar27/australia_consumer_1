import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoanReason } from "../../interfaces/loanReason.interface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from "../../validators/commonUtils";
@Component({
    selector: 'personalLoan',
    templateUrl: './personalLoan.component.html'

})
export class PersonalLoanComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public application_id: any;
    prod_type: string
    prod_code: string
    configMsg: ConfigDetails;
    public loanTerm: any[] = [];
    public repaymentType: any[] = [];
    public loanreason = [];
    public loan_reason_v = new LoanReason(false, false, false, false, false, false, false);
    isLoading: Boolean = false;
    public frequencyTypes: any[]=[];
    public minAmount:number;
    public maxAmount:number;
    showAmountErrorMessage:boolean=true;
    public updateSec_id: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public model1 = new PersonalDetailsObject('', '', '', '', '', '', '');
   constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
      
        this.model.frequencyType = "Monthly";
        this.showAmountErrorMessage=true;
        console.log("PersonalLoanComponent  constructor()")
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        this.model = this.oaoService.getPersonalDetailsObject();
        if (this.applicantType == "personalLoanDetails") {
            this.model = this.oaoService.getPersonalDetailsObject();
        }
        console.log(this.model);
        if (typeof this.model.loanreason != "undefined") {
            this.loan_reason_v = this.model.loanreason;
        }
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }
    
    ngOnInit() {
       CommonUtils.activeProgressBar();
       CommonUtils.completedProgressBarStep(1);
        if (this.model.frequencyType == null) {
            this.model.frequencyType = "";
        }
        if (this.model.loanterm == null) {
            this.model.loanterm = '0'
        }
        if (this.model.repaymenttype == null) {
            this.model.repaymenttype = '0'
        }


        this.oaoService.GetPropertyDetails('commonCodes', 'LOAN_TERM')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.loanTerm.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'REPAYMENT_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.repaymentType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
                console.log("repaymentType: ",this.repaymentType);
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'frequency_type')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.frequencyTypes.push({
                        property_desc: data.result[i].property_desc,
                        property_value: data.result[i].property_value
                    })
                }
                console.log("frequencyTypes: ",this.frequencyTypes);
            }
            );

        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'MIN_AMOUNT')
            .subscribe(
            data => {
                this.minAmount=data.result[0].propertyValue;
            }
            );

         this.oaoService.GetPropertyDetails('GENERIC_PROP', 'MAX_AMOUNT')
            .subscribe(
            data => {
                this.maxAmount=data.result[0].propertyValue;
            }
            );
            

    }
    
    checkAmount(value:any){
        console.log('amtborrow ',value);
        console.log('minAmount: ',this.minAmount);
        if((parseInt(value) < this.minAmount) || (parseInt(value)> this.maxAmount)){
            console.log("not valid");
            this.showAmountErrorMessage=false;
        }else{
            this.showAmountErrorMessage=true;
            console.log("else m")
        }
    }

    onSubmit() {
        if(this.showAmountErrorMessage==false){
            return;
        }
        CommonUtils.completedProgressBarStep(2);
        this.isLoading=!this.isLoading;
        this.model.loanreason = this.loan_reason_v;
		this.model.sec_2_v=true;
        if(String( this.model.amtborrow).match(/\,/g) ){
        var amtborrow =  this.model.amtborrow.replace(/\,/g,"");
         this.model.amtborrow=amtborrow;
        }

        console.log( this.model);

        this.oaoService.OAOCreateOrUpdatePersonalloanApplicant( this.model)
            .subscribe(
            data => {
                console.log("sample" + data);
                this.router.navigate(['../incomeExpense'],{relativeTo:this.route});
            }
            );

    }

    updateSection() {
            if (this.applicantType == "personalLoanDetails") {
            this.model1 = this.oaoService.getJointPersonalDetailsObject();
            this.updateSec_id = this.model1.application_id;
            this.oaoService.updatesection("section_1", this.updateSec_id).subscribe(
                data => { }
            );
        }
        this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
            data => {
               if (this.applicantType == "personalLoanDetails") {
                    this.router.navigate(['../personalContactInfoTwo'], { relativeTo: this.route });
                } else {
                    this.router.navigate(['../personalContactInfo'], { relativeTo: this.route });
                }
            }
        );
    }
    AmountFormatter(amountvalue: any, var_v: any) {
     if(  amountvalue != undefined && amountvalue!=null && amountvalue!=''  ){
            console.log("asd "+amountvalue+" "+var_v)
            var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
        //     this.testmodel[var_v]="";
        //  this.testmodel[var_v]=amountvalue;
        var finalString = formatter.format(amountvalue);
		finalString = finalString.replace('A$','');
        this.model[var_v] = finalString.replace('$','');
    }else{
         this.model[var_v]="0.00";
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

}
