const express = require('express');
const app = express();
const http = require('http');
const routes = require('./routes/routes');

require("events").EventEmitter.prototype._maxListeners = 0;

const dotenv = require('dotenv');
dotenv.config();
//Set View Engine To EJS
app.set("view engine", "ejs");
// Set Static Directory
app.use(express.static(__dirname + "/views"));

//Get the post data from client
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

global.appRootPath =__dirname+"/views/";
//api routes
app.use(routes);

//server initialization
const httpServer = http.createServer(app);

//server connection
httpServer.listen(process.env.PORT, "127.0.0.1", () =>
    console.log(`Express Running on port ${process.env.PORT}!`)
);