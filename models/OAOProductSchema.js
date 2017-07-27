var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOProductDetail = new Schema({

    product_code: { type: String, required: true },
    product_name: { type: String, required: true },
    child_of: { type: String, required: true },
    linked_crossselling_product: { type: String },
    linked_upsell_product: { type: String },
    display_text: { type: String },
    display_text_upsell: { type: String },
    cre_time: { type: Date, default: Date.now },
    mod_time: { type: Date, default: Date.now },
    cre_by: { type: String, default: 'SETUP' },
    mod_by: { type: String, default: 'SETUP' },
    del_flg: { type: Boolean, default: false },
    sequence: { type: String, default: '000' },
    core_identifier: { type: String },
    verification_mode: { type: Boolean, default: false },
    min_age: { type: String },
    max_age: { type: String },
    interest_rate: { type: String },
    bonus_interest_rate: { type: String },
    min_deposit: { type: String },
    keeping_fees: { type: String },
    transaction_fees: { type: String },
    comparison_rate: { type: String },
    establishment_fees: { type: String },
    loan_service_fees: { type: String },
    split_loan: { type: String },
    min_loan_amount: { type: String },
    max_loan_amount: { type: String },
    min_loan_term: { type: String },
    max_loan_term: { type: String },
     fees_url:{type:String}


});

module.exports = mongoose.model('OAOProductDetail', OAOProductDetail);