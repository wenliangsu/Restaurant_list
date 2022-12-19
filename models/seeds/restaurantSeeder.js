//Section set the variable
//呼叫暗碼套件
const bcrypt = require("bcryptjs");
//呼叫資料結構與User結構
const RestaurantData = require("../restaurant");
const User = require("../user");

//互叫餐廳以及User seed資料
const restaurantOriginalList = require("./restaurant.json").results;
//method (1) 使用
const UserSeeder = require("./userSeeder1.json").results;
// method (2) 使用
// const UserSeeder = require("./userSeeder2.json").results;

//連結資料庫
const db = require("../../config/mongoose");

//Section connect the database

db.once("open", () => {
  console.log("Importing the Seeds...");

  // Method (1)
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

  //   // !! Method (2) 使用for loop , (未解決, 似乎使用promise.all()需要用的是function, 會在for loop那邊卡住, )
  //   // UserSeeder.map((userInfo) => {
  //   //   // console.log(userInfo.password)
  //   //   bcrypt
  //   //     .genSalt(10)
  //   //     .then((salt) => bcrypt.hash(userInfo.password, salt))
  //   //     .then((hash) =>
  //   //       User.create({
  //   //         name: userInfo.name,
  //   //         email: userInfo.email,
  //   //         password: hash,
  //   //       })
  //   //     )

  //   //     .then((user) => {
  //   //       // console.log(user)
  //   //       const userName = user.name;
  //   //       const userId = user._id;
  //   //       for (let restaurantInfo of restaurantOriginalList) {
  //   //         // console.log(restaurantInfo)
  //   //         if (userName === "user1" && Number(restaurantInfo.id) <= 3) {
  //   //           RestaurantData.create({
  //   //             ...restaurantInfo,
  //   //             userId,
  //   //           });
  //   //         }
  //   //         if (
  //   //           userName === "user2" &&
  //   //           Number(restaurantInfo.id) > 3 &&
  //   //           Number(restaurantInfo.id) <= 6
  //   //         ) {
  //   //           RestaurantData.create({
  //   //             ...restaurantInfo,
  //   //             userId,
  //   //           });
  //   //         }
  //   //       }
  //   //     })

  //   //     .then(() => {
  //   //       console.log("done !");
  //   //       process.exit();
  //   //     })
  //   //     .catch((err) => console.log(err));
  //   // });
});
