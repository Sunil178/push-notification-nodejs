const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const ArticleResponseSchema = new Schema({
    article_id: {
        type: String,
    },
    success_count:{
        type: String,

    },
    failure_count:{
        type: String,
    },
    invalid_registration:{
        type: String,
    },
    not_registered:{
        type: String,
    },
    article_response:[{
        notification_response: {
            type: String,
        },
        fcm_token: {
            type: String,
        },
    }],
    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = {
    "StoreResponseSchema": ArticleResponseSchema,
}