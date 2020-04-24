//import mysql
const con = require("../connections/connection");

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
  
  console.log(data);
  res.render("viewarticles.ejs",{
    articles:data,
});

}
module.exports = {
  article,
  articleSubmit,
  articlesGet,
};