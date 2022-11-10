//Section Set the variable
//for server, framework, kit and database｀
const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
// 引入路由器
const routes = require("./routes");
const app = express();
//server connection port
const port = 3000;

//Section Database setting and connection
//set the variable
const mongoose = require("mongoose");

//note 非正式環境時使用dotenv
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//note 可直接使用mongoDB的連線位址: mongoose.connect('<mongoDB的連線url>')
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
//database connect status
db.on("error", () => {
  console.log("mongoDB error");
});
db.once("open", () => {
  console.log("mongoDB connected!");
});

//Section Set template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Section Static file, body-parser and method-override
//bootstrap, popper
app.use(express.static("public"));

//body-parser處理
app.use(express.urlencoded({ extended: true }));

//路由的前置處理
app.use(methodOverride("_method"));

//將request導入路由器
//note 要先導入method-override 才可以導入route，因為由上而下的執行關係
app.use(routes);

//Section Routes setting
// !!已搬移至routes獨立分開

//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
