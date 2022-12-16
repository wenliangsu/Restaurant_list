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
//引入modules的auth.js
const auth = require('./modules/auth')
//引入middleware 的auth.js
const { authenticator } = require('../middleware/auth')

//Section Router invoke
//路由模組
// note 注意擺放順序，條件越嚴格越要往上擺
router.use('/users', users)
router.use('/restaurants', authenticator, restaurants);
router.use('/auth', auth)
router.use('/', authenticator, home);


//匯出路由器
module.exports = router;
