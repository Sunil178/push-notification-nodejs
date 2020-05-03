const mongoose = require('mongoose');
const moment =require('moment');
const Schema = mongoose.Schema;
const ArticleResponseSchema = new Schema({
    notification_response:{
        type: String,
    },
    fcm_token: {
        type: String,
    },
    date: {
        type: Date,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
});

module.exports = {
    "StoreResponseSchema":ArticleResponseSchema,
}