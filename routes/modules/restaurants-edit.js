//Section Set the variable
const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//Section Routes setting
//todo create the new restaurant information(Create)
router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/", (req, res) => {
  //Method(1)使用save
  const newData = req.body;
  //note 因傳進來的為一個物件，將其用展開運算子後，一個一個帶入
  const newInfo = new Restaurant({ ...newData });
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
router.get("/:id", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantDetail) => res.render("show", { restaurantDetail }))
    .catch((error) => console.log(error));
});

//todo  edit the restaurant Info (Update)
router.get("/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantContent) => res.render("edit", { restaurantContent }))
    .catch((error) => console.log(error));
});

//note 傳進來的req.body並未帶有_id，所以要在透過Object的方式將原先的物件內容整個替換掉新的並保留_id才可以讓mongoose替換新的
router.put("/:id", (req, res) => {
  const restaurantId = req.params.id;
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

//todo delete the restaurant information (Delete)
router.delete("/:id", (req, res) => {
  const restaurantId = req.params.id;

  return Restaurant.findById(restaurantId)
    .then((restaurantData) => restaurantData.remove())
    .then(() => res.redirect("/"));
});

module.exports = router;
