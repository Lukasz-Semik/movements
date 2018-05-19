var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/',(req, res)=>{
  res.render("landing");
});
//===========
//AUTH ROUTES
//===========
//show register form:
router.get('/register',(req,res)=>{
  res.render('register');
})
//handle signup logic
router.post('/register', (req, res)=>{
  //res.send('Singing you up');
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if(err){
      //console.log(err);
      req.flash('error', err.message);
      return res.render("register");
    }
    passport.authenticate('local')(req, res, ()=>{
      req.flash('success', `Welcome to YieldCamp ${user.username}`);
      res.redirect('/campgrounds');
    })
  })
})

//===========
//LOGIN ROUTES
//===========
//show LOGIN
router.get('/login', (req, res)=>{
  res.render('login');
})
//app.post('/login', middleware, callback);
router.post('/login', passport.authenticate('local', {
  successRedirect: "/campgrounds",
  failureRedirect: '/login'
}), function(req, res){
})
//===========
//LOGOUT ROUTES
//===========
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success', 'Log you out');
  res.redirect('/campgrounds');
})

// function isLoggedIn(req,res,next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect('/login');
// }

module.exports = router;
