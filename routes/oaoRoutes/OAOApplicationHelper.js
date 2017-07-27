
var nodemailer = require('nodemailer');
var random = require("random-js")();
var config_urls = require("../../configFiles/DBconfigfile");
var fs = require('fs');
var jade = require('jade');
var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret();
var crypto = require("crypto");
var secret32=secret.base32;
var OAODBHelper = require("./OAODBHelper");
var request = require('request');
var cmis = require('cmis');
var http = require("https");
var Jimp = require("jimp");
const Vision = require('@google-cloud/vision');
const projectId = 'oao-india';
var path = require('path');
var Tesseract = require('tesseract.js');

var session = cmis.createSession(config_urls.url.cmis_alfresco_url);
session.setCredentials(config_urls.url.alfresco_username, config_urls.url.alfresco_password)

/**Google Vision Client */
const visionClient = Vision({
    projectId: projectId,
    keyFilename: path.join(__dirname, '..', '..') + '/keys/application_default_credentials.json'
});

module.exports = {
    cmisUpload: function (req, res,callback) {
   
        console.log('calling alfresco...');
        session.loadRepositories().ok(function (data) {
            var parentId = config_urls.url.alfresco_folder_id;
            try {
                content = fs.createReadStream(req.file.path);
            } catch (e) {
                console.log(e);
                return;
            }
            var input = {
                "cmis:name": req.file.filename,
                "cmis:objectTypeId": "D:onboarding:upload",
                "onboarding:mobile": req.headers.mobile,
                "onboarding:appid": req.headers.app_id
            }
            var mimeTypeExtension = req.file.mimetype;
            var policies = [];
            var addACEs;
            var removeACEs;
            var options;
            session.createDocument(parentId, content, input, mimeTypeExtension, policies, addACEs, removeACEs, options).ok(function (response) {
                var arr = (response.succinctProperties['alfcmis:nodeRef']).split('/');
                var file_obj_id = arr[3];
                var file_name = response.succinctProperties['cmis:name'];
                OAODBHelper.saveUploadData(file_name, file_obj_id, req.headers.app_id, function (err, result) {
                    if (!err) {
                        console.log("uploaded file information inserted into db successfully...");

                    } else {
                        console.log("Error occurred while saving uploaded file info", err);
                    }

                })
                console.log(response)
                callback(true);
                
            }).notOk(function (response) {
                console.log(response)
                 callback(false);
            })
        });
    },
    updateCimsProperties: function (app_id,cifid) {
        OAODBHelper.getApplicantsRecord(app_id, function (result) {
            var obj_id = [];
              var count = Object.keys(result[0].filesUpload).length;
                for (var i = 0; i < count; i++) {
                    obj_id.push(result[0].filesUpload[i].fileObjectId)
                }
                var properties={
                    "onboarding:cifid":cifid
                }
                session.loadRepositories().ok(function (data) {
                session.bulkUpdateProperties( obj_id, properties).ok(function(data){
                    console.log(data)
                }).notOk(function(data){
                    console.log(data)
                })
                });
        })
    },
    SendMail: function (email, mobile, data, emailTemplateId, callback) {
        console.log(data);
        var template;
        var mailOptions;
        if (emailTemplateId == 'SAVE_SUBMISSION') {
            console.log('Save Submission');
            template = process.cwd() + '/public/mailtemplate/saveconfirmation.jade';
        }else if(emailTemplateId == 'SAVE_SUBMISSION_JOINT'){
             console.log('SAVE_SUBMISSION_JOINT');
            template = process.cwd() + '/public/mailtemplate/jointapplication.jade';
        }else if(emailTemplateId =='SEND_OTP'){
             console.log('SEND OTP');
            template = process.cwd() + '/public/mailtemplate/sendOtp.jade';
        }
        else if (emailTemplateId == 'ADMIN_CONTROL') {
            console.log('admin took control');
            template = process.cwd() + '/public/mailtemplate/admintakecontrol.jade';
        }
        else if (emailTemplateId == 'ADMIN_SAVE_SUBMISSION') {
            console.log('admin took control');
            template = process.cwd() + '/public/mailtemplate/adminsaveconfirmation.jade';
        }
        else {
            console.log('Confirmation Submission');
            template = process.cwd() + '/public/mailtemplate/confirmation.jade';
        }
        fs.readFile(template, 'utf-8', function (err, file) {
            if (err) {
                console.log('Error while rendering jade template', template);
            } else {
                var compiledTmpl = jade.compile(file, { filename: template });
                var context = { mobile: mobile, data: data };
                htmlToSend = compiledTmpl(context);

                /**
                 * node mailer transporter
                 */
                var transporter = nodemailer.createTransport({
                    host: config_urls.url.host,
                    port: config_urls.url.port,
                    secure: true, // use SSL 
                    auth: {
                        user: config_urls.url.gmailID,
                        pass: config_urls.url.gmailPassword
                    }
                });

                 if (emailTemplateId == 'SAVE_SUBMISSION') {
                    mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'Application Saved Succesfully',
                        html: htmlToSend
                    };
                } else if (emailTemplateId == 'FINAL_SUBMISSION' && data.product_type_code == 'SAV') {
                       mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject :'Application Processed Succesfully',
                        html: htmlToSend
                    };
                 }else if(emailTemplateId == 'SEND_OTP'){
                     var subject;
                     if(data.verify) subject="OTP for verification"
                     else subject="OTP to resume saved appplication"
                     console.log("subject: ",subject);
                       mailOptions = {
                        from: config_urls.url.gmailID, 
                        to: email, 
                        subject : subject,
                        html: htmlToSend
                    };
                    console.log("mailOptions.subject: ",mailOptions.subject)
                }
                else if (emailTemplateId == 'ADMIN_CONTROL') {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Admin took control of your appplication to fill',
                        html: htmlToSend
                    };
                }
                else if (emailTemplateId == 'ADMIN_SAVE_SUBMISSION') {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Application saved successfully by admin',
                        html: htmlToSend
                    };
                } else {
                    mailOptions = {
                        from: config_urls.url.gmailID,
                        to: email,
                        subject: 'Application Submitted for processing succesfully',
                        html: htmlToSend
                    }; 
                 }
               

                /**
                 *  send mail with defined transport object 
                 */
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('Error while sending mail', error);
                        return callback(Result = "false");
                    }

                    console.log('Message sent: ' + info.response);
                    return callback(Result = "true");
                });
            }
        });
    },

    //Application Reference ID Generation

    RefIdFormater: function (ID,req,res) {
        dbSequence = Number(ID);
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        return AppRefID = ['DB', year,
            (month > 9 ? '' : '0') + month,
            (day > 9 ? '' : '0') + day,
            dbSequence
        ].join('');

    },

    Gen_coreAcc_no: function (callback) {
        var CORE_ACCOUNT_NUMBNER = "00000" + random.integer(1, 999);
        return callback(CORE_ACCOUNT_NUMBNER);
    },
    Gen_custId: function (callback) {
        var CORE_CUSTOMER_ID = random.integer(100000, 999999);
        return callback(CORE_CUSTOMER_ID);
    },

    BSB_Number: function (callback) {
        return callback(123123);
    },

    //To generate OTP
    genOTP:function(callback){
        OAODBHelper.getDropboxContent('GENERIC_PROP','OTP_VALIDITY',function(result){
            console.log(result[0].property_value)
             var token = speakeasy.totp({
                secret: secret32,
                encoding: 'base32',
                step: parseInt(result[0].property_value)
            });
            console.log(token);
        return callback(token);
        })
         
    },
      verifyOTP:function(userToken,callack){
         OAODBHelper.getDropboxContent('GENERIC_PROP','OTP_VALIDITY',function(result){
        var verified = speakeasy.totp.verify({
            secret: secret32,
            encoding: 'base32',
            step: parseInt(result[0].property_value),
            token: userToken      
        });
        return callack(verified)
        })
    },
    sendOTPMessage: function (result, otp) {
        console.log(" sms " + otp)
        var auth = new Buffer(config_urls.url.msgMediaUsername + ':' + config_urls.url.msgMediaPassword).toString('base64');
        console.log(auth)
        var options = {
            "method": "POST",
            "hostname": "api.messagemedia.com",
            "port": null,
            "path": "/v1/messages",
            "headers": {
                "accept": "application/json",
                "authorization": "Basic "+ auth,
                "content-type": "application/json"
            }
        };
        var msgSCntent= config_urls.OTPContent + otp;
        var destNumber=result.mobile
        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(JSON.stringify({ messages: [{"content": msgSCntent,"destination_number": "+61"+destNumber,"format": "SMS","source_number_type": "INTERNATIONAL","source_number": "+61491570156",}] }));
        req.end();


    },
    sendOTPMail:function(result,otp){
            var data = {
                                'fname': result.fname,
                                'lname': result.lname,
                                'otp': otp
                            }
            this.SendMail(result.email,result.mobile,data,'SEND_OTP',function(result){
                    console.log(result)
            })
        
    },
    processImage: function (req, res,callback) {
        var fileName = req.file.filename;
        var  completeFileName = req.file.filename;
        var imagePath =  `public/uploads/${req.headers.app_id}/${completeFileName}`;
     //   var processedImagePath = `public/uploads/${req.headers.app_id}/Jimp/`;
        Jimp.read(imagePath).then(function (result) {
            console.log(result.bitmap.data) // set greyscale // save 
            var wid = result.bitmap.width;
            var height = result.bitmap.height;
            console.log(wid)
            console.log(height)
            return new Promise((resolve, reject) => {
                // result.scan(0, 0, result.bitmap.width, result.bitmap.height, function (i, j, idx) {
                //     var red = this.bitmap.data[idx + 0];
                //     var green = this.bitmap.data[idx + 1];
                //     var blue = this.bitmap.data[idx + 2];
                //     var alpha = this.bitmap.data[idx + 3];
                //     var avg = (red + green + blue) / 3;
                //     if (avg > 110) {
                //         this.bitmap.data[idx] = 255
                //         this.bitmap.data[idx + 1] = 255
                //         this.bitmap.data[idx + 2] = 255
                //     } else {
                //         this.bitmap.data[idx] = 0
                //         this.bitmap.data[idx + 1] = 0
                //         this.bitmap.data[idx + 2] = 0
                //     }
                //     resolve("done");
                // })
                resolve("done");

            })
                .then(function (data) {
                    console.log(data);
                    result.write(imagePath);
                    console.log("Completed");
                    callback(true);
                }).catch(function (err) {
                    console.log('Jimp processing error', err);
                    callback(false);
                });
        })
    },
    scanDrivingLicense: function (req, res, callback) {
        console.log('Scanning Driving License', req.file.filename);
        completeFileName = req.file.filename;
        var folderName = req.headers.app_id;
        var fileLocation = `public/uploads/${req.headers.app_id}/${completeFileName}`;
        console.log('File Location', fileLocation);
        var licenseArray = [];
        var status;
    
        //Ephesoft integration
           setTimeout(function () {
            Jimp.read(fileLocation).then(function (result) {
                console.log("lena1: ", result.bitmap.data);
                var wid = result.bitmap.width;
                var height = result.bitmap.height;
                var base64Image ="";
                console.log("width: ", wid)
                console.log("height: ", height)
                return new Promise((resolve, reject) => {
                    result.scan(0, 0, result.bitmap.width, result.bitmap.height, function (i, j, idx) {
                        var red = this.bitmap.data[idx + 0];
                        var green = this.bitmap.data[idx + 1];
                        var blue = this.bitmap.data[idx + 2];
                        var alpha = this.bitmap.data[idx + 3];
                        var avg = (red + green + blue) / 3;
                        if (avg > 100) {
                            this.bitmap.data[idx] = 0
                            this.bitmap.data[idx + 1] = 0
                            this.bitmap.data[idx + 2] = 0
                        } else {
                            this.bitmap.data[idx] = 255
                            this.bitmap.data[idx + 1] = 255
                            this.bitmap.data[idx + 2] = 255
                        }
                        resolve("done");
                    })
                }).then(function (e) {
                    console.log(e);
                    result.write("public/uploads/" + folderName + "/1.jpg");
                    console.log("Completed");
                    return new Promise((resolve, reject) => {
                        fs.readFile("public/uploads/" + folderName + "/1.jpg", function (err, original_data) {
                            resolve("done reading");
                        })
                    }).then(function (e) {
                        console.log(e);
                     request.post({ url: 'http://52.15.47.203:8080/EphesoftProj/ephesoftController', form: { applicationRequestID: folderName, imageData:  fs.readFileSync("public/uploads/" + folderName + "/1.jpg").toString("base64") } }, function (err, httpResponse, body) {
                    ///   request.post({ url: 'http://52.15.47.203:8080/EphesoftProj/ephesoftController', form: { applicationRequestID: folderName, imageData: base64Image } }, function (err, httpResponse, body) {
                            if (err) {
                                return console.error('upload failed:', err);
                            }
                            console.log('Upload successful!  Server responded with:', body);
                            callback(body);
                        });
                    })
                }).catch(function (e) {
                    console.log("Error from ephesoft",e);
                })
            })
        }, 2000)
    },
    crop: function (req, res, callback) {

        // var fileName = req.file.filename;
        var  completeFileName = req.file.filename;
        var imagePath =  `public/uploads/${req.headers.app_id}/${completeFileName}`;
        console.log('Image Path',imagePath);
        //var imagePath = './public/uploads/DB201706295396/2.jpg';
        var processedImagePath = './public/processed/';
        var cropPositions = [
            { "x": 18, "y": 111, "width": 422, "height": 78 },
            { "x": 716, "y": "135", "width": 205, "height": 44 },
            { "x": 315, "y": 346, "width": 256, "height": 52 },
            { "x": 209, "y": 78, "width": 241, "height": 34 }
        ];
        for (var i = 0; i < cropPositions.length; i++) {
            console.log(i);
            module.exports.loop(imagePath, i, cropPositions[i]);
        }
        callback(true);
    },

    loop: function (filename, index, data) {
        var fileName = 'image' + index + '.jpg';
      var processedImagePath = './public/processed/';
        console.log(processedImagePath);
        Jimp.read(filename).then(function (image) {
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (i, j, idx) {
                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                var alpha = this.bitmap.data[idx + 3];
                var avg = (red + green + blue) / 3;
                if (avg > 110) {
                    this.bitmap.data[idx] = 255
                    this.bitmap.data[idx + 1] = 255
                    this.bitmap.data[idx + 2] = 255
                } else {
                    this.bitmap.data[idx] = 0
                    this.bitmap.data[idx + 1] = 0
                    this.bitmap.data[idx + 2] = 0
                }
            })
            image.crop(parseInt(data.x), parseInt(data.y), data.width, data.height);
            image.write(processedImagePath + fileName);
        }).catch(function (err) {
            console.log(err);
        });
    },
    fetchData: function (req, res, callback) {
         var  completeFileName = req.file.filename;
        var imagePath =  `/uploads/${req.headers.app_id}/${completeFileName}`;
       // console.log('Image Path',imagePath);
        var pathArray = [];
        var payload = [];
        
        for (var i = 0; i <= 3; i++) {
            var path = './public/processed/image'+ i + '.jpg';
            pathArray.push(path);
        }
        console.log(pathArray);
        new Promise((resolve, reject) => {
            var count = 0;
            for (var j = 0; j < pathArray.length; j++) {
                     visionClient.detectText(pathArray[j])
                    .then(function (result) {
                         var visionResult = result[0];
                var data = visionResult[0];
                    console.log('Vision Data',data);
                      //  console.log(result.text);
                        //ocrText = result.text;
                        payload.push(data);
                        count++;
                        if (count == pathArray.length) {
                            resolve("Completed");
                        }
                    })
            }
        }).then((e) => {
             payload.push(imagePath);
            console.log(e);
            callback(payload);
          //  res.send({ "payload": payload });
        })
    }


}; //end of function