var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      //res.send("Edit campground route");
      //znajdz campground:
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          req.flash('error', "campground not found :(")
          res.redirect('/campgrounds');
        }else{
          //tu sprawdzamy, czy user jest wlascicielem tego campground:
          //foundCampground.author.id ==> TO JEST OBJEKT! gdybym oba te id dal na konsole, to wygladalyby tak samo!
          //req.uesr._id ==> to jest string!
          if(foundCampground.author.id.equals(req.user._id)){//ttaj mamy metode mongoosa
            //res.render('campgrounds/edit', {campground: foundCampground});
            next();
          }else{
            req.flash('error', 'you need to be owner of this campground!');
            //res.send("YoU DO NOT HAVE PERSMISSION TO DO THAT!");
            res.redirect('back');
          }
        }
      });
    }else{
      req.flash("error", "You need to be logged in");
      res.redirect('back'); //BACK! TO JEST WBUDOWANA KOMENDA, ODESLE USERA WCZESNIEJ GDZIE BYL.
    }
  }

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){//jest zapisany?user?
      //znajdz comment:
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect('/back');
        }else{
          //tu sprawdzamy, czy user jest wlascicielem tego coemmenta:
          //foundComment.author.id ==> TO JEST OBJEKT! gdybym oba te id dal na konsole, to wygladalyby tak samo!
          //req.uesr._id ==> to jest string!
          if(foundComment.author.id.equals(req.user._id)){//ttaj mamy metode mongoosa
            //res.render('campgrounds/edit', {campground: foundCampground});
            next();
          }else{
            //res.send("YoU DO NOT HAVE PERSMISSION TO DO THAT!");
            req.flash('error', 'This is not your comment');
            res.redirect('back');
          }
        }
      });
    }else{
      req.flash('error', 'You need to be logged in');
      res.redirect('back'); //BACK! TO JEST WBUDOWANA KOMENDA, ODESLE USERA WCZESNIEJ GDZIE BYL.
    }
  }

middlewareObj.isLoggedIn =   function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error', 'You need to be logged in to do that:()'); //daje nam mozliwosc do dostania sie. TO jeszcze nic nie pokazuje. To mowi, we flashu - dodaj tekst w nastepnym requscie.
    res.redirect('/login');
  }

module.exports = middlewareObj;

//moge zapisac tak:
/*module.exports = {

}*/
//lub przypisac do zmiennej
