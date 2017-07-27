var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOPropertyDetail = new Schema({

                property_type:{type: String, required: true},
                property: {type: String, required: true},
                property_value:{type: String, required: true},
                property_desc:{type: String, required: true},
                cre_time:{type: Date,default: Date.now},
                mod_time:{type: Date,default: Date.now},
                cre_by:{type:String,default:'SETUP'},
                mod_by:{type: String,default:'SETUP'}
    });

module.exports = mongoose.model('OAOPropertyDetail', OAOPropertyDetail);