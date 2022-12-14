//Section Set the variable
//for server, framework and database｀
const express = require('express');
const router = express.Router();
//引入home.js
const home = require('./modules/home');
// 引入restaurants_edit
const restaurants = require('./modules/restaurants-edit');
//引入users.js
const users = require('./modules/users')

//Section Router invoke
//路由模組
router.use('/', home);
router.use('/restaurants', restaurants);
router.use('/users', users)

//匯出路由器
module.exports = router;
