//import mysql
const mysql = require("mysql");

const mongoose = require('mongoose');

const mydb_url = 'mongodb://localhost:27017';
mongoose.connect(mydb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (!err) {
            console.log('MongoDB Connected succesfully')
        } else {
            console.log('MongoDB Not Connected' + err)
        }
    });


//export mysql connection
module.exports={ 
    connection : mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "node_push_notication",
        port: 3306
    })
}