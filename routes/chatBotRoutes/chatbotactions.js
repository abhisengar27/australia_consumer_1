
var request = require('request');
var msg = require("./helperbot.js");
var mongoose = require('mongoose');
//var customerDetails = require("../models/customerdetails.js"); 
var propDetails = require("../../models/OAOPropertyDetail.js");
var oaoApplicant = require("../../models/OAOApplicantSchema.js");
var apphelper = require("../oaoRoutes/OAOApplicationHelper.js");
var dbhelper = require("../oaoRoutes/OAODBHelper.js");
const crypto = require('crypto');

var self = module.exports = {
  sendOtp(req, callback) {
    var mobileNum = req.body.result.parameters['phoneNumber'];
    dbhelper.getSavedRecord(mobileNum, "true", function (result, success) {
      console.log(result);
      if (result && success == true) {
        apphelper.genOTP(function (otp) {
          console.log(otp);
          dbhelper.getDropboxContent('GENERIC_PROP', 'EnableMsgMedia', function (Propdata) {
            console.log(Propdata[0].property_value)
            if (Propdata[0].property_value == "Y") {
              apphelper.sendOTPMessage(result, otp);
            }
          })
          callback(success = true);
        })
      } else {
        callback(success = false);
      }
    });
  },
  verifyOtp(req, otp, callback) {
    apphelper.verifyOTP(otp, function (verified) {
      console.log(verified)
      if (verified == true) {
        console.log("in verified")
        callback(success = true);
      } else {
        console.log("in else verified")
        callback(success = false);
      }
    })
  },
  getRecords: function (mobile, dob, callback) {
    var dob_v = dob;
    dbhelper.getSavedRecord(mobile, dob_v, function (result, success) {
      if (success) {
        console.log(result);
        callback(result, true);
      } else {
        callback(null, false);
      }
    })
  },//
  updateReason: function (appid, reason, callback) {

    oaoApplicant.findOneAndUpdate({ "application_id": appid },
      { "bot_fields.0.notInterestedReason": reason, "bot_fields.0.botContacted": 'Y', mod_time: Date.now(), application_status: "CAN" }, function (err, docs) {
        if (docs) {
          return callback(success = true);
        } else if (err) {
          console.log("err " + err);
          return callback(success = false);
        }

      })
  },
  updateSocialId: function (mobile, socialId, callback) {
    oaoApplicant.update({ "mobile": mobile }, { "bot_fields.0.socialId": socialId, mod_time: Date.now() }, function (err, docs) {
      if (docs) {
        return callback(success = true);
      } else if (err) {
        console.log("err " + err);
        return callback(success = false);
      }
    })
  },
  
  optedUpdates: function (req, mobile, socialId, callback) {
    var query = {}
    query["mobile"] = mobile;
    query["bot_fields.socialId"] = socialId;
    oaoApplicant.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: '$bot_fields.socialId',
          count: { $sum: 1 }
        }
      }

    ], function (err, result) {
      if (err) {
        callback(opted = false)
      } else {
        console.log("optin", result.length)
        if (result.length == 0) {
          callback(opted = false)
        } else {
          self.updateSocialId(mobile, socialId, function (success) {
          })
          callback(opted = true)
        }

      }
    })
  }


}

