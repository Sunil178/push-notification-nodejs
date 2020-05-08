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
var a = [];

function article(req, res) {
  //   for (let index = 0; index < 5000; index++) {

  //     a.push(['fuid1234321hufebd','','','eKxlBWgpi3g:APA91bFJcZcCTP6H_jNyxQMsxHZmbEuAli822VSdQ9Xq1WJk774IFZx0kfNbt87xw7jU85MCYm6zWwDz3GpTPlFGWTsnY7WMVNYbcJk1-oPgeSNQ0yOrRkpME62fBxFRUM3J1VSZ3LII'])

  //   }
  // var sql = `INSERT INTO users (fuid,email,password,token) VALUES ?`;
  // con.connection.query(sql, [a],(err, result) => {
  //   if (err) {
  //     res.send(err);
  //   }
  //   console.log("Inserted Succesfully!!")
  // });
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
  var sql = `INSERT INTO articles (article_heading,article_summary,article_image,notification_text,main_source) VALUES ('${article_title}','${article_body}','${article_img_url}','${article_notification_text}','${article_main_source}')`;
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
  con.connection.query(get_query, async (err, result) => {
    if (err) res.send(err);
    data = await result;
  });
  res.render("viewarticles.ejs", {
    articles: data.slice(0, 15),
  });
}

function scroll_articles(req, res) {
  var response = [];
  start_index = Number(req.params.id);
  //console.log("hii",start_index);

  var get_query = "SELECT * FROM articles";
  con.connection.query(get_query, async (err, result) => {
    if (err) response["status"] = "error";
    else {
      data = await result;
    }
  });
  res.send(JSON.stringify(data.slice(start_index + 1, start_index + 10)));
}
var notification_send_report = [];

function notificationReport(req, res) {
  var get_data_query = `SELECT * FROM articles where status='1'`;
  con.connection.query(get_data_query, async (err, result) => {
    if (err) res.send(err);
    //article_data = await result;
    notification_send_report = [];
    await result.forEach((element) => {
      NotificationResponseReport.find({
          article_id: element["id"]
        },
        (err, docs) => {
          //  console.log(docs[0]['article_response']);
          if (docs.length != 0) {
            //notification_send_report.push(element['id']);
            notification_send_report.push({
              article_id: element["id"],
              article_title: element["article_heading"],
              success_count: docs[0]["success_count"],
              failure_count: docs[0]["failure_count"],
              invalid_registration: docs[0]["invalid_registration"],
              not_registered: docs[0]["not_registered"],
            });
          }
        }
      );
    });
  });

  res.render("notification_report.ejs", {
    notification_report: notification_send_report,
  });
}

var notification_report_stats = [];
var users_info = [];

function notificationReportStats(req, res) {
  NotificationResponseReport.find({
      article_id: req.params.id
    },
    (err, docs) => {
      notification_report_stats = [];
      users_info = [];
      if (err) res.send(err);

      notification_report_stats = docs[0]["article_response"];
      var get_data_query = `SELECT * FROM users`;
      con.connection.query(get_data_query, async (err, result) => {
        if (err) res.send(err);
        users_info = result;
        //console.log(result);
      });
      // console.log(docs[0]["article_response"].forEach(element=>{
      //     notification_report_stats.push({

      //     });
      // console.log(element['fcm_token'])
      // }));
    }
  );

  res.render("notification_report_stats.ejs", {
    notification_stats: notification_report_stats,
    users_info,
  });
}

function pushnotication(req, res) {
  var article_data = [];
  var store = 0;
  var invalid_registration_count = 0;
  var not_registered_count = 0;

  var success_count = 0;
  var failure_count = 0;
  var store_response = [];
  var message_data = req.body.data;
  
  
  //Query to get the data from database for a particular id
  var get_data_query = `SELECT * FROM articles where id=${message_data}`;

  // Update Query for status
  con.connection.query(
    `UPDATE articles SET status='1' WHERE id = ${message_data}`
  );

  con.connection.query(get_data_query, (err, result) => {
    if (err) res.send(err);
    article_data = result;
  });

  //To wait until query gets executed
  var get_query = "SELECT token FROM users";
  var tokens = [];

  function get_tokens_query(){
    return new Promise((resolve, reject) => {
    con.connection.query(get_query, (err, result) => {
    
    if (err) {
      return reject(err);
    }
    return resolve(result);
    
  });
});
}
(async () => {
  try{  
  const result = await get_tokens_query();

  //Sending the data to multiple users
  for (var i = 0; i < result.length; i++) {
    // if(!tokens.includes(result[i]["token"])){
    //   tokens.push(result[i]["token"]);
    // }
    tokens.push(result[i]["token"]);

  }
  tokens=Array.from(new Set(tokens));
  var fcm_tokens = tokens.slice().reverse();
  let start = 0;
  var len = tokens.length;
  //len = 5
  let limit = 5;
  end = Math.ceil(len / limit);

  while (start < end) {
    var message = {
      registration_ids: tokens.slice(limit * start, (start + 1) * limit), // Multiple tokens in an array
      collapse_key: "Updates Available",
      content_available: true,

      notification: {
        title: article_data[0]["article_heading"],
        body: article_data[0]["notification_text"],
        image: article_data[0]["article_image"],
      },
      data: {
        //you can send only notification or only data(or include both)
        article_id: message_data,
        article_main_source: article_data[0]["main_source"],
      },
    };
    async function makeRequest() {
      try {
        const result = await push_notification(message);
        //console.log("Resolved", result);
        response = JSON.parse(result);

        success_count += response["success"];
        failure_count += response["failure"];
        response_array = response["results"].slice().reverse();
        console.log("success", response);
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
          }
          i += 1;
        }
        //store+=1;
      } catch (error) {
        response = JSON.parse(error);
        //console.log(response);
        success_count += response["success"];
        failure_count += response["failure"];
        response_array = response["results"].slice().reverse();
        console.log("error", response);
        let i = 0;

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
            if (response_array[i]["error"] == "InvalidRegistration") {
              invalid_registration_count += 1;
              store_response.push({
                notification_response: response_array[i]["error"],
                fcm_token: fcm_tokens[store],
              });
            } else {
              not_registered_count += 1;
              store_response.push({
                notification_response: response_array[i]["error"],
                fcm_token: fcm_tokens[store],
              });
            }

            store += 1;
          }
          i += 1;
        }
        //store+=1;
      }
      if (store == len) {
        var store_notification_response = {
          article_id: message_data,
          success_count: success_count,
          failure_count: failure_count,
          invalid_registration: invalid_registration_count,
          not_registered: not_registered_count,
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
    console.log("******************************************************************************");
    start += 1;
  }

  }

  catch(err){
    console.log(err)
  }
})();

res.send(JSON.stringify("Succesfully sent the data"));

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
  scroll_articles,
};