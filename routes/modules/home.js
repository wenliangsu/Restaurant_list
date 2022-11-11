//Section Set the variable
const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//Section Routes setting
//todo read all the restaurant data
router.get("/", (req, res) => {
  const sortValue = req.query.sort;
  // console.log(sortValue)
  // 設立各個類型排序方式
  const sortOption = {
    "a-z": { name: "asc" },
    "z-a": { name: "desc" },
    category: { category: "asc" },
    location: { location: "asc" },
  };

  //note 透過triple-operator來讓初始畫面為正排序
  const sort = sortValue ? { [sortValue]: true } : { "a-z": true };


  Restaurant.find()
    .lean()
    .sort(sortOption[sortValue])
    .then((restaurantList) => res.render("index", { restaurantList, sort }))
    .catch((error) => console.log(error));
});

//todo set the route for search bar
router.get("/search", (req, res) => {
  //note 為了讓使用者知道自己搜尋的關鍵字為何，故多宣告一個變數可放在handlebars的input value裡面
  const keywordByUser = req.query.keyword;
  const keyword = req.query.keyword.toLowerCase().trim();

  Restaurant.find({})
    .lean()
    .then((restaurantsData) => {
      const filteredRestaurant = restaurantsData.filter((restaurants) => {
        return (
          restaurants.name.toLowerCase().includes(keyword) ||
          restaurants.category.toLowerCase().includes(keyword)
        );
      });
      if (!keywordByUser) {
        //未輸入關鍵字
        //note res.redirect可以返回指定的url
        res.redirect("/");
      } else if (filteredRestaurant.length === 0) {
        //未比對到搜尋結果
        res.render("searchNoFound");
      } else {
        //比對到後的結果
        res.render("index", {
          restaurantList: filteredRestaurant,
          keyword: keywordByUser,
        });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
