//import mysql
const con = require("../connections/connection");
const {
  push_notification
} = require("../connections/notification");
const {
  StoreResponseSchema
} = require("../connections/technomatrixSchema");
//Import mongoose
const mongoose = require("mongoose");
var NotificationResponseReport = mongoose.model(
  "NotificationResponseReport",
  StoreResponseSchema
);

function article(req, res) {
 
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
  // console.log(req.params.id)

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
var notification_send_report=[];

function notificationReport(req,res){
  var get_data_query = `SELECT * FROM articles where status='1'`;
  con.connection.query(get_data_query, async (err, result) => {
    if (err) res.send(err);
    //article_data = await result;
    notification_send_report=[]
    await result.forEach(element => {
       NotificationResponseReport.find({article_id:element['id']},(err,docs)=>{
        //  console.log(docs[0]['article_response']);
        if(docs.length!=0) {
          //notification_send_report.push(element['id']);
          notification_send_report.push({"article_id":element['id'],"article_title":element['article_title'],
          "success_count":docs[0]["success_count"],"failure_count":docs[0]["failure_count"]});
       }
        });
      
    });

  });

  res.render("notification_report.ejs", {
     notification_report: notification_send_report,
  });
}

function notificationReportStats(req,res){
  console.log(req.params.id)
  
  res.render("notification_report_stats.ejs", {
    notification_stats: 1,
 });
}


function pushnotication(req, res) {
  var article_data = [];
  var store = 0;
  var success_count=0;
  var failure_count=0;
  var store_response = [];
  var message_data = req.body.data;
  console.log(message_data);
  //Query to get the data from database for a particular id
  var get_data_query = `SELECT * FROM articles where id=${message_data}`;
  con.connection.query(
    `UPDATE articles SET status='1' WHERE id = ${message_data}`
  );

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
    var tokens = [];
    for (var i = 0; i < result.length; i++) {
      tokens.push(result[i]["token"]);
    }

    var fcm_tokens = tokens.slice().reverse();
    //tokens = Array.from(tokens);
    let start = 0;
    len = tokens.length;
    let limit = 999;
    end = Math.ceil(len / limit);

    while (start < end) {
      var message = {
        registration_ids: tokens.slice(limit * start, (start + 1) * limit), // Multiple tokens in an array
        collapse_key: "Updates Available",
        content_available: true,

        notification: {
          title: article_data[0]["article_title"],
          body: article_data[0]["articlebody"],
          image: article_data[0]["article_img"],
        },

        data: {
          //you can send only notification or only data(or include both)
          article_id:message_data,
          notification_text: article_data[0]["article_notification_text"],
          article_main_source: article_data[0]["article_main_source"],
        },
      };
      async function makeRequest() {
        try {
          const result = JSON.parse(await push_notification(message));
          console.log("Resolved", result);
        } catch (error) {

          response = JSON.parse(error);
          //console.log(response);
          success_count+=response["success"]
          failure_count+=response["failure"]
          response_array = response["results"].slice().reverse();

          let i = 0;
          console.log(store);
          while (i < response_array.length) {
            if (response_array[i]["message_id"] != null) {
              // documents array
              store_response.push({
                notification_response: response_array[i]["message_id"],
                fcm_token: fcm_tokens[store],
              });
              store += 1;
            } else {
              // documents array
              store_response.push({
                notification_response: response_array[i]["error"],
                fcm_token: fcm_tokens[store],
              });
              store += 1;
            }
            i += 1;
          }
          //store+=1;
          console.log(store);

          //console.log("rejected",error);
        }
        if (store == tokens.length) {
          var store_notification_response = {
            article_id: message_data,
            success_count:success_count,
            failure_count:failure_count,
            article_response: store_response.reverse(),
          };
          NotificationResponseReport.collection.insertOne(
            store_notification_response,
            function (err, docs) {
              if (err) {
                return console.error("my error", err);
              } else {
                console.log("Multiple documents inserted to Collection");
              }
            }
          );
        }
      }

      makeRequest();

      console.log(
        "******************************************************************************"
      );
      start += 1;
    }

    res.render("index.ejs");
    //console.log(ids)
  });
}

function storeUser(req, res) {
  var sql =
    "INSERT INTO users (fuid, email, password, token) VALUES ('" +
    req.body.uid +
    "', '" +
    req.body.email +
    "', '" +
    req.body.password +
    "', '" +
    req.body.token +
    "')";
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
  notificationReport,
  notificationReportStats,
};