var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');//nie musimy dawac index - od razu bierze index. jak zawsze.
//UWAGA! usuwamy stad fragmeny routow (samych adresow), ze wzgledu na wstawienie tych
//fragmentow w app.js w app.use(rout...);


//REST - INDEX ROUT! SHOW ALL campgrounds
  //Get all campgrounds from db.
router.get('/', (req,res)=>{
  //console.log(req.user);
  Campground.find({}, (err, allCampgrounds)=>{ //pamietaj, ze argumenty w callbackach nazywamy jak chcemy
    if(err){
      console.log(err);
    }else{//                                                                      tu juz bysmy nie potrzebowali, currentUser, bo mamy middleware. ale zostawiam ku pamieci!
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});//to rpzesyla takze do headera i footera, ale muze to przeslac takze do innych routow, zeby zawsze dzialalo.
    }
  })
});

//REST- CREATE ROUT add new campground to dB
//te same api dla get i post to podazanie za REST konwencja
router.post("/", middleware.isLoggedIn, (req, res)=>{//pamietaj tu o tym skrocie, ktory napisalismy w app.js
  //res.send("You hit the post rout!");
  //get data from form and add to campgrounds array
  //przyisanie wartosci z formularza!!!!!!
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  //przypisanie wartosci z bazy danych, drugi sposo:
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name, image, description, author};
  //console.log(req.user);
  //przypisanie wartosci z bazy danych, drugi sposo ciag dalszy
  //Create new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated)=>{ //w calbacku jest juz dana z bazy
    if(err){
      console.log(err);
    }else{
        console.log(newlyCreated);
        res.redirect("/campgrounds");
    }
  })
  //campgrounds.push(newCampground); to bylo wstawianie do testowej tablicy, jeszcze bez db.
  //redirect back to campgrounds page.
});

//REST = NEW - show form to create new campground!
//ten url to tez jest REST konwencja
router.get("/new", middleware.isLoggedIn, (req,res)=>{
  res.render("campgrounds/new");
});

//REST = SHOW, shows more info about one camp
router.get('/:id', (req, res)=>{
  //find the campground with provided ID
  //mongoos:
  Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground)=>{
    if(err){
      console.log(err);
    }else {
      //console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//NA DOLE WERSJA PRZED MIDDLEWARE:
//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, (req, res)=>{
  //find and update and redirect (show page)

  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  })
})

//DESTROY CAMPGROUND ROUTE:
router.delete('/:id', middleware.checkCampgroundOwnership, (req,res)=>{
  //res.send("YOU ARE TRYING TO DELETE SOMETHING");
  Campground.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  })
})




module.exports = router;

// //EDIT CAMPGROUND ROUTE
// router.get('/:id/edit', (req,res)=>{
//   //if user logged in? if yes-> does user own the campground? If not, redirect.
//   if(req.isAuthenticated()){
//     //res.send("Edit campground route");
//     //znajdz campground:
//     Campground.findById(req.params.id, function(err, foundCampground){
//       if(err){
//         res.redirect('/campgrounds');
//       }else{
//         //tu sprawdzamy, czy user jest wlascicielem tego campground:
//         //foundCampground.author.id ==> TO JEST OBJEKT! gdybym oba te id dal na konsole, to wygladalyby tak samo!
//         //req.uesr._id ==> to jest string!
//         if(foundCampground.author.id.equals(req.user._id)){//ttaj mamy metode mongoosa
//           res.render('campgrounds/edit', {campground: foundCampground});
//         }else{
//           res.send("YoU DO NOT HAVE PERSMISSION TO DO THAT!");
//         }
//       }
//     });
//   }else{
//     console.log("You need to be logged in to do that");
//     res.send("You need to be logged in to do that");
//   }
// })
