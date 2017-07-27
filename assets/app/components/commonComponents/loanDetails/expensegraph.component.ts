import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Assetdetails } from "../../../interfaces/assetsInterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { CommonUtils } from '../../../validators/commonUtils';
import { AlphanumericValidator } from "../../../validators/alphanumeric_validator";

declare var jQuery: any;
@Component({

    templateUrl: 'expensegraph.component.html'
})
export class ExpenseComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model1 = new PersonalDetailsObject('', '', '', '', '', '', '');
    public model2 = new PersonalDetailsObject('', '', '', '', '', '', '');
    Assets: Assetdetails;
    liability_tab: boolean = false;
    public idCheck_v: string;
    options: any = {
        legend: { display: false, position: 'left', fullWidth: false },
        cutoutPercentage: 70
    }

    public chartColors: any[] = [
        {
            backgroundColor: ["#109618", "#ff9900", "#990099"]

        }
    ];
    public maximumBorrower: any;
    public barChartLabels: string[];
    public barChartData: any[];
    public barChartType: string;
    public isHML: boolean = true;
    public chart_Flag: boolean = false;
    public MaxLimit: number;
    public assetsLength: number;
    public LiabilitiesLength: number;
    public assetsDetails: any;
    public LiabilitiesArray: any;
    public isAdmin: boolean;
    public assetType: any[] = [];
    public liabilityType: any[] = [];
    public freqType: any[] = [];
    public verification_auto: boolean;
    public application_id: any;
    public total_expense_show: any;
    public total_remaining_show: any;
    public total_emi_show: any;
    nextflag: boolean = true;
    lessIncome: boolean = false;
    //public idCheck_v: string;
    public inf_loan: string;
    finalSend: PersonalDetailsObject;
    isLoading: boolean = false;
    userExistingFlag: boolean = false; //chandan 
    public updateSec_id: string;
    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public singleORjoint: string;
    private forwardProgressDataHML = ['completed', 'completed', 'completed', 'active', 'Y', 'N'];
    // private backwardProgressDataHML = ['completed','completed','active','N','N'];

    private forwardProgressDataPRL = ['completed', 'completed', 'completed', 'active', 'Y', 'N'];
    //private backwardProgressDataPRL = ['completed','completed','active','N','N'];
    annualSalTable: any[] = [];
    other_incomeTable: any[] = [];
    rental_incomeTable: any[] = [];
    expense_allowanceTable: any[] = [];
    private flagStatus: string;
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute) {
        console.log("ExpenseGraph constructor()")
        this.flagStatus = "yes";
        this.barChartType = 'doughnut';
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log(" sample check \t" + this.applicantType);
        console.log("aboutYou  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        console.log("out first", this.model)
        if (this.applicantType == "expense_graph") {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
            console.log("oexpense_graph", this.model);
        } else {
            this.model = this.oaoService.getPersonalDetailsObject();
            this.singleORjoint = this.model.singleORjoint;
        }
        var promise = new Promise((resolve, reject) => {
            this.oaoService.getBorrowingCalculatorTable().subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    console.log("Borrowing Table data", data);
                    // data.AnnualSalResult.forEach(element => {

                    // });
                    console.log("length", (data.AnnualSalResult).length);
                    for (var j = 0; j < (data.AnnualSalResult).length; j++) {
                        this.annualSalTable[j] = data.AnnualSalResult[j].property_value;
                        // console.log("annual sal table", this.annualSalTable[j]);
                        this.other_incomeTable[j] = data.OtherIncomeResult[j].property_value;
                        this.rental_incomeTable[j] = data.RentalIncomeResult[j].property_value;
                        this.expense_allowanceTable[j] = data.ExpenseResult[j].property_value;
                        if (j == ((data.AnnualSalResult).length) - 1)
                            resolve("done");
                    }
                }
            )
        })


        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(data)
            }
            );

        //this.chart_Flag=true;
        //this.barChartLabels = ["Existing expenses/debts","New Loan Repayments","Total Remaining Amount"];
        //this.chart_proFlag = true;
        // this.barChartData = [0,0,0];
        // this.barChartLegend = false;
        // this.model = this.oaoService.getPersonalDetailsObject();
        this.isAdmin = this.model.is_admin;
        console.log("in expense graph", this.model);
        console.log("EMI");
        console.log(this.model.emi, this.model.frequencyType);
        var emi_frequency = this.model.frequencyType;
        var emi = this.model.emi;
        if (emi_frequency != undefined && emi_frequency == "month") {
            emi = emi;
        }
        else {
            if (emi_frequency != undefined && emi_frequency == "week") {
                emi = emi * 4;
            }
            else if (emi_frequency != undefined && emi_frequency == "fortnight") {
                emi = emi * 2;
            }
            else {
                emi = emi;
            }
        }
        console.log("all expense");
        console.log(this.model.monthlyLivingExpenses, this.model.expenseFrequency, this.model.rentShare, this.model.frequencyOfRent, this.model.Liabilities);
        console.log("all earning");
        console.log(this.model.rentalincome, this.model.earnPerMonth, this.model.incomeFrequency, this.model.secondJobEarning, this.model.secondJobIncomeFrequency, this.model.assets);
        var baseIncomeFlag = 0;
        var rental_income_variable = 0;
        var living_expenses = 0;
        var liabilities_expense = 0;
        if (this.model.rentalincome != undefined || this.model.rentalincome == "")
            rental_income_variable = parseInt(this.model.rentalincome) * 12;


        var annual_income_varaible = 0;
        var other_income_varaible = 0;
        var total_earning = 0;
        if (this.model.rentalincome != undefined) {
            total_earning = total_earning + parseInt(this.model.rentalincome);

        }

        var earningFrequency = this.model.incomeFrequency;
        var second_earning_frequency = this.model.secondJobIncomeFrequency;
        var earn_per_month = parseInt(this.model.earnPerMonth);
        console.log("earning per ", earn_per_month);
        var second_earn_per_month = parseInt(this.model.secondJobEarning);
        console.log("second_earn_per_month per ", second_earn_per_month);
        var otherincome = this.model.otherIncomeData;
        var assets = this.model.assets;

        if (assets != undefined && assets.length >= 1) {
            for (var j = 0; j < assets.length; j++) {
                if (assets[j].assettype != "Vehicle") {
                    if (assets[j].assetIncomeFrequency == "month") {
                        if (!isNaN(assets[j].assetIncome))
                            total_earning = total_earning + parseInt(assets[j].assetIncome);
                        console.log("in assets if", total_earning);
                        console.log("asset value", parseInt(assets[j].assetIncome))
                    }
                    else if (assets[j].assetIncomeFrequency == "week") {
                        console.log("in assets if2");
                        if (!isNaN(assets[j].assetIncome))
                            total_earning = total_earning + parseInt(assets[j].assetIncome) * 4;
                        console.log("in assets if", total_earning);
                        console.log("asset value", parseInt(assets[j].assetIncome))
                    }
                    else if (assets[j].assetIncomeFrequency == "fortnight") {
                        console.log("in assets if3");
                        if (!isNaN(assets[j].assetIncome))
                            total_earning = total_earning + parseInt(assets[j].assetIncome) * 2;
                        console.log("in assets if", total_earning);
                        console.log("asset value", parseInt(assets[j].assetIncome))
                    }
                    else {
                        console.log("in assets if4");
                        total_earning = total_earning;
                        console.log("in assets if", total_earning);
                        console.log("asset value", parseInt(assets[j].assetIncome))
                    }
                }
                else {
                    total_earning = total_earning;
                }
            }
        }


        if (otherincome != undefined && otherincome.length >= 1) {
            for (var j = 0; j < otherincome.length; j++) {

                if (otherincome[j].otherIncomeFrequency == "month") {
                    other_income_varaible = other_income_varaible + parseInt(otherincome[j].otherIncomeEarning) * 12;

                    total_earning = total_earning + parseInt(otherincome[j].otherIncomeEarning);
                    console.log("in otherincome if", total_earning);
                }
                else if (otherincome[j].otherIncomeFrequency == "week") {
                    other_income_varaible = other_income_varaible + parseInt(otherincome[j].otherIncomeEarning) * 48;
                    total_earning = total_earning + parseInt(otherincome[j].otherIncomeEarning) * 4;
                    console.log("in otherincome if2", total_earning);
                }
                else if (otherincome[j].otherIncomeFrequency == "fortnight") {
                    other_income_varaible = other_income_varaible + parseInt(otherincome[j].otherIncomeEarning) * 24;
                    total_earning = total_earning + parseInt(otherincome[j].otherIncomeEarning) * 2;
                    console.log("in otherincome if3", total_earning);
                }
                else {

                    total_earning = total_earning;
                    console.log("in otherincome esle", total_earning);
                }

            }
        }
        if (earningFrequency != undefined && earningFrequency == "month" && !isNaN(earn_per_month)) {
            console.log("IN FIRST IF");
            total_earning = total_earning + earn_per_month;
            if (second_earning_frequency != undefined && second_earning_frequency == "month" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "fortnight" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 2;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "week" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 4;
            }
            else {
                total_earning = total_earning;
            }
            console.log("IN FIRST IF", total_earning);
        }
        else if (earningFrequency != undefined && earningFrequency == "week" && !isNaN(earn_per_month)) {

            total_earning = total_earning + earn_per_month * 4;
            if (second_earning_frequency != undefined && second_earning_frequency == "month" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "fortnight" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 2;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "week" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 4;
            }
            else {
                total_earning = total_earning;
            }
            console.log("IN SECOND IF", total_earning);
        }
        else if (earningFrequency != undefined && earningFrequency == "fortnight" && !isNaN(earn_per_month)) {

            total_earning = total_earning + earn_per_month * 2;
            if (second_earning_frequency != undefined && second_earning_frequency == "month" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "fortnight" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 2;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "week" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month / 12;
            }
            else {
                total_earning = total_earning;
            }
            console.log("IN THIRD IF", total_earning);
        }
        else {

            total_earning = 0;
            if (second_earning_frequency != undefined && second_earning_frequency == "month" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "fortnight" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month * 2;
            }
            else if (second_earning_frequency != undefined && second_earning_frequency == "week" && !isNaN(second_earn_per_month)) {
                total_earning = total_earning + second_earn_per_month / 12;
            }
            else {
                total_earning = total_earning;
            }
            console.log("IN else", total_earning);
        }
        var total_expense = 0;
        var monthlyLivingExpenses = parseInt(this.model.monthlyLivingExpenses);
        console.log("monthlyLivingExpenses is", monthlyLivingExpenses);
        var monthlyLivingExpenses_frequency = this.model.expenseFrequency;
        var rentShare = parseInt(this.model.rentShare);
        console.log("rentshare is", rentShare);
        var rentShare_frequency = this.model.frequencyOfRent;
        var liabilities = this.model.Liabilities;
        if (monthlyLivingExpenses_frequency != undefined && monthlyLivingExpenses_frequency == "month" && !isNaN(monthlyLivingExpenses)) {
            console.log("in monthlyexpense if");
            living_expenses = living_expenses + monthlyLivingExpenses * 12;
            total_expense = total_expense + monthlyLivingExpenses;
            console.log("in monthlyexpense if", total_expense);
        }
        else {
            if (monthlyLivingExpenses_frequency != undefined && monthlyLivingExpenses_frequency == "week" && !isNaN(monthlyLivingExpenses)) {
                living_expenses = living_expenses + monthlyLivingExpenses * 48;
                total_expense = total_expense + monthlyLivingExpenses * 4;
                console.log("in monthlyexpense if2", total_expense);
            }
            else if (monthlyLivingExpenses_frequency != undefined && monthlyLivingExpenses_frequency == "fortnight" && !isNaN(monthlyLivingExpenses)) {
                living_expenses = living_expenses + monthlyLivingExpenses * 24;
                total_expense = total_expense + monthlyLivingExpenses * 2;
                console.log("in monthlyexpense if3", total_expense);
            }
            else {


                total_expense = total_expense;
                console.log("in monthlyexpense if4", total_expense);
            }
        }
        if (rentShare_frequency != undefined && rentShare_frequency == "month" && !isNaN(rentShare)) {
            living_expenses = living_expenses + rentShare * 12;
            total_expense = total_expense + rentShare;
            console.log("in renshare if", total_expense);
        }
        else {
            if (rentShare_frequency != undefined && rentShare_frequency == "week" && !isNaN(rentShare)) {
                living_expenses = living_expenses + rentShare * 48;
                total_expense = total_expense + rentShare * 4;
                console.log("in renshare if2", total_expense);
            }
            else if (rentShare_frequency != undefined && rentShare_frequency == "fortnight" && !isNaN(rentShare)) {
                living_expenses = living_expenses + rentShare * 24;
                total_expense = total_expense + rentShare * 2;
                console.log("in renshare if3", total_expense);
            }
            else if (rentShare_frequency != undefined && rentShare_frequency == "annual" && !isNaN(rentShare)) {
                living_expenses = living_expenses + rentShare;
                total_expense = total_expense + rentShare / 12;
                console.log("in renshare if4", total_expense);
            }
            else {

                total_expense = total_expense;
                console.log("in renshare if5", total_expense);
            }
        }
        if (liabilities != undefined && liabilities.length >= 1) {
            for (var j = 0; j < liabilities.length; j++) {
                if (liabilities[j].Payment_Frequency == "month") {
                    if (!isNaN(liabilities[j].Payable_Amount)) {
                        liabilities_expense = liabilities_expense + parseInt(liabilities[j].Payable_Amount);
                        total_expense = total_expense + parseInt(liabilities[j].Payable_Amount);
                    }
                    console.log("in liabilities if", total_expense);
                }
                else if (liabilities[j].Payment_Frequency == "week") {
                    console.log("in liabilities if2");
                    if (!isNaN(liabilities[j].Payable_Amount)) {
                        liabilities_expense = liabilities_expense + parseInt(liabilities[j].Payable_Amount) * 4;
                        total_expense = total_expense + parseInt(liabilities[j].Payable_Amount) * 4;
                    }
                    console.log("in liabilities if", total_expense);
                }
                else if (liabilities[j].Payment_Frequency == "fortnight") {
                    console.log("in liabilities if3");
                    if (!isNaN(liabilities[j].Payable_Amount)) {
                        liabilities_expense = liabilities_expense + parseInt(liabilities[j].Payable_Amount) * 2;
                        total_expense = total_expense + parseInt(liabilities[j].Payable_Amount) * 2;
                    }
                    console.log("in liabilities if", total_expense);
                }
                else {
                    console.log("in liabilities if4");
                    total_expense = total_expense;
                    console.log("in liabilities if", total_expense);
                }
            }
        }
        /* if(monthlyLivingExpenses_frequency != undefined && monthlyLivingExpenses_frequency =="month")
         {
             total_expense = total_expense+monthlyLivingExpenses;
             if(rentShare_frequency != undefined && rentShare_frequency == "month")
             {
                 total_expense = total_expense+rentShare;
                 if(liabilities !=undefined && liabilities.length >=1)
                 {
                     for(var j =0;j<liabilities.length;j++)
                     {
                         if(liabilities[j].Payment_Frequency == "month")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount;
                         }
                         else if(liabilities[j].Payment_Frequency == "week")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*4;
                         }
                         else if(liabilities[j].Payment_Frequency == "fortnight")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*2;
                         }
                         else{
                             total_expense=total_expense;
                         }
                     }
                 }
                 
             }
             else if(rentShare_frequency != undefined && rentShare_frequency == "week")
             {
                  total_expense = total_expense+rentShare*4;
                   if(liabilities !=undefined && liabilities.length >=1)
                 {
                     for(var j =0;j<liabilities.length;j++)
                     {
                         if(liabilities[j].Payment_Frequency == "month")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount;
                         }
                         else if(liabilities[j].Payment_Frequency == "week")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*4;
                         }
                         else if(liabilities[j].Payment_Frequency == "fortnight")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*2;
                         }
                         else{
                             total_expense=total_expense;
                         }
                     }
                 }
             }
             else if(rentShare_frequency != undefined && rentShare_frequency == "fortnight")
             {
                  total_expense = total_expense+rentShare*2;
                   if(liabilities !=undefined && liabilities.length >=1)
                 {
                     for(var j =0;j<liabilities.length;j++)
                     {
                         if(liabilities[j].Payment_Frequency == "month")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount;
                         }
                         else if(liabilities[j].Payment_Frequency == "week")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*4;
                         }
                         else if(liabilities[j].Payment_Frequency == "fortnight")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*2;
                         }
                         else{
                             total_expense=total_expense;
                         }
                     }
                 }
             }
             else
             {
                  total_expense = total_expense;
                   if(liabilities !=undefined && liabilities.length >=1)
                 {
                     for(var j =0;j<liabilities.length;j++)
                     {
                         if(liabilities[j].Payment_Frequency == "month")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount;
                         }
                         else if(liabilities[j].Payment_Frequency == "week")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*4;
                         }
                         else if(liabilities[j].Payment_Frequency == "fortnight")
                         {
                             total_expense=total_expense+liabilities[j].Payable_Amount*2;
                         }
                         else{
                             total_expense=total_expense;
                         }
                     }
                 }
             }
         }*/
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });

        console.log("Everything", total_expense, emi, (total_earning - total_expense - emi))

        //     if((total_earning-total_expense-emi)<0)
        //     {
        //         this.chart_Flag=false;
        //         this.lessIncome= true;
        //     }
        //     else{
        //         this.lessIncome= false;
        //         this.chart_Flag=true;
        //     this.barChartLabels = [ "Expenses " , "EMI", "Balance" ];
        //            this.barChartData = [total_expense,emi,(total_earning-total_expense-emi)];
        //   //this.barChartData =[10,15,20];
        //   this.total_emi_show=formatter.format(emi);
        //   this.total_expense_show=formatter.format(total_expense);
        //   this.total_remaining_show=formatter.format((total_earning - total_expense-emi));
        //     }
        promise.then((e) => {
            console.log(e);
            annual_income_varaible = total_earning * 12;
            console.log("Annual total Earning is", annual_income_varaible);
            console.log("Borrowing Table", this.annualSalTable, this.expense_allowanceTable, this.other_incomeTable, this.rental_incomeTable);
            var minimumAllowance = 0;
            if (annual_income_varaible > rental_income_variable && annual_income_varaible > other_income_varaible) {
                console.log("annaul income is more");
                minimumAllowance = this.annualSalTable[this.model.supportFinancially];
            }
            else if (rental_income_variable > annual_income_varaible && rental_income_variable > other_income_varaible) {
                console.log("rental income is more");
                minimumAllowance = this.rental_incomeTable[this.model.supportFinancially];
            }
            else if (other_income_varaible > annual_income_varaible && other_income_varaible > rental_income_variable) {
                console.log("other income is more");
                minimumAllowance = this.other_incomeTable[this.model.supportFinancially];
            }
            var diff_livin_allow = 0;
            var maximumBorrower = 0;
            console.log("Minimum Allowance is", minimumAllowance);
            if ((this.expense_allowanceTable[this.model.supportFinancially] * 12) < living_expenses) {
                diff_livin_allow = ((living_expenses / 12) - this.expense_allowanceTable[this.model.supportFinancially] + liabilities_expense) * 210
                console.log("differnce livin expense", diff_livin_allow);
                if (annual_income_varaible > 40000)
                    maximumBorrower = (((annual_income_varaible - minimumAllowance) * 1000) / 98) - diff_livin_allow;
                else
                    maximumBorrower = (((annual_income_varaible - minimumAllowance) * 1000) / 85) - diff_livin_allow;
                console.log("Maximum Borrowing amount is in eexpense formula", maximumBorrower);
                if (parseInt(this.model.amtborrow) > maximumBorrower) {
                    console.log("you are not allowed to borrow loan cause of your expenses");
                    this.chart_Flag = false;
                    this.lessIncome = true;
                }
                else {
                    this.lessIncome = false;
                    this.chart_Flag = true;
                    this.barChartLabels = ["Expenses ", "EMI", "Balance"];
                    this.barChartData = [total_expense, emi, (total_earning - total_expense - emi)];
                    //this.barChartData =[10,15,20];
                    this.total_emi_show = formatter.format(emi);
                    this.total_expense_show = formatter.format(total_expense);
                    this.total_remaining_show = formatter.format((total_earning - total_expense - emi));
                }

            }
            else {
                diff_livin_allow = liabilities_expense * 210
                console.log("differnce livin expense in else part", diff_livin_allow);
                if (annual_income_varaible > 40000)
                    maximumBorrower = (((annual_income_varaible - minimumAllowance) * 1000) / 98) - diff_livin_allow;
                else
                    maximumBorrower = (((annual_income_varaible - minimumAllowance) * 1000) / 85) - diff_livin_allow;


                //maximumBorrower=(((annual_income_varaible - minimumAllowance) * 1000) / 85);
                console.log("Maximum Borrowing amount ", maximumBorrower);
                if (parseInt(this.model.amtborrow) > maximumBorrower) {
                    // if ((((total_earning - minimumAllowance) * 1000) / 85) < 0) {
                    console.log("you are not allowed to borrow loan");
                    this.chart_Flag = false;
                    this.lessIncome = true;
                }
                else {
                    this.lessIncome = false;
                    this.chart_Flag = true;
                    this.barChartLabels = ["Expenses ", "EMI", "Balance"];
                    this.barChartData = [total_expense, emi, (total_earning - total_expense - emi)];
                    //this.barChartData =[10,15,20];
                    this.total_emi_show = formatter.format(emi);
                    this.total_expense_show = formatter.format(total_expense);
                    this.total_remaining_show = formatter.format((total_earning - total_expense - emi));
                }
            }
            if (maximumBorrower > 0)
                this.maximumBorrower = formatter.format(maximumBorrower);
            else
                this.maximumBorrower = "0.00";
        })
        this.userExistingFlag = this.oaoService.getUserExistingFlag();


    }

    successAccount() {

        if (this.applicantType == "expense_graph") {
            this.model.skip = true;
            this.model.verification_auto = this.verification_auto;
            this.oaoService.setPersonalDetailsObject(this.model);
        } else {
            this.model.skip = true;
            this.model.verification_auto = this.verification_auto;
            this.oaoService.setPersonalDetailsObject(this.model);
        }
        console.log(this.model);

        if (this.singleORjoint == 'single') {
            switch (this.model.product_type_code) {
                case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                    .subscribe(
                    data => {
                        console.log(data);
                        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
                            .subscribe(
                            data => {
                                if (data.message == "Failed") {
                                    this.isLoading = false;
                                    jQuery("#validation").modal('show');
                                }
                                else {
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
                    }
                    );
                    break;
                case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                    .subscribe(
                    data => {
                        console.log(data);
                        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_005')
                            .subscribe(
                            data => {
                                if (data.message == "Failed") {
                                    console.log("validation failed", data.Result);
                                    this.isLoading = false;
                                    jQuery("#validation").modal('show');
                                }
                                else {
                                    jQuery("#validation").hide();
                                    console.log(data);
                                    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_005')
                                        .subscribe(
                                        data => {
                                            this.inf_loan = data.result[0].property_value;
                                            jQuery('#success').modal('show');
                                        }
                                        );

                                }
                            }
                            );
                    }
                    );
                    break;
                default: console.log("Page not found");

            }
        } else {
            const promise = new Promise((resolve, reject) => {
                this.model1 = this.oaoService.getPersonalDetailsObject();
                this.model1.skip = true;
                switch (this.model1.product_type_code) {
                    case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model1)
                        .subscribe(
                        data => {
                            this.oaoService.GetApplicantsDetail(this.model1.application_id)
                                .subscribe(
                                data => {
                                    console.log("Account Details:")
                                    console.log(data.result[0])
                                    this.model1 = data.result[0];
                                });
                        });
                        break;
                    case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model1)
                        .subscribe(
                        data => {
                            this.oaoService.GetApplicantsDetail(this.model1.application_id)
                                .subscribe(
                                data => {
                                    console.log("Account Details:")
                                    console.log(data.result[0])
                                    this.model1 = data.result[0];
                                });
                        });
                        break;
                }
                resolve();
            });
            const promise1 = new Promise((resolve, reject) => {
                this.model2 = this.oaoService.getJointPersonalDetailsObject();
                this.model2.skip = true;
                switch (this.model2.product_type_code) {
                    case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model2)
                        .subscribe(
                        data => {
                            if (data.message == "Failed") {
                                console.log("validation failed", data.Result);
                                this.isLoading = false;
                                jQuery("#validation").modal('show');
                            }
                            else {
                                jQuery("#validation").hide();
                                console.log(data);
                                this.oaoService.GetApplicantsDetail(this.model2.application_id)
                                    .subscribe(
                                    data => {
                                        console.log(data);
                                        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
                                            .subscribe(
                                            data => {
                                                this.model2 = data.result[0];
                                                this.inf_loan = data.result[0].property_value;
                                                jQuery('#success').modal('show');
                                            });
                                    });
                            }

                        });
                        break;
                    case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model2)
                        .subscribe(
                        data => {
                            this.oaoService.GetApplicantsDetail(this.model2.application_id)
                                .subscribe(
                                data => {
                                    if (data.message == "Failed") {
                                        console.log("validation failed", data.Result);
                                        this.isLoading = false;
                                        jQuery("#validation").modal('show');
                                    }
                                    else {
                                        jQuery("#validation").hide();
                                        console.log(data);
                                        this.oaoService.GetApplicantsDetail(this.model2.application_id)
                                            .subscribe(
                                            data => {
                                                console.log(data);
                                                this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
                                                    .subscribe(
                                                    data => {
                                                        this.model2 = data.result[0];
                                                        this.inf_loan = data.result[0].property_value;
                                                        jQuery('#success').modal('show');
                                                    });
                                            });
                                    }

                                });
                        });
                        break;
                }
                resolve();
            });
        }


    }
    gotoLoan() {

        this.oaoService.updatesection("section_2", this.model.application_id)
            .subscribe(
            data => {
                // this.oaoService.setData(data.Result);
                console.log("in data", data);
                this.router.navigate(['../loanDetails'], { relativeTo: this.route });
            }
            );
    }
    goBack() {
        this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(["../assets"], { relativeTo: this.route });
            });
    }
    onSubmitMain() {
        if (this.idCheck_v == "O") {
            this.showSave();
        } else if (this.idCheck_v == "M") {
            this.isLoading = !this.isLoading;
            this.router.navigate(['../onlineIdCheck'], { relativeTo: this.route });
        } else {
            this.successAccount();
        }
    }
    showSave() {
        jQuery('#onlineid-check').modal('show');

    }

    ngOnInit() {
        jQuery('.modal').insertAfter(jQuery('body'));
    }

    setNextFlag(flag) {
        this.flagStatus = flag;
    }

}
