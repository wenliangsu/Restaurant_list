//Section set the variable
//連結資料庫
const db = require("../../config/mongoose");
//呼叫資料結構
const restaurantData = require("../restaurant");
//互叫原始餐廳資料
const restaurantOriginalList = require("./restaurant.json").results;

//Section connect the database

db.once("open", () => {
  console.log("Importing the original data...");
  restaurantData
    .create(restaurantOriginalList)
    .then(() => {
      console.log("All is  done!");
    })
    .catch((err) => console.log(err));
});
