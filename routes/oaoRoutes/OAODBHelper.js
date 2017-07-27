var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var OAOSequenceGenerator = require('../../models/OAOSequenceGenerator');
var OAOPropertyDetail = require('../../models/OAOPropertyDetail');
var OAOProductTypeDetail = require('../../models/OAOProductTypeSchema');
var OAOProductDetail = require('../../models/OAOProductSchema');
var constants = require("./AppConstants");
const crypto = require('crypto');
var config = require("../../configFiles/DBconfigfile.json");
var request = require('request');
// var sync = require('sync');
var jsonfile = require('jsonfile');
var ERR_001;
var ERR_002;
var ERR_003;
var allfrequency = [];
var relationship_stat = []
var living_type = [];
var Liab_type = [];
var assets_type = [];
var phone_valid = new RegExp(/^[04][0-9]\d{8}$/g);
var name_valid = new RegExp(/^([a-zA-Z'.-]+ ?)+$/);
var housenum = new RegExp(/^[0-9]+$/);
var streetnum = new RegExp(/^[0-9-]+$/);
var streetname = new RegExp(/^[a-zA-Z '.-]+$/);
var suburb = new RegExp(/^[a-zA-Z '.-]+$/);
var postcode = new RegExp(/^[0-9]\d{4}$/);
var amount = new RegExp(/^[0-9]+(\.[0-9][0-9])?$/);
var tfn_regex = new RegExp(/^[0-9]\d{8}$/g);
var arr_years = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
//var arr_months =["0 Month","1 Month","2 Month","3 Month","4 Month","5 Month","6 Month","7 Month","8 Month","9 Month","10 Month","11 Month"];
var arr_months = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var self = module.exports = {

    //INSERT OR UPDATE APPLICANTS RECORD 
    save: function (dataSave, callback) {
        dataSave.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },
    GetErrorMessage: function (prop_type) {
        console.log("getErrosS");
        return new Promise((resolve, reject) => {
            OAOPropertyDetail.find({ property_type: prop_type }, function (err, result) {
                if (err)
                    console.log(err);
                else {
                    //console.log("found erroceode",result[0].property_desc);
                    resolve(result);
                }
            })
        })
    },

    //PERSONAL DETAILS VALIDATOR
    PersonalDetailsValidation: function (req, res, callback) {
        allfrequency = [];
        relationship_stat = []
        living_type = [];
        Liab_type = [];
        assets_type = [];
        self.getDropboxContent('commonCodes', 'relationship', function (relationships) {
            for (var j = 0; j < relationships.length; j++) {
                relationship_stat.push(relationships[j].property_desc);
            }

        })

        self.getDropboxContent('commonCodes', 'livingType', function (living) {
            for (var j = 0; j < living.length; j++) {
                living_type.push(living[j].property_desc);
            }
        })
        self.getDropboxContent('commonCodes', 'LIABILITY_TYPE', function (Liab) {
            for (var j = 0; j < Liab.length; j++) {
                Liab_type.push(Liab[j].property_desc);
            }
        })
        self.getDropboxContent('commonCodes', 'ASSET_TYPE', function (param_asset) {
            for (var j = 0; j < param_asset.length; j++) {
                assets_type.push(param_asset[j].property_desc);
            }
        })
        self.getDropboxContent('commonCodes', 'frequencyOfRent', function (frequency) {
            for (var i = 0; i < frequency.length; i++)
                allfrequency.push(frequency[i].property_value);
        })
        // sync(function () {


        var postal_home_address_flag = req.body.postal_home_address_flag;
        var no_address_found_flag = req.body.no_address_found_flag;


        var dob_status;

        console.log("befrore err");
        self.GetErrorMessage('ERROR_MESSAGE').then((e) => {
            console.log("erro code in Promise", e);
            ERR_001 = e[0].property_value;
            ERR_002 = e[1].property_value;
            ERR_003 = e[2].property_value;

            // for(var j=0;j<e.length;e++)
            // {console.log("erro code in Promise",e[j]);
            // if(e[j].property=="ERR_001")
            // ERR_001=e[j].property_value;
            // if(e[j].property=="ERR_002")
            // ERR_002=e[j].property_value;
            // if(e[j].property=="ERR_003")
            // ERR_003=e[j].property_value;
            // }



            console.log("ERR01,", ERR_001, ERR_002, ERR_003);
            // ERR_002=this.GetErrorMessage.sync(null,'ERROR_MESSAGE','ERR_002');
            // ERR_003=this.GetErrorMessage.sync(null,'ERROR_MESSAGE','ERR_003');
            // dob_status=this.GetAgeLimit.sync(null,'GENERIC_PROP','DOB',req.body.dob);

            //REGULAR EXPRESSIONS
            var phone_valid = new RegExp(/^[04][0-9]\d{8}$/g);
            var re = new RegExp(/^[a-zA-Z '.-]+$/);
            var dateFormat = new RegExp(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/);
            var email = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/);
            //var en_AU   =   new RegExp(/^(\+?61|0)4\d{8}$/);
            var en_AU = new RegExp(/^04\d{8}$/);
            var housenum = new RegExp(/^[0-9]+$/);
            var streetnum = new RegExp(/^[0-9-]+$/);
            var streetname = new RegExp(/^[a-zA-Z '.-]+$/);
            var suburb = new RegExp(/^[a-zA-Z '.-]+$/);
            var postcode = new RegExp(/^[0-9]\d{4}$/);
            var title_array = ['Mr', 'Mrs', 'Dr', 'Ms', 'Miss', 'Prof'];



            // console.log("sample check"+status);

            // FIRST NAME VALIDATOR
            console.log("sastitle array", title_array.indexOf(req.body.title));
            if (req.body.title == null || req.body.title == 0) {
                req.check('Title', `${ERR_001}`).notEmpty()
            }
            // else if(req.body.email==''){
            //      req.check('email', `${ERR_001}`).notEmpty();

            // }

            else if (title_array.indexOf(req.body.title) < 0) {
                req.check('Title', 'Title is not selected from Dropdown').notEmpty();
            }
            if (req.body.fname == null) {

            }
            else if (req.body.fname == "") {
                // console.log("ex fname")
                req.check('fname', `${ERR_001}`).notEmpty();
            } else if ((req.body.fname).length < 2 || (req.body.fname) > 45) {
                req.check('fname', `${ERR_002}`).len(1, 45);
            } else if (re.test(req.body.fname) == false) {
                req.check('fname', `${ERR_003}`).matches(/^[a-zA-Z '.-]+$/, 'i');
            }

            // MIDDLE NAME VALIDATOR
            if (req.body.mname == null) {

            }
            // else if(req.body.mname=="")
            // {
            //     req.check('mname', `${ERR_001}`).notEmpty();
            // }
            else if ((req.body.mname != "") && ((req.body.mname).length < 2 || (req.body.mname) > 45)) {
                req.check('mname', `${ERR_002}`).len(1, 45);
            } else if ((req.body.mname != "") && re.test(req.body.mname) == false) {
                req.check('mname', `${ERR_003}`).matches(/^[a-zA-Z '.-]+$/, 'i');
            }

            //LAST NAME VALIDATOR
            if (req.body.lname == null) {

            }
            else if (req.body.lname == "") {
                req.check('lname', `${ERR_001}`).notEmpty();
            } else if ((req.body.lname).length < 2 || (req.body.lname) > 45) {
                req.check('lname', `${ERR_002}`).len(1, 45);
            } else if (re.test(req.body.lname) == false) {
                req.check('lname', `${ERR_003}`).matches(/^[a-zA-Z '.-]+$/, 'i');
            }

            //DATE OF BIRTH VALIDATOR
            // console.log(dob_status==true);
            if (req.body.dob == null) {

            } else if (req.body.dob == "") {
                req.check('dob', 'date of birth can not be blank').notEmpty();
            } else if (dateFormat.test(req.body.dob) == false) {
                req.check('dob', 'date of birth must be in [ YYYY-MM-DD ]').isDate({ format: 'YYYY-MM-DD' })
            }
            if (dob_status) {
                req.check('dob', 'must be greater then 18 years');
                // console.log("true");
            }


            //MOBILE NUMBER VALIDATOR
            if (req.body.mobile == null || req.body.mobile == undefined) {
                req.check('Mobile', 'Mobile number can not be blank').notEmpty();
            }
            // else if(req.body.mobile=="")
            // {

            // }
            else if (phone_valid.test(req.body.mobile) == false) {
                console.log(phone_valid);
                console.log("mso", req.body.mobile);
                req.check('Mobile', 'Please eneter valid phone no.').foundError();
            }

            //EMAIL ID VALIDATOR
            console.log("eamil regex", String(req.body.email).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/));
            if (req.body.email == null || req.body.email == undefined) {
                req.check('email', `${ERR_001}`).notEmpty()
            }
            // else if(req.body.email==''){
            //      req.check('email', `${ERR_001}`).notEmpty();

            // }
            else if (String(req.body.email).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/) == "null" || String(req.body.email).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/) == null) {
                console.log("sasda");
                req.check('Email', 'Please provide the email id in proper format').isEmail();
            }



            var status = req.validationErrors();
            console.log("status is validation", status);
            return callback(status);

        });
        // })
    },
    commonaddressValidation: function (req, flag, param_address, unit, street, street_name, param_suburb, param_postcode) {
        console.log("In common addresss validation");
        // if (flag == 'N') {
        //     //HOUSE NUMBER VALIDATOR
        //     console.log("no address from  data tools");
        //     if (param_address == null) {
        //         //req.check('Address',ERR_001).notEmpty();
        //     }
        //     else if (param_address == '') {
        //         console.log("no address");
        //         req.check('sad address', 'A valid address21 is required').foundError();
        //     }


        // }

        // else {
        // if (unit == null) {

        // }
        // else if (unit == "") {
        //     req.check('phousenum', 'A valid address is required').notEmpty();
        // }
        // else if (housenum.test(unit) == false) {
        //     req.check('phousenum', 'A valid address is required').matches(/^[0-9]+$/, 'i');

        // }

        // //STREET NUMBER VALIDATOR
        // if (street == null) {

        // }
        // else if (street == "") {
        //     req.check('pstreetnum', 'A valid address is required').notEmpty();
        // }
        // else if (streetnum.test(street) == false) {
        //     req.check('pstreetnum', 'A valid address is required').matches(/^[0-9-]+$/, 'i');
        // }

        // //STREET NAME VALIDATOR
        // if (street_name == null) {

        // }
        // else if (street_name == "") {
        //     req.check('street_name', 'A valid address is required').notEmpty();
        // }
        // else if (streetname.test(street_name) == false) {
        //     req.check('street_name', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
        // }

        // // SUBURB VALIDATOR
        // if (param_suburb == null) {

        // }
        // else if (param_suburb == "") {
        //     req.check('psuburb', 'A valid address is required').notEmpty();
        // }
        // else if (suburb.test(param_suburb) == false) {
        //     req.check('psuburb', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
        // }


        //POSTCODE VALIDATOR
        if (param_postcode == null) {

        }
        else if (param_postcode == "") {
            req.check('postcode', 'A valid postcode is required').notEmpty();
        }
        else if (param_postcode == "0000") {
            req.check('postcode', 'A valid postcode is required').notEmpty();
        }
        else if (postcode.test(param_postcode) == false) {
            req.check('ppostcode', 'A valid postcode is required').matches(/^[0-9]+$/, 'i');
        }
        // }



        // // console.log("adrre");
        // var status = req.validationErrors();
        // console.log("status is  address validation", status);
        // return callback(status);
    },
    personaladdressValidation: function (req, res, callback) {
        //ADDRESS VALIDATOR


        if (req.body.no_address_found_flag == 'N') {
            //HOUSE NUMBER VALIDATOR
            if (req.body.address == null) {
                //req.check('Address',ERR_001).notEmpty();
            }
            else if (req.body.address == '') {
                req.check('address', 'A valid address is required').notEmpty();
            }
            // if(req.body.housenum==null){

            // }
            // else if(housenum.test(req.body.housenum)==false)
            // {
            //     req.check('housenum', 'A valid address is required').matches(/^[0-9]+$/,'i');  

            // }else if(req.body.housenum==""){
            //      req.check('housenum', 'A valid address is required').notEmpty();
            // }

            // //STREET NUMBER VALIDATOR
            // if(req.body.streetnum==null){

            // }
            // else if(streetnum.test(req.body.streetnum)==false)
            // {
            //      req.check('streetnum', 'A valid address is required').matches(/^[0-9]+$/,'i');  
            // }else if(req.body.streetnum==""){
            //      req.check('streetnum', 'A valid address is required').notEmpty();
            // }

            // //STREET NAME VALIDATOR
            // if(req.body.streetname==null){

            // }
            // else if(streetname.test(req.body.streetname)==false)
            // {
            //     req.check('streetname', 'A valid address is required').matches(/^[a-zA-Z '.-]+$/,'i'); 
            // }else if(req.body.streetname==""){
            //      req.check('streetname', 'A valid address is required').notEmpty(); 
            // }

            // // SUBURB VALIDATOR
            // if(req.body.suburb==null){

            // }
            // else if(suburb.test(req.body.suburb)==false)
            // {
            //     req.check('suburb', 'A valid address is required').matches(/^[a-zA-Z '.-]+$/,'i'); 
            // }else if(req.body.suburb==""){
            //        req.check('suburb', 'A valid address is required').notEmpty();
            // }

            // //POSTCODE VALIDATOR
            // if(req.body.postcode==null){

            // }
            // else if(postcode.test(req.body.postcode)==false)
            // {
            //     req.check('postcode', 'A valid address is required').matches(/^[0-9]+$/,'i'); 
            // }else if(req.body.postcode==""){
            //     req.check('postcode', 'A valid address is required').notEmpty();
            // }

        }

        if (!req.body.postal_home_address_flag) {
            // if (req.body.phousenum == null) {

            // }
            // else if (housenum.test(req.body.phousenum) == false) {
            //     req.check('phousenum', 'A valid address is required').matches(/^[0-9]+$/, 'i');

            // } else if (req.body.phousenum == "") {
            //     req.check('phousenum', 'A valid address is required').notEmpty();
            // }

            // //STREET NUMBER VALIDATOR
            // if (req.body.pstreetnum == null) {

            // }
            // else if (streetnum.test(req.body.pstreetnum) == false) {
            //     req.check('pstreetnum', 'A valid address is required').matches(/^[0-9-]+$/, 'i');
            // } else if (req.body.pstreetnum == "") {
            //     req.check('pstreetnum', 'A valid address is required').notEmpty();
            // }

            // //STREET NAME VALIDATOR
            // if (req.body.pstreetname == null) {

            // }
            // else if (streetname.test(req.body.pstreetname) == false) {
            //     req.check('pstreetname', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
            // } else if (req.body.pstreetname == "") {
            //     req.check('pstreetname', 'A valid address is required').notEmpty();
            // }

            // // SUBURB VALIDATOR
            // if (req.body.psuburb == null) {

            // } else if (req.body.psuburb == "") {
            //     req.check('psuburb', 'A valid address is required').notEmpty();
            // }
            // else if (suburb.test(req.body.psuburb) == false) {
            //     req.check('psuburb', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
            // }

            //POSTCODE VALIDATOR
            if (req.body.ppostcode == null) {

            }
            else if (postcode.test(req.body.ppostcode) == false) {
                req.check('ppostcode', 'A valid address is required').matches(/^[0-9]+$/, 'i');
            } else if (req.body.ppostcode == "") {
                req.check('postcode', 'A valid address is required').notEmpty();
            }
        }
        if (arr_years.indexOf(req.body.years) < 0) {
            req.check('years Value', "Please select the value from the dropdown").foundError();
        }
        if (arr_months.indexOf(req.body.months) < 0) {
            req.check('months Value', "Please select the value from the dropdown").foundError();
        }

        // console.log("adrre");
        var status = req.validationErrors();
        console.log("status is  address validation", status);
        return callback(status);



    },
    validateExemption: function (req, res, callback) {

        // self.personaladdressValidation(req, res, function (result) {

        //     if (result.length > 0) {
        //         console.log("validation failed for persona details", Result);
        //         res.json({ message: "Failed", Result: result });
        //     }
        //     else {
        console.log('validateexemption');
        if (req.body.pageName == "taxInfo") {

            console.log('validateexemptiondas');
            if (req.body.tfn != "" && req.body.tfn != undefined) {
                console.log("inside if TFN");
                if (req.body.tfn == "")
                    req.check('TFN', ERR_001).notEmpty();
                else if (tfn_regex.test(req.body.tfn) == false)
                    req.check('TFN VALUE', 'Please enter valid TFN').foundError();
                var status = req.validationErrors();
                console.log("status is  address validation", status);
                return callback(status);
            }
            else {
                console.log("inside eles TFN");
                if (req.body.exemption == 0 || req.body.exemption == "")
                    req.check('Exemption', ERR_001).notEmpty();
                else {
                    self.getDropboxContent('commonCodes', 'EXRSN', function (result) {

                        console.log("exemptions are", result);


                        var i = 0;
                        var count = 0;
                        //console.log((result.property_value).indexOf(req.body.exemption ))

                        return new Promise((resolve, reject) => {

                            while (i < result.length) {
                                console.log("exemption value from db", result[i].property_value);
                                console.log("hl");
                                if (req.body.exemption == result[i].property_value) {
                                    count++;
                                    //return false;
                                    // resolve(count);
                                }
                                i++;
                                if (count == 1)
                                    resolve("found exemption")
                            }
                            setTimeout(function () {
                                if (count == 0)
                                    reject("exemption not found genrate valdiation error");
                            }, 500)
                        }).then((e) => {
                            console.log(e);
                            var status = req.validationErrors();
                            console.log("status is  address validation", status);
                            return callback(status);


                        }).catch((e) => {
                            console.log(e);
                            req.check('Exemption', "Please select the value from the dropdown").isEmail();
                            var status = req.validationErrors();
                            console.log("status is  address validation", status);
                            return callback(status);
                        })

                    })
                }
            }
            //     }
            // })
        }
        else {
            var status = req.validationErrors();
            console.log("status is  address validation", status);
            return callback(status);

        }


    },
    validPropertyDetails: function (req, res, callback) {



        if (req.body.purchaseprice == "" || req.body.purchaseprice == null || req.body.purchaseprice == "0.00") {
            req.check('Purchase Price', ERR_001).notEmpty();
        }
        else if (amount.test(req.body.purchaseprice) == false) {
            req.check('Purchase Price', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
        }
        if (req.body.loantype != "NEW PURCHASE") {
            if (req.body.payoutbal == "" || req.body.payoutbal == null) {
                req.check('Payout Balance', ERR_001).notEmpty();
            }
            else if (amount.test(req.body.payoutbal) == false) {
                req.check('Payout Balance', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            }
        }

        if (req.body.property != "No") {
            if (req.body.no_address_found_flag == 'N') {
                //HOUSE NUMBER VALIDATOR
                if (req.body.propaddr == null) {
                    //req.check('Address',ERR_001).notEmpty();
                }
                else if (req.body.propaddr == '') {
                    req.check('Property Address', 'A valid address is required').notEmpty();
                }
            }
            else {
                // if (req.body.prophousenum == "") {
                //     req.check('prophousenum', 'A valid address is required').notEmpty();
                // }
                // else if (housenum.test(req.body.prophousenum) == false) {
                //     req.check('prophousenum', 'A valid address is required').matches(/^[0-9]+$/, 'i');

                // }

                // //STREET NUMBER VALIDATOR
                // if (req.body.propstreetnum == "") {
                //     req.check('propstreetnum', 'A valid address is required').notEmpty();
                // }
                // else if (streetnum.test(req.body.propstreetnum) == false) {
                //     req.check('propstreetnum', 'A valid address is required').matches(/^[0-9-]+$/, 'i');
                // }

                // //STREET NAME VALIDATOR
                // if (req.body.propstreetname == "") {
                //     req.check('propstreetname', 'A valid address is required').notEmpty();
                // }
                // else if (streetname.test(req.body.propstreetname) == false) {
                //     req.check('propstreetname', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
                // }

                // // SUBURB VALIDATOR
                // if (req.body.propsuburb == "") {
                //     req.check('propsuburb', 'A valid address is required').notEmpty();
                // }
                // else if (suburb.test(req.body.propsuburb) == false) {
                //     req.check('propsuburb', 'A valid address is required').matches(/^[a-zA-Z0-9 '.-]+$/, 'i');
                // }

                //POSTCODE VALIDATOR
                if (req.body.proppostcode == "") {
                    req.check('postcode', 'A valid address is required').notEmpty();
                }
                else if (postcode.test(req.body.proppostcode) == false) {
                    req.check('proppostcode', 'A valid postcode is required').matches(/^[0-9]+$/, 'i');
                }
            }
        }
        if (req.body.ownership == "INVESTMENT") {
            if (req.body.rentalincome == "") {
                req.check('Rental Income Loan Details', ERR_001).notEmpty();
            }
            else if (amount.test(req.body.rentalincome) == false) {
                req.check('Rental Income Loan Details', 'A valid amoutn is required').foundError();
            }
        }
        self.getDropboxContent('commonCodes', 'PROP_TYPE', function (result) {

            console.log("Property types  are", result);
            if (req.body.proptype == 0 || req.body.proptype == "") {
                req.check('Property Type', ERR_001).notEmpty();
                var status = req.validationErrors();
                console.log("status is  property  validation IF", status);
                return callback(status);
            }
            else {
                var i = 0;
                var count = 0;
                //console.log((result.property_value).indexOf(req.body.exemption ))

                return new Promise((resolve, reject) => {

                    while (i < result.length) {
                        //console.log("exemption value from db", result[i].property_value);
                        //console.log("hl");
                        if (req.body.proptype == result[i].property_value) {
                            count++;
                            //return false;
                            // resolve(count);
                        }
                        i++;
                        if (count == 1)
                            resolve("found property type")
                    }
                    setTimeout(function () {
                        if (count == 0)
                            reject("propert type not found genrate valdiation error");
                    }, 500)
                }).then((e) => {
                    console.log(e);
                    var status = req.validationErrors();
                    console.log("status is  property  validation", status);
                    return callback(status);


                }).catch((e) => {
                    console.log(e);
                    req.check('Property Type', "Please select the value from the dropdown").isEmail();
                    var status = req.validationErrors();
                    console.log("status is  property validation catch", status);
                    return callback(status);
                })
            }

        })
        // req.body.propaddr
        // prophousenum
        // propstreetnum
        // propstreetname
        // propstreettype
        // propsuburb
        // propstate
        // proppostcode
    },
    loanDetailsValidation: function (req, res, callback) {
        if (req.body.amtborrow == null || req.body.amtborrow == "" || req.body.amtborrow == "0.00") {
            req.check('Amount Borrow', ERR_001).notEmpty();
        }
        else if (amount.test(req.body.amtborrow) == false) {
            req.check('Amount Borrow', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
        }

        if (req.body.estvalue != null && req.body.estvalue != "") {
            if (amount.test(req.body.estvalue) == false) {
                req.check('Estimate Value', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            }

            if (req.body.finInstitution == null || req.body.finInstitution == "") {
                req.check('finInstitution Value', ERR_001).notEmpty();
            }
            self.commonaddressValidation(req, req.body.no_address_found_flag, req.body.propaddress_m, req.body.prophousenum_m, req.body.propstreetnum_m, req.body.propstreetname_m, req.body.propsuburb_m, req.body.propstate_m);
        }





        if (req.body.cc_estvalue != "" && req.body.cc_estvalue != null) {
            if (amount.test(req.body.cc_estvalue) == false)
                req.check('Estimate Value creditcard', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            if (req.body.cc_finInstitution == "" || req.body.cc_finInstitution == null)
                req.check('Credit Card finInstitution Value', ERR_001).notEmpty();

        }
        if (req.body.pl_estvalue != "" && req.body.pl_estvalue != null) {
            if (amount.test(req.body.pl_estvalue) == false)
                req.check('Estimate Value personal loan', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            if (req.body.pl_finInstitution == "" || req.body.pl_finInstitution == null)
                req.check('Personal Loan finInstitution Value', ERR_001).notEmpty();

        }
        if (req.body.cl_estvalue != "" && req.body.cl_estvalue != null) {
            if (amount.test(req.body.cl_estvalue) == false)
                req.check('Estimate Value car loan', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            if (req.body.cl_finInstitution == "" || req.body.cl_finInstitution == null)
                req.check('car Loan finInstitution Value', ERR_001).notEmpty();

        }

        if (req.body.sl_estvalue != "" && req.body.sl_estvalue != null) {
            if (amount.test(req.body.sl_estvalue) == false)
                req.check('Estimate Value student loan', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            if (req.body.sl_finInstitution == "" || req.body.sl_finInstitution == null)
                req.check('student Loan finInstitution Value', ERR_001).notEmpty();

        }

        if (req.body.o_estvalue != "" && req.body.o_estvalue != null) {
            if (amount.test(req.body.o_estvalue) == false)
                req.check('Estimate Value other loan', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');
            if (req.body.o_finInstitution == "" || req.body.o_finInstitution == null)
                req.check('other Loan finInstitution Value', ERR_001).notEmpty();

        }

        // if (amount.test(req.body.repaymentAmount) == false)
        //     req.check('Repayment Amount', 'Not a number').matches(/^[0-9]+(\.[0-9][0-9])?$/, 'i');

        console.log("All frequencies are ");
        if (allfrequency.indexOf(req.body.frequencyType) < 0)
            req.check("Frequency Type of loan term", "Please select the value from the dropdown").notEmpty();
        if (req.body.repaymentAmount != undefined && parseInt(req.body.repaymentAmount) != 0) {
            // if()
            //  req.check('Repayment Amount', "Amount Entered is too less").foundError();
            if (amount.test(req.body.repaymentAmount) == false)
                req.check('Repayment Amount', "Please enter the valid amount").foundError();

            var status = req.validationErrors();
            // console.log("status is  property validation catch", status);
            return callback(status);

        }
        else {


            new Promise((resolve, reject) => {
                self.getDropboxContent('commonCodes', 'LOAN_TERM', function (loan_term) {
                    var i = 0;
                    for (i = 0; i < loan_term.length; i++) {
                        if (req.body.loanterm == loan_term[i].property_desc) {
                            resolve("found Loan terms");
                        }
                    }
                    setTimeout(function () {
                        if (i == loan_term.length) {
                            reject("Loan Term not found");
                        }
                    }, 300)
                })
            }).then((e) => {
                console.log(e);
                var status = req.validationErrors();
                // console.log("status is  property validation catch", status);
                return callback(status);
            }).catch((e) => {
                console.log(e);
                req.check('Loan Term', "Please select the value from the dropdown").isEmail();
                var status = req.validationErrors();
                // console.log("status is  property validation catch", status);
                return callback(status);
            })
        }
    },
    validateIncome: function (req, res, callback) {
        var relationship_stat = []
        var living_type = [];
        Liab_type = [];
        assets_type = [];
        self.getDropboxContent('commonCodes', 'relationship', function (relationships) {
            for (var j = 0; j < relationships.length; j++) {
                relationship_stat.push(relationships[j].property_desc);
            }

        })

        self.getDropboxContent('commonCodes', 'livingType', function (living) {
            for (var j = 0; j < living.length; j++) {
                living_type.push(living[j].property_desc);
            }
        })
        self.getDropboxContent('commonCodes', 'LIABILITY_TYPE', function (Liab) {
            for (var j = 0; j < Liab.length; j++) {
                Liab_type.push(Liab[j].property_desc);
            }
        })
        self.getDropboxContent('commonCodes', 'ASSET_TYPE', function (param_asset) {
            for (var j = 0; j < param_asset.length; j++) {
                assets_type.push(param_asset[j].property_desc);
            }
        })

        setTimeout(function () {
            if (req.body.employed == "Retired") {
                if (arr_years.indexOf(req.body.retirementYears) < 0) {
                    req.check('years Value', "Please select the value from the dropdown").foundError();
                }
                if (arr_months.indexOf(req.body.retirementMonths) < 0) {
                    req.check('months Value', "Please select the value from the dropdown").foundError();
                }
            } else if (req.body.employed == "Self_employed") {
                if ((req.body.companyName != "" && req.body.companyName != null) || (req.body.yearsEstablished != "" && req.body.yearsEstablished != null)) {


                    if (req.body.companyName == "" || req.body.companyName == null)
                        req.check('companyName', ERR_001).notEmpty();
                    if (req.body.yearsEstablished == "" || req.body.yearsEstablished == null) {
                        req.check('yearsEstablished', ERR_001).notEmpty();
                    }
                    else if (isNaN(req.body.yearsEstablished)) {
                        req.check('yearsEstablished', "Not a Number").isEmail();
                    }
                }
                if (req.body.earnPerMonth == "" || req.body.earnPerMonth == null || req.body.earnPerMonth == "0.00") {
                    req.check('earnPerMonth', ERR_001).notEmpty();
                }
                else if (amount.test(req.body.earnPerMonth) == false) {
                    req.check('Service', "Not a Number").isEmail();
                }

                if (req.body.incomeFrequency == 0) {
                    req.check('incomeFrequency', ERR_001).notEmpty();
                }
                else if (allfrequency.indexOf(req.body.incomeFrequency) < 0) {
                    req.check('Income Frequeny', "Please select the value from the dropdown").isEmail();
                }

            } else {
                if ((req.body.employer != "" && req.body.employer != null) || (req.body.service != "" && req.body.employer != null)) {
                    if (req.body.employer == "" || req.body.employer == null)
                        req.check('Employer', ERR_001).notEmpty();
                    if (req.body.service == "" || req.body.service == null) {
                        req.check('Service', ERR_001).notEmpty();
                    }
                    else if (isNaN(req.body.service)) {
                        req.check('Service', "Not a Number").isEmail();
                    }
                } else {
                    req.check('Employment', "Employment Dat not filled").notEmpty();
                }
                if (req.body.earnPerMonth == "" || req.body.earnPerMonth == null || req.body.earnPerMonth == "0.00") {
                    req.check('earnPerMonth', ERR_001).notEmpty();
                }
                else if (amount.test(req.body.earnPerMonth) == false) {
                    req.check('Service', "Not a Number").isEmail();
                }

                if (req.body.incomeFrequency == 0) {
                    req.check('incomeFrequency', ERR_001).notEmpty();
                }
                else if (allfrequency.indexOf(req.body.incomeFrequency) < 0) {
                    req.check('Income Frequeny', "Please select the value from the dropdown").isEmail();
                }
            }


            if (req.body.secondJob != null && req.body.secondJob) {
                if (req.body.secondJobEarning == "" || req.body.secondJobEarning == null) {
                    req.check('secondJobEarning', ERR_001).notEmpty();
                }
                else if (amount.test(req.body.secondJobEarning) == false) {
                    req.check('secondJobEarning', "Not a Number").isEmail();
                }

                if (req.body.secondJobIncomeFrequency == 0) {
                    req.check('secondJobIncomeFrequency', ERR_001).notEmpty();
                }
                else if (allfrequency.indexOf(req.body.secondJobIncomeFrequency) < 0) {
                    req.check('secondJobIncomeFrequency Frequeny', "Please select the value from the dropdown").isEmail();
                }
            }

            if (req.body.otherIncome != null && req.body.otherIncome) {
                for (var i = 0; i < req.body.otherIncomeData; i++) {
                    if (req.body.otherIncomeSource[i] == "" || req.body.otherIncomeSource[i] == null) {
                        req.check('otherIncomeSource' + i + '', ERR_001).notEmpty();
                    }
                    if (req.body.otherIncomeEarning[i] == "" || req.body.otherIncomeEarning[i] == null) {
                        req.check('otherIncomeEarning' + i + '', ERR_001).notEmpty();
                    }
                    else if (amount.test(req.body.otherIncomeEarning[i]) == false) {
                        req.check('secondJobEarning' + i + '', "Not a Number").isEmail();
                    }

                    if (req.body.otherIncomeFrequency[i] == 0) {
                        req.check('otherIncomeFrequency' + i + '', ERR_001).notEmpty();
                    }
                    else if (allfrequency.indexOf(req.body.otherIncomeFrequency[i]) < 0) {
                        req.check('otherIncomeFrequency Frequeny' + i + '', "Please select the value from the dropdown").isEmail();
                    }
                }

            }


            console.log("realtionship", relationship_stat);
            if (req.body.relationshipStatus != "" && relationship_stat.indexOf(req.body.relationshipStatus) < 0) {
                req.check('RelationShiop Status', "Please select the value from the dropdown").isEmail();
            }

            if (req.body.supportFinancially != "" && (housenum.test(req.body.supportFinancially) == false)) {
                req.check('supportFinancially Status', "Not a number").isEmail();
            }

            if (req.body.livingType != "" && living_type.indexOf(req.body.livingType) < 0) {
                req.check('livingType Status', "Please select the value from the dropdown").isEmail();
            }

            if ((req.body.rentShare != "" && req.body.rentShare != null) || (req.body.frequencyOfRent != "")) {
                if (req.body.rentShare == "" || req.body.rentShare == null)
                    req.check('rentShare', ERR_001).notEmpty();
                else if (amount.test(req.body.rentShare) == false) {
                    req.check('rentShare', "Not a Number").isEmail();
                }
                if (req.body.frequencyOfRent == "") {
                    req.check('frequencyOfRent', ERR_001).notEmpty();
                }
                else if (allfrequency.indexOf(req.body.frequencyOfRent) < 0) {
                    req.check('frequencyOfRent Status', "Please select the value from the dropdown").isEmail();
                }


            }

            if (req.body.monthlyLivingExpenses == "" || req.body.monthlyLivingExpenses == null)
                req.check('monthlyLivingExpenses', ERR_001).notEmpty();
            else if (amount.test(req.body.monthlyLivingExpenses) == false) {
                req.check('monthlyLivingExpenses', "Not a Number").isEmail();
            }
            if (req.body.expenseFrequency == "") {
                req.check('expenseFrequency', ERR_001).notEmpty();
            }
            else if (allfrequency.indexOf(req.body.expenseFrequency) < 0) {
                req.check('expenseFrequency Status', "Please select the value from the dropdown").isEmail();
            }
            console.log("pageName", req.body.pageName);

            if (req.body.pageName == "assets") {

                var arr_assets = req.body.assets;
                var arr_liab = req.body.Liabilities;
                console.log("isnide assets3", arr_assets);

                if (arr_assets != "" && arr_assets != null) {
                    console.log("inside asssets");
                    for (var j = 0; j < arr_assets.length; j++) {
                        console.log("assettypes", assets_type);
                        if (assets_type.indexOf(arr_assets[j].assettype) < 0)
                            req.check('Asset Type Status', "Please select the value from the dropdown").isEmail();
                        if (arr_assets[j].assetvalue == "" || arr_assets[j].assetvalue == null)
                            req.check('Asset Value', ERR_001).notEmpty();
                        else if (amount.test(arr_assets[j].assetvalue) == false)
                            req.check('Asset Value', "Not a Number").isEmail();
                        if (arr_assets[j].assettype != "Vehicle") {
                            if (arr_assets[j].assetIncome == "" || arr_assets[j].assetIncome == null)
                                req.check('assetIncome Value', ERR_001).notEmpty();
                            else if (amount.test(arr_assets[j].assetIncome) == false)
                                req.check('assetIncome Value', "Not a Number").isEmail();
                            if (allfrequency.indexOf(arr_assets[j].assetIncomeFrequency) < 0)
                                req.check('assetIncomeFrequency Value', "Please select the value from the dropdown").isEmail();
                        }
                    }
                }

                if (arr_liab != "" && arr_liab != null) {
                    for (var j = 0; j < arr_liab.length; j++) {
                        if (Liab_type.indexOf(arr_liab[j].Liabilitiestype) < 0)
                            req.check('Liabilities Type Status', "Please select the value from the dropdown").isEmail();
                        if (arr_liab[j].Payable_Amount == "" || arr_liab[j].Payable_Amount == null)
                            req.check('Payable_Amount Value', ERR_001).notEmpty();
                        else if (amount.test(arr_liab[j].Payable_Amount) == false)
                            req.check('Payable_Amount Value', "Not a Number").isEmail();


                        if (allfrequency.indexOf(arr_liab[j].Payment_Frequency) < 0)
                            req.check('Payment_Frequency Value', "Please select the value from the dropdown").isEmail();

                        if (arr_liab[j].Balance_Pending == "" || arr_liab[j].Balance_Pending == null)
                            req.check('Balance_Pending Value', ERR_001).notEmpty();
                        else if (amount.test(arr_liab[j].Balance_Pending) == false)
                            req.check('Balance_Pending Value', "Not a Number").isEmail();

                        if (arr_liab[j].Financial_Institution == "" || arr_liab[j].Financial_Institution == null)
                            req.check('Financial_Institution Value', ERR_001).notEmpty();


                    }



                }


            }

            if (req.body.pageName == "aboutus") {
                if (req.body.years == "0") {
                    if (req.body.months == "0")
                        req.check('months Value', "Months should be more than zero").isEmail();
                }
                if (arr_years.indexOf(req.body.years) < 0) {
                    req.check('years Value', "Please select the value from the dropdown").isEmail();
                }
                if (arr_months.indexOf(req.body.months) < 0) {
                    req.check('months Value', "Please select the value from the dropdown").isEmail();
                }

                if (req.body.years == "1" || req.body.years == "0") {
                    //flag, param_address, unit, street, street_name, param_suburb, param_postcode
                    self.commonaddressValidation(req, req.body.no_address_found_flag, req.body.newaddress, req.body.newhousenum, req.body.newstreetnum, req.body.newstreetname, req.body.newsuburb, req.body.newpostcode)
                    if (req.body.anotheryears == "0") {
                        if (req.body.anothermonths == "0")
                            req.check('months Value', "Months should be more than zero").isEmail();
                    }
                    if (arr_years.indexOf(req.body.anotheryears) < 0) {
                        req.check('anotheryears Value', "Please select the value from the dropdown").isEmail();
                    }
                    if (arr_months.indexOf(req.body.anothermonths) < 0) {
                        req.check('anothermonths Value', "Please select the value from the dropdown").isEmail();
                    }
                }

                if (req.body.fullname == "" || req.body.fullname == null) {
                    // console.log("found error1",req.check('Phone Value', "Please enter a valid phone number").foundError());
                    req.check('fullname About us Value', ERR_001).notEmpty();
                    // console.log("fou1",req.check('fullname About us Value', ERR_001).foundError());
                }
                console.log("phone valid212", req.body.phone);
                if (req.body.phone == "" || req.body.phone == null) {
                    req.check('Phone Number', ERR_001).notEmpty();
                }

                else if (phone_valid.test(req.body.phone) == false) {
                    console.log("phone valid", req.body.phone);
                    // console.log("found error",req.check('Phone Value', "Please enter a valid phone number").foundError());
                    req.check('Phone', "Please enter a valid phone number").foundError();
                }



            }
            setTimeout(function () {
                var status = req.validationErrors();
                // console.log("status is  property validation catch", status);
                return callback(status);
            }, 300)




        }, 500)





    },
    // VALIDATION
    validation: function (req, res, callback) {
        var postal_home_address_flag = req.body.postal_home_address_flag;
        var no_address_found_flag = req.body.no_address_found_flag;

        // first name 
        if (req.body.fname == "") {
            req.check('fname', 'ddd').notEmpty();
        } else if ((req.body.fname).length < 3 || (req.body.fname) > 45) {
            req.check('fname', 'name must be with spacified range (3, 45)').len(3, 45);
        } else if (re.test(req.body.fname) == false) {
            req.check('fname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        }


        // Middle name 
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'name must be with spacified range (3, 45)').len(3, 45);
        req.check('mname', 'middle name can not be blank').notEmpty();

        // Last name
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/, 'i');
        req.check('mname', 'last name must be with spacified range (3, 45)').len(3, 45);
        req.check('lname', 'last name can not be blank').notEmpty();

        // date of birth
        req.check('dob', 'date of birth must be in [ YYYY-MM-DD ]').isDate({ format: 'YYYY-MM-DD' })
        req.check('dob', 'date of birth can not be blank').notEmpty();

        // Email ID
        req.check('email', 'email id can not be blank').isEmail();

        //Mobile Number
        // req.check('mobile', 'Mobile number must be in +61434653192').isMobilePhone('phone_valid');
        req.check('mobile', 'Mobile number can not be blank').notEmpty()

        // address
        req.check('address', 'A valid address is required').notEmpty();
        if (postal_home_address_flag == 'N') {
            req.check('paddress', 'A valid address is required').notEmpty();
        }

        if (no_address_found_flag == 'N') {
            req.check('postcode', 'A valid address is required').notEmpty();
            req.check('ppostcode', 'A valid address is required').notEmpty();
        }


        var status = req.validationErrors();
        return callback(status);
    },

    //CHECK FOR EXISTING APPLICANT IN DATABASE

    checkExistingApplicant: function (req, res, callback) {
        console.log("checking for existing cust..");
        console.log(req.body);
        OAOApplicantSchema.findOne({ application_id: req.body.application_id }, function (err, result) {
            return callback(result);
        })
    },


    //GENERATE APPLICATION REFERENCE ID
    GenerateApplicationReferenceId: function (req, res, callback) {
        if (req.body.application_id == undefined) {
            OAOSequenceGenerator.find(function (err, result_v) {
                console.log("result_v " + result_v)
                OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref_id: Number(result_v[0].app_ref_id) + 1 }, function (err, result) {
                    if (err) {
                        return err;
                    }
                    console.log("result " + result)
                    return callback(result)
                })
            })
        } else {
            return callback("result");
        }

    },

    //UPDATING APPLICATION REFERENCE ID EVERY APPLICATION SUBMITTED

    UpdateApplicationReferenceIdGeneration: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref_id: Number(result[0].app_ref_id) + 1 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    //UPDATING SECTION ON BACK
    UpdateApplication: function (app_id, section, callback) {
        var section = "section_SAV[0]." + section;
        console.log(section)
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, { $set: { section_SAV: { "section_2": false } } }, function (err, result) {
            if (err) {
                console.log(err)
                return err;
            }
            console.log(result)
            return callback(result)
        })

    },
    // UPDATING THE RESUMING TIME
    UpdateResumeTime: function (app_id, update_value, callback) {
        console.log("is  id " + app_id + "updating value is" + update_value);
        OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id }, update_value, function (err, result) {
            if (err) {
                console.log("error is " + err);
                return err;
            }
            console.log(result);
            return callback(result);

        });
    },

    //RESETTING APPLICATION REFERENCE ID EVERY DAY

    ResetApplicationReferenceId: function (req, res, callback) {
        OAOSequenceGenerator.find(function (err, result) {
            OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff" }, { app_ref: 0 }, function (err, result) {
                if (err) {
                    return err;
                }
                return callback(result)
            })
        })
    },

    getDropboxContent: function (PropertyType, Property, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType, property: Property }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    getMessages: function (PropertyType, callback) {
        OAOPropertyDetail.find({ property_type: PropertyType }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },

    saveDropboxContent: function (dropBoxRecord, callback) {
        dropBoxRecord.save(function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        });
    },

    getApplicantsRecord: function (ApplicaionID, callback) {
        OAOApplicantSchema.find({ application_id: ApplicaionID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);

        })
    },
    //GET SAVED RECORD 
    getSavedRecord: function (mobile, dob, callback) {
        console.log("mobile", mobile, dob);
        var query = {}
        switch (dob) {
            case 'true': query["mobile"] = mobile;
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
                break;
            case 'no': query["mobile"] = mobile;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
                break;
            default: query["mobile"] = mobile;
                query["dob"] = dob;
                query["application_status"] = { $in: ['SAV', 'INC'] }
                query["product_type_code"] = { $in: ['SAV', 'HML', 'PRL'] }
        }
        console.log("alljkh  ", query)
        OAOApplicantSchema.find(query, function (err, result) {
            if (err) {
                return callback(err, success = false);
            } else if ((result !== null && result != '')) {
                return callback(result, success = true);
            } else {
                console.log("res", result)
                return callback(result, success = false);
            }

        })
    },
    saveUploadData: function (file_name, file_obj_id, app_id, callback) {
        var file_data = {
            fileName: file_name,
            fileObjectId: file_obj_id
        }
        this.getApplicantsRecord(app_id, function (result) {
            if (result == "") {
                return callback(success = false)
            } else {
                result[0].filesUpload.push(file_data);
            }
            result[0].save(function (err, result) {
                if (err) {
                    return callback(success = false)
                }
                return callback(success = true)
            });
        });
    },
    addProdTypeData: function (data, callback) {
        this.getProductTypeContent(data.product_type_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_type_code = data.product_type_code,
                    result[0].product_type_name = data.product_type_name,

                    result[0].save(function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(result);
                    });
            }
        })

    },
    addData: function (data, callback) {
        this.getProductContent(data.product_code, function (result) {
            if (!result || result == '') {
                console.log(data)
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].product_code = data.product_code,
                    result[0].product_name = data.product_name,

                    result[0].child_of = data.child_of,
                    result[0].del_flg = data.del_flg
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    addCSData: function (data, callback) {
        this.getCrossSellingProductContent(data.cross_selling_product_id, function (result) {
            if (!result || result == '') {
                data.save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            } else {
                result[0].cross_selling_product_id = data.cross_selling_product_id,
                    result[0].cross_selling_name = data.cross_selling_name,
                    result[0].cross_selling_desc = data.cross_selling_desc,
                    result[0].display_text = data.display_text,
                    result[0].linked_to_products = data.linked_to_products
                result[0].save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(result);
                });
            }
        })

    },
    getProductTypeContent: function (ProductTypeCode, callback) {
        OAOProductTypeDetail.find({ product_type_code: ProductTypeCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    getProductContent: function (ProductCode, callback) {
        console.log(ProductCode)
        OAOProductDetail.find({ product_code: ProductCode }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    downloadFromAdmin: function () {

        console.log("/ChangeData")
        return new Promise((resolve, reject) => {

            request.get(config.url.adminUrl + '/api/getLocalContent', function (err, result_v) {

                var data_res = JSON.parse(result_v.body);
                var storeData = data_res.result;
                var dir = './public/contents/Product1.json'
                var obj = storeData;
                jsonfile.writeFile(dir, obj, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        resolve("downloaded the file from admin");
                    }
                })
            })
        })


    },
    getProducts: function (callback) {

        OAOProductDetail.find({ del_flg: false, child_of: { $nin: ["CRS", "UPS"] } }, function (err, result) {
            if (err) {
                console.log(err);
                return callback(false, '');
            }
            else if (result == null) {
                console.log("null is coming");
                return callback(false, result);
            }
            else {
                console.log("got products");
                return callback(true, result);
            }
        })

    },
    getRelativeProducts: function (ProductTypeCode, callback) {

        OAOProductDetail.find({ del_flg: false, child_of: ProductTypeCode }, function (err, result) {
            if (err) {
                console.log(err);
                return callback(false, '');
            }
            else if (result == null) {
                console.log("null is coming");
                return callback(false, result);
            }
            else {
                console.log("got products");
                return callback(true, result);
            }
        })

    },

    getProductByParent: function (product_code, child_of, callback) {
        OAOProductDetail.find({ product_code: product_code, child_of: child_of }, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(result);
        })
    },
    //get cross sell child
    getChild: function (product, callback) {
        console.log('Inside Get Child');
        OAOProductDetail.find({ 'product_code': product }, { 'linked_crossselling_product': 1 }, function (err, result) {
            console.log(result);
            console.log(result.length);
            if (err) {
                return callback(err, success = false);
            }
            if (result.length == 0) {
                return callback(err, success = false);
            } else {
                OAOProductDetail.find({ 'product_code': result[0].linked_crossselling_product }, { 'display_text': 1, 'product_code': 1, 'child_of': 1 }, function (err, result) {
                    if (err) {
                        return callback(err, success = false);
                    }
                    return callback(result);
                })
            }

        })
    },
    getProductContent: function (ProductID, callback) {
        console.log(ProductID)
        OAOProductDetail.find({ product_code: ProductID }, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log(result)
            return callback(result);
        })
    },
    encryption: function (msg, callback) {
        var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
        var crypted = cipher.update(msg, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return callback(crypted);

    },
    decryption: function (crypted_msg, callback) {
        var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
        var dec = decipher.update(crypted_msg, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return callback(dec);

    }
};