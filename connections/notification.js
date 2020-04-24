var FCM = require('fcm-node');
var serverKey = 'YOURSERVERKEYHERE'; // put your server key here
var fcm = new FCM(serverKey);


function push_notification(message){

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
}
module.exports={
    push_notification,
}