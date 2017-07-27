var express = require('express');
var OAOUserDetailSchema = require('../../models/OAOUserDetailSchema');
var OAORouter = express.Router();

var app = express();
var jwt=require('jsonwebtoken');
var randtoken=require('rand-token');
var tokenkey=randtoken.generate(16);
app.set('superSecret', tokenkey);
var localStorage=require('localStorage');

     OAORouter.route('/login')
    .post(function(req,res){
        console.log("/login api")
        console.log(req.body);
        OAOUserDetailSchema.findOne({userName:req.body.userName,password:encrypt(req.body.password)},
        function(err,result){
              if(err)
             {
                 console.log("error")
                //res.json({userName:null});
             }
            if(result=="")
            {
                console.log("null");
                 res.json({userName:"null"});
            }
            if(result==null){
                console.log("null2")
                res.json({userName:null});
            }
            else{
                var token = jwt.sign(result,app.get('superSecret'),{expiresIn:1440});
                localStorage.setItem("token",token);
                console.log(token);
                res.json({userName:result.userName,token:token});
            }
        });
    });



//Register Online create LoginUserDetails
      OAORouter.route('/regIntBanking')
    .post(function(req,res)
    {
        console.log("regIntBanking api")
        console.log(req.body);
       var oaoUserDetailSchema = new OAOUserDetailSchema({
                userId:req.body.userId,
                userName:req.body.userName,
                password:encrypt(req.body.password),
                title:req.body.title,
                fName:req.body.fName,
                mName:req.body.mName,
                lName:req.body.lName,
                dob:req.body.dob,
                age:req.body.age,
                email:req.body.email,
                mobile:req.body.mobile,
                homeAddress:req.body.homeAddress,
                streetNum:req.body.streetNum,
                streetName:req.body.streetName,
                houseNum:req.body.houseNum,
                postCode:req.body.postCode,
                state:req.body.state,

                pstreetNum:req.body.pstreetNum,
                pstreetName:req.body.pstreetName,
                phouseNum:req.body.phouseNum,
                ppostCode:req.body.ppostCode,
                pstate:req.body.pstate,
                postalAddress:req.body.postalAddress,
                TFN:req.body.TFN,
                exemptionReason:req.body.exemptionReason,
                passportNumber:"",
                issuingCountry:"",
                colourOfCard:"",
                cardNumber:"",
                referenceNumber:"",
                validTo:"",
                StateOfDrivingLicenseRegistration:"",
                licenseNumber:"",
       })

        oaoUserDetailSchema.save(function (err,result) {
            if (err) {
                return res.json({error:err});
            }
             return res.json({result:result});
        });


    });

    //encrypt password
var crypto = require('crypto'),algorithm = 'aes-256-ctr',password = 'd6F3Efeq';
function encrypt(text)
{
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}


 OAORouter.route('/checkDup')
    .post(function(req,res){
        console.log("/checkDup api")
        console.log(req.body);
        if(req.body.email == undefined)
         req.body.email = '';
         if(req.body.mobile == undefined)
         req.body.mobile = '';
        OAOUserDetailSchema.findOne({email:req.body.email,mobile:req.body.mobile},
        function(err,result){
              if(err)
             {
                 console.log("error")
                //res.json({userName:null});
             }
            if(result=="")
            {
                console.log("null");
                 res.json({status:false});
            }
            if(result==null){
                console.log("null2")
                res.json({status:false});
            }
            else{

                res.json({status:true});
            }
        });
    });


/////////////////////////////////////////////////////////////////////////////
OAORouter.use(function(req, res, next) {
    console.log("checking token")
  var token = req.body.token || req.query.token || localStorage.getItem("token");

  // decode token
  if (token)
  {
    jwt.verify(token, app.get('superSecret'), function(err, decoded)
    {
      if (err)
      {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
      else
      {
        req.decoded = decoded;
        next();
      }
    });
  }
  else
   {
    return res.status(403).send({success: false,message: 'No token provided.'});
   }
});

//////////////////////////////////////////////////////////////////////////////

     OAORouter.route('/getLoginUserDetails')
    .post(function(req,res){
        console.log("getLoginUserDetails api")
        console.log(req.body.userName)
        OAOUserDetailSchema.findOne({userName:req.body.userName},function(err,result){
            //  if(err)
            //  {
            //     console.log(result)
            //     res.json({result:result});
            // }
            if(result=="")
            {
                res.json({result:result});
            }else{
                console.log(result)
                res.json({result:result});
            }
        });
    });
////////////////////////////////////////////////////////////////////////
//logout
OAORouter.get('/logout', function(req, res){
	console.log("logout api");
    localStorage.removeItem('token');
    res.json({success:true,message:'logout'});
});



module.exports=OAORouter;
