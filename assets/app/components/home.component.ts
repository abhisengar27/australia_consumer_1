import { Component ,AfterViewInit,OnInit,Inject} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {OAOService} from "../services/OAO.Service";
import { ConfigDetails } from "../interfaces/configinterface";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { DOCUMENT } from '@angular/platform-browser';

import { CustomeStyleInterface } from "../interfaces/customeStyle.interface";


import {checkbox} from '../interfaces/checkboxinterface';
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { DatePipe } from '@angular/common';
import {CommonUtils} from '../validators/commonUtils';
import { Observable, Subscription } from 'rxjs/Rx';
import {GoogleAnalyticsEventsService} from "../services/GoogleAnalyticsEvents.Service";
import { ProductsInterface } from '../interfaces/product.interface';
declare var google: any;
declare var googleLoaded: any;

declare var jQuery: any;
declare var moment: any;
@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
    product: ProductsInterface[];
    jointAppn:boolean=false
    productCodeNamePair: Map<String, String> = new Map<String, String>();
  ticks = 60;
    private timer;
     configMsg: ConfigDetails
     static id_app;
    resend:boolean=false
    date_v:string;
    content:any;
    isDataAvailable:boolean=false;
    products:any;
    wrongDetails_v:boolean=false;
    savedApp_v:boolean=false
    myForm:boolean=false;
    // Subscription object
    private sub: Subscription;
    public modal = new checkbox(false, false);
    public product_code: string="";
    public campaign_id:string;
    public dis_v: boolean = false;
    public img: string;
  static adminId:string;
    public FbData: boolean = false;
    public userExistingFlag: boolean; //chandan
    public fName: any; //chandan
    public age: any;//chandan
    private userDetailsObject = new UserDetailsObject('', '');  //chandan
    private model = new PersonalDetailsObject('', '', '', '', '', '', ''); //chandan
    public modelarray = new PersonalDetailsObject('', '', '', '', '', '', '');
    public modelArray: any;
	
	public default_css_flag:boolean;
	//dummy comment
	public customeTheme= new CustomeStyleInterface();
    /**Initialization for md2 date component */
    isRequired = false;
    isDisabled = false;
    isOpenOnFocus = false;
    isOpen = false;
    today: Date = new Date();
    type: string = 'date';
    types: Array<any> = [
        { text: 'Date', value: 'date' },
        { text: 'Time', value: 'time' },
        { text: 'Date Time', value: 'datetime' }];

        mode: string = 'auto';
        modes: Array<any> = [
            { text: 'Auto', value: 'auto' },
            { text: 'Portrait', value: 'portrait' },
            { text: 'Landscape', value: 'landscape' }];

        container: string = 'inline';
        containers: Array<any> = [
            { text: 'Inline', value: 'inline' },
            { text: 'Dialog', value: 'dialog' }];

        date: Date = null;
        minDate: Date = null;
        maxDate: Date = null;
		
		private setProductBckColor:any;
		
		private setProductBtnColor:any;


        openDatepicker() {
            this.isOpen = true;
            setTimeout(() => {
                this.isOpen = false;
            }, 1000);
        }
        /**end of md2 component */
    constructor(@Inject(DOCUMENT) private document,private oaoService: OAOService, private router: Router, private fb: FacebookService, private datePipe: DatePipe, public route: ActivatedRoute, private gaEventsService: GoogleAnalyticsEventsService) {

this.oaoService.getCustomeStyle().subscribe((data)=>{
		console.log("custome style record");
			console.log(data);
			
			this.customeTheme=data.Result[0];
			this.oaoService.setCustomeStyleSetter(this.customeTheme);
			
			
		},(error)=>{
			console.log(error);
		},()=>{
			
			var customeStyleRecord=this.oaoService.getCustomeStyleGetter();
			 
	
	var css=this.oaoService.getCustomeStyleGetter();
		console.log("====================css=======================");
		console.log(css);
		var customeStyleCode	=	".btn-apply {background: "+css.bck_btn_color+" !important;} .btn-secondary {background: "+css.bck_btn_color+" !important;}.btn-form-primary {background: "+css.bck_btn_color+" !important;}.btn-default:hover{background-color:"+css.bck_btn_color+" !important;}.btn-default:active{background-color:"+css.bck_btn_color+" !important;}.btn-default:focus{background-color:"+css.bck_btn_color+" !important;}.btn-default{background-color:"+css.bck_btn_color+" !important;}   .button {background-color:"+css.bck_btn_color+" !important;}.button1{background-color:"+css.bck_btn_color+" !important;}.oao-panel .panel .panel-heading{background:"+css.background_color+" !important;}.info-bg{background:"+css.background_color+" !important;}.progress-button{background-color: "+css.background_color+" !important;}.success-modal .regbtn{background-color: "+css.bck_btn_color+" !important;} success-modal .regbtn:focus{background-color: "+css.bck_btn_color+" !important;} .card-title {color: "+css.text_color+" !important; font-family: "+css.font_family+" !important;}.progress-bar2{background-color:"+css.progress_bar_1+" !important;}.progress-bar { background-color:"+css.progress_bar_2+" !important;}.form-label { color: "+css.text_color+" !important; font-family: "+css.font_family+" !important;}";
		// console.log(customeStyleCode);
		 this.oaoService.generateCustomeStyle(customeStyleCode,css.updated_flag).subscribe((data)=>{
		  // console.log("custome css style record");
		  // console.log(data);
		  if(css.reset_flag==false){
			this.document.getElementById('custStyle').setAttribute('href', './assets/css/dynamicStyle.css');  
		  }
		  
		  if(css.updated_flag==true){
			this.oaoService.updateThemeStyleFlag().subscribe((data)=>{
			  console.log(data);
		  })  
		  }
		  
	  })
			
		})
        this.oaoService.getProduct().subscribe(
            (subproducts: any) => {
                this.products = subproducts;
                //console.log("Products: " , this.products);

                for (var i = 0; i < this.products.length; i++) {
                    this.productCodeNamePair.set(this.products[i].product_code, this.products[i].product_name);
                    //this.products[i].product_code_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
                    //this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                    // console.log(this.productTypeCodeNamePair);
                }
            }
        );
    
	  //console.log("office account>>",this.oaoService.getOfficeAccountLoggedIn());
	    if(this.oaoService.getOfficeAccountLoggedIn()==undefined){
			console.log('Check Office account logged in');
			//router.navigate(['/office365']);
		}else if (this.oaoService.getOfficeAccountLoggedIn()==true){
			// Do nothing
		} else{
			this.oaoService.setOfficeAccountLoggedIn(false);
		}
        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log(this.configMsg)
            });
           
        this.model = this.oaoService.getPersonalDetailsObject();
        console.log("HomeComponent constructor()");
        fb.init({
            appId: '658955644261049',
            version: 'v2.8'
        });
        
        this.router.routerState.root.queryParams.subscribe(params => {
            //this.model.source= "" + params['utm_source'];
             console.log("Length: "+JSON.stringify(params).length);
            console.log(JSON.stringify(params).length==0);
            if(JSON.stringify(params).length>2){
           this.product_code = "" + params['utm_medium'];
            this.campaign_id = ""+params['utm_campaign'];
            this.oaoService.setCampaignId(this.campaign_id);
           console.log("campaign_id hello: "+this.campaign_id);
           console.log("condition: "+this.product_code);
          
            }
           // jQuery('#resume-modal').modal('show');
           // jQuery('#appRef').val(app_id);
            //this.selectedId = +params['id'];
        });


    }//constructor

    //facebook login
    private handleError(error) {
        console.error('Error processing action', error);
    }
    resolved(captchaResponse: string) {
    console.log(this.myForm);
    this.myForm=true;
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    }
    private login() {
       console.log('Initializing Facebook');
       this.fb.login()
          .then((res: LoginResponse) => {
            console.log('Logged in', res);
         //to get profile data
         this.fb.api('/me','get', {fields:['first_name','last_name','birthday','id','email','location']})
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.oaoService.setFbData(true);
        this.processFBdata(res);
      })
      .catch(this.handleError);
      })
      .catch(this.handleError);
  }
    CalledByParent(result:any){    
    console.log("printign event emitter",result.type);
    this.setModalType(result.type);
}
   private processFBdata(data)
    {
                  if(data.first_name==null){}else{this.model.fname=data.first_name;}
                  if(data.last_name==null){}else{this.model.lname=data.last_name;}
                  if(data.email==null){}else{this.model.email=data.email;}
                  if(data.birthday==null){}else{this.model.dob=data.birthday;}
                  if(data.location==null){}else{this.model.address=data.location;}
                    this.oaoService.setData(this.model);
                    this.FbData=this.oaoService.getFbData();
                    this.modal.aus_citizen=true;
                    this.modal.age_test=true;
                    jQuery('#savingsaccount-modal').modal('show');

    }
     clear() {
       window.location.href=this.oaoService.baseURL;
    }
    clearError(){
        this.wrongDetails_v=false;
        this.savedApp_v=false;
    }
    onSearch(mobile: string) {
        console.log(mobile);
        // HomeComponent.id_app = mobile;
        var formatedDate = this.datePipe.transform(this.date_v, 'MM/dd/yyyy');
        console.log('Formated date id Check', formatedDate);
        this.date_v = formatedDate;
        if (mobile != null && mobile != '' && mobile != undefined && this.date_v != null && this.date_v != '' && this.date_v != undefined) {
            this.oaoService.sendOTP(mobile, formatedDate).subscribe(
                data => {
                    console.log("send otp service");
                    console.log(data)
                    if (data.success == true && data.savedApp == false) {
                        this.resend = false;
                        this.modelarray = data.result;
                        this.modelArray = data.result;
                        console.log(this.modelarray);
                        console.log(this.modelArray);
                        console.log("==");
                        for (var i = 0; i < this.modelArray.length; i++) {
                            this.modelArray[i].product_name =this.productCodeNamePair.get(this.modelArray[i].product_code );
                        }
                        console.log(this.modelarray);
                        console.log(this.modelArray);
                        console.log("==");
                        this.oaoService.setPersonalDetailsObject(this.model);
                        this.timer = Observable.timer(1000, 1000);
                        this.sub = this.timer.subscribe(t => this.tickerFunc(t));
                    } else if (data.savedApp == true) {
                        this.savedApp_v = true;
                    } else {
                        this.wrongDetails_v = true;
                    }
                });
        } else {
            this.wrongDetails_v = true;
        }
}
tickerFunc(tick){
        this.ticks -=1
        if(this.ticks<=0){
            this.sub.unsubscribe();
            this.resend=true
            this.ticks=60;
        }
    }
onVerify(verify:number){
    console.log(verify);
    this.oaoService.checkOTP(verify).subscribe(
            data => {
                console.log(data)
                // this.getRouteLink(data.success);
                console.log("length");
                console.log(this.modelArray.length);
                if(this.modelArray.length>1){
                    jQuery('#resume-modal2').modal('show');
                }else{
                    this.proceed(0);
                }
                
            });
    }

    public getRouteLink(data) {
        this.setProduct_Name(this.model.product_code);
       console.log(data)
                 if(data==true){
                     var sec_v= "";
            var prod_t = this.model.product_type_code;
            console.log(prod_t)
            for (var i = 1; i <= this.model.no_of_section; i++) {
                console.log(this.model);
                var sec = "section_" + i;
                var prod_code = "section_" + prod_t;
                console.log(prod_code)
                console.log("value: " + this.model[prod_code][0][sec]);
                if (this.model[prod_code][0][sec] == false) {
                    console.log(sec);
                    sec_v = sec;
                    console.log(sec_v)
                    break;
                }
            }
            console.log("model",this.model)
            console.log("product name",this.model.product_name);
            console.log("product code",this.model.product_code);
            if (this.model.is_admin) {
                this.oaoService.adminControl_sendMail(this.model).subscribe(
                    data => {
                        console.log("mail sent", data);
                    }
                )
            }
            if (sec_v != "") {
                var link = this.configMsg[prod_t][sec_v].route_v;
                console.log(link);
            this.oaoService.getConfigByKey(this.model.product_type_code,HomeComponent.id_app, HomeComponent.adminId)
           .subscribe((response) => {
               this.model.progressBarConfig = JSON.parse(JSON.stringify(response.data));

              this.model.sectionCount = Object.keys(this.model.progressBarConfig).length;

              this.oaoService.setPersonalDetailsObject(this.model);
              this.oaoService.setResumeStatus(true);

                        console.log("1");
                        if(this.jointAppn==true && this.model[prod_code][0].section_1 == false){
                            this.router.navigate(['/completeInformation/personalBasicInfo']);
                        }else{
                            let routeTo = "completeInformation/" + link;
                        console.log(routeTo);
                        this.router.navigate(['/' + routeTo]);
                        }
                        

           });
                    }
                 }
}

    private ngOnInit() //to active model and hide the buttons  while coming from login page
    {
        console.log("HomeComponent ngOnInit()");
        console.log("Checking the user type:");
        this.oaoService.getContents()
          .subscribe((data)=>{
          console.log("Comtents is");
          console.log(data);
          this.content = data.result;
          console.log(this.content);
          this.products = data.products;
          console.log(this.products);
          this.isDataAvailable = true;
           if(this.product_code!=null && this.product_code!=undefined && this.product_code!=""){
           console.log("If m aya");
           this.setModalType(this.product_code);
           }
          });
        this.userExistingFlag=this.oaoService.getUserExistingFlag();
        if(this.userExistingFlag)
        {
            console.log("Existing user");
            this.GetUserDetails(); //get the all details of user by sending user name
        }
        else{
            //window.location.reload();
            console.log("New user");
        }
    }
    ngAfterViewInit() {
        
        this.route.params.subscribe(params => {
            let app_id = params['appid'];
            let prod_type = params['prod_type'];
          //  let CampID = params['CampID'];
            let adminId_v = params['adminid'];
             HomeComponent.id_app = app_id;
             //HomeComponent.adminId = adminId_v;
             console.log("before modal"+this.model.adminId);
             this.model = this.oaoService.getPersonalDetailsObject();
             this.model.adminId = adminId_v;
             this.model.is_admin=false;
             console.log("adminID from model"+ this.model.adminId);
             console.log(this.model);
            //console.log("admin is idskkj "+adminId_v);
            console.log("application id is" + HomeComponent.id_app);
            /*  if (prod_type != null && prod_type != '' && prod_type != undefined && CampID != null && CampID != '' && CampID != undefined) {
                  console.log(prod_type + "\t" + CampID)
                  this.model.campaign_id = CampID;
                  this.setModalType(prod_type);
              }*/
            if (app_id != null && app_id != '' && app_id != undefined && adminId_v != null && adminId_v!="joint") {
                console.log("===")
                this.oaoService.getDecryptedKey(app_id).subscribe(
                    (data) => {
                        console.log(data)
                        app_id = data.key;
                        HomeComponent.id_app = app_id;
                        this.model.is_admin = true;
                        HomeComponent.adminId = adminId_v;
                        console.log("his.model.adminId")
                        console.log(HomeComponent.adminId);
                        console.log(this.model);
                        this.oaoService.setPersonalDetailsObject(this.model);
                        console.log(this.model.adminId);
                        this.getAppDetail_Admin(app_id);
                    });

            }
            else if (app_id != null && app_id != '' && app_id != undefined || adminId_v=="joint") {
                if(adminId_v){
                    this.jointAppn=true;
                }
                jQuery('#resume-modal').modal('show');
                jQuery('#mobile').val(app_id);


            }
        }
        );
       
         
    }

  private loginFlag()
  {
      this.oaoService.setLoginFlag(true);
  }

  private GetUserDetails()
  {
      console.log("GetUserDetails()");
       this.oaoService.GetLoginUserDetails(this.oaoService.getUserDetailsObject()).subscribe(
            data => {
                var name=data.result.fName;
                name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                 return letter.toUpperCase();});
                this.fName=name;
                if(parseInt(data.result.age)<18)
                {
                    jQuery('#not_eligible-modal').modal('show');
                }
                else
                {
                    this.model.title=data.result.title;
                    this.model.fname=name;
                    this.model.mname=data.result.mName;
                    this.model.lname=data.result.lName;
                    this.model.dob=data.result.dob;
                    this.model.mobile=data.result.mobile;
                    this.model.email=data.result.email;
                    this.model.address=data.result.homeAddress;
                    this.model.streetnum=data.result.streetNum;
                     this.model.streetname=data.result.streetName;
                      this.model.state=data.result.state;
                       this.model.postcode=data.result.postCode;
                        this.model.housenum=data.result.houseNum;
                         this.model.pstreetnum=data.result.pstreetNum;
                     this.model.pstreetname=data.result.pstreetName;
                      this.model.pstate=data.result.pstate;
                       this.model.ppostcode=data.result.ppostCode;
                    this.model.paddress=data.result.postalAddress;
                     this.model.phousenum=data.result.phouseNum;
                   
                    this.model.tfn=data.result.TFN;
                    this.model.exemption=data.result.exemptionReason;
                     this.model.core_customer_id=data.result.userId;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.router.navigate(['/completeInformation']);
                }
            });
  }
//once user selected the product type(type of account)
    private setModalType(prod_code: string)
    {
        console.log("setModalType():"+prod_code);
	  this.gaEventsService.emitEvent('OAO_Products', this.model.product_name, prod_code, 2);
/*
        this.model.product_code=prod_code;
		    this.img=prod_code;
        this.oaoService.GetPropertyDetails('commonCodes','PRODUCT_TYPE')
        .subscribe(
           data =>{
              var count   =   Object.keys( data.result ).length;
              for(var i = 0; i < count; i++)
              {
                   if(data.result[i].property_value=== this.model.product_code)
                   {
                       this.model.product_type=data.result[i].property_desc;
                       this.oaoService.setPersonalDetailsObject(this.model); //setting the values
                   }
                }//for
            });
            */
        this.model.product_code = prod_code;
        console.log(prod_code);
        this.setProductName(prod_code);
        console.log("Inside function");
       
    }
    setProductName(prod_code: string) {
      
        this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                if (data.result[0].product_code == prod_code) {
                    this.model.product_name = data.result[0].product_name;
                    this.model.product_type_code = data.result[0].child_of;
                    this.img = this.model.product_type_code;
                    this.model.minimumAge = data.result[0].min_age;
                    this.model.maximumAge = data.result[0].max_age;
                    this.model.product_code = prod_code;
                    this.campaign_id = this.oaoService.getCampaignId();
                    this.model.campaign_id = this.campaign_id;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    if(this.model.product_type_code == "PRL" || this.model.product_type_code == "HML"){
                    jQuery('#savingsaccount-modal1').modal('show');
                    }else{
                        jQuery('#savingsaccount-modal').modal('show');
                    }
                }
            }
        )
    }
	        setProduct_Name(prod_code: string) {
      
        this.oaoService.GetProductDetail(prod_code).subscribe(
            data => {
                if (data.result[0].product_code == prod_code) {
                    this.model.product_name = data.result[0].product_name;
                    this.model.product_type_code = data.result[0].child_of;
                    
                       this.model.product_code = prod_code;
                    console.log("productname", this.model.product_name)
                    this.oaoService.setPersonalDetailsObject(this.model);
                    
                   
                }
            }
        )
    }
    private setFalse() {
        this.modal.age_test = false;
        this.modal.aus_citizen = false;
        this.dis_v = true;
        this.logout(); //chandan
    }

    private logout()
    {
        if(this.userExistingFlag)
        {
            this.oaoService.setUserExistingFlag(false);
            this.userExistingFlag=false;
            this.oaoService.logout().subscribe(
            data => {console.log(data);});
            console.log("loged out");
        }

    }
    getAppDetail_Admin(app_id){
        console.log(app_id);
          console.log("=========");
        // this.oaoService.GetApplicantsDetail(app_id).subscribe(
        //     data=>{
        //         console.log(data)
        //         this.model=data.result[0];
        //         this.getRouteLink("true");
        //     }
        // )

         this.oaoService.GetApplicantsDetail(app_id)
                .subscribe(
                data => {
                    console.log("HALUA"+app_id);
                    console.log(data.result[0]);
                    console.log(data.result);
                    console.log(data);
                    console.log("mistake");
                    console.log(this.model);
                    this.model = data.result[0];
                    this.model.adminId = HomeComponent.adminId;
                    this.model.is_admin=true;
                    console.log("mistake2");
                    console.log(this.model);
                    this.oaoService.adminControl_sendMail(this.model).subscribe(
                        data=>{
                            console.log("mail sent",data);
                        }
                    )
                    var data_v=true;
                      this.getRouteLink(data_v);
                });
    }
        proceed(i) {
        // jQuery('#resume-modal2').modal('hide');
        console.log(i);
        console.log(this.modelArray[i]);
        this.model = this.modelArray[i];
        console.log("model", this.model)
        this.oaoService.setPersonalDetailsObject(this.model);
        console.log(this.model.application_status)
        if (this.model.application_status == 'SAV' || this.model.application_status == 'INC') {
            this.getRouteLink(true);
        }
    }

}
