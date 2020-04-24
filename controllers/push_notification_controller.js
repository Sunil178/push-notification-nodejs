//import mysql
const con = require("../connections/connection");

function article(req, res) {
var data=[]
  //Get all data from the table to display
 var get_query="SELECT * FROM articles";
 con.connection.query(get_query,(err,result)=>{
   if (err) throw err;
   var data=result;
 });

 res.render("article.ejs",{
    articles:data,
});


}
function articleSubmit(req, res) {
var data="";
  article = req.body.articlebody;
  
  //connect to user database
  var sql = "INSERT INTO articles (articlebody) VALUES ('"+article+"')";  
  con.connection.query(sql);

  //Render to view
  res.render("viewarticles.ejs");
}

function articlesGet(req,res){
//     var sql = "INSERT INTO articles (articlebody) VALUES ('"+article+"')";  
//     //connect to user database
//    con.connection.query(sql);
}
module.exports = {
  article,
  articleSubmit,
  articlesGet,
};