var express = require('express');
var request = require("request");
var utf8 = require('utf8');
var to_json = require('xmljson').to_json;
var OAODBHelper = require("../oaoRoutes/OAODBHelper");
var OAORouter = express.Router();
var replaceall = require("replaceall");
OAORouter.route('/onlineidcheck')
      .post(function (req, res) {
            console.log(req.body);
            console.log("====");
            console.log(req.body.application_id);
             console.log(req.body.app_id);
            var app_id_ = req.body.application_id;
            OAODBHelper.getApplicantsRecord(app_id_, function (result) {
                  console.log("Inside online checkid");
                   try{

                  
                  var id_fname = result[0].fname
                  var id_lname = result[0].lname
                  var id_dob = result[0].dob
                  var id_idnum = req.body.idnum
                  var id_state = req.body.idstate
                  var id_dlstatecode = req.body.DLidState
                  var id_dlnum = req.body.LNum
                  var id_color = req.body.color
                  var id_meidicarenum = req.body.meidicarenum
                  // console.log(id_meidicarenum);
                  var id_refnum = req.body.refnum
                  console.log(id_refnum)
                  var id_validTo = req.body.validTo
                  console.log(id_validTo)
                  console.log(id_dob)
                  //----------changing Date format-----
                  var moment = require('moment');
                  var date = moment(id_dob, 'MM/DD/YYYY');
                  var new_date = date.format('YYYY-MM-DD');
                  console.log(new_date);// 20120412

                  var v_moment = require('moment');
                  var v_date = v_moment(id_validTo, 'MM/DD/YYYY');
                  console.log(v_date)
                  var v_new_date = v_date.format('YYYY-MM');
                  console.log(v_new_date);// 20120412
                  

                  var xmlbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"  xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vh="http://vedaxml.com/soap/header/v-header-v1-9.xsd" xmlns:ns1="http://vedaxml.com/vxml2/idmatrix-v4-0.xsd">
            <soapenv:Header>
            <wsse:Security>
            <wsse:UsernameToken>
            <wsse:Username>QCU8pV3bM8</wsse:Username>
            <wsse:Password>uJTrwPSZ7Z</wsse:Password>
            </wsse:UsernameToken>
            </wsse:Security>
            <wsa:ReplyTo>
            <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>
            </wsa:ReplyTo>
            <wsa:To>https://ctaau.vedaxml.com/cta/sys2/idmatrix-v4</wsa:To>
            <wsa:Action>http://vedaxml.com/idmatrix/VerifyIdentity</wsa:Action>
            <wsa:MessageID>QudosTestOAO</wsa:MessageID>
            </soapenv:Header>
            <soapenv:Body>
            <ns1:request client-reference="Finacle123" reason-for-enquiry="Customer Onboarding">
            <ns1:individual-name>
                            <ns1:family-name>`+ id_lname + `</ns1:family-name>
                            <ns1:first-given-name>`+ id_fname + `</ns1:first-given-name>
            </ns1:individual-name>
            <ns1:date-of-birth>`+ new_date + `</ns1:date-of-birth>`
                  if (id_dlnum == null) {
                        console.log("is Null");
                  }
                  else if (id_dlnum == '') {
                        console.log("is Empty")
                  } else if (id_dlnum == undefined) {
                        console.log("is undefinded")
                  }
                  else {
                        console.log("Stupid !!! I am ", id_dlnum, "#$@#$@#$#");
                  }
                  if (id_dlnum != null && id_dlnum != '' && id_dlstatecode != 0) {

                        xmlbody = xmlbody + `
              <ns1:drivers-licence-details>
                    <ns1:state-code>`+ id_dlstatecode + `</ns1:state-code>
                    <ns1:number>`+ id_dlnum + `</ns1:number>
                </ns1:drivers-licence-details>`
                  }
                  if (id_idnum != null && id_idnum != '' && id_state != 0) {
                        xmlbody = xmlbody + `
            <ns1:passport-details>
                            <ns1:country-code>`+ id_state + `</ns1:country-code>
                            <ns1:number>`+ id_idnum + `</ns1:number>
            </ns1:passport-details>`
                  }
                  if (id_color != 0 && id_meidicarenum != null && id_refnum != null && id_validTo != null && id_meidicarenum != '' && id_refnum != '' && id_validTo != '') {
                        xmlbody = xmlbody + `
                   <ns1:medicare>
                        <ns1:card-number>`+ id_meidicarenum + `</ns1:card-number>
                        <ns1:reference-number>`+ id_refnum + `</ns1:reference-number>
                        <ns1:middle-name-on-card>G</ns1:middle-name-on-card>
                        <ns1:date-of-expiry>`+ v_new_date + `</ns1:date-of-expiry>
                        <ns1:card-colour>`+ id_color + `</ns1:card-colour>
                     </ns1:medicare>`
                  }
                  xmlbody = xmlbody + `
                    </ns1:request>
                     </soapenv:Body>
                     </soapenv:Envelope>`


                  console.log(" printing xml body ");
                  console.log(xmlbody)
                  request.post({
                        url: "https://ctaau.vedaxml.com/cta/sys2/idmatrix-v4",
                        method: "POST",
                        headers: {
                              'Content-Type': 'text/xml',
                        },
                        body: xmlbody
                  },
                        function (error, response, body) {
                              //   console.log("response");
                              //console.log(response);
                              //  console.log("response code");
                              //  console.log(response.statusCode);
                              //  console.log("response body");
                              console.log(body);
                              //console.log(error);
                              var newBody = replaceall(":", "_", body); //  body.replaceAll();
                              // console.log(newBody);
                              var newBody1 = replaceall("-", "_", newBody); //  body.replaceAll();
                              // console.log(newBody1);

                              to_json(newBody1, function (error, data) {
                                    // Module returns a JS object 
                                    console.log(data);
                                    // -> { prop1: 'val1', prop2: 'val2', prop3: 'val3' } 
                                    if (data == null || data == '') {
                                          console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.soapenv_Fault.detail.l7_policyResult.$.status))
                                          var bad_req = JSON.stringify(data.soapenv_Envelope.soapenv_Body.soapenv_Fault.detail.l7_policyResult.$.status)
                                          console.log("Fail")
                                          res.json({ pass: "failure", dl: "failure", mc: "failure" })

                                    } else {


                                          // Format as a JSON string 
                                          // console.log("jjjjjjjjjjjjjjjjjjjjjjsssssssssssssssssssooooooooooooonnnn")
                                          //console.log(JSON.stringify(data));
                                          // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.soapenv_Fault.detail.l7_policyResult.$.status))
                                          //  console.log(id_idnum)
                                          //  console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result));
                                          if (id_idnum != null && id_state != 0 && id_dlnum != null && id_dlstatecode != 0 && id_color != 0 && id_meidicarenum != null && id_refnum != null && id_validTo != null) {
                                                console.log("jjjjjjjjjjjjjjjjjjjjjjsssssssssssssssssssooooooooooooonnnndddddddddd")
                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.search_name));
                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.search_name));
                                                var DFAT_AP_0079_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.match_indicator)
                                                console.log(DFAT_AP_0079_match_indicator);



                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.search_name));
                                                var QLD_DL_0075 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.match_indicator)
                                                console.log(QLD_DL_0075);


                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.search_name));
                                                var MEDICARE_CARD_0081 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.match_indicator)
                                                console.log(MEDICARE_CARD_0081);

                                                // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.search_name));
                                                // var VEDA_CBCONS_0068_match_indicator=JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.match_indicator)
                                                // console.log(VEDA_CBCONS_0068_match_indicator);

                                                //return res.json({Result:VEDA_CBCONS_0068_match_indicator});
                                                if (((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) && ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"')) && ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"'))) {
                                                      console.log("Success")
                                                      res.json({ pass: "success", dl: "success", mc: "success" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) {
                                                      console.log("Success")
                                                      res.json({ pass: "success", dl: "failure", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"')) {

                                                      res.json({ pass: "failure", dl: "success", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"')) {
                                                      res.json({ pass: "failure", dl: "failure", mc: "success" })
                                                }
                                                else {
                                                      res.json({ pass: "failure", dl: "failure", mc: "failure" })
                                                }
                                          }
                                          else if (((id_dlnum != null || id_dlstatecode != 0) && (id_dlnum != '')) && ((id_color != 0 || id_meidicarenum != null || id_refnum != null || id_validTo != null) && (id_meidicarenum != '' && id_refnum != '' && id_validTo != ''))) {

                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.search_name));
                                                var QLD_DL_0075 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.match_indicator)
                                                console.log(QLD_DL_0075);


                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.search_name));
                                                var MEDICARE_CARD_0081 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.match_indicator)
                                                console.log(MEDICARE_CARD_0081);

                                                // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.search_name));
                                                // var VEDA_CBCONS_0068_match_indicator=JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.match_indicator)
                                                // console.log(VEDA_CBCONS_0068_match_indicator);

                                                //return res.json({Result:VEDA_CBCONS_0068_match_indicator});
                                                if (((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"')) && ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"'))) {
                                                      console.log("Success")
                                                      res.json({ pass: "failure", dl: "success", mc: "success" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"')) {

                                                      res.json({ pass: "failure", dl: "success", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"')) {
                                                      res.json({ pass: "failure", dl: "failure", mc: "success" })
                                                }
                                                else {
                                                      res.json({ pass: "failure", dl: "failure", mc: "failure" })
                                                }
                                          }
                                          else if (((id_idnum != null || id_state != 0) && (id_idnum != '')) && ((id_color != 0 || id_meidicarenum != null || id_refnum != null || id_validTo != null) && (id_meidicarenum != '' && id_refnum != '' && id_validTo != ''))) {
                                                console.log(id_meidicarenum)
                                                console.log("jjjjjjjjjjjjjjjjjjjjjjsssssssssssssssssssooooooooooooonnnndddddddddd")
                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.search_name));
                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.search_name));
                                                var DFAT_AP_0079_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.match_indicator)
                                                console.log(DFAT_AP_0079_match_indicator);

                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.search_name));
                                                var MEDICARE_CARD_0081 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.match_indicator)
                                                console.log(MEDICARE_CARD_0081);

                                                // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.search_name));
                                                // var VEDA_CBCONS_0068_match_indicator=JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.match_indicator)
                                                // console.log(VEDA_CBCONS_0068_match_indicator);

                                                //return res.json({Result:VEDA_CBCONS_0068_match_indicator});
                                                if (((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) && ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"'))) {
                                                      console.log("Success")
                                                      res.json({ pass: "success", dl: "failure", mc: "success" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) {
                                                      console.log("Fail")
                                                      res.json({ pass: "success", dl: "failure", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"')) {
                                                      res.json({ pass: "failure", dl: "failure", mc: "success" })
                                                }
                                                else {
                                                      res.json({ pass: "failure", dl: "failure", mc: "failure" })
                                                }
                                          }
                                          else if (((id_idnum != null || id_state != 0) && ((id_idnum != ''))) && ((id_dlnum != null || id_dlstatecode != 0) && (id_dlnum != ''))) {
                                                console.log("jjjjjjjjjjjjjjjjjjjjjjsssssssssssssssssssooooooooooooonnnndddddddddd")
                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.search_name));
                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.search_name));
                                                var DFAT_AP_0079_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.match_indicator)
                                                console.log(DFAT_AP_0079_match_indicator);



                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.search_name));
                                                var QLD_DL_0075 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.match_indicator)
                                                console.log(QLD_DL_0075);

                                                // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.search_name));
                                                // var VEDA_CBCONS_0068_match_indicator=JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.match_indicator)
                                                // console.log(VEDA_CBCONS_0068_match_indicator);

                                                //return res.json({Result:VEDA_CBCONS_0068_match_indicator});
                                                if (((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) && ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"'))) {
                                                      console.log("Success")
                                                      res.json({ pass: "success", dl: "success", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) {
                                                      console.log("Success")

                                                      res.json({ pass: "success", dl: "failure", mc: "failure" })
                                                }
                                                else if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"')) {
                                                      console.log("Success")

                                                      res.json({ pass: "failure", dl: "success", mc: "failure" })
                                                }
                                                else {
                                                      console.log("Fail")
                                                      res.json({ pass: "failure", dl: "failure", mc: "failure" })
                                                }
                                          }
                                          else if (id_idnum != null && id_state != 0) {
                                                console.log("jjjjjjjjjjjjjjjjjjjjjjsssssssssssssssssssooooooooooooonnnndddddddddd")
                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.search_name));
                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.search_name));
                                                var DFAT_AP_0079_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[12].$.match_indicator)
                                                console.log(DFAT_AP_0079_match_indicator);


                                                // console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.search_name));
                                                // var VEDA_CBCONS_0068_match_indicator=JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[19].$.match_indicator)
                                                // console.log(VEDA_CBCONS_0068_match_indicator);

                                                //return res.json({Result:VEDA_CBCONS_0068_match_indicator});
                                                if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (DFAT_AP_0079_match_indicator == '"PASS"')) {
                                                      console.log("Success")
                                                      res.json({ pass: "success", dl: "NotEntered", mc: "NotEntered" })
                                                }
                                                else {
                                                      console.log("Fail")
                                                      res.json({ pass: "failure", dl: "NotEntered", mc: "NotEntered" })
                                                }
                                          }
                                          else if (id_dlnum != null && id_dlstatecode != 0) {

                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.search_name));
                                                var QLD_DL_0075 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[20].$.match_indicator)
                                                console.log(QLD_DL_0075);
                                                if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (QLD_DL_0075 == '"PASS"')) {
                                                      console.log("Success")
                                                      res.json({ pass: "Not Entered", dl: "success", mc: "Not Entered" })
                                                }
                                                else {
                                                      console.log("Fail")
                                                      res.json({ pass: "Not Entered", dl: "failure", mc: "Not Entered" })
                                                }



                                          }
                                          else if (id_color != 0 && id_meidicarenum != null && id_refnum != null && id_validTo != null) {
                                                var VEDA_CBCONS_0066_match_indicator = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[5].$.match_indicator)
                                                console.log(VEDA_CBCONS_0066_match_indicator);

                                                console.log(JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.search_name));
                                                var MEDICARE_CARD_0081 = JSON.stringify(data.soapenv_Envelope.soapenv_Body.ns5_response.ns5_component_responses.ns5_verification_response.ns5_search_results.ns5_search_result[21].$.match_indicator)
                                                console.log(MEDICARE_CARD_0081);
                                                if ((VEDA_CBCONS_0066_match_indicator == '"PASS"') && (MEDICARE_CARD_0081 == '"PASS"')) {
                                                      console.log("Success")
                                                      res.json({ pass: "Not Entered", dl: "Not Entered", mc: "success" })
                                                }
                                                else {
                                                      console.log("Fail")
                                                      res.json({ pass: "Not Entered", dl: "Not Entered", mc: "failure" })
                                                }

                                          }
                                          else {

                                                console.log("Fail")
                                                res.json({ pass: "failure", dl: "failure", mc: "failure" })

                                          }

                                    }


                              });
                        });
                        }catch(e){
                        console.log("fname mname... undefined",e)
                        res.json({server:"error"})
                  }

            });


      });




module.exports = OAORouter;