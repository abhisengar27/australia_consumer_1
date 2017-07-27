export class ConfigDetails {
    constructor(
        public name: string,
        public dob: string,
        public email: string,
        public mobile: string,
        public dupemail: string,
        public dupmobile: string,
        public refnumber:string,
        public address?: string,
        public passportNum?: string,
        public dlNum?: string,
        public required_v?:string,
        public SAV?:any,
        public sameAddress?:string,
        public office365LoginEnabled?:string,
		public dataToolsRequestKey?:string,
		public siteKeyReCaptcha?:string
    ){
		this.siteKeyReCaptcha=siteKeyReCaptcha;
        this.name=name;
        this.sameAddress=sameAddress;
        this.address=address;
        this.passportNum=passportNum;
        this.refnumber=refnumber;
        this.dupemail=dupemail;
        this.dupmobile=dupmobile;
        this.dob=dob;
        this.email=email;
        this.mobile=mobile;
        this.dlNum=dlNum;
        this.required_v=required_v;
        this.SAV=SAV;
        this.office365LoginEnabled=office365LoginEnabled;
        this.dataToolsRequestKey=dataToolsRequestKey;
    }
}

export class google{
    constructor(
        public address_components: string,
        public formatted_address: string
      
    ){
        this.address_components=address_components;
        this.formatted_address=formatted_address;
        
        
    }
}