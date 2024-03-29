// Section Set the variable
// for server, framework, kit and database｀
const express = require('express');
const session = require('express-session');
const usePassport = require('./config/passport');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');

// 引入express的路由器
const routes = require('./routes');
const app = express();

// note 這段要擺在port之前，因為moongose.js裡面有執行process.env，所以要比port早
// Database connection
require('./config/mongoose');

// server connection port
const port = process.env.PORT;

// Section Set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Section Static file, body-parser and method-override
// bootstrap, popper
app.use(express.static('public'));

// session處理
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// body-parser處理
app.use(express.urlencoded({ extended: true }));

// 路由的前置處理
app.use(methodOverride('_method'));

// 引入passport並傳入裡面所寫的apsep
usePassport(app);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  // 導入flash message
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});

// 將request導入路由器
// note 要先導入method-override 才可以導入route，因為由上而下的執行關係
app.use(routes);

// Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
