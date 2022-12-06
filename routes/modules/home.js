//Section Set the variable
const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//Section Routes setting
//Method (1) 將search and sort 功能分開
// //todo read all the restaurant data
// router.get("/", (req, res) => {
//   const sortValue = req.query.sort;
//   // console.log(sortValue)
//   // 設立各個類型排序方式
//   const sortOption = {
//     "a-z": { name: "asc" },
//     "z-a": { name: "desc" },
//     category: { category: "asc" },
//     location: { location: "asc" },
//   };

//   //note 透過triple-operator來讓初始畫面為正排序
//   const sort = sortValue ? { [sortValue]: true } : { "a-z": true };

//   Restaurant.find()
//     .lean()
//     .sort(sortOption[sortValue])
//     .then((restaurantList) => res.render("index", { restaurantList, sort }))
//     .catch((error) => {
//       console.log(error);
//       res.render("error", { error });
//     });
// });

// //todo set the route for search bar
// router.get("/search", (req, res) => {
//   //note 為了讓使用者知道自己搜尋的關鍵字為何，故多宣告一個變數可放在handlebars的input value裡面
//   const keywordByUser = req.query.keyword;
//   const keyword = req.query.keyword.toLowerCase().trim();
// console.log(keyword)
//   Restaurant.find({})
//     .lean()
//     .then((restaurantsData) => {
//       const filteredRestaurant = restaurantsData.filter((restaurants) => {
//         return (
//           restaurants.name.toLowerCase().includes(keyword) ||
//           restaurants.category.toLowerCase().includes(keyword)
//         );
//       });
//       if (!keywordByUser) {
//         //未輸入關鍵字
//         //note res.redirect可以返回指定的url
//         res.redirect("/");
//       } else if (filteredRestaurant.length === 0) {
//         //未比對到搜尋結果
//         res.render("searchNoFound");
//       } else {
//         //比對到後的結果
//         res.render("index", {
//           restaurantList: filteredRestaurant,
//           keyword: keywordByUser,
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.render("error", { error });
//     });
// });

//Method (2) 將search and sort整合一起(注意hbs裡面需要更動的路徑，像是noFound and index)

//todo search and sort for restaurant
// router.get("/", (req, res) => {
//   const reqValue = req.query;

//   if (reqValue.keyword) {
//     const keywordByUser = reqValue.keyword;
//     const keyword = reqValue.keyword.toLowerCase().trim();
//     console.log(reqValue)
//     Restaurant.find({})
//       .lean()
//       .sort()
//       .then((restaurantsData) => {
//         const filteredRestaurant = restaurantsData.filter((restaurants) => {
//           return (
//             restaurants.name.toLowerCase().includes(keyword) ||
//             restaurants.category.toLowerCase().includes(keyword)
//           );
//         });
//         if (!keywordByUser) {
//           //未輸入關鍵字
//           //note res.redirect可以返回指定的url
//           res.redirect("/");
//         } else if (filteredRestaurant.length === 0) {
//           //未比對到搜尋結果
//           res.render("searchNoFound");
//         } else {
//           //比對到後的結果
//           res.render("index", {
//             restaurantList: filteredRestaurant,
//             keyword: keywordByUser,
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         res.render("error", { error });
//       });
//   } else {
//     const sortValue = reqValue.sort;
//     console.log(reqValue);
//     // 設立各個類型排序方式
//     const sortOption = {
//       "a-z": { name: "asc" },
//       "z-a": { name: "desc" },
//       category: { category: "asc" },
//       location: { location: "asc" },
//     };

//     //note 透過triple-operator來讓初始畫面為正排序
//     const sort = sortValue ? { [sortValue]: true } : { "a-z": true };

//     Restaurant.find()
//       .lean()
//       .sort(sortOption[sortValue])
//       .then((restaurantList) => res.render("index", { restaurantList, sort }))
//       .catch((error) => {
//         console.log(error);
//         res.render("error", { error });
//       });
//   }
// });

// //Method (3) refactor the feature from Method (2)
// router.get("/", (req, res) => {
//   const sortValue = req.query.sort;
//   const sortOption = {
//     "a-z": { name: "asc" },
//     "z-a": { name: "desc" },
//     category: { category: "asc" },
//     location: { location: "asc" },
//   };
//   const sort = sortValue ? { [sortValue]: true } : { "a-z": true };

//   const keywordByUser = req.query.keyword;

//   Restaurant.find()
//     .lean()
//     .sort(sortOption[sortValue])
//     .then((restaurantList) => {
//       const filteredRestaurant = restaurantList.filter((restaurants) => {
//         return (
//           restaurants.name.toLowerCase().includes(keywordByUser) ||
//           restaurants.category.toLowerCase().includes(keywordByUser)
//         );
//       });
//       if (!keywordByUser) {
//         //未輸入關鍵字
//         res.render("index", { restaurantList, sort });
//       } else if (filteredRestaurant.length === 0) {
//         //未比對到搜尋結果        console.log(2)
//         res.render("searchNoFound");
//       } else {
//         //比對到後的結果
//         res.render("index", {
//           restaurantList: filteredRestaurant,
//           keyword: keywordByUser,
//           sort,
//         });
//       }
//     })

//     .catch((error) => {
//       console.log(error);
//       res.render("error", { error });
//     });
// });

//Method (4) operate the sort and search from mongoDB database
router.get("/", (req, res) => {
  const sortValue = req.query.sort;
  const sortOption = {
    "a-z": { name: "asc" },
    "z-a": { name: "desc" },
    category: { category: "asc" },
    location: { location: "asc" },
  };
  const sort = sortValue ? { [sortValue]: true } : { "a-z": true };

  const keywordByUser = req.query.keyword ? req.query.keyword : ""

  Restaurant.find({
    //note $or 來自官方文件，可以使用多種regular expression，可以搭配sort()同時使用。
    // note $regex為採用regular expression 用於資料搜尋，而$options可以設定＄regex的條件
    // note https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    $or: [
      { name: { $regex: keywordByUser, $options: "$i" } },
      { name_en: { $regex: keywordByUser, $options: "$i" } },
      { category: { $regex: keywordByUser, $options: "$i" } },
    ],
  })
    .lean()
    .sort(sortOption[sortValue])
    .then((restaurantList) => {
      res.render("index", {
        restaurantList,
        keyword: keywordByUser,
        sort,
      });
    })

    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});





module.exports = router;
