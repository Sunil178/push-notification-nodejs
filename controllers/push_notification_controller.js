//import mysql
const con = require("../connections/connection");
const {
  push_notification
} = require("../connections/notification");

function article(req, res) {
  //console.log(appRootPath);

  // var sql = `SELECT * FROM articles where id=1;`;
  // con.connection.query(sql, (err, result) => {
  // if (err){
  //       res.send(err);
  //     }
  //     console.log(result);
  //     console.log("Done")      
  //   });     

  // for (let index = 0; index < 500; index++) {
  //   con.connection.query(sql, (err, result) => {
  //     if (err) {
  //       res.send(err);
  //     }
  //     console.log("Done")      
  //   });     
  // }
  res.render("index.ejs");
}

function articleSubmit(req, res) {
  article_body = req.body.articlebody;
  article_title = req.body.article_title;
  article_img_url = req.body.article_img_url;
  article_notification_text = req.body.notification_text;
  article_main_source = req.body.main_source;
  //  console.log(req.body);

  // connect to user database
  var sql = `INSERT INTO articles (article_title,articlebody,article_img,article_notification_text,article_main_source) VALUES ('${article_title}','${article_body}','${article_img_url}','${article_notification_text}','${article_main_source}')`;
  con.connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.render("index.ejs");
  });
}

var data = [];

function articlesGet(req, res) {
  //Get all data from the table to display
  var get_query = "SELECT * FROM articles";
  con.connection.query(get_query, (err, result) => {
    if (err) res.send(err);
    data = result;
  });

  //console.log(data);
  res.render("viewarticles.ejs", {
    articles: data,
  });

}
var article_data = [];

function pushnotication(req, res) {

  var message_data = req.body.data
   console.log(message_data)
  //Query to get the data from database for a particular id
  var get_data_query = `SELECT * FROM articles where id=${message_data}`;
  con.connection.query(`UPDATE articles SET status='1' WHERE id = ${message_data}`);
  con.connection.query(get_data_query, (err, result) => {
    if (err) res.send(err);
    article_data = result;
  });

  //To wait until query gets executed
  setTimeout(() => {
    console.log(article_data[0]["article_title"]);
  }, 1000);
  var get_query = "SELECT token FROM users";
  con.connection.query(get_query, (err, result) => {
    if (err) res.send(err);

    //Sending the data to multiple users
    //var tokens = new Set();
    var tokens = []
    for (var i = 0; i < result.length; i++) {
      tokens.push(result[i]['token']);
    }
    //tokens = Array.from(tokens);
    let start = 0;
    len = tokens.length;
    let limit = 999
    //end = Math.ceil(len / limit);
    end=1
  while (start < end) {

      var message = {
        registration_ids: tokens.slice(limit * start, (start + 1) * limit), // Multiple tokens in an array
        collapse_key: 'green',

        notification: {
          title: article_data[0]["article_title"],
          body: article_data[0]["articlebody"],
          image: article_data[0]["article_img"],
        },

        data: { //you can send only notification or only data(or include both)
          "article_id":message_data,
          "notification_text": article_data[0]["article_notification_text"],
          //"Room": "PortugalVSDenmark"
        }
      };
      push_notification(message);
      console.log("******************************************************************************")
      start += 1
    }
    //console.log(ids)
  });
  res.render(index.ejs)

}

function storeUser(req, res) {
  var sql = "INSERT INTO users (fuid, email, password, token) VALUES ('" + req.body.uid + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.token + "')";
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