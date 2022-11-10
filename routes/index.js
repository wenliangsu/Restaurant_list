//Section Set the variable
//for server, framework and database｀
const express = require("express");
const router = express.Router();
//引入home.js
const home = require("./modules/home");
// 引入restaurants_edit
const restaurants = require("./modules/restaurants-edit");

//Section Router invoke
//路由模組
router.use("/", home);
router.use("/restaurants", restaurants);

//匯出路由器
module.exports = router;
