import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service"
import { CommonUtils } from '../../../validators/commonUtils';
declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'calculator',
    templateUrl: './calculator.component.html'

})
export class CalculatorComponent {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    configMsg: ConfigDetails;
    incomeFrequencies: any[] = [];
    frequencyKeyValuePair: Map<string, number>;
    foodTemp: number = 0;
    transportTemp: number = 0;
    healthCareTemp: number = 0;
    childcareTemp: number = 0;
    billsTemp: number = 0;
    clothingTemp: number = 0;
    travelTemp: number = 0;
    otherTemp: number = 0;
    constructor(private oaoService: OAOService) {
        console.log("CalculatorComponent  constructor()");
        this.foodTemp = 0;
        this.transportTemp = 0;
        this.travelTemp = 0;
        this.clothingTemp = 0;
        this.childcareTemp = 0;
        this.healthCareTemp = 0;
        this.otherTemp = 0;
        this.billsTemp = 0;

        this.frequencyKeyValuePair = new Map<string, number>();
        this.model = this.oaoService.getPersonalDetailsObject();
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
                console.log("frequencyTypes: ", this.incomeFrequencies);
            }
            );
        this.frequencyKeyValuePair.set("Monthly", 1);
        this.frequencyKeyValuePair.set("Fortnightly", 2)
        this.frequencyKeyValuePair.set("Weekly", 4);
        this.frequencyKeyValuePair.set("", 0);
    }

    ngOnInit() {
        if (this.model.foodExpenseFrequency == null) {
            this.model.foodExpenseFrequency = ""
        }
        if (this.model.healthCareExpenseFrequency == null) {
            this.model.healthCareExpenseFrequency = "";
        }
        if (this.model.childcareExpenseFrequency == null) {
            this.model.childcareExpenseFrequency = "";
        }
        if (this.model.transportExpenseFrequency == null) {
            this.model.transportExpenseFrequency = "";
        }
        if (this.model.travelExpenseFrequency == null) {
            this.model.travelExpenseFrequency = "";
        }
        if (this.model.clothingExpenseFrequency == null) {
            this.model.clothingExpenseFrequency = "";
        }
        if (this.model.billsExpenseFrequency == null) {
            this.model.billsExpenseFrequency = "";
        }
        if (this.model.otherExpenseFrequency == null) {
            this.model.otherExpenseFrequency = "";
        }
         if (this.model.monthlyLivingExpenses == undefined) {
            this.model.monthlyLivingExpenses = "";
        }
         if (this.model.foodExpense == undefined) {
            this.model.foodExpense = "";
        }
        if (this.model.travelExpense == undefined) {
            this.model.travelExpense = "";
        }
        if (this.model.transportExpense == undefined) {
            this.model.transportExpense = "";
        }
        if (this.model.childcareExpense == undefined) {
            this.model.childcareExpense = "";
        }
        if (this.model.healthCareExpense == undefined) {
            this.model.healthCareExpense = "";
        }
        if (this.model.otherExpense == undefined) {
            this.model.otherExpense = "";
        }
        if (this.model.billsExpense == undefined) {
            this.model.billsExpense = "";
        }
        if (this.model.clothingExpense == undefined) {
            this.model.clothingExpense = "";
        }
        
    }/*
    calculateTotal(value, var_v, frequency) {
        var temp = value.replace(/\,/g, '');
        console.log(temp);
        if (frequency == "Weekly") {
            temp = temp * 4;
        }
        if (frequency == "Fortnightly") {
            temp = temp * 2;
        }
        if (this.model.monthlyLivingExpenses == undefined) {
            this.model.monthlyLivingExpenses = "";
        }

        if (this.model.monthlyLivingExpenses != null && String(this.model.monthlyLivingExpenses).match(/\,/g)) {
            this.model.monthlyLivingExpenses = this.model.monthlyLivingExpenses.replace(/\,/g, '');
            console.log("1: ", this.model.monthlyLivingExpenses);
        }
        if (this.model.monthlyLivingExpenses != null && String(this.model.monthlyLivingExpenses).endsWith('.00')) {
            this.model.monthlyLivingExpenses = this.model.monthlyLivingExpenses.substr(0, this.model.monthlyLivingExpenses.length - 3);
            console.log("2: ", this.model.monthlyLivingExpenses);
        }
        if(this.model.monthlyLivingExpenses!=""){
        this.model.monthlyLivingExpenses = parseInt(this.model.monthlyLivingExpenses) + temp;
        }else{
            this.model.monthlyLivingExpenses = this.model.monthlyLivingExpenses + temp;
        }
        console.log("3: ", this.model.monthlyLivingExpenses);
        this.AmountFormatter(this.model.monthlyLivingExpenses, var_v);
        console.log("4: ", this.model.monthlyLivingExpenses);


    }*/
    calculateTotal() {
        this.model.expenseFrequency="month";
        if (this.model.monthlyLivingExpenses == undefined) {
            this.model.monthlyLivingExpenses = "";
        }
        if (this.model.monthlyLivingExpenses != null && String(this.model.monthlyLivingExpenses).match(/\,/g)) {
            this.model.monthlyLivingExpenses = this.model.monthlyLivingExpenses.replace(/\,/g, '');
        }
        if (this.model.monthlyLivingExpenses != null && String(this.model.monthlyLivingExpenses).endsWith('.00')) {
            this.model.monthlyLivingExpenses = this.model.monthlyLivingExpenses.substr(0, this.model.monthlyLivingExpenses.length - 3);
            
        }
        var temp;
        if(this.model.foodExpense!="") {
            temp=this.model.foodExpense;
            if(this.model.foodExpense.match(/\,/g)) {
                temp=this.model.foodExpense.replace(/\,/g, '');
            }
            this.foodTemp = parseInt(temp);
        }
         if(this.model.travelExpense!="") {
             temp=this.model.travelExpense;
            if(this.model.travelExpense.match(/\,/g)) temp=this.model.travelExpense.replace(/\,/g, '');
            this.travelTemp = parseInt(temp);
        }
         if(this.model.transportExpense!="") {
             temp=this.model.transportExpense;
            if(this.model.transportExpense.match(/\,/g)) temp=this.model.transportExpense.replace(/\,/g, '');
            this.transportTemp = parseInt(temp);
        }
         if(this.model.childcareExpense!="") {
             temp=this.model.childcareExpense;
            if(this.model.childcareExpense.match(/\,/g)) temp=this.model.childcareExpense.replace(/\,/g, '');
            this.childcareTemp = parseInt(temp);
        }
         if(this.model.healthCareExpense!="") {
             temp=this.model.healthCareExpense;
            if(this.model.healthCareExpense.match(/\,/g)) temp=this.model.healthCareExpense.replace(/\,/g, '');
            this.healthCareTemp = parseInt(temp);
        }
         if(this.model.billsExpense!="") {
             temp=this.model.billsExpense;
            if(this.model.billsExpense.match(/\,/g)) temp=this.model.billsExpense.replace(/\,/g, '');
            this.billsTemp = parseInt(temp);
        }
         if(this.model.otherExpense!="") {
             temp=this.model.otherExpense;
            if(this.model.otherExpense.match(/\,/g)) temp=this.model.otherExpense.replace(/\,/g, '');
            this.otherTemp = parseInt(temp);
        }
         if(this.model.clothingExpense!="") {
             temp=this.model.clothingExpense;
            if(this.model.clothingExpense.match(/\,/g)) temp=this.model.clothingExpense.replace(/\,/g, '');
            this.clothingTemp = parseInt(temp);
        }
       /* if(this.model.travelExpense!="") {
            this.travelTemp = parseInt(this.model.travelExpense);
            }
        if(this.model.transportExpense!="") this.transportTemp = parseInt(this.model.transportExpense);
        if(this.model.clothingExpense!="") this.clothingTemp = parseInt(this.model.clothingExpense);
        if(this.model.healthCareExpense!="") this.healthCareTemp = parseInt(this.model.healthCareExpense);
        if(this.model.childcareExpense!="") this.childcareTemp = parseInt(this.model.childcareExpense);
        if(this.model.billsExpense!="") this.billsTemp = parseInt(this.model.billsExpense);
        if(this.model.otherExpense!="") this.otherTemp = parseInt(this.model.otherExpense);
        console.log("Food: ",this.foodTemp * this.frequencyKeyValuePair.get(this.model.foodExpenseFrequency));
        console.log("travelExpense: ",this.travelTemp * this.frequencyKeyValuePair.get(this.model.travelExpenseFrequency))
        console.log("transportExpense: ",this.transportTemp * this.frequencyKeyValuePair.get(this.model.transportExpenseFrequency))
        console.log("billsExpense: ",this.billsTemp * this.frequencyKeyValuePair.get(this.model.billsExpenseFrequency))
        console.log("clothingExpense: ",this.clothingTemp * this.frequencyKeyValuePair.get(this.model.clothingExpenseFrequency))
        console.log("childcareExpense: ",this.childcareTemp * this.frequencyKeyValuePair.get(this.model.childcareExpenseFrequency))
        console.log("healthCareExpense: ",this.healthCareTemp * this.frequencyKeyValuePair.get(this.model.healthCareExpenseFrequency))
        console.log("otherExpense: ",this.otherTemp * this.frequencyKeyValuePair.get(this.model.otherExpenseFrequency))
        */
        var abc = this.foodTemp * this.frequencyKeyValuePair.get(this.model.foodExpenseFrequency) + this.travelTemp * this.frequencyKeyValuePair.get(this.model.travelExpenseFrequency) + this.transportTemp * this.frequencyKeyValuePair.get(this.model.transportExpenseFrequency) + this.healthCareTemp * this.frequencyKeyValuePair.get(this.model.healthCareExpenseFrequency) + this.childcareTemp * this.frequencyKeyValuePair.get(this.model.childcareExpenseFrequency) + this.billsTemp * this.frequencyKeyValuePair.get(this.model.billsExpenseFrequency) + this.clothingTemp * this.frequencyKeyValuePair.get(this.model.clothingExpenseFrequency) + this.otherTemp * this.frequencyKeyValuePair.get(this.model.otherExpenseFrequency)
        this.model.monthlyLivingExpenses = abc.toString();

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
        }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue
            console.log(this.model[var_v]);
        }
    }

}
