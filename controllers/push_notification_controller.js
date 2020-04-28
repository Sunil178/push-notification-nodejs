//import mysql
const con = require("../connections/connection");
const {
  push_notification
} = require("../connections/notification");
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
var fs=require('fs');
function article(req, res) {
  //console.log(appRootPath);
  res.render("index.ejs");
}

function articleSubmit(req, res) {
  article_body = req.body.articlebody;
  article_title=req.body.article_title;
  fileName="img/"+req.body.file_name;
  console.log(fileName);
  console.log(req.files.article_img.data)
      
    if (fileName != undefined) {
      var path = appRootPath + fileName;
      console.log(path)
      flag = true
      fs.writeFile(path + "", req.files.article_img.data, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
  // connect to user database
  var sql = `INSERT INTO articles (article_title,articlebody,article_img) VALUES ('${article_title}','${article_body}','${fileName}')`;
  con.connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("index.ejs");
  });
}


var data = []

function articlesGet(req, res) {
  //Get all data from the table to display
  var get_query = "SELECT * FROM articles";
  con.connection.query(get_query, (err, result) => {
    if (err) throw err;
    data = result;
  });

  //console.log(data);
  res.render("viewarticles.ejs", {
    articles: data,
  });

}

function pushnotication(req, res) {
  message_data=req.body.data.split(",")

  var get_query = "SELECT token FROM users";
  con.connection.query(get_query, (err, result) => {
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
        title: message_data[0],
        body: message_data[1],
        image_url: message_data[2],
      },
      data: { //you can send only notification or only data(or include both)
        "Nick": "Mario",
        "Room": "PortugalVSDenmark"
      }
    };
    push_notification(message);

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