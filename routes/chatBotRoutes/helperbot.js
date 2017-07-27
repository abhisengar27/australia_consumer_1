
var request = require('request');
module.exports={
    
    
 sendMessage:function(sender_id,crn,callback){
     //config msg
           request.post({url:'https://sample-latitude-dev-product.herokuapp.com/action/fbmessage',
                    form: {tosend:sender_id,
                           title:'Incomplete Application',
                           subtitle:'If you need help from the bank to complete application, select "HELP" or select "I WILL  COMPLETE" to proceed with completing the application yourself.​​​​​​',
                           b1_title:'Help',
                           b1_payload:'help',
                           b2_title:'I WILL COMPLETE',
                           b2_payload:'crn: '+crn,
                           b3_title:'Not Interested',
                           b3_payload:'Not Interested'}}, function(err,body){
                                                    if(err){
                                                        console.log(err);
                                                    }else if(body){
                                                          var success="true";
                                                          return callback(success);
                                                    }
                           });
}
};