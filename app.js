//Section Set the variable
//for server, framework, kit and database｀
const express = require('express');
const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
// 引入路由器
const routes = require('./routes');
const app = express();
//server connection port
const port = 3000;

//Section Database setting and connection
//!!連線指令已搬移至config中

//Connect the database
require('./config/mongoose');

//Section Set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Section Static file, body-parser and method-override
//bootstrap, popper
app.use(express.static('public'));

//session處理
app.use(session({
  secret: 'WenProject',
  resave: false,
  saveUninitialized: true
}))

//body-parser處理
app.use(express.urlencoded({ extended: true }));

//路由的前置處理
app.use(methodOverride('_method'));

//引入passport並傳入裡面所寫的apsep
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

//將request導入路由器
//note 要先導入method-override 才可以導入route，因為由上而下的執行關係
app.use(routes);

//Section Routes setting
// !!已搬移至routes獨立分開

//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
