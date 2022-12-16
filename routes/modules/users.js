//Section Set the variable
const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../../models/user')

//Section Routes setting

// todo 使用者登入驗證
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


// todo 註冊使用者資料
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then( user => {
      if (user) {
        console.log('This User is already registered')
        //keep the value from user
        res.render('register', { name, email, password, confirmPassword })
      } else {
        // create new user if it isn't registered
        return  User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(error => {
          console.log(error)
          res.render('error', { error: error.message })
        })
      }
    })
})

// todo 使用者登出
router.get('/logout', (req, res) => {
  // note passport@0.6後 req.logout()改為asynchronous，所以放裡面等執行完在顯現flash
    req.logout((err) => {
      if (err) { return next(err)}
      req.flash('success_msg', 'You already logout successfully')
      res.redirect('/users/login')
    })
})

module.exports = router
