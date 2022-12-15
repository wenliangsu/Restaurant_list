//Section Set the variable
const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

//Section Routes setting
//todo create the new restaurant information(Create)
router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', (req, res) => {
  const newData = req.body;
  newData.userId = req.user._id

  //Method(1)使用save
  // //note 因傳進來的為一個物件，將其用展開運算子後，一個一個帶入
  // const newInfo = new Restaurant({ ...newData });
  // return newInfo
  //   .save()
  //   .then(() => res.redirect('/'))
  //   .catch((error) => {
  //     console.log(error);
  //     res.render('error', { error: error.message });
  //   });

  //Method(2) 直接建立create
  //notice 新增資料要注意所有的格式和名稱都要跟Schema一樣，不然會無法新增，增加了User認證後，無法使用save()來做，因為非增加新的instance
  Restaurant.create(newData)
    .then(() => res.redirect("/"))
    .catch((error) =>{
       console.log(error)
       res.render('error', { error: error.message})
      });
});

//todo the description of restaurant(Read)
router.get('/:id', (req, res) => {
  const userId = req.user._id
  
  // note 使用fineOne後，id要用_id， findById才會自動換成資料庫用的
  const _id = req.params.id;

  //note比對資料庫找出該使用者的資料
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantDetail) => {
      console.log(restaurantDetail)
      res.render('show', { restaurantDetail })
    })
    .catch((error) => {
      console.log(error);
      res.render('error', { error: error.message });
    });
});

//todo  edit the restaurant Info (Update)
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id

  const _id = req.params.id;
  return Restaurant.findOne({ _id, userId})
    .lean()
    .then((restaurantContent) => res.render('edit', { restaurantContent }))
    .catch((error) => {
      console.log(error);
      res.render('error', { error: error.message });
    });
});

//note 傳進來的req.body並未帶有_id，所以要在透過Object的方式將原先的物件內容整個替換掉新的並保留_id才可以讓mongoose替換新的
router.put('/:id', (req, res) => {
  const userId = req.user._id

  const _id = req.params.id;
  return Restaurant.findOne({ _id, userId})
    .then((restaurantEditedInfo) => {
      for (const [key, value] of Object.entries(req.body)) {
        restaurantEditedInfo[key] = value;
      }
      return restaurantEditedInfo.save();
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => {
      console.log(error);
      res.render('error', { error: error.message });
    });
});

//todo delete the restaurant information (Delete)
router.delete('/:id', (req, res) => {
  const userId = req.user._id

  const _id = req.params.id;

  return Restaurant.findOne({ _id, userId})
    .then((restaurantData) => restaurantData.remove())
    .then(() => res.redirect('/'));
});

module.exports = router;
