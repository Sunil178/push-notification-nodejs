var FCM = require('fcm-node');
var serverKey = 'AAAA_fwlOnE:APA91bEzApiNvi8fWQPsWPadCWWPJn2zSc504dRv1CLI8weS3PX2NFUsfnboEZhDn65_whPxhSSmIX2l410ycRpifPCROFlnezwBLpi6L1VgsAqWOUJv0KJQE80d1NWk2BAh640nhLW_'; // put your server key here
var fcm = new FCM(serverKey);


function push_notification(message) {

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}
module.exports = {
    push_notification,
}