var express = require('express');
var session = require('express-session');
var router = express.Router();
var authHelper = require('./office365/authHelper');
var graphHelper = require('./office365/graphHelper');
var config=require("../configFiles/DBconfigfile");
router.use(session({secret: 'emPowerOnBoardIng'}));
var sess;

//Commented by Chandru for Office365 Changes

//router.get('/', function (req, res, next) {
  //  res.render('index');
//});

router.get('/', function(req,res,next){
	if(config.office365LoginEnabled=="Y"){	
	sess=req.session;
	console.log('Request handler \'home\' was called.');
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<p>Please <a href="' + authHelper.getAuthUrl() + '">sign in</a> with your Office 365 or Outlook.com account.</p>');
	res.end();
	}else{
		res.writeHead(302, {'Location': config.url.clientUrl+'/home'});
        res.end();
	}
});

var url = require('url');
router.get('/authorize', function(req,res,next) {
  console.log('Request handler \'authorize\' was called.');
  console.log(res);
  // The authorization code is passed as a query parameter
  var url_parts = url.parse(req.url, true);
  var code = url_parts.query.code;
  console.log('Code: ' + code);
  authHelper.getTokenFromCode(code, tokenReceived, res);
  
});

router.post('/tokenValidation', function(req,res,next){
	console.log("sess.loginToken>>"+sess.loginToken);
	console.log("req.body.token>>"+req.body.token);
	console.log("sess.accessToken>>"+sess.accessToken);
	graphHelper.getUserData(sess.accessToken, (err, user) => {
     if(user){
		 console.log("user data")
		 ///console.log(user);
		 //console.log(user.res[0].IncomingMessage);
		 var newJson=JSON.parse(user.text);
		 var mailId=newJson.mail;
		 console.log(sess.loginToken==req.body.token && mailId.endsWith('u@latitudefintech.com'));
		 
		 if(sess.loginToken==req.body.token && mailId.endsWith('@latitudefintech.com')){
		console.log("true");
		res.json({success:true});
			}else{
				res.json({success:false});
			}
	 }
	else{
		console.log("false");
		res.json({success:false});
	}
	if(err){
		res.json({success:false});
	 }
   });
	
});


function tokenReceived(response, error, token) {
	sess.loginToken=token.id_token;
	sess.accessToken=token.access_token;
  if (error) {
		response.redirect('/');
  } else {
        response.writeHead(302, {'Location': config.url.clientUrl+'/office365/'+token.id_token});
        response.end();
  }
}
module.exports = router;
