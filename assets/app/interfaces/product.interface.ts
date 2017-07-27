export class ProductsInterface {
    constructor(
        public product_code: String,
        public product_name: String,
        public child_of: String,
        public linked_crossselling_product?:String,
        public display_text?:String,
        public display_text_upsell?:String,
        public del_flg?:Boolean,
        public product_code_name?:String,
        public product_type_name?:String,
        public linked_crossselling_product_name?:String,
        public linked_upselling_product_name?:String,
        public linked_upsell_product?:String,
        public new_cross_sell?:Boolean,
        public new_up_sell?: Boolean,
        public verification_mode?:Boolean,
        public dummy_crosssell_name?:String,
        public dummy_upsell_name?:String,
        public dummy_addon_name?:String,
        public core_identifier?:String
/*
        public cre_by?: String,
        public mod_by?: String,
        public cre_time?:String,
        public mod_time?:String,
        public sequence?:String,*/
      

    ) {
        this.product_code = product_code;
        this.product_name = product_name;
        this.child_of = child_of;
        this.del_flg=del_flg;
        this.linked_crossselling_product=linked_crossselling_product;
        this.display_text=display_text;
        this.display_text_upsell=display_text_upsell;
        this.product_code_name=product_code_name
        this.product_type_name=product_type_name;
        this.linked_crossselling_product_name=linked_crossselling_product_name;
        this.linked_upsell_product=linked_upsell_product;
        this.linked_upselling_product_name=linked_upselling_product_name;
        this.new_cross_sell = new_cross_sell;
        this.new_up_sell=new_up_sell;
        this.verification_mode=verification_mode;
        this.dummy_crosssell_name=dummy_crosssell_name;
        this.dummy_upsell_name=dummy_upsell_name;
        this.dummy_addon_name=dummy_addon_name;
        this.core_identifier=core_identifier;
    }
}