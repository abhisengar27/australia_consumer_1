import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
//import {CrossSellDetailsObject} from "../interfaces/crossSellDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan

import { CustomeStyleInterface } from "../interfaces/customeStyle.interface";
@Injectable()
export class OAOService
{
    //baseURL:string = "https://uploadfortheme.herokuapp.com";
      baseURL:string = "http://localhost:3000";
	adminUrl:string="http://localhost:3001";
     //private baseURL:String = "http://192.168.1.66:3000";
    data:PersonalDetailsObject;
    officeAccountLoggedIn:boolean;
    userExistingFlag:boolean; //chandan
    loginFlag:boolean=false;//chandan
    userDetailsObject = new UserDetailsObject('', '');  //chandan
    personalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    jointModdel = new PersonalDetailsObject('', '', '', '', '', '', '');
    //crossSellDetailsObject= new CrossSellDetailsObject('', '', '', '', '', '', '');

    public customeStyleInterface = new CustomeStyleInterface();

    callMatchingCustomerFlag: boolean = false;

    progressBardata: string[] = ['', '', '', '', ''];

    private isResume: boolean = false;
    private campaignId: string = '';

    constructor(private http: Http) { }
    //LOGO

    getLOGO() {
        return this.http.get(this.adminUrl + '/api/getLOGO')
            .map((response: Response) => response.json())
    }

    //STYLE

    getCustomeStyle() {
        return this.http.get(this.adminUrl + '/api/getCustomeTheme')
            .map((response: Response) => response.json())
    }

    updateThemeStyleFlag() {
        return this.http.get(this.adminUrl + '/api/updateThemeStyleFlag')
            .map((response: Response) => response.json())
    }

    generateCustomeStyle(customeStyleCode: String, s_flag: boolean) {
        // .btn-apply:active{background: #E35A40 !important;color: #fff;outline: 0;}
        // .btn-apply {background: green !important;border-radius: 2px;padding: 10px 30px;font-weight: 500;font-size: 18px;color: #FFFFFF;letter-spacing: -0.37px;transition: all 0.4s ease;}
        // var customeStyleCode	=	".btn-apply {background: red !important;} .btn-secondary {background: red !important;}.btn-form-primary {background: red !important;}.btn-default:hover{background-color:red !important;}.btn-default:active{background-color:red !important;}.btn-default:focus{background-color:red !important;}.btn-default{background-color:red !important;}   .button {background-color:red !important;}.button1{background-color:red !important;}";
        // console.log("serice")
        // console.log(customeStyleCode)
        // return this.http.get(`${this.baseURL}/api/generateCustomeCssFile/`+customeStyleCode)
        // .map((response: Response) => response.json())
        // console.log(s_flag)

        const body = JSON.stringify({ StyleSheet: customeStyleCode, status_flag: s_flag });

        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/generateCustomeCssFile`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    // THEME SETTER GETTER

    setCustomeStyleSetter(customeStyleInterface: CustomeStyleInterface) {
        this.customeStyleInterface = customeStyleInterface;
        // console.log(customeStyleInterface);
    }
    getCustomeStyleGetter() {
        return this.customeStyleInterface;
    }



    // END THEME SETTER GETTER


    //-------------onlineIdcheck----------------
    onlineIdcheck(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("onlineIdcheck" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/idcheck/onlineidcheck`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    //------------------By Rajath-------------
    setOfficeAccountLoggedIn(officeAcc: boolean) {
        this.officeAccountLoggedIn = officeAcc;
    }
    getOfficeAccountLoggedIn() {
        return this.officeAccountLoggedIn;
    }

    // setCrossSellDetailsObject(crossSellDetailsObject:CrossSellDetailsObject){
    //     this.crossSellDetailsObject=crossSellDetailsObject;
    // }
    // getCrossSellDetailsObject(){
    //     return this.crossSellDetailsObject;
    // }
    //chandan
    setPersonalDetailsObject(personalDetailsObject: PersonalDetailsObject) {
        this.personalDetailsObject = personalDetailsObject;
    }
    getPersonalDetailsObject() {
        return this.personalDetailsObject;
    }
    setJointPersonalDetailsObject(jointModel_v: PersonalDetailsObject) {
        this.jointModdel = jointModel_v;
    }
    getJointPersonalDetailsObject() {
        return this.jointModdel;
    }
    setUserDetailsObject(userDetailsObject: UserDetailsObject) {
        // console.log("service setUserDeatils()")
        this.userDetailsObject = userDetailsObject;
    }
    getUserDetailsObject() {
        //console.log("service getUserDetailsObject()");
        return this.userDetailsObject;
    }

    setUserExistingFlag(userExistingFlag: boolean) {
        this.userExistingFlag = userExistingFlag;
    }
    getUserExistingFlag() {
        return this.userExistingFlag;
    }

    Login(user: UserDetailsObject) {
        const body = JSON.stringify(user);
        // console.log("service Login()"+body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/loginAPI/login`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    GetLoginUserDetails(user: UserDetailsObject) {
        const body = JSON.stringify(user);
        // console.log("service GetUserDetails()"+body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/loginAPI/getLoginUserDetails`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    setLoginFlag(loginFlag: boolean) {
        this.loginFlag = loginFlag;
    }
    getLoginFlag() {
        return this.loginFlag;
    }

    registerInternetBanking(user: UserDetailsObject) {
        const body = JSON.stringify(user);
        // console.log("service registerInternetBanking()"+body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/loginAPI/regIntBanking`, body, { headers: headers })
            .map((response: Response) => response.json());
    }

    logout() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.get(`${this.baseURL}/loginAPI/logout`, { headers: headers })
            .map((response: Response) => response.json());
    }
    setCallMatchingCustomerFlag(callMatchingCustomerFlag: boolean) {
        this.callMatchingCustomerFlag = callMatchingCustomerFlag;
    }
    getCallMatchingCustomerFlag() {
        return this.callMatchingCustomerFlag;
    }
    checkMatchingCustomer(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        //console.log("service registerInternetBanking()"+body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/loginAPI/checkDup`, body, { headers: headers })
            .map((response: Response) => response.json());
    }
    //chandan

    OAOCreateOrUpdateApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        console.log("Before Post");
        return this.http.post(`${this.baseURL}/api/Applicants`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    OAOSaveApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        console.log("Before Post");
        return this.http.post(`${this.baseURL}/api/SaveApplicants`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    OAOCreateOrUpdateHomeloanApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/HomeLoanApplicants`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    OAOCreateOrUpdatePersonalloanApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service"+body);
        console.log("INSIDE PRL SERVICE");
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/PersonalLoanApplicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    GetPropertyDetails(PropertyType: String, Property: String) {
        return this.http.get(`${this.baseURL}/api/PropertyDetails/` + PropertyType + '/' + Property)
            .map((response: Response) => response.json())
    }
    GetProductDetail(ProductCode: String) {
        return this.http.get(`${this.baseURL}/api/ProductDetails/` + ProductCode)
            .map((response: Response) => response.json())
    }
    GetApplicantsDetail(Applicants_id: String) {
        // console.log("apppp"+Applicants_id);
        return this.http.get(`${this.baseURL}/api/ApplicantsRecord/` + Applicants_id)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    setCampaignId(data: string) {
        this.campaignId = data;
    }
    getCampaignId() {
        return this.campaignId;
    }
    setData(data: PersonalDetailsObject) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getConfig() {
        return this.http.get(`${this.baseURL}/api/getConfig`)
            .map((response: Response) => response.json())

    }

    getConfigByKey(key: string, id: string, who: string) {
        console.log("id is" + id + " and who is " + who);
        return this.http.get(`${this.baseURL}/api/getConfig/${key}/${id}/${who}`)
            .map((response: Response) => response.json())
    }

    prod_code: string
    updatesection(section: String, app_id: String) {
        console.log("update", app_id)
        this.prod_code = this.personalDetailsObject.product_type_code;
        return this.http.get(`${this.baseURL}/api/UpdateSection/` + app_id + '/' + section + '/' + this.prod_code)
            .map((response: Response) => response.json())
    }

    setFb: boolean = false;
    setFbData(set: boolean) {
        this.setFb = set;
    }
    getFbData() {
        return this.setFb;
    }


    //OTP
    sendOTP(mobile: string, dob: string) {
        const body = JSON.stringify({ mobile: mobile, dob: dob });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/sendOTP`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    checkOTP(otp: number) {
        const body = JSON.stringify({ otp: otp });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/verifyOTP`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    tokenValidation(token: string) {
        const body = JSON.stringify({ token: token });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/tokenValidation`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    getContents() {
        return this.http.get(`${this.baseURL}/api/getContent`)
            .map((response: Response) => response.json())
    }
    setResumeStatus(status: boolean) {
        this.isResume = status;
    }
    getResumeStatus() {
        return this.isResume;
    }
    /**
     * Fetch Cross Sell Product Type
     */
    GetProduct(Product: String) {
        return this.http.get(`${this.baseURL}/api/GetChildProduct1/` + Product)
            .map((response: Response) => response.json())
    }
    /**Cross Sell creation */
    OAOCreateOrUpdateCrossSellApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/CreateCrossSellApplicants`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    /**Cross Sell */
    OAOCrossSellCreate(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/CrossSellApplicants`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    getProductDetails(prod_id: string) {
        return this.http.get(`${this.baseURL}/api/ProductDetails/` + prod_id)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }


    adminControl_sendMail(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service" + body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        console.log("Before Post");
        return this.http.post(`${this.baseURL}/api/sendMail`, body, { headers: headers })
            .map((response: Response) => response.json())
    }

    /**Remove File */

    RemoveUploadedFile(folderName: String, fileName: String) {
        console.log('Inside remove file...', folderName);
        console.log('Inside remove file...', fileName);
        return this.http.get(`${this.baseURL}/api/file/remove/` + folderName + '/' + fileName)
            .map(response =>
                //console.log(JSON.stringify(response));
                response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getDecryptedKey(key: String) {
        const body = JSON.stringify({ "decryptMsg": key });
        // console.log("service Login()"+body);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/decryption`, body, { headers: headers })
            .map((response: Response) => response.json())

    }
    getProduct() {
        return this.http.get(`${this.baseURL}/api/Products`)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    getRealtiveProduct(ProductTypeCode) {
        return this.http.get(`${this.baseURL}/api/RelativeProducts/` + ProductTypeCode)
            .map(response => response.json().result)
            .catch((error: Response) => Observable.throw(error.json().result));
    }
    /**generate applicant id */
    generateApplicationID() {
        return this.http.get('/api/generateApplicationId')
            .map((response: Response) => response.json(), (err) => { console.log(err) })
    }
    /**generate  */
    getAttachedFile() {
        return this.http.get(`${this.baseURL}/api/GetAttachedFile/`)
            .map((response: Response) => response.json())
    }
    getFreeFieldDetails() {
        return this.http.get(`${this.baseURL}/api/getFreeFieldDetails`)
            .map((response: Response) => response.json())
    }

    getOTPToVerifyMobileNumber(mobile: any) {        
        const body = JSON.stringify({ mobile: mobile });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/sendOTPTOVerifyMobileNumber`, body, { headers: headers })
            .map((response: Response) => {
            console.log("Service m otp: ",response.json());
                response.json()
            }
            )
    }
    getOTPToVerifyEmail(email: any,fname :any) {
        const body = JSON.stringify({ email: email,fname:fname });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseURL}/api/sendOTPTOVerifyEmail`, body, { headers: headers })
            .map((response: Response) => response.json())
    }
    getBorrowingCalculatorTable(){
        return this.http.get(`${this.baseURL}/api/getBorrowingCalculatorTable`)
            .map((response: Response) => response.json())
    }
} 

