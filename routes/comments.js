var express = require('express');
var router = express.Router({mergeParams: true}); //scala params z campgrounds i comments, dzieki czemu mamy dostep tutaj do id.
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
//UWAGA! usuwamy stad fragmeny routow (samych adresow), ze wzgledu na wstawienie tych
//fragmentow w app.js w app.use(rout...);

//===============================================
//COMENTS ROUTS
//===============================================
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground});
    }
  });
  //res.send("This will be the comment form!");
})

router.post("/", middleware.isLoggedIn, (req, res)=>{
  //find campground using ID
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      //console.log(err);
      res.redirect("/campgrounds");
    }else{//tutaj uzywamy drugiej strategii pobierania danych z name, z formularza.Mamy tam comment[text]
      //console.log(req.body.comment);
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          req.flash('error', 'Something went wrong:(');
          //console.log(err);
        }else{
          //add username and id to comments
          //przypisanie wartosci z bazy danych, pierwszy sposo:
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //console.log("new comment usernem will be:" + req.user.username);
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          //console.log(comment);
          //odsylamy do campgrounds/:id
          req.flash('success', 'Succesfully added comment');
          res.redirect(`/campgrounds/${campground._id}`);
        }
      })
    }
  })
  //create new comments
  //connect new comment to campground
  //redirect to campground show page.
})

//comments edit rout --> SHOW THE FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
  //res.send('hej');
  Comment.findById(req.params.comment_id, (err, foundComment)=>{
    if(err){
      res.redirect('back');
    }else{
      //w roucie mamy juz id campgroundu (tylko mamy napisany ten skrot w app js.)
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
})

//comment update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  //res.send("you hit update rout for comment!")
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
    if(err){
      res.redirect('back');
    }else{
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  //find by idand remove
  //res.send("this is the destroy comment route!");
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect('back')
    }else{
      req.flash('success', 'You deleted the comment');
      res.redirect(`/campgrounds/${req.params.id}`)//tutaj id odnosi sie do campgroundowego id!;
    }
  })
});

module.exports = router;
