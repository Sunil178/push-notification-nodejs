const express = require('express');
const app = express();
const http=require('http');
const routes=require('./routes/routes');
//Get the post data from client
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

//api routes
app.use(routes);

//server initialization
const httpServer = http.createServer(app);

//server connection
port=3000
httpServer.listen(port, () =>
  console.log(`Express Running ${port}!`)
);
