//Section Set the variable
//for server, framework and database｀
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const Restaurant = require("./models/restaurant");
//invoke the list of data
// const restaurantList = require("./restaurant.json").results;

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

//Section Static file and body-parser
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

//Section Routes setting
//todo read all the restaurant data
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurantList) => res.render("index", { restaurantList }))
    .catch((error) => console.log(error));
});

//todo create the new restaurant information(Creat)
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

app.post("/restaurants", (req, res) => {
  //Method(1)使用save
  const newData = req.body;
  // console.log(newData)
  //note 因傳進來的為一個物件，將其用展開運算子後，一個一個帶入
  const newInfo = new Restaurant({ ...newData });
  console.log(newInfo);
  return newInfo
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));

  //Method(2) 直接建立create
  // Restaurant.create(req.body)
  //   .then(() => res.redirect("/"))
  //   .catch((error) => console.log(error));
});

//todo the description of restaurant(Read)
app.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;
  // console.log(restaurantId);
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantDetail) => res.render("show", { restaurantDetail }))
    .catch((error) => console.log(error));
});

//todo  edit the restaurant Info (Update)
app.get("/restaurants/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  // console.log(restaurantId);
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantContent) => res.render("edit", { restaurantContent }))
    .catch((error) => console.log(error));
});

//note 傳進來的req.body並未帶有_id，所以要在透過Object的方式將原先的物件內容整個替換掉新的並保留_id才可以讓mongoose替換新的
app.post("/restaurants/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  // console.log(req.body)
  return Restaurant.findById(restaurantId)
    .then((restaurantEditedInfo) => {
      for (const [key, value] of Object.entries(req.body)) {
        restaurantEditedInfo[key] = value;
      }
      return restaurantEditedInfo.save();
    })
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch((error) => console.log(error));
});

//todo delete the restaurant information
app.post("/restaurants/:id/delete", (req, res) => {
  const restaurantId = req.params.id;
  // console.log(req.body)
  return Restaurant.findById(restaurantId)
    .then((restaurantData) => restaurantData.remove())
    .then(() => res.redirect("/"));
});

//!!以下尚未完成
// //todo set the route for search bar
// app.get("/search", (req, res) => {
//   // console.log(req.query.keyword)
//   //note 為了讓使用者知道自己搜尋的關鍵字為何，故多宣告一個變數可放在handlebars的input value裡面
//   const keywordByUser = req.query.keyword;
//   const keyword = req.query.keyword.toLowerCase().trim();
//   const filteredRestaurant = restaurantList.filter((restaurant) => {
//     return (
//       restaurant.name.toLowerCase().includes(keyword) ||
//       restaurant.category.toLowerCase().includes(keyword)
//     );
//   });

//   // console.log(filteredRestaurant)

//   if (!keywordByUser) {
//     //未輸入關鍵字
//     //note res.redirect可以返回指定的url
//     res.redirect("/");
//   } else if (filteredRestaurant.length === 0) {
//     //未比對到搜尋結果
//     res.render("search");
//   } else {
//     //比對到後的結果
//     res.render("index", {
//       restaurantList: filteredRestaurant,
//       keyword: keywordByUser,
//     });
//   }
// });

//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
