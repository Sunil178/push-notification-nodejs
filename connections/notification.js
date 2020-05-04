var FCM = require('fcm-node');
var serverKey = 'AAAA_fwlOnE:APA91bEzApiNvi8fWQPsWPadCWWPJn2zSc504dRv1CLI8weS3PX2NFUsfnboEZhDn65_whPxhSSmIX2l410ycRpifPCROFlnezwBLpi6L1VgsAqWOUJv0KJQE80d1NWk2BAh640nhLW_'; // put your server key here
var fcm = new FCM(serverKey);


//Import A Mongoose Schema
const {
    StoreResponseSchema
} = require('./technomatrixSchema');
//Import mongoose
const mongoose = require('mongoose');

function push_notification(message) {
    //let TechnoMatrix = mongoose.model('TechnoMatrix', StoreResponseSchema, message['data']['article_id']);
    //var store_response = [];
    return new Promise((resolve, reject) => {
    let leng = message["registration_ids"].length;
        console.log(leng)
        fcm.send(message,(err,response)=>{
            if (err) {

                return reject(err);
            }
            return resolve(response);
        });
    });
}
module.exports = {
    push_notification,
}