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
        registration_ids: ['eQ0QRZyQPhs:APA91bH735elxHMxw6AgdXtsKUxxibSXjYlIYfEu1VTCYJP-658a4-LTLIOFoiXQeifRlbKXyFemyDPa3mMygQVkHV7aNd0US05Y6o_QgbXayk1UBzTW-CLcsVZaTQL1GCdj7okIyfXf'], // Multiple tokens in an array
        collapse_key: 'green',
        
        notification: {
            title: 'Our First Message', 
            body: req.body.data ,
        },
        
        // data: {  //you can send only notification or only data(or include both)
        //   "Nick" : "Mario",
        //   "Room" : "PortugalVSDenmark"
        // }
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