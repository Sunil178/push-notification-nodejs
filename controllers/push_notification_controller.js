//import mysql
const con = require("../connections/connection");
const {push_notification}=require("../connections/notification");
function article(req, res) {

 res.render("article.ejs");
}
function articleSubmit(req, res) {
  article = req.body.articlebody;
  
  //connect to user database
  var sql = "INSERT INTO articles (articlebody) VALUES ('"+article+"')";  
  con.connection.query(sql);

  //Render to view
    res.render("article.ejs");
 
}
var data=[]

function articlesGet(req,res){
  //Get all data from the table to display
  var get_query="SELECT * FROM articles";

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
    var message = { 
        registration_ids: ['registration_tokens'], // Multiple tokens in an array
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    push_notification(message);

    console.log(req.body.data);
}
module.exports = {
  article,
  articleSubmit,
  articlesGet,
  pushnotication,
};