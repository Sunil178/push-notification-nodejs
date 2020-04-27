//import router from express
const express = require("express");
const router = express();
const pushController = require("../controllers/push_notification_controller");

//Root route
router.get("/", pushController.article);

//Form submit route
router.post("/", pushController.articleSubmit);

router.get("/article", pushController.articlesGet);

router.post("/pushnotication", pushController.pushnotication);

router.post("/api/store-data", pushController.storeUser);

module.exports = router;