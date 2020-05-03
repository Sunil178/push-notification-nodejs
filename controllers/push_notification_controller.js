//import mysql
const con = require("../connections/connection");
const {
  push_notification
} = require("../connections/notification");
const {
  StoreResponseSchema
} = require('../connections/technomatrixSchema');
//Import mongoose
const mongoose = require('mongoose');

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
  var store = 0;
  var message_data = req.body.data;
  console.log(message_data)
  //Query to get the data from database for a particular id
  var get_data_query = `SELECT * FROM articles where id=${message_data}`;
  con.connection.query(`UPDATE articles SET status='1' WHERE id = ${message_data}`);

  con.connection.query(get_data_query, (err, result) => {
    if (err) res.send(err);
    article_data = result;
  });

  //To wait until query gets executed
  var get_query = "SELECT token FROM users";
  con.connection.query(get_query, (err, result) => {
    if (err) res.send(err);

    //Sending the data to multiple users
    //var tokens = new Set();
    var tokens = []
    for (var i = 0; i < result.length; i++) {
      tokens.push(result[i]['token']);
    }
    var fcm_tokens = tokens.slice().reverse();
    //tokens = Array.from(tokens);
    let start = 0;
    len = tokens.length;
    let limit = 999
    end = Math.ceil(len / limit);
    while (start < end) {
      var message = {
        registration_ids: tokens.slice(limit * start, (start + 1) * limit ), // Multiple tokens in an array
        collapse_key: 'Updates Available',
        content_available: true,

        notification: {
          title: article_data[0]["article_title"],
          body: article_data[0]["articlebody"],
          image: article_data[0]["article_img"],
        },

        data: { //you can send only notification or only data(or include both)
          "article_id": message_data,
          "notification_text": article_data[0]["article_notification_text"],
        }
      };
      async function makeRequest() {
        try {
          const result = JSON.parse(await push_notification(message));

          console.log("Resolved", result);

        } catch (error) {

          let TechnoMatrix = mongoose.model('TechnoMatrix', StoreResponseSchema, message_data);
          var store_response = [];

          response = JSON.parse(error);
          response_array = response["results"].slice().reverse();
          
          let i = 0;
          console.log(store);
          while (i < response_array.length) {
            if (response_array[i]["message_id"] != null) {
              // documents array
              store_response.push({
                notification_response: response_array[i]['message_id'],
                fcm_token: fcm_tokens[store],
              });
              store+=1;
            } else {
              // documents array
              store_response.push({
                notification_response: response_array[i]['error'],
                fcm_token: fcm_tokens[store],
              });
              store+=1;
            }
            i+=1
          }
          //store+=1;
          console.log(store)

          TechnoMatrix.collection.insertMany(store_response, function (err, docs) {
            if (err) {
              return console.error(err);
            } else {
              console.log("Multiple documents inserted to Collection");
            }
          });
        
          //console.log("rejected",error);
        }
      }
      makeRequest();
      console.log("******************************************************************************")
      start += 1
    }

    res.render("index.ejs");
    //console.log(ids)
  });

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