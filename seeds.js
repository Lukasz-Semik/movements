var mongoose = require('mongoose');

var Campground = require('./models/campground');
var Comment = require('./models/comment');


var data = [
  {
    name: "Sea Camp",
    image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
    description: "Aenean vulputate facilisis vulputate. Nunc aliquet turpis et eros pretium, ut malesuada ex tristique. Curabitur luctus nulla ac malesuada porta. Donec nec aliquam est. Curabitur urna tellus, finibus sed sem sit amet, maximus imperdiet massa. Nunc id varius ante. Pellentesque imperdiet bibendum nisi at eleifend. Fusce id tristique leo. Maecenas a ante erat. Pellentesque tempor efficitur facilisis. Morbi bibendum lorem risus, quis sagittis mauris elementum vitae."
  },
  {
    name: "Mountain Camp",
    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
    description: "Aenean vulputate facilisis vulputate. Nunc aliquet turpis et eros pretium, ut malesuada ex tristique. Curabitur luctus nulla ac malesuada porta. Donec nec aliquam est. Curabitur urna tellus, finibus sed sem sit amet, maximus imperdiet massa. Nunc id varius ante. Pellentesque imperdiet bibendum nisi at eleifend. Fusce id tristique leo. Maecenas a ante erat. Pellentesque tempor efficitur facilisis. Morbi bibendum lorem risus, quis sagittis mauris elementum vitae."
  },
  {
    name: "Lake Camp",
    image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg",
    description: "Aenean vulputate facilisis vulputate. Nunc aliquet turpis et eros pretium, ut malesuada ex tristique. Curabitur luctus nulla ac malesuada porta. Donec nec aliquam est. Curabitur urna tellus, finibus sed sem sit amet, maximus imperdiet massa. Nunc id varius ante. Pellentesque imperdiet bibendum nisi at eleifend. Fusce id tristique leo. Maecenas a ante erat. Pellentesque tempor efficitur facilisis. Morbi bibendum lorem risus, quis sagittis mauris elementum vitae."
  }
];

//Za kazdym uruchomieniem serwera, wyczyscimy baze danych i dodamy campgroundy i commenty.
//chcemy eksportowac funkcje.
function seedDB(){
  //clean db
  Campground.remove({},(err)=>{ //przestajemy seedowac, bo zmienila nam sie struktura danych. teraz komenty maja w sobie takze usera!
    //zrobilismy jeden reset! Potem odlaczamy ten plik z app.js
    if(err){
      console.log(err);
    }else{
      console.log("removed campgrounds");
    }
    data.forEach((seed)=>{
      Campground.create(seed, (err, campground)=>{
        if(err){
          console.log(err);
        }else{
          console.log("added campgrounds");
          Comment.create({text: "This place is great, but I whis there was internet", author: "Homer"},
            (err, comment)=>{
              if(err){
                console.log(err);
              }else{
                campground.comments.push(comment);
                campground.save();
                console.log("new comment created");
              }
            }
          );
        }
      })
    })
  });
}

module.exports = seedDB;

//--------------TO NIE ZADZIALA, BO NIE MAMY PEWNOSCI
//CO SIE WYKONA JAKO PIERWSZE. DLATEGO WSADZIMY TO DO CALLBACKA, aby miec pewnosc,
//ze dodamy nowe dane po usunieciu!
// Campground.remove({},(err)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("removed campgrounds");
//   }
// });
// //ADD CAMPGROUNDS
// data.forEach((seed)=>{
//   Campground.create(seed, (err, data)=>{
//     if(err){
//       console.log(err);
//     }else{
//       console.log("added campgrounds");
//     }
//   })
// })
// //add a few comments:
// }
