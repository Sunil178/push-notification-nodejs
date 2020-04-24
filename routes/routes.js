//import router from express
const express = require("express");
const router=express();
const pushController=require("../controllers/push_notification_controller");

//root route
//router.get("/", pushController.index);

router.post("/form", pushController.index);



module.exports=router;