const mongoose = require('mongoose');
const moment=require('moment');
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
    article_response: {
        type: String,
    },
    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
});

module.exports = mongoose.model('Article', ArticleSchema);