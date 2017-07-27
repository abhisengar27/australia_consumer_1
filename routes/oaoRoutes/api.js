var express = require('express');
const crypto = require('crypto');
var config = require("../../configFiles/DBconfigfile");
var OAODBHelper = require("./OAODBHelper");
var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var OAOPropertyDetail = require('../../models/OAOPropertyDetail');
var OAOProductTypeDetail = require('../../models/OAOProductTypeSchema');
var OAOProductDetail = require('../../models/OAOProductSchema');
var OAOApplicationHelper = require("./OAOApplicationHelper.js");
var constants = require("./AppConstants");
var OAORouter = express.Router();
var fs = require('fs');
var async = require("async");
var request = require('request');
var multer = require('multer');
var device = require('express-device');
var mkdirp = require('mkdirp');
var jsonfile = require('jsonfile');
var OAOAddNewField = require('../../models/OAOAddNewFieldSchema');
OAORouter.use(device.capture());
console.log("Constants: ", constants.ACTIVE);
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        var dir = './public/uploads/' + req.headers.app_id;
        mkdirp(dir, function (err) {
            if (err) {
                console.error(err)
            }
            else {
                console.log('Folder created')
            }
        });
        var link = dir + '/';
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, req.headers.id_type + '_' + datetimestamp + '_' + file.originalname)
    }
});

/**Multer configuration */
var upload = multer({
    storage: storage
}).single('file');
OAORouter.post('/generateCustomeCssFile', function (req, res, next) {

    if (req.body.status_flag == false) {
        return res.json({ MSG: "No Record to Update StyleSheet css file" });
    }
    fs.writeFile('./public/assets/css/dynamicStyle.css', req.body.StyleSheet, function (err) {
        if (err) {
            return res.json({ ERROR: err });
        }
        res.json({ RESULT: "STYLE CREATED" });
    })
    // console.log("====check for service====");
    // console.log(req.body.StyleSheet);
    // console.log(req.body.status_flag);
    // console.log("====check for service ends====");
})
OAORouter.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        // console.log(req);
        console.log('Inside Upload', req.file.filename);
        console.log('Header Type...', req.headers.id_type);
        console.log('Selected Type Id Type...', req.headers.id_type);
        OAOApplicationHelper.cmisUpload(req, res, function (result) {
            if (result) {
                console.log('result...', result);
                res.status(200).json({
                    success: true
                });
            } else {
                console.log('result...', result);
                res.status(500).json({
                    success: false
                });
            }
        })
    })
});
OAORouter.post('/scan/dl', function (req, res, next) {

    console.log('Calling Scan driving license');
    upload(req, res, function (err) {
        var completeFileName = req.file.filename;
        var imagePath = `/uploads/${req.headers.app_id}/${completeFileName}`;
        OAOApplicationHelper.cmisUpload(req, res, function (result) {
            console.log('Success Response', result);
            if (result) {
                console.log('inside success');
                OAOApplicationHelper.processImage(req, res, function (result) {
                    if (result) {
                        OAOApplicationHelper.scanDrivingLicense(req, res, function (result1) {
                             console.log('Calback Result',result1);
                            var result = JSON.parse(result1);
                            console.log("result1",result);
                            console.log("name",result.Name);
                            var st = result.DOB.replace(/\n|\r|\s/g, "");
                          //  var complete_address = result[5] + ' ' + result[6] + ' ' + result[7] + ' ' + result[1]
                          var complete_address = result.Address;
                            console.log('ST', st);
                            var arr = st.split('-');
                            // this.model.dob = "06-29-2017"; //  yyyy-mm-dd
                             if(arr[2]==undefined || arr[1]==undefined || arr[0]==undefined){
                                var formatedDate = "";
                            }else{
                                var formatedDate = arr[2] + '-' + arr[1] + '-' + arr[0];
                            }
                            console.log('FT ', formatedDate);
                            var scanData = {
                                "status": true,
                                "payload": {
                                    "fname": result.Name.replace(/\n|\r/g, "").split(' ')[0],
                                    "lname": result.Name.replace(/\n|\r/g, "").split(' ')[1],
                                    "license_number": result.LicenseNo.replace(/\n|\r/g, ""),
                                    "dob": formatedDate,
                                    "country_code":'AUS',
                                    "image_path": imagePath,
                                    "address": {
                                        "state": 'AUS',
                                        "streettype": 'FLAT 10',
                                        "streetname": 'SAMPLE PARADE',
                                        "streetnum": '77',
                                        "suburb": '10',
                                        "housenum": "3102",
                                        "address": complete_address
                                    }
                                }
                            }
                            res.send(scanData);
                        })
                    }
                });

                // OAOApplicationHelper.crop(req, res, function (result) {
                //     console.log('Success Response', result);
                //     if (result) {
                //         console.log('cropped image succesfully');
                //         OAOApplicationHelper.fetchData(req, res, function (result) {
                //             var st = result[3].replace(/\n|\r|\s/g, "");
                //             console.log('ST',st);
                //             var arr = st.split('-');
                //              //this.model.dob = "06-29-2017"; //  yyyy-mm-dd
                //             var formatedDate = arr[2] + '-' + arr[1] + '-' + arr[0];
                //             console.log('FT ',formatedDate);
                //             var scanData = {
                //                 "status": true,
                //                 "payload": {
                //                     "fname": result[2].replace(/\n|\r/g, "").split(' ')[0],
                //                     "lname":result[2].replace(/\n|\r/g, "").split(' ')[1],
                //                     "license_number": result[0].replace(/\n|\r/g, ""),
                //                     "dob": formatedDate,
                //                     "country_code": result[1].replace(/\n|\r/g, ""),
                //                     "image_path":result[4]
                //                 }
                //             }
                //             res.send(scanData);
                //         });
                //     }
                // });
            } else {
                res.status(500).json({
                    success: false
                });
            }
        })
    })
})
OAORouter.get('/crop', function (req, res, next) {
    console.log('Calling Crop');
    OAOApplicationHelper.crop(req, res, function (result) {
        console.log('Success Response', result);
        if (result) {
            console.log('cropped image succesfully');
            OAOApplicationHelper.fetchData(req, res, function (result) {
                var scanData = {
                    "status": true,
                    "payload": {
                        "name": result[0].replace(/\n|\r/g, ""),
                        "license_number": result[1].replace(/\n|\r/g, ""),
                        "dob": result[2].replace(/\n|\r|\s/g, ""),
                        "country_code": result[3].replace(/\n|\r/g, "")
                    }
                }
                res.send(scanData);
            });
        }
    });
})
OAORouter.route('/sendOTPTOVerifyMobileNumber').post(function (req, res) {
    OAOApplicationHelper.genOTP(function (otp) {
        res.send(otp);
        OAODBHelper.getDropboxContent('GENERIC_PROP', 'EnableMsgMedia', function (Propdata) {
            console.log(Propdata[0].property_value)
            if (Propdata[0].property_value == "Y") {
                OAOApplicationHelper.sendOTPMessage(req, otp);
            }
        }

        )
    });
});
OAORouter.route('/sendOTPTOVerifyEmail').post(function (req, res) {
    OAOApplicationHelper.genOTP(function (otp) {
        res.send(otp);
        req.body.otp = otp;
        req.body.verify = "true";
        OAOApplicationHelper.SendMail(req.body.email, req.body.mobile, req.body, 'SEND_OTP', function (callbackResult) {
            console.log('Send OTP for verification', JSON.stringify(callbackResult));
        })
    })
});

OAORouter.route('/sendOTP')
    .post(function (req, res) {
        try {
            OAODBHelper.getSavedRecord(req.body.mobile, req.body.dob, function (result, success) {
                if (success == true && (result !== null && result != '')) {
                    console.log(result)
                    if (result[0].dob == req.body.dob) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAODBHelper.getDropboxContent('GENERIC_PROP', 'EnableMsgMedia', function (Propdata) {
                                console.log(Propdata[0].property_value)
                                if (Propdata[0].property_value == "Y") {
                                    OAOApplicationHelper.sendOTPMessage(result[0], otp);
                                }
                            })
                            OAOApplicationHelper.sendOTPMail(result[0], otp)
                            console.log(otp)
                            res.json({
                                sent: true,
                                success: true,
                                result: result,
                                savedApp: false
                            });
                        });
                    } else {
                        console.log("inside else")
                        res.json({
                            sent: false,
                            success: false,
                            savedApp: false
                        });
                    }
                } else {
                    res.json({
                        sent: false,
                        success: false,
                        savedApp: false
                    });
                }
            })
        } catch (e) {
            console.log("error in captha")
        }
    });
OAORouter.route('/verifyOTP')
    .post(function (req, res) {
        console.log(req.body.otp);
        OAOApplicationHelper.verifyOTP(req.body.otp, function (success) {
            res.json({ success: success });
        });
    });
OAORouter.route('/getDecrypted')
    .post(function (req, res) {
        OAOApplicationHelper.decrypt(req.body.app_id, function (d_appId) {
            console.log(d_appId)
            res.json({ d_appId: d_appId });
        });
    });
OAORouter.route('/Applicants')
    .post(function (req, res) {
        var completed_by;
        console.log("existing_cust_status" + req.body.existing_cust_status) //chanda
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            console.log("kush  " + req.body.application_id)
            var app_id_ = req.body.application_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);

            //console.log("Admins is withing something"+req.body.adminId);
            var Oao_product_customer_details = new OAOApplicantSchema({

                product_code: req.body.product_code,
                campaign_id: req.body.campaign_id,
                secondaryApplicantRefID: req.body.secondaryApplicantRefID,
                applicant: req.body.applicant,
                product_type_code: req.body.product_type_code,
                singleORjoint: req.body.singleORjoint,
                deviceType: req.device.type,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                verification_auto: req.body.verification_auto,
                brokerid: req.body.brokerid,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                no_address_found_flag: req.body.no_address_found_flag,
                section_SAV: {},
                bot_fields: {},
                no_of_section: config.number_of_sections[req.body.product_type_code],
                Mandatory_fields_SAV: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        tfn: false,
                        exemption: false
                    }],
                    section_3_fields: [{
                    }]
                }]
            })
            OAODBHelper.PersonalDetailsValidation(req, res, function (result1) {
                if (result1.length > 0) {
                    console.log("validation failed for persona details", result1);
                    res.json({ message: "Failed", Result: result1 });
                }
                else {
                    OAODBHelper.checkExistingApplicant(req, res, function (result) {
                        if (!result) {


                            OAODBHelper.save(Oao_product_customer_details, function (result) {
                                //Send mail for Everyday
                                if (req.body.primaryApplicantName == undefined) {
                                    //gathering data 
                                    var data = {
                                        'fname': result.fname,
                                        'lname': result.lname,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                } else {
                                    var data = {
                                        'primaryApplicantName': req.body.primaryApplicantName,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    result.section_SAV[0].section_2 = "true";
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION_JOINT', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                }
                                res.json({ Result: result });
                            })
                        }
                        else if (result.section_SAV[0].section_1 == false) {
                            if (req.body.fname != null) {
                                result.singleORjoint = req.body.singleORjoint
                                result.secondaryApplicantRefID = req.body.secondaryApplicantRefID
                                result.title = req.body.title
                                result.fname = req.body.fname
                                result.mname = req.body.mname
                                result.lname = req.body.lname
                                result.dob = req.body.dob
                                result.email = req.body.email,
                                    result.brokerid = req.body.brokerid,
                                    result.campaign_id = req.body.campaign_id,
                                    result.mobile = req.body.mobile,
                                    result.address = req.body.address,
                                    result.paddress = req.body.paddress,
                                    result.housenum = req.body.housenum,
                                    result.streetnum = req.body.streetnum,
                                    result.streetname = req.body.streetname,
                                    result.streettype = req.body.streettype,
                                    result.suburb = req.body.suburb,
                                    result.state = req.body.state,
                                    result.postcode = req.body.postcode,
                                    result.phousenum = req.body.phousenum,
                                    result.pstreetnum = req.body.pstreetnum,
                                    result.pstreetname = req.body.pstreetname,
                                    result.pstreettype = req.body.pstreettype,
                                    result.psuburb = req.body.psuburb,
                                    result.pstate = req.body.pstate,
                                    result.ppostcode = req.body.ppostcode,
                                    result.postal_home_address_flag = req.body.postal_home_address_flag,
                                    result.no_address_found_flag = req.body.no_address_found_flag
                                if (req.body.postal_home_address_flag == true) {
                                    result.paddress = req.body.address;
                                    result.pstreetname = req.body.streetname;
                                    result.ppostcode = req.body.postcode;
                                    result.pstate = req.body.state;
                                }
                                result.years = req.body.years;
                                    result.months = req.body.months;
                            
                            }
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            if (req.body.sec_1_v == true) {
                                result.section_SAV[0].section_1 = "true";
                                result.Mandatory_fields_SAV[0].section_1_fields[0].address = "true";
                                result.Mandatory_fields_SAV[0].section_1_fields[0].paddress = "true";
                                OAODBHelper.personaladdressValidation(req, res, function (result1) {
                                    if (result1.length > 0) {
                                        console.log("validation failed for persona details", result1);
                                        res.json({ message: "Failed", Result: result1 });
                                    }
                                    else {
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                })
                            } else if (req.body.sec_1_v == false) {
                                result.section_SAV[0].section_1 = "false";
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }

                        } else if (result.section_SAV[0].section_2 == false) {
                            result.tfn = req.body.tfn,
                                result.exemption = req.body.exemption,
                                result.verification_auto = req.body.verification_auto
                            OAODBHelper.validateExemption(req, res, function (result1) {
                                if (result1.length > 0) {
                                    console.log("validation failed for persona details", result1);
                                    res.json({ message: "Failed", Result: result1 });
                                }
                                // })
                                else {
                                    if ((result.tfn != null || result.exemption != null) && (req.body.skip == false || req.body.skip == 'false')) {
                                        result.section_SAV[0].section_3 = "false";
                                        result.section_SAV[0].section_2 = "true";
                                        result.Mandatory_fields_SAV[0].section_2_fields[0].tfn = "true";
                                        result.Mandatory_fields_SAV[0].section_2_fields[0].exemption = "true";
                                        if (req.body.bot == 'true') {
                                            if (result.tfn == "No" || result.tfn == "NO" || result.tfn == "no") {
                                                result.Mandatory_fields_SAV[0].section_2_fields[0].tfn = "true";
                                                result.Mandatory_fields_SAV[0].section_2_fields[0].exemption = "false";
                                                result.section_SAV[0].section_2 = "false";
                                            } else {
                                                result.section_SAV[0].section_2 = "true";
                                                result.section_SAV[0].section_3 = "false";
                                                result.deviceType = "bot";
                                                if (req.body.is_admin == true) {
                                                    result.application_status = constants.ACTIVE;
                                                } else {
                                                    result.application_status = constants.COMPLETED;
                                                }
                                                result.completion_time = new Date();
                                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                                    var update = {
                                                        $push: {
                                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                                        }
                                                    };
                                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                        console.log("Resume time updated");
                                                        console.log(result);
                                                    });
                                                }
                                                //result.completed_by = req.body.adminId;
                                                else {
                                                    var update = {
                                                        $push: {
                                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                                        }
                                                    };
                                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                        console.log("Resume time updated");
                                                        console.log(result);
                                                    });
                                                }
                                                //result.completed_by = "Applicant";
                                                OAOApplicationHelper.SendMail(result.email, result.mobile, function (callbackResult) { })
                                                OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                                    result.bank_bsb_number = CallBackResult;
                                                })
                                                console.log("req.body.core_customer_id:");
                                                if (req.body.existing_cust_status != "Y") {
                                                    OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                                        result.core_customer_id = CallBackResult;
                                                        OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                                    })
                                                } else {
                                                    result.core_customer_id = req.body.core_customer_id;
                                                    OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                                }
                                                OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                                    result.core_account_number = CallBackResult;
                                                })
                                            }
                                        }
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                    else if (req.body.skip == true) {
                                        console.log("in else")
                                        result.section_SAV[0].section_2 = "true";
                                        result.section_SAV[0].section_3 = "false";
                                        if (req.body.is_admin == true) {
                                            result.application_status = constants.ACTIVE;
                                        } else {
                                            result.application_status = constants.COMPLETED;
                                        }
                                        result.completion_time = new Date();
                                        if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        //result.completed_by = req.body.adminId;
                                        else {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        //// console.log                      
                                        var data = {
                                            'fname': result.fname,
                                            'lname': result.lname,
                                            'bsb_number': result.bank_bsb_number,
                                            'core_customer_id': result.core_customer_id,
                                            'core_account_number': result.core_account_number,
                                            'product_type_code': result.product_type_code,
                                            'product_name': req.body.product_name,
                                            'application_status': result.application_status
                                        }
                                        if (req.body.verification_auto == true && req.body.applicant == "primary") {
                                            result.application_status = constants.VERIFIED;
                                            console.log("changing status to onboard");
                                            OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                                result.bank_bsb_number = CallBackResult;
                                            })
                                            if (req.body.existing_cust_status != "Y") {
                                                OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                                    result.core_customer_id = CallBackResult;
                                                    OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                                })
                                            } else {
                                                result.core_customer_id = req.body.core_customer_id;
                                                OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                            }
                                            OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                                result.core_account_number = CallBackResult;
                                            })
                                            //gathering data to render
                                            var data = {
                                                'fname': result.fname,
                                                'lname': result.lname,
                                                'bsb_number': result.bank_bsb_number,
                                                'core_customer_id': result.core_customer_id,
                                                'core_account_number': result.core_account_number,
                                                'product_type_code': result.product_type_code,
                                                'product_name': req.body.product_name,
                                                'application_status': result.application_status
                                            }
                                            console.log('Everyday Account Data', JSON.stringify(data));
                                            //final submission mail
                                            OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                                console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                                            })
                                            result.application_status = constants.ONBOARDED;

                                        }
                                        if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                                            OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                                console.log('Application successfully processed', JSON.stringify(callbackResult));
                                            })
                                        }
                                        ////////
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                }
                            })
                        }
                        else if (result.section_SAV[0].section_3 == false) {
                            //result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            result.DLidState = req.body.DLidState,
                                result.LNum = req.body.LNum,
                                result.meidicarenum = req.body.meidicarenum,
                                result.color = req.body.color,
                                result.idnum = req.body.idnum,
                                result.idstate = req.body.idstate,
                                result.refnum = req.body.refnum,
                                result.validTo = req.body.validTo
                            result.verification_auto = req.body.verification_auto
                            if (req.body.skip == true) {
                                console.log("in else")
                                result.section_SAV[0].section_3 = "true";
                                if (req.body.is_admin == true) {
                                    result.application_status = constants.ACTIVE;
                                    result.section_SAV[0].section_3 = "false";
                                } else {
                                    result.application_status = constants.COMPLETED;
                                }
                                result.completion_time = new Date();
                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //result.completed_by = req.body.adminId;
                                else {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                var data = {
                                    'fname': result.fname,
                                    'lname': result.lname,
                                    'bsb_number': result.bank_bsb_number,
                                    'core_customer_id': result.core_customer_id,
                                    'core_account_number': result.core_account_number,
                                    'product_type_code': result.product_type_code,
                                    'product_name': req.body.product_name,
                                    'application_status': result.application_status
                                }
                                /////////////// Start of Verification Check
                                // If Verfication (Auto) - true 
                                //Change the status to verified
                                //If Onboarding (Auto) - true {
                                console.log(req.body.verification_auto);
                                console.log(result.verification_auto);
                                if (req.body.verification_auto == true && req.body.applicant == "primary") {
                                    result.application_status = constants.VERIFIED;

                                    OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                        result.bank_bsb_number = CallBackResult;
                                    })

                                    if (req.body.existing_cust_status != "Y") {
                                        OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                            result.core_customer_id = CallBackResult;
                                            OAOApplicationHelper.updateCimsProperties(result.application_id, CallBackResult);
                                        })
                                    } else {
                                        result.core_customer_id = req.body.core_customer_id;
                                        OAOApplicationHelper.updateCimsProperties(result.application_id, req.body.core_customer_id);
                                    }
                                    OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                        result.core_account_number = CallBackResult;
                                    })
                                    //gathering data to render
                                    console.log('Everyday Account Data', JSON.stringify(data));
                                    //final submission mail
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                        console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                                    })
                                    result.application_status = constants.ONBOARDED;

                                }
                                if (result.application_status == constants.VERIFIED || result.application_status == constants.COMPLETED) {
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                        console.log('Application successfully processed', JSON.stringify(callbackResult));
                                    })
                                }
                                /////// 
                                /// Change the status to Onboarded ...} End for Verification check
                                /// If the status is CMP/constants.VERIFIED, then  Use Home loan mail template as submitte for processing
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            } else {
                                console.log("tttetstsj")
                                console.log(result);
                                OAODBHelper.save(Oao_product_customer_details, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }
                        } else {
                            res.status(404).json({
                                message: 'Page Not found',
                            });
                        }

                    })
                }
            })
        })
    });
// OAO HOMELOAN Applicants
OAORouter.route('/HomeLoanApplicants')
    .post(function (req, res) {
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            console.log("kush  " + req.body.application_id)
            var app_id_ = req.body.application_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
            var Oao_product_customer_details = new OAOApplicantSchema({
                secondaryApplicantRefID: req.body.secondaryApplicantRefID,
                applicant: req.body.applicant,
                product_code: req.body.product_code,
                product_type_code: req.body.product_type_code,
                campaign_id: req.body.campaign_id,
                deviceType: req.device.type,
                title: req.body.title,
                existing_cust_status: req.body.existing_cust_status,
                singleORjoint: req.body.singleORjoint,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                brokerid: req.body.brokerid,
                //new about you values
                years: req.body.years,
                months: req.body.months,
                fullname: req.body.fullname,
                phone: req.body.phone,
                anotheryears: req.body.anotheryears,
                anothermonths: req.body.anothermonths,
                newaddress: req.body.newaddress,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                loantype: req.body.loantype,
                property: req.body.property,
                proptype: req.body.proptype,
                payoutbal: req.body.payoutbal,
                propaddr: req.body.propaddr,
                purchaseprice: req.body.purchaseprice,
                amtborrow: req.body.amtborrow,
                totalMortgage: req.body.totalMortgage,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                repaymentAmount: req.body.repaymentAmount,
                emi: req.body.emi,
                interest_rate: req.body.interest_rate,
                repaymenttype: req.body.repaymenttype,
                establishment_fees: req.body.establishment_fees,
                loan_service_fees: req.body.loan_service_fees,
                interesttype: req.body.interesttype,
                fixedper: req.body.fixedper,
                variableper: req.body.variableper,
                consolidateMortage: req.body.consolidateMortage,
                estvalue: req.body.estvalue,
                propaddress_m: req.body.propaddress_m,
                finInstitution: req.body.finInstitution,
                consolidateotherMortage: req.body.consolidateotherMortage,
                cc_estvalue: req.body.cc_estvalue,
                cc_finInstitution: req.body.cc_finInstitution,
                pl_estvalue: req.body.pl_estvalue,
                pl_finInstitution: req.body.pl_finInstitution,
                cl_estvalue: req.body.cl_estvalue,
                cl_finInstitution: req.body.cl_finInstitution,
                sl_estvalue: req.body.sl_estvalue,
                sl_finInstitution: req.body.sl_finInstitution,
                o_estvalue: req.body.o_estvalue,
                o_finInstitution: req.body.o_finInstitution,
                ownership: req.body.ownership,
                rentalincome: req.body.rentalincome,
                no_address_found_flag: req.body.no_address_found_flag,
                prophousenum: req.body.prophousenum,
                propstreetnum: req.body.propstreetnum,
                propstreetname: req.body.propstreetname,
                propstreettype: req.body.propstreettype,
                propsuburb: req.body.propsuburb,
                propstate: req.body.propstate,
                proppostcode: req.body.proppostcode,
                prophousenum_m: req.body.prophousenum_m,
                propstreetnum_m: req.body.propstreetnum_m,
                propstreetname_m: req.body.propstreetname_m,
                propstreettype_m: req.body.propstreettype_m,
                propsuburb_m: req.body.propsuburb_m,
                propstate_m: req.body.propstate_m,
                proppostcode_m: req.body.proppostcode_m,
                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,
                expenseFrequency: req.body.expenseFrequency,
                no_of_section: config.number_of_sections[req.body.product_type_code],
                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                otherIncomeData: req.body.otherIncomeData,
                supportFinancially: req.body.supportFinancially,
                relationshipStatus: req.body.relationshipStatus,
                livingType: req.body.livingType,
                rentShare: req.body.rentShare,
                frequencyOfRent: req.body.frequencyOfRent,
                newhousenum: req.body.newhousenum,
                newstreetnum: req.body.newstreetnum,
                newstreetname: req.body.newstreetname,
                newstreettype: req.body.newstreettype,
                newsuburb: req.body.newsuburb,
                newstate: req.body.newstate,
                newpostcode: req.body.newpostcode,
                totalYears: req.body.totalYears,
                totalMonths: req.body.totalMonths,
                thirdyears: req.body.thirdyears,
                thirdmonths: req.body.thirdmonths,
                thirdaddress: req.body.thirdaddress,
                thirdhousenum: req.body.thirdhousenum,
                thirdstreetnum: req.body.thirdstreetnum,
                thirdstreetname: req.body.thirdstreetname,
                thirdstreettype: req.body.thirdstreettype,
                thirdsuburb: req.body.thirdsuburb,
                thirdstate: req.body.thirdstate,
                thirdpostcode: req.body.thirdpostcode,
                retirementYears: req.body.retirementYears,
                retirementMonths: req.body.retirementMonths,
                section_HML: {},
                bot_fields: {},
                Mandatory_fields_HML: [{
                    section_1_fields: [{
                        lanme: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        loantype: false,
                        property: false,
                        proptype: false,
                        payoutbal: false,
                        propaddr: false,
                        purchaseprice: false,
                        ownership: false,
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        interesttype: false,
                        fixedper: false,
                        variableper: false,
                        repaymenttype: false,
                        estvalue: false,
                        propaddress_m: false,
                        prophousenum: false,
                        propstreetnum: false,
                        propstreetname: false,
                        propstreettype: false,
                        propsuburb: false,
                        propstate: false,
                        proppostcode: false,
                        prophousenum_m: false,
                        propstreetnum_m: false,
                        propstreetname_m: false,
                        propstreettype_m: false,
                        propsuburb_m: false,
                        propstate_m: false,
                        proppostcode_m: false,
                        finInstitution: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }],
                    section_4_fields: [{
                    }]
                }]
            })
 if(req.body.jointEmailOrComp==true && req.body.applicant=="secondary"){
             Oao_product_customer_details.section_HML[0].section_2 = "true";
	     }
            console.log("sample result" + Oao_product_customer_details);
            OAODBHelper.PersonalDetailsValidation(req, res, function (result1) {
                if (result1.length > 0) {
                    console.log("validation failed for persona details", result1);
                    res.json({ message: "Failed", Result: result1 });
                }
                else {
                    OAODBHelper.checkExistingApplicant(req, res, function (result) {
                        if (!result) {

                            OAODBHelper.save(Oao_product_customer_details, function (result) {
                                if (req.body.primaryApplicantName == undefined) {
                                    //gathering data 
                                    var data = {
                                        'fname': result.fname,
                                        'lname': result.lname,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                } else {
                                    var data = {
                                        'primaryApplicantName': req.body.primaryApplicantName,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    result.section_HML[0].section_2 = "true";
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION_JOINT', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                }
                                res.json({ Result: result });
                            })
                        } else if (result.section_HML[0].section_1 == false) {
                            if (req.body.fname != null) {
                                result.singleORjoint = req.body.singleORjoint
                                result.secondaryApplicantRefID = req.body.secondaryApplicantRefID
                                result.title = req.body.title
                                result.fname = req.body.fname
                                result.mname = req.body.mname
                                result.lname = req.body.lname
                                result.dob = req.body.dob
                                result.email = req.body.email,
                                    result.brokerid = req.body.brokerid,
                                    result.mobile = req.body.mobile
                                result.campaign_id = req.body.campaign_id,
                                    result.address = req.body.address,
                                    result.paddress = req.body.paddress,
                                    result.housenum = req.body.housenum,
                                    result.streetnum = req.body.streetnum,
                                    result.streetname = req.body.streetname,
                                    result.streettype = req.body.streettype,
                                    result.suburb = req.body.suburb,
                                    result.state = req.body.state,
                                    result.postcode = req.body.postcode,
                                    result.phousenum = req.body.phousenum,
                                    result.pstreetnum = req.body.pstreetnum,
                                    result.pstreetname = req.body.pstreetname,
                                    result.pstreettype = req.body.pstreettype,
                                    result.psuburb = req.body.psuburb,
                                    result.pstate = req.body.pstate,
                                    result.ppostcode = req.body.ppostcode,
                                    result.prophousenum = req.body.prophousenum,
                                    result.propstreetnum = req.body.propstreetnum,
                                    result.propstreettype = req.body.propstreettype,
                                    result.propstreetname = req.body.propstreetname,
                                    result.propsuburb = req.body.propsuburb,
                                    result.propstate = req.body.propstate,
                                    result.proppostcode = req.body.proppostcode,
                                    result.postal_home_address_flag = req.body.postal_home_address_flag,
                                    result.no_address_found_flag = req.body.no_address_found_flag
                                if (req.body.postal_home_address_flag == true) {
                                    result.paddress = req.body.address;
                                    result.pstreetname = req.body.streetname;
                                    result.ppostcode = req.body.postcode;
                                    result.pstate = req.body.state;
                                }
                                result.years = req.body.years;
                                result.months = req.body.months;

                            }
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            if (req.body.sec_1_v == true) {
                                console.log("in sec 1 sec_1_v == true")
                                result.section_HML[0].section_1 = "true";
                                result.Mandatory_fields_HML[0].section_1_fields[0].address = "true";
                                result.Mandatory_fields_HML[0].section_1_fields[0].paddress = "true";
                                OAODBHelper.personaladdressValidation(req, res, function (result1) {
                                    if (result1.length > 0) {
                                        console.log("validation failed for persona details", result1);
                                        res.json({ message: "Failed", Result: result1 });
                                    }
                                    else {
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                })
                            } else if (req.body.sec_1_v == false) {
                                console.log("in sec 1 sec_1_v == false")
                                result.section_HML[0].section_1 = "false";
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }

                        } else if (result.section_HML[0].section_2 == false) {
                            console.log("enter of section 2");
                            if (req.body.loantype != null) {
                                result.loantype = req.body.loantype,
                                    result.property = req.body.property,
                                    result.proptype = req.body.proptype,
                                    result.payoutbal = req.body.payoutbal,
                                    result.propaddr = req.body.propaddr,
                                    result.purchaseprice = req.body.purchaseprice,
                                    result.ownership = req.body.ownership,
                                    result.rentalincome = req.body.rentalincome,
                                    result.prophousenum = req.body.prophousenum,
                                    result.propstreetnum = req.body.propstreetnum,
                                    result.propstreetname = req.body.propstreetname,
                                    result.propstreettype = req.body.propstreettype,
                                    result.propsuburb = req.body.propsuburb,
                                    result.propstate = req.body.propstate,
                                    result.proppostcode = req.body.proppostcode
                                result.amtborrow = req.body.amtborrow,
                                    result.totalMortgage = req.body.totalMortgage,
                                    result.loanterm = req.body.loanterm,
                                    result.repaymentAmount = req.body.repaymentAmount,
                                    result.emi = req.body.emi,
                                    result.interest_rate = req.body.interest_rate,
                                    result.loan_service_fees = req.body.loan_service_fees,
                                    result.interesttype = req.body.interesttype,
                                    result.frequencyType = req.body.frequencyType,
                                    result.interesttype = req.body.interesttype,
                                    result.fixedper = req.body.fixedper,
                                    result.variableper = req.body.variableper,
                                    result.repaymenttype = req.body.repaymenttype,
                                    result.estvalue = req.body.estvalue,
                                    result.propaddress_m = req.body.propaddress_m,
                                    result.finInstitution = req.body.finInstitution,
                                    result.consolidateMortage = req.body.consolidateMortage,
                                    result.prophousenum_m = req.body.prophousenum_m,
                                    result.propstreetnum_m = req.body.propstreetnum_m,
                                    result.propstreetname_m = req.body.propstreetname_m,
                                    result.propstreettype_m = req.body.propstreettype_m,
                                    result.propsuburb_m = req.body.propsuburb_m,
                                    result.propstate_m = req.body.propstate_m,
                                    result.proppostcode_m = req.body.proppostcode_m,
                                    result.consolidateotherMortage = req.body.consolidateotherMortage,
                                    result.cc_estvalue = req.body.cc_estvalue,
                                    result.cc_finInstitution = req.body.cc_finInstitution,
                                    result.pl_estvalue = req.body.pl_estvalue,
                                    result.pl_finInstitution = req.body.pl_finInstitution,
                                    result.cl_estvalue = req.body.cl_estvalue,
                                    result.cl_finInstitution = req.body.cl_finInstitution,
                                    result.sl_estvalue = req.body.sl_estvalue,
                                    result.sl_finInstitution = req.body.sl_finInstitution,
                                    result.o_estvalue = req.body.o_estvalue,
                                    result.o_finInstitution = req.body.o_finInstitution
                            }
                            if (req.body.sec_2_v == false) {
                                result.section_HML[0].section_2 = "false";
                                OAODBHelper.validPropertyDetails(req, res, function (result1) {
                                    console.log("validation in propdetails", result1);
                                    if (result1.length > 0) {
                                        console.log("validation failed for persona details", result1);
                                        res.json({ message: "Failed", Result: result1 });
                                    }
                                    else {
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                })
                            } else if (req.body.sec_2_v == true) {
                                OAODBHelper.loanDetailsValidation(req, res, function (result1) {
                                    if (result1.length > 0) {
                                        console.log("validation failed for persona details", result1);
                                        res.json({ message: "Failed", Result: result1 });
                                    }
                                    else {
                                        result.section_HML[0].section_2 = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].loantype = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].property = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].proptype = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].payoutbal = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddr = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].purchaseprice = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].ownership = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].amtborrow = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].loanterm = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].frequencyType = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].interesttype = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].fixedper = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].variableper = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].repaymenttype = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].estvalue = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddress_m = "true";
                                        result.Mandatory_fields_HML[0].section_2_fields[0].finInstitution = "true";
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                })

                            }

                        } else if (result.section_HML[0].section_3 == false) {
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            OAODBHelper.validateIncome(req, res, function (result1) {
                                if (result1.length > 0) {
                                    console.log("validation failed for persona details", result1);
                                    res.json({ message: "Failed", Result: result1 });
                                }
                                else {
                                    if (req.body.employed != null) {
                                        result.employed = req.body.employed,
                                            result.employer = req.body.employer,
                                            result.service = req.body.service,
                                            result.companyName = req.body.companyName,
                                            result.yearsEstablished = req.body.yearsEstablished,
                                            result.earnPerMonth = req.body.earnPerMonth,
                                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                                        result.otherIncomeData = req.body.otherIncomeData
                                        supportFinancially = req.body.supportFinancially,
                                            //about you values
                                            result.retirementYears = req.body.retirementYears,
                                            result.retirementMonths = req.body.retirementMonths,
                                            result.fullname = req.body.fullname,
                                            result.phone = req.body.phone,
                                            result.anotheryears = req.body.anotheryears,
                                            result.anothermonths = req.body.anothermonths,
                                            result.newaddress = req.body.newaddress
                                        result.relationshipStatus = req.body.relationshipStatus
                                        result.livingType = req.body.livingType
                                        result.rentShare = req.body.rentShare
                                        result.frequencyOfRent = req.body.frequencyOfRent
                                        result.expenseFrequency = req.body.expenseFrequency
                                        result.verification_auto = req.body.verification_auto
                                        result.assets = req.body.assets,
                                            result.Liabilities = req.body.Liabilities,
                                            result.newhousenum = req.body.newhousenum,
                                            result.newstreetnum = req.body.newstreetnum,
                                            result.newstreetname = req.body.newstreetname,
                                            result.newstreettype = req.body.newstreettype,
                                            result.newsuburb = req.body.newsuburb,
                                            result.newstate = req.body.newstate,
                                            result.newpostcode = req.body.newpostcode
                                        result.totalYears = req.body.totalYears,
                                            result.totalMonths = req.body.totalMonths,
                                            result.thirdyears = req.body.thirdyears,
                                            result.thirdmonths = req.body.thirdmonths,
                                            result.thirdaddress = req.body.thirdaddress,
                                            result.thirdhousenum = req.body.thirdhousenum,
                                            result.thirdstreetnum = req.body.thirdstreetnum,
                                            result.thirdstreetname = req.body.thirdstreetname,
                                            result.thirdstreettype = req.body.thirdstreettype,
                                            result.thirdsuburb = req.body.thirdsuburb,
                                            result.thirdstate = req.body.thirdstate,
                                            result.thirdpostcode = req.body.thirdpostcode
                                    }
                                    console.log("in sec 3 before employed")
                                    if (req.body.skip == false && (req.body.fullname == null || req.body.fullname == undefined)) {
                                        console.log("in if sec 3 employed")
                                        result.section_HML[0].section_3 = "false";
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    } else if (req.body.skip == false && (req.body.fullname != null || req.body.fullname != undefined)) {
                                        console.log("in if sec skip false")
                                        result.section_HML[0].section_3 = "true";
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                    else if (req.body.skip == true) {
                                        console.log("in if sec end skip true")
                                        result.section_HML[0].section_3 = "true";
                                        if (req.body.is_admin == true) {
                                            result.application_status = constants.ACTIVE;
                                        } else {
                                            result.application_status = constants.COMPLETED;
                                            if (req.body.verification_auto == true) {
                                                result.application_status = constants.VERIFIED;
                                                result.verification_auto = true;
                                            }
                                        }
                                        result.completion_time = new Date();
                                        if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        //result.completed_by = req.body.adminId;
                                        else {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        result.Mandatory_fields_HML[0].section_3_fields[0].employed == "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].employer = "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].service = "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].companyName = "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].yearsEstablished = "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].earnPerMonth = "true",
                                            result.Mandatory_fields_HML[0].section_3_fields[0].monthlyLivingExpenses = "true"
                                        //final submission data
                                        var data = {
                                            'fname': result.fname,
                                            'lname': result.lname,
                                            'product_type_code': result.product_type_code,
                                            'product_name': req.body.product_name
                                        }
                                        console.log('Personal account load data', JSON.stringify(data));
                                        OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                            console.log('Personal account loan final submission mail status', JSON.stringify(callbackResult));
                                        })
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                }
                            })
                        }

                        else if (result.section_HML[0].section_4 == false) {
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            result.DLidState = req.body.DLidState,
                                result.LNum = req.body.LNum,
                                result.meidicarenum = req.body.meidicarenum,
                                result.color = req.body.color,
                                result.idnum = req.body.idnum,
                                result.idstate = req.body.idstate,
                                result.refnum = req.body.refnum,
                                result.validTo = req.body.validTo
                            result.verification_auto = req.body.verification_auto
                            console.log("in sec 4")
                            if (req.body.skip == false) {
                                console.log("in if sec 4 skip false")
                                result.section_HML[0].section_4 = "true";
                                if (req.body.is_admin == true) {
                                    result.application_status = constants.ACTIVE;
                                    result.section_HML[0].section_4 = "false";
                                } else {
                                    result.application_status = constants.COMPLETED;
                                    if (req.body.verification_auto == true) {
                                        result.application_status = constants.VERIFIED;
                                        result.verification_auto = true;
                                    }
                                }
                                result.completion_time = new Date();
                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //result.completed_by = req.body.adminId;
                                else {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //gathering data for Home Loan
                                var data = {
                                    'fname': result.fname,
                                    'lname': result.lname,
                                    'product_type_code': result.product_type_code,
                                    'product_name': req.body.product_name
                                }
                                console.log('Final Data', JSON.stringify(data));
                                //sending mail for home loan final submission
                                OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                                })
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })

                            }
                            else if (req.body.skip == true) {
                                console.log("in if sec 4 skip true")
                                result.section_HML[0].section_4 = "true";
                                if (req.body.is_admin == true) {
                                    result.application_status = constants.ACTIVE;
                                    result.section_HML[0].section_4 = "false";
                                } else {
                                    result.application_status = constants.COMPLETED;
                                    if (req.body.verification_auto == true) {
                                        result.application_status = constants.VERIFIED;
                                        result.verification_auto = true;
                                    }
                                }
                                result.completion_time = new Date();
                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //result.completed_by = req.body.adminId;
                                else {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //gathering data for Home Loan
                                var data = {
                                    'fname': result.fname,
                                    'lname': result.lname,
                                    'product_type_code': result.product_type_code,
                                    'product_name': req.body.product_name
                                }
                                console.log('Final Data', JSON.stringify(data));
                                //sending mail for home loan final submission
                                OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                                })
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }
                        }
                        else {
                            res.status(404).json({
                                message: 'Page Not found',
                            });
                        }
                    })
                }
            })
        })
    });

//ends HOMELOAN

// OAO PERSONALLOAN Applicants
OAORouter.route('/PersonalLoanApplicants')
    .post(function (req, res) {
        console.log("Inside PErsonal loan");
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            console.log("kush  " + req.body.application_id)
            var app_id_ = req.body.application_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
            var Oao_product_customer_details = new OAOApplicantSchema({
                secondaryApplicantRefID: req.body.secondaryApplicantRefID,
                applicant: req.body.applicant,
                product_code: req.body.product_code,
                product_type_code: req.body.product_type_code,
                campaign_id: req.body.campaign_id,
                singleORjoint: req.body.singleORjoint,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                deviceType: req.device.type,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                brokerid: req.body.brokerid,
                //new about you values
                years: req.body.years,
                months: req.body.months,
                fullname: req.body.fullname,
                phone: req.body.phone,
                anotheryears: req.body.anotheryears,
                anothermonths: req.body.anothermonths,
                newaddress: req.body.newaddress,
                mobile: req.body.mobile,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                loanreason: req.body.loanreason,
                amtborrow: req.body.amtborrow,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                no_address_found_flag: req.body.no_address_found_flag,
                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                incomeFrequency: req.body.incomeFrequency,
                secondJobEarning: req.body.secondJobEarning,
                secondJobIncomeFrequency: req.body.secondJobIncomeFrequency,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,
                expenseFrequency: req.body.expenseFrequency,
                no_of_section: config.number_of_sections[req.body.product_type_code],
                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                otherIncomeData: req.body.otherIncomeData,
                supportFinancially: req.body.supportFinancially,
                relationshipStatus: req.body.relationshipStatus,
                livingType: req.body.livingType,
                rentShare: req.body.rentShare,
                frequencyOfRent: req.body.frequencyOfRent,
                newhousenum: req.body.newhousenum,
                newstreetnum: req.body.newstreetnum,
                newstreetname: req.body.newstreetname,
                newstreettype: req.body.newstreettype,
                newsuburb: req.body.newsuburb,
                newstate: req.body.newstate,
                totalYears: req.body.totalYears,
                totalMonths: req.body.totalMonths,
                thirdyears: req.body.thirdyears,
                thirdmonths: req.body.thirdmonths,
                thirdaddress: req.body.thirdaddress,
                thirdhousenum: req.body.thirdhousenum,
                thirdstreetnum: req.body.thirdstreetnum,
                thirdstreetname: req.body.thirdstreetname,
                thirdstreettype: req.body.thirdstreettype,
                thirdsuburb: req.body.thirdsuburb,
                thirdstate: req.body.thirdstate,
                thirdpostcode: req.body.thirdpostcode,
                section_PRL: {},
                bot_fields: {},
                Mandatory_fields_PRL: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: false,
                        paddress: false
                    }],
                    section_2_fields: [{
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        loanreason: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }],
                    section_4_fields: [{
                    }]
                }]
            })
	if(req.body.jointEmailOrComp==true && req.body.applicant=="secondary"){
             Oao_product_customer_details.section_PRL[0].section_2 = "true";
        }
            OAODBHelper.PersonalDetailsValidation(req, res, function (result1) {
                if (result1.length > 0) {
                    console.log("validation failed for persona details", result1);
                    res.json({ message: "Failed", Result: result1 });
                }
                else {
                    OAODBHelper.checkExistingApplicant(req, res, function (result) {
                        if (!result) {
                            OAODBHelper.save(Oao_product_customer_details, function (result) {
                                if (req.body.primaryApplicantName == undefined) {
                                    //gathering data 
                                    var data = {
                                        'fname': result.fname,
                                        'lname': result.lname,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                } else {
                                    var data = {
                                        'primaryApplicantName': req.body.primaryApplicantName,
                                        'product_type_code': result.product_type_code,
                                        'product_name': req.body.product_name,
                                        'url': config.url.clientUrl
                                    }
                                    result.section_SAV[0].section_2 = "true";
                                    console.log('Home Loan Application data', JSON.stringify(data));
                                    OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'SAVE_SUBMISSION_JOINT', function (callbackResult) {
                                        console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                                    })
                                }
                                res.json({ Result: result });
                            })
                        } else if (result.section_PRL[0].section_1 == false) {
                            if (req.body.fname != null) {
                                result.singleORjoint = req.body.singleORjoint
                                result.secondaryApplicantRefID = req.body.secondaryApplicantRefID
                                result.title = req.body.title
                                result.fname = req.body.fname
                                result.mname = req.body.mname
                                result.lname = req.body.lname
                                result.brokerid = req.body.brokerid
                                result.dob = req.body.dob
                                result.email = req.body.email,
                                    result.mobile = req.body.mobile
                                result.campaign_id = req.body.campaign_id,
                                    result.address = req.body.address,
                                    result.paddress = req.body.paddress,
                                    result.housenum = req.body.housenum,
                                    result.streetnum = req.body.streetnum,
                                    result.streetname = req.body.streetname,
                                    result.streettype = req.body.streettype,
                                    result.suburb = req.body.suburb,
                                    result.state = req.body.state,
                                    result.postcode = req.body.postcode,
                                    result.phousenum = req.body.phousenum,
                                    result.pstreetnum = req.body.pstreetnum,
                                    result.pstreetname = req.body.pstreetname,
                                    result.pstreettype = req.body.pstreettype,
                                    result.psuburb = req.body.psuburb,
                                    result.pstate = req.body.pstate,
                                    result.ppostcode = req.body.ppostcode,
                                    result.postal_home_address_flag = req.body.postal_home_address_flag,
                                    result.no_address_found_flag = req.body.no_address_found_flag
                                if (req.body.postal_home_address_flag == true) {
                                    result.paddress = req.body.address;
                                    result.pstreetname = req.body.streetname;
                                    result.ppostcode = req.body.postcode;
                                    result.pstate = req.body.state;
                                }
                                result.years = req.body.years;
                                    result.months = req.body.months;
                            
                            }
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            if (req.body.sec_1_v == true) {
                                result.section_PRL[0].section_1 = "true";
                                result.Mandatory_fields_PRL[0].section_1_fields[0].address = "true";
                                result.Mandatory_fields_PRL[0].section_1_fields[0].paddress = "true";
                                OAODBHelper.personaladdressValidation(req, res, function (result1) {
                                    if (result1.length > 0) {
                                        console.log("validation failed for persona details", result1);
                                        res.json({ message: "Failed", Result: result1 });
                                    }
                                    else {
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                })
                            } else if (req.body.sec_1_v == false) {
                                result.section_PRL[0].section_1 = "false";
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }

                        } else if (result.section_PRL[0].section_2 == false) {
                            console.log("enter of section 2");
                            if (req.body.amtborrow != null) {
                                result.amtborrow = req.body.amtborrow,
                                    result.loanterm = req.body.loanterm,
                                    result.frequencyType = req.body.frequencyType,
                                    result.loanreason = req.body.loanreason
                            }
                            if (req.body.sec_2_v == true) {
                                result.section_PRL[0].section_2 = "true";
                                result.Mandatory_fields_PRL[0].section_2_fields[0].amtborrow = "true";
                                result.Mandatory_fields_PRL[0].section_2_fields[0].loanterm = "true";
                                result.Mandatory_fields_PRL[0].section_2_fields[0].frequencyType = "true";
                                console.log("success condtion in section 2" + result);
                                OAODBHelper.save(result, function (result) {

                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            } else if (req.body.sec_2_v == false) {
                                console.log("false constion");
                                result.section_PRL[0].section_2 = "false";
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }

                        } else if (result.section_PRL[0].section_3 == false) {
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            OAODBHelper.validateIncome(req, res, function (result1) {
                                if (result1.length > 0) {
                                    console.log("validation failed for persona details", result1);
                                    res.json({ message: "Failed", Result: result1 });
                                }
                                else {
                                    if (req.body.employed != null) {
                                        result.employed = req.body.employed,
                                            result.employer = req.body.employer,
                                            result.service = req.body.service,
                                            result.companyName = req.body.companyName,
                                            result.yearsEstablished = req.body.yearsEstablished,
                                            result.earnPerMonth = req.body.earnPerMonth,
                                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                                        result.otherIncomeData = req.body.otherIncomeData
                                        supportFinancially = req.body.supportFinancially,
                                            //about you values
                                            result.retirementYears = req.body.retirementYears,
                                            result.retirementMonths = req.body.retirementMonths,
                                            result.years = req.body.years,
                                            result.months = req.body.months,
                                            result.fullname = req.body.fullname,
                                            result.phone = req.body.phone,
                                            result.anotheryears = req.body.anotheryears,
                                            result.anothermonths = req.body.anothermonths,
                                            result.newaddress = req.body.newaddress
                                        result.relationshipStatus = req.body.relationshipStatus
                                        result.livingType = req.body.livingType
                                        result.rentShare = req.body.rentShare
                                        result.frequencyOfRent = req.body.frequencyOfRent
                                        result.expenseFrequency = req.body.expenseFrequency
                                        result.verification_auto = req.body.verification_auto
                                        result.assets = req.body.assets,
                                            result.Liabilities = req.body.Liabilities,
                                            result.newhousenum = req.body.newhousenum,
                                            result.newstreetnum = req.body.newstreetnum,
                                            result.newstreetname = req.body.newstreetname,
                                            result.newstreettype = req.body.newstreettype,
                                            result.newsuburb = req.body.newsuburb,
                                            result.newstate = req.body.newstate,
                                            result.newpostcode = req.body.newpostcode,
                                            result.totalYears = req.body.totalYears,
                                            result.totalMonths = req.body.totalMonths,
                                            result.thirdyears = req.body.thirdyears,
                                            result.thirdmonths = req.body.thirdmonths,
                                            result.thirdaddress = req.body.thirdaddress,
                                            result.thirdhousenum = req.body.thirdhousenum,
                                            result.thirdstreetnum = req.body.thirdstreetnum,
                                            result.thirdstreetname = req.body.thirdstreetname,
                                            result.thirdstreettype = req.body.thirdstreettype,
                                            result.thirdsuburb = req.body.thirdsuburb,
                                            result.thirdstate = req.body.thirdstate,
                                            result.thirdpostcode = req.body.thirdpostcode
                                    }
                                    console.log("in sec 3 before employed")
                                    if (req.body.skip == false && (req.body.fullname == null || req.body.fullname == undefined)) {
                                        console.log("in if sec 3 employed")
                                        result.section_PRL[0].section_3 = "false";
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    } else if (req.body.skip == false && (req.body.fullname != null || req.body.fullname != undefined)) {
                                        console.log("in if sec skip false")
                                        result.section_PRL[0].section_3 = "true";
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                    else if (req.body.skip == true) {
                                        console.log("in if sec end skip true")
                                        result.section_PRL[0].section_3 = "true";
                                        if (req.body.is_admin == true) {
                                            result.application_status = constants.ACTIVE;
                                        } else {
                                            result.application_status = constants.COMPLETED;
                                            if (req.body.verification_auto == true) {
                                                result.application_status = constants.VERIFIED;
                                                result.verification_auto = true;
                                            }
                                        }
                                        result.completion_time = new Date();
                                        if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        //result.completed_by = req.body.adminId;
                                        else {
                                            var update = {
                                                $push: {
                                                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                                }
                                            };
                                            OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                                console.log("Resume time updated");
                                                console.log(result);
                                            });
                                        }
                                        result.Mandatory_fields_PRL[0].section_3_fields[0].employed == "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].employer = "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].service = "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].companyName = "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].yearsEstablished = "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].earnPerMonth = "true",
                                            result.Mandatory_fields_PRL[0].section_3_fields[0].monthlyLivingExpenses = "true"
                                        //final submission data
                                        var data = {
                                            'fname': result.fname,
                                            'lname': result.lname,
                                            'product_type_code': result.product_type_code,
                                            'product_name': req.body.product_name
                                        }
                                        console.log('Personal account load data', JSON.stringify(data));
                                        OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                            console.log('Personal account loan final submission mail status', JSON.stringify(callbackResult));
                                        })
                                        OAODBHelper.save(result, function (result) {
                                            res.status(200).json({
                                                message: 'Updated message',
                                                Result: result
                                            });
                                        })
                                    }
                                }
                            })
                        } else if (result.section_PRL[0].section_4 == false) {
                            // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                            result.DLidState = req.body.DLidState,
                                result.LNum = req.body.LNum,
                                result.meidicarenum = req.body.meidicarenum,
                                result.color = req.body.color,
                                result.idnum = req.body.idnum,
                                result.idstate = req.body.idstate,
                                result.refnum = req.body.refnum,
                                result.validTo = req.body.validTo
                            console.log("in sec 4")
                            if (req.body.skip == false) {
                                console.log("in if sec 4 skip false")
                                result.section_PRL[0].section_4 = "true";
                                if (req.body.is_admin == true) {
                                    result.section_PRL[0].section_4 = "false";
                                    result.application_status = constants.ACTIVE;
                                } else {
                                    result.application_status = constants.COMPLETED;
                                    if (req.body.verification_auto == true) {
                                        result.application_status = constants.VERIFIED;
                                        result.verification_auto = true;
                                    }
                                }
                                result.completion_time = new Date();
                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //result.completed_by = req.body.adminId;
                                else {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //gathering data for Home Loan
                                var data = {
                                    'fname': result.fname,
                                    'lname': result.lname,
                                    'product_type_code': result.product_type_code,
                                    'product_name': req.body.product_name
                                }
                                console.log('Final Data', JSON.stringify(data));
                                //sending mail for home loan final submission
                                OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                                })
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })

                            }
                            else if (req.body.skip == true) {
                                console.log("in if sec 4 skip true")
                                result.section_PRL[0].section_4 = "true";
                                if (req.body.is_admin == true) {
                                    result.application_status = constants.ACTIVE;
                                    result.section_PRL[0].section_4 = "false";
                                } else {
                                    result.application_status = constants.COMPLETED;
                                    if (req.body.verification_auto == true) {
                                        result.application_status = constants.VERIFIED;
                                        result.verification_auto = true;
                                    }
                                }
                                result.completion_time = new Date();
                                if (req.body.adminId != undefined && req.body.adminId != "undefined") {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //result.completed_by = req.body.adminId;
                                else {
                                    var update = {
                                        $push: {
                                            logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 6 }
                                        }
                                    };
                                    OAODBHelper.UpdateResumeTime(result.application_id, update, function (result) {
                                        console.log("Resume time updated");
                                        console.log(result);
                                    });
                                }
                                //gathering data for Home Loan
                                var data = {
                                    'fname': result.fname,
                                    'lname': result.lname,
                                    'product_type_code': result.product_type_code,
                                    'product_name': req.body.product_name
                                }
                                console.log('Final Data', JSON.stringify(data));
                                //sending mail for home loan final submission
                                OAOApplicationHelper.SendMail(result.email, result.mobile, data, 'FINAL_SUBMISSION', function (callbackResult) {
                                    console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                                })
                                OAODBHelper.save(result, function (result) {
                                    res.status(200).json({
                                        message: 'Updated message',
                                        Result: result
                                    });
                                })
                            }
                        }
                        else {
                            res.status(404).json({
                                message: 'Page Not found',
                            });
                        }
                    })
                }
            })
        })
    });
//ends PERSONALLOAN

OAORouter.get('/getConfig', function (req, res) {
    res.json({ data: config });
});
OAORouter.get('/getConfig/:key/:id/:who', function (req, res) {
    var id = req.params.id;
    var who = req.params.who;
    console.log("id in server" + id);
    console.log("Capturing who resumes" + who);
    if (who != "null" && who != '') {
        var update = {
            $push: {
                logs: { 'updated_time': new Date(), 'who': who, 'change_type': 5 }
            }
        };
    }
    else {
        if (id != null || id != '') {
            var update = {
                $push: {
                    logs: { 'updated_time': new Date(), 'who': "Applicant", 'change_type': 5 }
                }
            };
            console.log("date is" + update);

        }
    }
    OAODBHelper.UpdateResumeTime(id, update, function (result) {
        console.log("Resume time updated");
        console.log(result);
    });
    res.json({ data: config[req.params.key] });
});
OAORouter.route('/PropertyDetails/:PropertyType/:Property')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        var Property = req.params.Property;
        OAODBHelper.getDropboxContent(PropertyType, Property, function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/saveProprtyDetails')
    .post(function (req, res) {
        var oAOPropertyDetail = new OAOPropertyDetail({
            property_type: req.body.p_type,
            property: req.body.property,
            property_value: req.body.p_value,
            property_desc: req.body.desc
        });
        OAODBHelper.saveDropboxContent(oAOPropertyDetail, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })
    });
OAORouter.route('/ErrorMessages/:PropertyType')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        OAODBHelper.getMessages(PropertyType, function (result) {
            res.json({ result: result });
        })
    });
//Removing since it is not used
// OAORouter.route('/applicationReferenceIdGeneration')
// .get(function(req, res) {
//         // OAODBHelper.GenerateApplicationReferenceId(req,res,function(result){
//         //     res.json({result:result});
//         // })
//         //  OAODBHelper.updateApplicationReferenceIdGeneration(req,res,function(result){
//         //     res.json({result:result});
//         // });
// OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function(result) {
//     res.json({ resss: result });
// })
// });
OAORouter.route('/CoreAccountNumber')
    .get(function (req, res) {
        OAOApplicationHelper.RefIdFormater(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ApplicantsRecord/:Applicants_id')
    .get(function (req, res) {
        var Applicants_id = req.params.Applicants_id;
        OAODBHelper.getApplicantsRecord(Applicants_id, function (result) {
            if (result == "") {
                res.json({ result: "no result" });
            } else {
                res.json({ result: result });
            }
        })
    });
OAORouter.route('/sendMail')
    .post(function (req, res) {
        console.log("inside send mail route", req.body)
        OAOApplicationHelper.SendMail(req.body.email, req.body.mobile, req.body, 'ADMIN_CONTROL', function (callbackResult) {
            console.log('admin take ownership notification sent to customer', JSON.stringify(callbackResult));
            res.json({ result: callbackResult });
        })
    })
OAORouter.route('/SaveApplicants')
    .post(function (req, res) {
        console.log("save applicaants");
        console.log(req.body);
        OAODBHelper.getApplicantsRecord(req.body.application_id, function (result) {
            if (result == "") {
                console.log("no result");
                res.json({ result: "no result" });
            } else {
                result.DLidState = req.body.DLidState,
                    result[0].LNum = req.body.LNum,
                    result[0].meidicarenum = req.body.meidicarenum,
                    result[0].color = req.body.color,
                    result[0].idnum = req.body.idnum,
                    result[0].idstate = req.body.idstate,
                    result[0].refnum = req.body.refnum,
                    result[0].validTo = req.body.validTo
                OAODBHelper.save(result[0], function (result) {
                    console.log("save..");
                    console.log(result);
                });
                OAOApplicationHelper.SendMail(req.body.email, req.body.mobile, req.body, 'ADMIN_SAVE_SUBMISSION', function (callbackResult) {
                    console.log('admin take ownership notification sent to customer', JSON.stringify(callbackResult));
                })
                var update = {
                    $push: {
                        logs: { 'updated_time': new Date(), 'who': req.body.adminId, 'change_type': 6 }
                    }
                };
                OAODBHelper.UpdateResumeTime(req.body.application_id, update, function (result) {
                    console.log("Resume time updated");
                    console.log(result);
                    res.status(200).json({
                        message: 'Updated message',
                        Result: result
                    });
                });
                // console.log("final save by admin");
                // console.log(result);
                // console.log(result[0]);
                // OAODBHelper.save(result[0], function (result) {
                //     res.status(200).json({
                //         message: 'Updated message',
                //         Result: result
                //     });
                // })
            }
        });
    });
OAORouter.route('/UpdateSection/:Applicants_id/:section/:product_type_code')
    .get(function (req, res) {
        app_id = req.params.Applicants_id;
        section = req.params.section;
        prod_type = "section_" + req.params.product_type_code;
        console.log("Product type code: " + prod_type);
        OAODBHelper.getApplicantsRecord(app_id, function (result) {
            if (result == "") {
                res.json({ result: "no result" });
            } else {
                if (result[0][prod_type][0][section] == true) {
                    result[0][prod_type][0][section] = 'false';
                }
                OAODBHelper.save(result[0], function (result) {
                    res.status(200).json({
                        message: 'Updated message',
                        Result: result
                    });
                })
            }
        })
    })
OAORouter.route('/validation')
    .post(function (req, res) {
        OAODBHelper.validation(req, res, function (result) {
            res.json({ result: result });
        })
    });

//save product
OAORouter.route('/saveProductType')
    .post(function (req, res) {
        console.log(req)
        var OAOProductDetail_v = new OAOProductTypeDetail({
            product_type_code: req.body.product_type_code,
            product_type_name: req.body.product_type_name,
        });
        OAODBHelper.addProdTypeData(OAOProductDetail_v, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })
    });
//save sub product
OAORouter.route('/saveProduct')
    .post(function (req, res) {
        var OAOProductDetail_v = new OAOProductDetail({
            product_code: req.body.product_code,
            product_name: req.body.product_name,
            child_of: req.body.child_of,
            del_flg: req.body.del_flg || 'false'
        });
        OAODBHelper.addData(OAOProductDetail_v, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })
    });
//save cross selling product
// OAORouter.route('/saveCrossSellingProduct')
//     .post(function (req, res) {
//         var OAOCrossSellingProductDetail_v = new OAOCrossSellingProductDetail({
//                 cross_selling_product_id:req.body.cross_selling_product_id,
//                 cross_selling_name: req.body.cross_selling_name,
//                 cross_selling_desc:req.body.cross_selling_desc,
//                 display_text:req.body.display_text,
//                 linked_to_products:req.body.linked_to_products

//         });
//         OAODBHelper.addCSData(OAOCrossSellingProductDetail_v, function (result) {
//             if (!result) {
//                 return res.json({ result: "no record found" });
//             }
//             res.json({ result: result });
//         })
//     });
//get single product details
OAORouter.route('/ProductDetails/:ProductCode')
    .get(function (req, res) {
        var ProductCode = req.params.ProductCode;
        OAODBHelper.getProductContent(ProductCode, function (result) {
            res.json({ result: result });
        })
    });

//get single product type details
OAORouter.route('/ProductTypeDetails/:ProductTypeCode')
    .get(function (req, res) {
        var ProductTypeCode = req.params.ProductTypeCode;
        OAODBHelper.getProductTypeContent(ProductTypeCode, function (result) {
            res.json({ result: result });
        })
    });
//get single CrossSellingProductContent details
OAORouter.route('/CrossSellingProductDetails/:CrossSellingID')
    .get(function (req, res) {
        var CrossSellingID = req.params.CrossSellingID;
        OAODBHelper.getCrossSellingProductContent(CrossSellingID, function (result) {
            res.json({ result: result });
        })
    });
//for all records
OAORouter.route('/Products')
    .get(function (req, res) {
        console.log("products");
        var path = './public/contents/Product1.json';
        OAODBHelper.getProducts(function (status, result) {
            console.log("result", result, status)
            new Promise((resolve, reject) => {
                console.log("In Promuse");
                var stats;
                try {
                    stats = fs.statSync(path);
                    console.log("File exists.", stats);
                    resolve("done checking if file exists");
                }
                catch (e) {
                    console.log("File does not exist.", stats);
                    reject("File Not found downloading the file");
                }
            }).then((e) => {
                console.log(e);
                res.json({ result: result });
            }).catch((e) => {
                console.log(e);
                OAODBHelper.downloadFromAdmin().then((e) => {
                    console.log(e);
                    res.json({ result: result });
                })

            })

        })
    });
OAORouter.route('/RelativeProducts/:ProductTypeCode')
    .get(function (req, res) {
        var product_type_code = req.params.ProductTypeCode;
        console.log("products");
        OAODBHelper.getRelativeProducts(product_type_code, function (status, result) {
            console.log("result", result, status)
            res.json({ result: result });
        })
    });
OAORouter.route('/ProductTypes')
    .get(function (req, res) {
        OAODBHelper.getProductType(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/CrossSellingProducts')
    .get(function (req, res) {
        OAODBHelper.getCrossSellingProduct(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/GetProduct/:product_code/:child_of')
    .get(function (req, res) {
        var product_code = req.params.product_code;
        var child_of = req.params.child_of;
        OAODBHelper.getSubProductByParent(subproduct_id, child_of, function (result) {
            res.json({ result: result });
        })
    })
//Create Cross Sell
OAORouter.route('/CrossSellApplicants').post(function (req, res) {
    console.log('Inside corss sell', req.body.app_id)
    req.body.app_id = undefined;
    req.body.application_id = undefined;
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        console.log("kush  " + req.body.application_id)
        var app_id_ = req.body.application_id || OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        console.log('CS result', JSON.stringify(result));
        var cross_sell_details = new OAOApplicantSchema({
            product_code: req.body.product_code,
            product_type_code: req.body.product_type_code,
            singleORjoint: req.body.singleORjoint,
            deviceType: req.device.type,
            existing_cust_status: req.body.existing_cust_status,
            title: req.body.title,
            application_id: app_id_,
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            dob: req.body.dob,
            email: req.body.email,
            mobile: req.body.mobile,
            brokerid: req.body.brokerid,
            address: req.body.address,
            paddress: req.body.paddress,
            DLidState: req.body.DLidState,
            LNum: req.body.LNum,
            color: req.body.color,
            idnum: req.body.idnum,
            idstate: req.body.idstate,
            username: req.body.username,
            refnum: req.body.refnum,
            tfn: req.body.tfn,
            validTo: req.body.validTo,
            exemption: req.body.exemption,
            housenum: req.body.housenum,
            streetnum: req.body.streetnum,
            streetname: req.body.streetname,
            streettype: req.body.streettype,
            suburb: req.body.suburb,
            state: req.body.state,
            postcode: req.body.postcode,
            phousenum: req.body.phousenum,
            pstreetnum: req.body.pstreetnum,
            pstreetname: req.body.pstreetname,
            pstreettype: req.body.pstreettype,
            psuburb: req.body.psuburb,
            pstate: req.body.pstate,
            ppostcode: req.body.ppostcode,
            meidicarenum: req.body.meidicarenum,
            no_address_found_flag: req.body.no_address_found_flag,
            section_SAV: {},
            bot_fields: {},
            cross_sell: {
                main_app_no: req.body.main_app_no,
                main_prod_type: req.body.main_prod_type,
                main_prod: req.body.main_prod
            }
        })
        console.log('API Cross sell', JSON.stringify(cross_sell_details));
        OAODBHelper.save(cross_sell_details, function (result) {
            res.status(200).json({
                message: 'Updated message',
                Result: result
            });
        })
    })
});
OAORouter.route('/getContent')
    .get(function (req, res) {
        jsonfile.readFile('./public/contents/Product1.json', function (err, data) {
            if (err) {
                console.log("error is reading json file" + err);
            } else {
                output_content = data;
                //flag = true;
                console.log("done reading content");
                OAODBHelper.getProducts(function (success, result) {
                    if (success) {
                        console.log("result from products is");
                        output = result;
                        console.log(output);
                        res.json({ result: output_content, products: output });
                    }
                })
            }
        });
    });
//Fetch Cross Sell Type
OAORouter.route('/GetChildProduct1/:Product')
    .get(function (req, res) {
        //  var product = req.params.Product;
        var product = req.params.Product;
        console.log('Product', product);
        OAODBHelper.getChild(product, function (result) {
            res.json({ result: result });
        })
    });
/**Remove Uploaded File */
OAORouter.route('/file/remove/:folderName/:fileName')
    .get(function (req, res) {
        fs.exists(`public/uploads/${req.params.folderName}/${req.params.fileName}`, function (exists) {
            console.log("checking file existance ", exists);
            if (exists) {
                fs.unlink(`public/uploads/${req.params.folderName}/${req.params.fileName}`, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.json({ error: "File deletion failed !!!" });
                    } else {
                        res.json({ error: null, message: "File deleted successfully" });
                    }
                })
            } else {
                res.json({ error: null, message: "File does not exists" });
            }
        })
    })
OAORouter.route('/ProductDetails/:ProductCode')
    .get(function (req, res) {
        var ProductCode = req.params.ProductCode;
        OAODBHelper.getProductContent(ProductCode, function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ChangeProductData/:do_v')
    .get(function (req, res, next) {
        var do_v = req.params.do_v;
        if (do_v == "fetch") {
            request.get(config.url.adminUrl + '/api/getLocalContent', function (err, result_v) {
                var data_res = JSON.parse(result_v.body);
                var storeData = data_res.result;
                var dir = './public/contents/Product1.json'
                var obj = storeData;
                jsonfile.writeFile(dir, obj, function (err) {
                    if (err) {
                        console.log(err)
                    }
                })
                res.json({ success: true });
            })
        } else {
            consol.log("Nothing to fetch")
        }
    });
OAORouter.route('/ChangeData')
    .get(function (req, res) {
        console.log("/ChangeData")
        request.get(config.url.adminUrl + '/api/getLocalContent', function (err, result_v) {
            var data_res = JSON.parse(result_v.body);
            var storeData = data_res.result;
            var dir = './public/contents/Product1.json'
            var obj = storeData;
            jsonfile.writeFile(dir, obj, function (err) {
                if (err) {
                    console.log(err)
                }
            })
            res.json({ success: true });
        })
    })
OAORouter.get('/encryption/:encryptMsg', function (req, res, next) {
    var msg = req.params.encryptMsg;
    OAODBHelper.encryption(msg, function (result) {
        res.json({ key: result });
    })
})
OAORouter.post('/decryption', function (req, res, next) {
    var msg = req.body.decryptMsg;
    OAODBHelper.decryption(msg, function (result) {
        res.json({ key: result });
    })
})
/**generate application id */
OAORouter.get('/generateApplicationId', (req, res) => {
    console.log("/generateApplicationId");
    OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
        let app_id = OAOApplicationHelper.RefIdFormater(Number(result.app_ref_id) + 1, req);
        res.json({ error: null, data: app_id });
    });
})
/**get attched file */
OAORouter.get('/GetAttachedFile/:appId/:fileName', (req, res) => {
    dir = './public/uploads/';
    var fileLocation = dir + req.query.appId + '/' + req.query.fileName;
    fs.readFile(fileLocation, function (err, data) {
        if (err) throw err;
        res.end(data); // Send the file data to the browser.
    });
})
OAORouter.get('/getFreeFieldDetails', function (req, res, next) {
    OAOAddNewField.find({}, function (err, result) {
        res.json({ result: result });
    })
})
OAORouter.get('/getBorrowingCalculatorTable',function(req,res){
    console.log("Finding Borrowing Table");
     async.parallel({
            getAnnualSalTable: function (callback) {
                console.log("Annual Sal Table");
                OAOPropertyDetail.find({ property_type: 'commonCodes', property: 'Min_Annual_Salary' }).exec(callback)
            },
            getOtherIncomeTable: function (callback) {
                console.log("other income Table");
              
                OAOPropertyDetail.find({ property_type: 'commonCodes', property: 'other_income' }).exec(callback)
            },
            getRentalIncomeTable: function (callback) {
                console.log("rental income table");
               
                OAOPropertyDetail.find({ property_type: 'commonCodes', property: 'rental_income' }).exec(callback)
            },
            getMonthlyExpenseAllowance: function (callback) {
                console.log("monthly expense table");
                
                OAOPropertyDetail.find({ property_type: 'commonCodes', property: 'monthly_expense_allowance' }).exec(callback)
            },
        }, function (err, result1) {
            //console.log(res);
            console.log("borrower tbale");
            //console.log("sending result",{ AnnualSalResult: result1.getAnnualSalTable, OtherIncomeResult: result1.getOtherIncomeTable,RentalIncomeResult:result1.getRentalIncomeTable,ExpenseResult:result1.getMonthlyExpenseAllowance });
            res.json({ AnnualSalResult: result1.getAnnualSalTable, OtherIncomeResult: result1.getOtherIncomeTable,RentalIncomeResult:result1.getRentalIncomeTable,ExpenseResult:result1.getMonthlyExpenseAllowance });
        })
})
module.exports = OAORouter;

