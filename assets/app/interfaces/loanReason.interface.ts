export class LoanReason {
    constructor(
        public car?:boolean,
        public bike?:boolean,
        public debt?:boolean,
        public Holiday?:boolean,
        public Home_renovations?:boolean,
        public Household_personal_items?:boolean,
        public Education?:boolean,
        public Wedding_Funerals?:boolean,
        public Others?:boolean
    ){
        this.car=car
        this.bike=bike
        this.debt=debt
        this.Holiday=Holiday
        this.Home_renovations=Home_renovations
        this.Household_personal_items=Household_personal_items
        this.Education=Education
        this.Wedding_Funerals=Wedding_Funerals
        this.Others=Others
    }
}