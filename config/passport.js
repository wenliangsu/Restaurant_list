// Section passport setting 
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  //initialize passport module (固定寫法)
  app.use(passport.initialize())
  app.use(passport.session())

  //set the local strategy
  passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered'})
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Email or Password incorrect'})
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

