var FCM = require('fcm-node');
var serverKey = 'AAAA_fwlOnE:APA91bEzApiNvi8fWQPsWPadCWWPJn2zSc504dRv1CLI8weS3PX2NFUsfnboEZhDn65_whPxhSSmIX2l410ycRpifPCROFlnezwBLpi6L1VgsAqWOUJv0KJQE80d1NWk2BAh640nhLW_'; // put your server key here
var fcm = new FCM(serverKey);
//Import A Mongoose Schema
const {StoreResponseSchema}=require('./technomatrixSchema');
//Import mongoose
const mongoose = require('mongoose');

function push_notification(message) {
    var response=[];
    console.log(message['registration_ids'])
    let TechnoMatrix=mongoose.model('TechnoMatrix', StoreResponseSchema,message['data']['article_id']);
        // documents array
        let i=0
        while(i!=10){
        response.push({ notification_response: 'duplicate', fcm_token: message['registration_ids'] });
        i+=1
        }
    TechnoMatrix.collection.insertMany(response, function (err, docs) {
        if (err){ 
            return console.error(err);
        } else {
          console.log("Multiple documents inserted to Collection");
        }
    });


    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Something has gone wrong!",err);
  //  response.push({ notification_response: err['response'][], fcm_token: message['registration_ids'][] });
    //     } else {
          //  response.push({ notification_response: err['response'][], fcm_token: message['registration_ids'][] });
    //         console.log("Successfully sent with response: ", response);
    //     }
    // });
}
module.exports = {
    push_notification,
}