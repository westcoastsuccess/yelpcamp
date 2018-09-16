var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
      {
         name:          "Clouds Rest",
         image:         "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=aaf08554d638e2690a4383bf1c632d93&auto=format&fit=crop&w=400&q=60",
         description:   "Spicy jalapeno bacon ipsum dolor amet tenderloin salami shank pig in, landjaeger cillum kielbasa short ribs. Sint tongue excepteur nisi, andouille ad qui shank. Tempor tail esse, frankfurter commodo aliquip in ea quis hamburger nulla swine. Boudin dolor aliqua shoulder laboris ribeye laborum pig sed brisket officia frankfurter pastrami. Bresaola meatloaf enim laborum, capicola swine velit frankfurter cow jowl kielbasa. Qui velit nulla drumstick. Cillum dolor tri-tip short ribs sunt, qui consequat pig ut ribeye."  
      },        {
         name:          "Desert Mesa",
         image:         "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
         description:   "Spicy jalapeno bacon ipsum dolor amet tenderloin salami shank pig in, landjaeger cillum kielbasa short ribs. Sint tongue excepteur nisi, andouille ad qui shank. Tempor tail esse, frankfurter commodo aliquip in ea quis hamburger nulla swine. Boudin dolor aliqua shoulder laboris ribeye laborum pig sed brisket officia frankfurter pastrami. Bresaola meatloaf enim laborum, capicola swine velit frankfurter cow jowl kielbasa. Qui velit nulla drumstick. Cillum dolor tri-tip short ribs sunt, qui consequat pig ut ribeye."  
      },        {
         name:          "Canyon Floor",
         image:         "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg",
         description:   "Spicy jalapeno bacon ipsum dolor amet tenderloin salami shank pig in, landjaeger cillum kielbasa short ribs. Sint tongue excepteur nisi, andouille ad qui shank. Tempor tail esse, frankfurter commodo aliquip in ea quis hamburger nulla swine. Boudin dolor aliqua shoulder laboris ribeye laborum pig sed brisket officia frankfurter pastrami. Bresaola meatloaf enim laborum, capicola swine velit frankfurter cow jowl kielbasa. Qui velit nulla drumstick. Cillum dolor tri-tip short ribs sunt, qui consequat pig ut ribeye."  
      },  
   ];
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
      if(err){
          console.log(err);
      } else {
          console.log("removed campgrounds!");
          Comment.remove({}, function(err){
             if(err){
                console.log(err);
             }
             console.log("removed comments!");
         //Add a few campgrounds
         //data - var from above; see - new var for that particular piece of data from seed
         data.forEach(function(seed){
            //pass in the particular campground (seed)
            Campground.create(seed, function(err, campground){
               if(err){
                  console.log(err);
               } else {
                  console.log("added a campground");
                  //Create a comment (all the same, but doesn't matter for testing purposes)
                  Comment.create(
                     {
                        text:    "This place is great, but wish they had internet",
                        author:  "Homer"
                     }, function(err, comment){
                           if(err){
                              console.log("Couldn't create a comment: " + err);
                           } else {
                              //associate the comment to the campground and then save to DB
                              campground.comments.push(comment);
                              campground.save();
                              console.log("Created new comment");
                           }
                     });
               }
            });
         });
      });
   }
});
  
   
   //Add a few comments
}

module.exports = seedDB;