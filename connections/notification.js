var FCM = require('fcm-node');
// put your server key here
// var serverKey = 'AAAA7_Am0qE:APA91bHcDZBbgN2Z80SHJ_LWn3ITV--7LjTB5Lx6HGL1FdpFkwsGRJTYYeIZIiJzzPttqP4703hn0ukG2xFl4GQlIGtQzH-pNFPWCXMp-28r_1pU4LkF4mxEBTkaGsKVu08UQcoEDjBM'; 

//client server key
var serverKey = 'AAAALpOh8nA:APA91bErQAVgKN3WTuFY9EKBchyvSWI-f2CsK6Bv4zqxsnJWoyuCbSoOMOEpGEhn-fFTQFYW3gWm96fg3RK3suCwzulNTAMQc4EP8xe_Q9UZmA80-Ace9iXR8xBlQFjzUNkjG4ZTJzxo'; 

var fcm = new FCM(serverKey);
//Import A Mongoose Schema
const {
    StoreResponseSchema
} = require('./technomatrixSchema');
//Import mongoose
const mongoose = require('mongoose');

function push_notification(message, index) {
    return new Promise((resolve, reject) => {
    let leng = message["registration_ids"].length;
        // console.log(leng)
        fcm.send(message,(err,response)=>{
            if (err) {
                err = JSON.parse(err);
                err["index"] = index;
                err = JSON.stringify(err);
                return reject(err);
            }
            response = JSON.parse(response);
            response["index"] = index;
            response = JSON.stringify(response);
            return resolve(response);
        });
    });
}
module.exports = {
    push_notification,
}