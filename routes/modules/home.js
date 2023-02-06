// Section Set the variable
const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// Section Routes setting

// Method operate the sort and search from mongoDB database
router.get('/', (req, res) => {
  const userId = req.user._id;
  const sortValue = req.query.sort;
  const sortOption = {
    'a-z': { name: 'asc' },
    'z-a': { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  };
  const sort = sortValue ? { [sortValue]: true } : { 'a-z': true };

  const keywordByUser = req.query.keyword ? req.query.keyword : '';

  Restaurant.find({
    userId,
    // note $or 來自官方文件，可以使用多種regular expression，可以搭配sort()同時使用。
    // note $regex為採用regular expression 用於資料搜尋，而$options可以設定＄regex的條件
    // note https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    $or: [
      { name: { $regex: keywordByUser, $options: '$i' } },
      { name_en: { $regex: keywordByUser, $options: '$i' } },
      { category: { $regex: keywordByUser, $options: '$i' } }
    ]
  })
    .lean()
    .sort(sortOption[sortValue])
    .then(restaurantList => {
      res.render('index', {
        restaurantList,
        keyword: keywordByUser,
        sort
      });
    })

    .catch(error => {
      console.log(error);
      res.render('error', { error });
    });
});

module.exports = router;
