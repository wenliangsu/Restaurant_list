//Section Set the variable and connect the database
//for server, framework and database｀
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

//connect the database
const mongoose = require("mongoose");

//note非正式環境時使用dotenv
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

//invoke the list of data
const restaurantList = require("./restaurant.json").results;

//server connection port
const port = 3000;

//Section Set template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Section Static file
app.use(express.static("public"));

//Section Routes setting
//todo set the route to list
app.get("/", (req, res) => {
  res.render("index", { restaurantList: restaurantList });
});

//todo set the route to the description of restaurant(params)
app.get("/restaurants/:restaurant_id", (req, res) => {
  // console.log(req.params.restaurant_id);
  const restaurantInfo = restaurantList.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  );

  // console.log(restaurantInfo);

  res.render("show", { restaurantInfo });
});

//todo set the route for search bar
app.get("/search", (req, res) => {
  // console.log(req.query.keyword)
  //note 為了讓使用者知道自己搜尋的關鍵字為何，故多宣告一個變數可放在handlebars的input value裡面
  const keywordByUser = req.query.keyword;
  const keyword = req.query.keyword.toLowerCase().trim();
  const filteredRestaurant = restaurantList.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
    );
  });

  // console.log(filteredRestaurant)

  if (!keywordByUser) {
    //未輸入關鍵字
    //note res.redirect可以返回指定的url
    res.redirect("/");
  } else if (filteredRestaurant.length === 0) {
    //未比對到搜尋結果
    res.render("search");
  } else {
    //比對到後的結果
    res.render("index", {
      restaurantList: filteredRestaurant,
      keyword: keywordByUser,
    });
  }
});

//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
