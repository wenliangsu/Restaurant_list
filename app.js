//Section Set the variable
//for server, framework and database｀
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const Restaurant = require("./models/restaurant");
//invoke the list of data
const restaurantList = require("./restaurant.json").results;

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

//Section Static file
app.use(express.static("public"));

//Section Routes setting
//todo read all the restaurant data
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurantList) => res.render("index", { restaurantList }))
    .catch((error) => console.log(error));
});



//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
