//import mysql
const con = require("../connections/connection");
const {push_notification}=require("../connections/notification");
var path = require('path');

function article(req, res) {

 res.render("index.ejs");
}
function articleSubmit(req, res) {
  article = req.body.articlebody;
  
  //connect to user database
  var sql = "INSERT INTO articles (articlebody) VALUES ('"+article+"')";  
  con.connection.query(sql, (err, result) => {
  	if (err) res.send(err);
    res.render("index.ejs");
  });

}
var data=[]

function articlesGet(req,res){
  //Get all data from the table to display
  var get_query = "SELECT * FROM articles";
  con.connection.query(get_query,(err,result)=>{
    if (err) throw err;
    data=result;
  });
  
  //console.log(data);
  res.render("viewarticles.ejs",{
    articles:data,
});

}
function pushnotication(req,res){
  var get_query = "SELECT token FROM users";
  con.connection.query(get_query,(err,result)=>{
    if (err) res.send(err);

    var tokens = new Set();
    for (var i = 0; i < result.length; i++) {
      tokens.add(result[i]['token']);
    }
    tokens = Array.from(tokens);
    
    var message = {
        registration_ids: tokens, // Multiple tokens in an array
        collapse_key: 'green',
        
        notification: {
            title: 'Our First Message', 
            body: req.body.data ,
            //icon: '/home/pratik/Workspace/nodejsprogram/node-js-push-notication/views/img/1.png',
            image_url:'/home/pratik/Workspace/nodejsprogram/node-js-push-notication/views/img/1.png',
        },
        data: {  //you can send only notification or only data(or include both)
          "Nick" : "Mario",
          "Room" : "PortugalVSDenmark"
        }
    };
    push_notification(message);
    
  });



}

function storeUser(req, res) {
  var sql = "INSERT INTO users (fuid, email, password, token) VALUES ('"+req.body.uid+"', '"+req.body.email+"', '"+req.body.password+"', '"+req.body.token+"')";  
  con.connection.query(sql, (err, result) => {
  	if (err) res.send("Failure");
  	res.send("Success");
  });
}

module.exports = {
  article,
  articleSubmit,
  articlesGet,
  pushnotication,
  storeUser,
};
