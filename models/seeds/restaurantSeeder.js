//Section set the variable
//呼叫暗碼套件
const bcrypt = require("bcryptjs");
//呼叫資料結構與User結構
const RestaurantData = require("../restaurant");
const User = require("../user");

//互叫餐廳以及User seed資料
const restaurantOriginalList = require("./restaurant.json").results;

const UserSeeder = require("./userSeeder1.json").results;

//連結資料庫
const db = require("../../config/mongoose");

//Section connect the database

db.once("open", () => {
  console.log("Importing the Seeds...");

  //notice return要寫的地方需要注意，否則會跑不出來
  Promise.all(
    UserSeeder.map((userInfo) => {
      // console.log(userInfo);
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(userInfo.password, salt))
        .then((hash) =>
          User.create({
            name: userInfo.name,
            email: userInfo.email,
            password: hash,
          })
        )
        .then((user) => {
          //篩選user1 and user2 的seed
          const restaurants = restaurantOriginalList.filter((data) => {
            return userInfo.restaurantId.includes(data.id);
          });
          //將兩個user的dat
          restaurants.forEach((data) => {
            data.userId = user._id;
          });
          return RestaurantData.create(restaurants);
        });
    })
  )
    .then(() => {
      console.log("done !");
      process.exit();
    })
    .catch((err) => console.log(err));
});
