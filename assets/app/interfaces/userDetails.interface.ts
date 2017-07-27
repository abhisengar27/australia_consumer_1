export class UserDetailsObject {
    constructor(
        //login details
        public userName:string,
        public password:string,
//PersonalBasicInfo
        public userId?:string,
        public title?: string,
        public fName?: string,
        public mName?: string,
        public lName?: string,
        public age?: string,
        public dob?: string,
//PersonalContactInfo
        public email?: string,
        public mobile?: string,
        public homeAddress?: string,
        public postalAddress?: string,
        public houseNum?:string,
        public streetNum?:string,
        public streetName?:string,
        public state?:string,
        public postCode?:string,
        public streetType?:string,
        public suburb?:string,


  public phouseNum?:string,
        public pstreetNum?:string,
        public pstreetName?:string,
        public pstate?:string,
        public ppostCode?:string,
 public pstreetType?:string,
        public psuburb?:string,


 //TaxInformation
        public TFN?: string,
        public  exemptionReason?: string,
//OnlineIdCheck
            //passport details
        public passportNumber?: string,
        public issuingCountry?: string,
    
            //Medicare details
        public colourOfCard?: string,
        public cardNumber?: string,
        public referenceNumber ?: string,
        public validTo?: string,

            //Driving Details
        public StateOfDrivingLicenseRegistration?: string,
        public licenseNumber ?: string,
        public balance ?: number
     

    )
    {
        this.balance=balance;
        this.userName=userName;
        this.password=password;

        this.fName=fName;
        this.mName=mName;
        this.lName=lName;
        this.dob=dob;
        this.email=email;
        this.mobile=mobile;
        
        this.homeAddress=homeAddress;
        this.postalAddress=postalAddress; 
        this.state=state;
        this.streetName=streetName;
        this.streetNum=streetNum;
        this.houseNum=houseNum;
        this.postCode=postCode;
        this.streetType=streetType;
        this.suburb=suburb;
        
        this.pstate=pstate;
        this.pstreetName=pstreetName;
        this.pstreetNum=pstreetNum;
        this.phouseNum=phouseNum;
        this.ppostCode=ppostCode;
         this.pstreetType=pstreetType;
        this.psuburb=psuburb;
        
               //passport details
        this.TFN=TFN;
        this.exemptionReason=exemptionReason;
        //passport
        this.passportNumber=passportNumber; 
        this.issuingCountry=issuingCountry;

        //Medicare details
        this.colourOfCard=colourOfCard;
        this.cardNumber=cardNumber;
        this.referenceNumber=referenceNumber;
        this.validTo=validTo;  
        //Driving Details
        this.StateOfDrivingLicenseRegistration=StateOfDrivingLicenseRegistration;
        this.licenseNumber=licenseNumber;
    }
}