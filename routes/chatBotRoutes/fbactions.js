var botactions = require("./chatbotactions.js");
var config = require("../../configFiles/DBconfigfile");
var allMessages = require("./chatbot_messages");
const crypto = require('crypto');
var dbhelper = require("../oaoRoutes/OAODBHelper.js");
var self = module.exports = {

    selectIntent: function (req, res) {
        action_v = req.body.result.action;
        switch (action_v) {

            case 'getMobileNumber': botactions.sendOtp(req, function (success) {
                if (success) {
                    res.json({
                        "speech": "Got it I have sent an OTP to " + req.body.result.parameters['phoneNumber'] + ". Please enter the OTP you recived.",
                        "displayText": "Got it I have sent an OTP to " + req.body.result.parameters['phoneNumber'] + ". Please enter the OTP you recived.",
                        "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                        "source": "getMobileNumber"
                    });
                } else {
                    res.json({
                        "speech": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                        "displayText": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                        "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                        "source": "getMobileNumber"
                    });
                }
            });
                break;
            case 'verifyOtp': var mobile = req.body.result.parameters['phoneNumber'];
                var otp = req.body.result.parameters['otp'];
                var socialId = req.body.originalRequest.data.sender['id'];
                var actionPerform = req.body.result.parameters['actionPerform'];
                var noOfTry = req.body.result.parameters['noOfTry'];
                console.log("start dd ", req.body.result.parameters['noOfTry'])
                console.log("start  ", noOfTry)
                botactions.verifyOtp(req, otp, function (success) {

                    if (success == true) {
                        botactions.optedUpdates(req, mobile, socialId, function (opted) {
                            console.log(opted)
                            if (opted == true) {
                                if (actionPerform == "resume" || actionPerform == "Resume") {
                                    botactions.getRecords(mobile, "no", function (result, nores) {
                                        if (nores) {
                                            self.sendResumeCarousel(req, res, mobile, result, "verifyOtp");
                                        } else {
                                            res.json({
                                                "speech": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                                "displayText": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                                "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                                                "source": "getMobileNumber"
                                            });
                                        }
                                    })
                                } else if (actionPerform == "status" || actionPerform == "Status") {
                                    botactions.getRecords(mobile, "true", function (result, nores) {
                                        if (nores) {
                                            self.sendStatusCarousel(req, res, mobile, result, "verifyOtp");
                                        } else {
                                            res.json({
                                                "speech": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                                "displayText": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                                "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                                                "source": "getMobileNumber"
                                            });
                                        }
                                    })
                                }

                            } else {

                                res.json({
                                    "speech": allMessages.action_msg[action_v].NotOpted,
                                    "displayText": allMessages.action_msg[action_v].NotOpted,
                                    "data": {
                                        "facebook": {
                                            "attachment": {
                                                "type": "template",
                                                "payload": {
                                                    "template_type": "generic",

                                                    "elements": [{
                                                        "title": allMessages.action_msg[action_v].NotOpted,
                                                        "image_url": "",
                                                        "subtitle": allMessages.action_msg[action_v].reciveConfirm,
                                                        "buttons": [
                                                            {
                                                                "type": "postback",
                                                                "title": "Ya sure",
                                                                "payload": "Yes"
                                                            }, {
                                                                "type": "postback",
                                                                "title": "No",
                                                                "payload": "No"
                                                            }
                                                        ]
                                                    }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    "contextOut": [{ "name": "verifyOtp", "lifespan": 1, "parameters": { "phoneNumber": mobile, "actionPerform": actionPerform } }],
                                    "source": "verifyOtp"
                                })
                            }
                        })

                    } else {

                        if (noOfTry < "2") {
                            noOfTry = parseInt(noOfTry) + 1;
                            console.log("end  ", noOfTry)
                            res.json({
                                "speech": allMessages.action_msg[action_v].wrongOTP,
                                "displayText": allMessages.action_msg[action_v].wrongOTP,
                                "contextOut": [{ "name": "verifyOtp", "lifespan": 0 }, { "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": actionPerform, "noOfTry": noOfTry } }],
                                "source": "verifyOtp"
                            });
                        } else {
                            noOfTry = 0;
                            res.json({
                                "speech": allMessages.action_msg.exceedTry,
                                "displayText": allMessages.action_msg.exceedTry,
                                "contextOut": [{ "name": "verifyOtp", "lifespan": 0 }, { "name": "getMobileNumber", "lifespan": 0 }],
                                "source": "verifyOtp"
                            });

                        }


                    }
                })
                break;
            case 'notInterested': var reason = req.body.result.parameters['reason'];
                var appid = req.body.result.parameters['appid'];
                botactions.updateReason(appid, reason, function (success) {
                    if (success == true) {
                        res.json({
                            "speech": allMessages.action_msg[action_v].feedback,
                            "displayText": allMessages.action_msg[action_v].feedback,
                            "contextOut": [],
                            "source": "notInterested"
                        });
                    }
                });
                break;
            case "confirmUpdates": var mobile = req.body.result.parameters['phoneNumber'];
                var optin = req.body.result.parameters['optin'];
                var socialId = req.body.originalRequest.data.sender['id'];
                if (optin == "Yes" || optin == "yes") {
                    botactions.updateSocialId(mobile, socialId, function (success) {
                        if (success) {
                            res.json({
                                "speech": allMessages.action_msg[action_v].optinSuccess_1 + " " + allMessages.action_msg[action_v].optinSuccess_2,
                                "data": {
                                    "facebook": {
                                        "attachment": {
                                            "type": "template",
                                            "payload": {
                                                "template_type": "generic",

                                                "elements": [{
                                                    "title": allMessages.action_msg[action_v].optinSuccess_1,
                                                    "image_url": "",
                                                    "subtitle": allMessages.action_msg[action_v].optinSuccess_2,
                                                    "buttons": [
                                                        {
                                                            "type": "postback",
                                                            "title": "Continue",
                                                            "payload": "continue"
                                                        }
                                                    ]
                                                }
                                                ]
                                            }
                                        }
                                    }
                                },
                                "contextOut": [{ "name": "confirmUpdates", "lifespan": 1, "parameters": { "phoneNumber": mobile, "actionPerform": actionPerform } }],
                                "source": "confirmUpdates"
                            })
                        } else {
                            res.json({
                                "speech": "Try again.",
                                "displayText": "Try again.",
                                "contextOut": [],
                                "source": "confirmUpdates"
                            });
                        }

                    })
                } else {
                    res.json({
                        "speech": allMessages.action_msg[action_v].optinNotInterested,
                        "displayText": allMessages.action_msg[action_v].optinNotIntereste,
                        "contextOut": [],
                        "source": "confirmUpdates"
                    });
                }
                break;
            case 'ContinueresumeORstatus': var mobile = req.body.result.parameters['phoneNumber'];
                var actionPerform = req.body.result.parameters['actionPerform'];
                if (actionPerform == "resume" || actionPerform == "Resume") {
                    botactions.getRecords(mobile, "no", function (result, nores) {
                        if (nores) {
                            self.sendResumeCarousel(req, res, mobile, result, "ContinueresumeORstatus");
                        } else {
                            res.json({
                                "speech": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                "displayText": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                                "source": "getMobileNumber"
                            });
                        }
                    })
                } else if (actionPerform == "status" || actionPerform == "Status") {
                    botactions.getRecords(mobile, "true", function (result, nores) {
                        if (nores) {
                            self.sendStatusCarousel(req, res, mobile, result, "ContinueresumeORstatus");
                        } else {
                            res.json({
                                "speech": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                "displayText": allMessages.action_msg.norecordsFound_1 + req.body.result.parameters['phoneNumber'] + allMessages.action_msg.norecordsFound_2 + config.url.clientUrl,
                                "contextOut": [{ "name": "getMobileNumber", "lifespan": 1, "parameters": { "phoneNumber": req.body.result.parameters['phoneNumber'], "actionPerform": req.body.result.parameters['actionPerform'] } }],
                                "source": "getMobileNumber"
                            });
                        }
                    })
                }
                break;

            default: res.json({
                "speech": allMessages.action_msg.default,
                "displayText": allMessages.action_msg.default,
                "contextOut": [],
                "source": ""
            });
        }

    },
    getStatusArray: function (result, callback) {


        callback(arr)
    },
    sendStatusCarousel: function (req, res, mobile, result, actionToSent) {
        var arr = [];
        var total_len = result.length;
        count = 0;
        for (var i = 0; i < total_len; i++) {
            (function () {
                dbhelper.getProductContent(result[i].product_code, function (prodData) {
                    var subtitle_v = allMessages.application_status_msg[result[count].application_status];
                    if (count <= 9) {
                        arr.push({
                            "title": "Application status for " + prodData[0].product_name + "is " + subtitle_v,
                            "image_url": config.url.clientUrl + "/assets/images/" + result[count].product_type_code + ".svg",
                            "subtitle": allMessages.action_msg.applied_On + result[count].cre_time
                        })
                    }
                    count++;
                    if (count > total_len - 1) done();
                });
            }(i));
        }
        function done() {
            res.json({
                "data": {
                    "facebook": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",

                                "elements": arr
                            }
                        }
                    }
                },
                "contextOut": [{ "name": actionToSent, "lifespan": 1, "parameters": { "phoneNumber": mobile, "actionPerform": req.body.result.parameters['actionPerform'] } }],
                "source": actionToSent
            })
        }



    },
    sendResumeCarousel: function (req, res, mobile, result, actionToSent) {
        var arr = [];
        var total_len = result.length;
        count = 0;
        for (var i = 0; i < total_len; i++) {
            (function () {
                dbhelper.getProductContent(result[i].product_code, function (prodData) {
                    var msg = result[count].application_id;
                    dbhelper.encryption(msg, function (encrypted) {
                        if (count <= 9) {
                            arr.push({
                                "title": allMessages.action_msg.resumeCarosalTitle + prodData[0].product_name + " application",
                                "image_url": config.url.clientUrl + "/assets/images/" + result[count].product_type_code + ".svg",
                                "subtitle": allMessages.action_msg.applied_On + result[count].cre_time,
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": config.url.clientUrl + "/home/bot/" + encrypted,
                                        "title": "Yes, resume Now"
                                    }, {
                                        "type": "postback",
                                        "title": "No",
                                        "payload": "No: " + result[count].application_id
                                    }
                                ]
                            })
                        }
                    })
                    count++;
                    if (count > total_len - 1) done();
                });
            }(i));
        }
        function done() {
            res.json({
                "data": {
                    "facebook": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",

                                "elements": arr
                            }
                        }
                    }
                },
                "contextOut": [{ "name": actionToSent, "lifespan": 1, "parameters": { "phoneNumber": mobile, "actionPerform": req.body.result.parameters['actionPerform'] } }],
                "source": actionToSent
            })
        }
    }
};