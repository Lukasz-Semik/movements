var express = require('express'),
    app = express(),
    bodyParser = require('body-parser')
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStartegy = require('passport-local');
//mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require ("./seeds");
var methodOverride = require('method-override');
var flash = require('connect-flash');


//zatrzymujemy seedowanie
//seedDB();

var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

app.use(flash());
//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "Once Again Training of the Authen",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Przeslanie danych o userze do wszystkich routow (tak aby ich nie przekazywac recznie w kazdym roucie)
app.use(function(req,res,next){ //to jest nasze middleware.
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error'); //wszystkie templatki beda mialy stad dostep do message z flasha
  res.locals.success = req.flash('success');
  next();
})

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true} ); //pamietaj, ze utaj takze tworzymy baze, jesli nie ma o takiej nazwie.
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(indexRoutes);

app.listen(3000, ()=>{
  console.log('Yield Camp server on 3000');
});

// app.listen(process.env.PORT, process.env.IP);
