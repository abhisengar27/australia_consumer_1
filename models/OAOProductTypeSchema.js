var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOProductTypeDetail = new Schema({

                product_type_code:{type: String, required: true},
                product_type_name: {type: String, required: true},
                cre_time:{type: Date,default: Date.now},
                mod_time:{type: Date,default: Date.now},
                cre_by:{type:String,default:'SETUP'},
                mod_by:{type: String,default:'SETUP'}
    });

module.exports = mongoose.model('OAOProductTypeDetail', OAOProductTypeDetail);