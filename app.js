var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var mongoose = require('mongoose');
var Regex = require("regex");
var config_urls = require("./configFiles/DBconfigfile");
var expressValidator = require('express-validator');
var cors = require('cors');
var OAOPropertyDetail = require('./models/OAOPropertyDetail');


mongoose.connect(config_urls.url.mongoDB, function(err, db) {
    if (!err) {
        console.log("Connected to Database")
    } else {
        console.log("failed to connect");
    }
});


var app = express();
var appRoutes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    //The below changes are commented since there parameters are restricting the access in Heroku. 
	
	//res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    //res.setHeader('X-Content-Type-Options', 'nosniff');
    //res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/', appRoutes);

//oao
var api = require('./routes/oaoRoutes/api');
app.use('/api', api); //chandan

//onlinIdCheck
var idcheck = require('./routes/onlineIdCheckRoutes/idcheck');
app.use('/idcheck', idcheck);

//login
var loginUserAPI = require('./routes/loginRoutes/loginAPI'); //chandan
app.use('/loginAPI', loginUserAPI); //chandan

//chat bot actions 
var actions = require('./routes/chatBotRoutes/action');
app.use('/action', actions);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
     //chnages done for switchTheme
    if(config_urls.Production_Mode == "Y")
    {
         OAOPropertyDetail.find({ property_type: 'GENERIC_PROP', property: 'CURRENT_UXTHEME' }, function (err, result) {
            if (result) {
                if(result[0].property_value == 'EmpowerDefault')
                   res.render('index',{ 'bundle': config_urls.THEMES.EmpowerDefault.bundle, 'style':config_urls.THEMES.EmpowerDefault.style});
                else if(result[0].property_value == 'EmpowerTheme1')
                   res.render('index',{ 'bundle': config_urls.THEMES.EmpowerTheme1.bundle, 'style':config_urls.THEMES.EmpowerTheme1.style});  
            }
            else if(err)
                console.log(err+"........................................error........................");
        });
    }
    else
      res.render('index',{ 'bundle': config_urls.THEMES.EmpowerTheme1.bundle, 'style':config_urls.THEMES.EmpowerTheme1.style});
});

app.use(expressValidator({
    customValidators: {
        foundError:function(){
            return false;
        },
        isAuNumber: function(value) {
            // return Array.isArray(value);

            if (value != "") {

                // var regexqq = new Regex(/\^[a-zA-Z]{2}$/g);

                // var resul=regexqq.test('aa');

                // console.log("final result==>"+resul);

                // var pattern = /^(0[0-8]{8})$/;
                // var match = pattern.exec(value);
                // console.log(match);

                var regexp = /\^([a-z])\d{2}/;
                // var regexp =/^(0[0-8]{8,})$/;
                console.log(regexp);
                console.log(value);
                console.log(regexp.test(value));
                var result = regexp.test(value);
                console.log("custome\t" + result);

                // if(result==true){
                //     console.log("condition"+value);
                return value;
                // }
            }
            return value;
        }
    }
}));

module.exports = app;