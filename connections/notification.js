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
    
        // let leng=err["results"].length;
        // if (err) {
        //     err = JSON.parse(err);
        //     console.log("Something has gone wrong!", err);
        //     let i = 0;
        //     while (i < leng) {
        //         if (err["results"][i]["message_id"] != null) {
        //             // documents array
        //             store_response.push({
        //                 notification_response: err['results'][i]['message_id'],
        //                 fcm_token: message['registration_ids'][i]
        //             });
        //         }
        //         else {
        //             // documents array
        //             store_response.push({
        //                 notification_response: err['results'][i]['error'],
        //                 fcm_token: message['registration_ids'][i]
        //             });
        //         }
        //         i += 1;
        //     }
        // }
        // else {
        //     console.log("Successfully sent with response: ", response);
        //     response = JSON.parse(response);
        //     let j = 0;
        //     while (j < leng) {
        //         if (response["results"][i]["message_id"] != null) {
        //             // documents array
        //             store_response.push({
        //                 notification_response: response['results'][i]['message_id'],
        //                 fcm_token: message['registration_ids'][i]
        //             });
        //         }
        //         else {
        //             // documents array
        //             store_response.push({
        //                 notification_response: response['results'][i]['error'],
        //                 fcm_token: message['registration_ids'][i]
        //             });
        //         }
        //         j += 1;
        //     }
        // }
        // TechnoMatrix.collection.insertMany(store_response, function (err, docs) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     else {
        //         console.log("Multiple documents inserted to Collection");
        //     }
        // });

}
module.exports = {
    push_notification,
}