//import mysql
const mysql = require("mysql");

// //create connection for user database
// var config={
//     host: "localhost",
//     user: "root",
//     password: "Pr@tik12345",
//     database: "nodejs_push_notication",
//     port: 3306
// }
// var con = mysql.createConnection(config);

// con.connect(function (err) {
//     if (err) throw err;
//     console.log(" Connected!");
// });


//export mysql connection
module.exports={ 
    connection : mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Pr@tik12345",
        database: "nodejs_push_notication",
        port: 3306
    }) 

}