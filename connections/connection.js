//Import dotenv package
const dotenv = require('dotenv');
dotenv.config();
//import mysql
const mysql = require("mysql");
//Import mongoose
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
        host:  `${process.env.MYSQL_HOST}`,
        user: `${process.env.MYSQL_USERNAME}`,
        password: `${process.env.MYSQL_PASSWORD}`,
        database: `${process.env.MYSQL_DATABASE}`,
        port:  `${process.env.MYSQL_PORT}`
    }) 

}
