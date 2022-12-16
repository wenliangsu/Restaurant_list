// Section passport setting 
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  //initialize passport module (固定寫法)
  app.use(passport.initialize())
  app.use(passport.session())

  //set the local strategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash("warning_msg", 'This email is not registered')
          return done(null, false, { message: 'This email is not registered'})
        }

        if (user.password !== password) {
          req.flash("warning_msg", 'Email or Password is incorrect')
          return done(null, false, { message: 'Email or Password incorrect !'})
        }

        return done(null, user)
      })
  }))


  //set serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
   })

  passport.deserializeUser((id, done) => { 
    User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(error => done(error, null))
  })
}

