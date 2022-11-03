//Section set the variable
const mongoose = require("mongoose");
//呼叫資料結構
const restaurantData = require("../restaurant");
//互叫原始餐廳資料
const restaurantOriginalList = require("../../restaurant.json").results;


//Section connect the database
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("mongoDB error");
});

db.once("open", () => {
  console.log("Importing the original data...");
  restaurantData.create(restaurantOriginalList)
    .then(() => {
      console.log("All is  done!");
    })
    .catch((err) => console.log(err));
});
