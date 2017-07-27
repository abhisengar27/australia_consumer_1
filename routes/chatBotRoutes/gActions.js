
// module.exports={

//     selectIntent:function(req,res){
//          var action_v=req.body.result.action;
//                 switch(action_v)
//                 {
//                    case 'welcomecheck':
//                                                accessFun.searchuser(req,function(success){
//                                                    console.log(success);
//                                                     if(success==true){
//                                                         accessFun.sendotp(req,function(otp){
//                                                             console.log("in fun: "+otp)
//                                                          res.json({  "speech": "Hi!! Happy to see you back!!! Now enter otp ("+otp+")",
//                                                 "displayText": "Hi!! Happy to see you back!!! Now enter otp ("+otp+")",
//                                                 "contextOut": [{"name":"welcomecheck", "lifespan":1 }],
//                                                 "source": "welcomecheck"
//                                                 });
//                                                         });
//                                                 //  sendotp(req);
//                                                     }else{
//                                                         res.json({  "speech": "Hi!! Happy to see you here!!! Enter ur CIF number",
//                                                 "displayText": "Hi!! Happy to see you here!!! Enter ur CIF number",
//                                                 "contextOut": [{"name":"welcomecheck", "lifespan":1 }],
//                                                 "source": "welcomecheck"
//                                                 });
//                                                     }
//                                                });
                                                
                                            
//                                              break;
//                     case 'getcif'     :  accessFun.newuser(req);
//                                          accessFun.sendotp(req,function(otp){
//                                           res.json({  "speech": "ok enter otp("+otp+")",
//                                                 "displayText": "ok enter otp("+otp+")",
//                                                 "contextOut": [{"name":"getcif", "lifespan":1} ],
//                                                 "source": "getcif"
//                                                 });
//                                             });
//                                          break;
//                        case 'greeting'   :     accessFun.verifyotp(req,function(tokenValidates){
//                                             if(tokenValidates==true){
//                                        res.json({  "speech": "Hello! Would you like to Open Account or View balance or Complete the account opening?",
//                                                 "displayText": "Hello! Would you like to Open Account or View balance or Complete the account opening?",
//                                                 "contextOut": [{"name":"greeting", "lifespan":1} ],
//                                                 "source": "greeting"
//                                                 });
//                                             }else{
//                                                  res.json({  "speech": "Invalid OTP try once again from start",
//                                                 "displayText": "Invalid OTP try once again from start",
//                                                 "contextOut": [{"name":"greeting", "lifespan":1} ],
//                                                 "source": "greeting"
//                                                 });
//                                             }
//                                               });
                                        
//                                          break;

//                     case 'openAccount':  
//                                                 var prodType=req.body.result.parameters['prodType'];
//                                                 res.json({  "speech": "Hi!! Happy to see you here!!! Do you want to open an account in our bank with name as "+name +" Yes or No??",
//                                                 "displayText": "Hi!!Happy to see you here!!! Do you want to open an account in our bank with name as "+name +" Yes or No??",
//                                                 "contextOut": [{"name":"openAccount", "lifespan":1, "parameters":{"prodType":prodType}},{"name":"yesName", "lifespan":1, "parameters":{"name":name}} ],
//                                                 "source": "openAccount"
//                                                 });
                                            
//                                              break;
                                             
//                    case 'getAddress':   var prodType="";
//                                               var name="";
//                                             if(req.body.result.parameters['prodType']!=''){
//                                                 prodType=req.body.result.parameters['prodType'];
//                                             }else{
//                                                 prodType=req.body.result.parameters['prodTypeN'];
//                                             }
//                                             if(req.body.result.parameters['name']!=''){
//                                                 name=req.body.result.parameters['name'];
//                                             }else{
//                                                 name=req.body.result.parameters['nameN'];
//                                             }
//                                             var email=req.body.result.parameters['email'];
//                                             var dob=req.body.result.parameters['dob'];
//                                             var address=req.body.result.parameters['address'];
//                                             var mobile=req.body.result.parameters['phonenumber'];
//                                         accessFun.insertData(req,function(customer_id){  
                                        
//                                          res.json({  "speech": "Ok Which Id Proof do you have??(Driving License/Medicare Number/Passport) Mention any one.",
//                                                 "displayText": "Ok Which Id Proof do you have??(Driving License/Medicare Number/Passport) Mention any one.",
//                                                 "contextOut": [{"name":"getAddress", "lifespan":1, "parameters":{"name":name,"prodType":prodType,"phonenumber":mobile,"email":email,"dob":dob,"address":address,"customer_id":customer_id}}] ,
//                                                 "source": "getAddress"
//                                                 });
                  
//                                             });
//                                              break;

//                     case 'DLidState'      :   console.log(req.body.result.parameters);
//                                               var prodType="";
//                                               var name="";
//                                             if(req.body.result.parameters['prodType']!=''){
//                                                 prodType=req.body.result.parameters['prodType'];
//                                             }else{
//                                                 prodType=req.body.result.parameters['prodTypeN'];
//                                             }
//                                             if(req.body.result.parameters['name']!=''){
//                                                 name=req.body.result.parameters['name'];
//                                             }else{
//                                                 name=req.body.result.parameters['nameN'];
//                                             }
//                                             var email=req.body.result.parameters['email'];
//                                             var dob=req.body.result.parameters['dob'];
//                                             var address=req.body.result.parameters['address'];
//                                             var proof=req.body.result.parameters['proof'];
//                                             var idnum=req.body.result.parameters['idnum'];
//                                             var state=req.body.result.parameters['state'];
//                                             var customer_id=req.body.result.parameters['customer_id'];
//                                              var phonenumber=req.body.result.parameters['phonenumber'];
//                                             switch(prodType)
//                                             {
//                                                 case 'everyday account':  res.json({  "speech": `Ok `+name+` . Your details: Name:`+name+` . Date of Birth:`+dob+` .
//                                                                                                         Address:`+address+` .
//                                                                                                         Email-Id=`+email+` .
//                                                                                                         Mobile NO=`+phonenumber+` .
//                                                                                                         Proof:`+proof+` .
//                                                                                                         Id Number:`+idnum+` .
//                                                                                                         State of Id proof:`+state+` .
//                                                                                                         Is your details are correct(Yes or No)?`,
//                                                                                     "displayText":  `Ok `+name+` . Your details: Name:`+name+` . Date of Birth:`+dob+` .
//                                                                                                         Address:`+address+` .
//                                                                                                         Email-Id=`+email+` .
//                                                                                                         Mobile NO=`+phonenumber+` .
//                                                                                                         Proof:`+proof+` .
//                                                                                                         Id Number:`+idnum+` .
//                                                                                                         State of Id proof:`+state+` .
//                                                                                                         Is your details are correct(Yes or No)?`,
//                                                                                     "contextOut": [{"name":"DLidState", "lifespan":1, "parameters":{"name":name,"prodType":prodType,"phonenumber":phonenumber,"email":email,"dob":dob,"address":address,"customer_id":customer_id,"proof":proof,"state":state,"idnum":idnum}}],//give context
//                                                                                     "source": "DLidState"
//                                                                                     });
//                                                                                     break;
//                                                     case 'term deposit' :   
//                                                                                 insertData(req);
//                                                                                 res.json({  "speech": "What is the amount you want to deposit?",
//                                                                                         "displayText": "What is the amount you want to deposit?",
//                                                                                         "contextOut": [{"name":"idState", "lifespan":1, "parameters":{"name":name,"prodType":prodType}}],
//                                                                                         "source": "idState"
//                                                                                         });
//                                                                                         break;
//                                                     case 'home loan' :      insertData(req);
//                                                                             res.json({  "speech": "Which type of loan you want Refinance or Newpurchase",
//                                                                             "displayText": "Which type of loan you want Refinance or Newpurchase",
//                                                                             "contextOut": [{"name":"idState", "lifespan":1, "parameters":{"name":name,"prodType":prodType}}],
//                                                                             "source": "idState"
//                                                                             });
//                                                                             break;//udhoihao
//                                                     default              : res.json({  "speech": "Product u selected does't exist",
//                                                                             "displayText": "Product u selected does't exist",
//                                                                             "contextOut": [],
//                                                                             "source": "idState"
//                                                                             });
//                                                                             break;
                                
//                                             }
                                            
//                                             break;
//                  case 'accountSuccess':       console.log(req.body.result.parameters);
//                                                 accessFun.updateData(req);
//                                                 res.json({  "speech": "Hurray!!!! Your account is opened!!!!! Account Number "+123456789+" :)",
//                                                 "displayText": "Hurray!!!! Your account is opened!!!!! Account Number "+123456789+" :)",
//                                                 "contextOut": [],
//                                                 "source": "accountSuccess"
//                                                 });
//                                              break;


//                     case 'savenexit':   console.log(req.body.result.contexts);
//                                         res.json({  "speech": "Your Crn number:test",
//                                                     "displayText": "Your Crn number:test",
//                                                     "contextOut": [],
//                                                     "source": "savenexit"
//                                                     });      

//                     default :     var acno=req.body.result.parameters['number'];
//                                     User.findOne({ where: {accno: acno} }).then(function(result,err) { 
                                    
//                                     var speech="Your balance is"+result.get('bal');
//                                     res.json({  "speech": "Hi!! Your balance is"+result.get('bal'),
//                                                 "displayText": "Hi!! Your balance is"+result.get('bal'),
//                                                 "contextOut": [{"name":"getBalance", "lifespan":2, "parameters":{"bal":result.get('bal'),"number":result.get('accno')}}],
//                                                 "source": "getBalance"
//                                                 });
//                                             });          
//                 }
            

//     }


// };