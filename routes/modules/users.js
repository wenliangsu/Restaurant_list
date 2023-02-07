// Section Set the variable
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

// Section Routes setting

// todo 使用者登入驗證
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
);

// todo 註冊使用者資料
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email and password is required !!' });
    console.log(errors);
  }

  if (password !== confirmPassword) {
    errors.push({ message: 'The password is not matched by confirmPAssword' });
    console.log(errors);
  }

  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    });
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: 'This User is already registered !' });
      // keep the value from user
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      });
    }

    // create new user if it isn't registered (use hash table)
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/'))
      .catch(error => {
        console.log(error);
        res.render('error', { error: error.message });
      });
  });
});

// todo 使用者登出
router.get('/logout', (req, res, next) => {
  // note passport@0.6後 req.logout()改為asynchronous，所以放裡面等執行完在顯現flash
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You already logout successfully');
    res.redirect('/users/login');
  });
});

module.exports = router;
