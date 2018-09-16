var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//****MULTER CLOUDINARY INTEGRATION CODE
var multer = require('multer'); //require Multer
var storage = multer.diskStorage({ //configure storage and create a name for each image uploaded
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) { //filter uploaded files to only allow jpg, jpeg, png, gif
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter}) //create upload variable passing storage and filter

var cloudinary = require('cloudinary'); //require cloudinary
cloudinary.config({ 
  cloud_name: 'dxhg0to4b', //cloud name from our cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//*****

router.get("/", function(req, res){
   //Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds){
      if(err){
            console.log("Something went wrong!");
      } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});

      }
   });
});

//CREATE - add new campground to DB
//router.post("/", middleware.isLoggedIn, function(req,res){
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    //ORIGINAL CODE REPLACED WITH IAN's FOR IMAGE UPLOAD - SEE BELOW
//     //get data from form and add to campgruonds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
//     var newCampground = {name: name, image: image, description: desc, author:author, price:price};
//     // campgrounds.push(newCampground);
//     //Create a new campground and save to DB
//     Campground.create(newCampground, function(err, newlyCreated){
//       if(err){
//           console.log(err);
//       } else {
//             //redirect back to campgrounds page
//             res.redirect("/campgrounds");
//       }
//     });
// });

//REPLACING ORIGINAL CODE WITH IAN's for IMAGE UPLOAD - see https://github.com/nax3t/image_upload_example
    cloudinary.uploader.upload(req.file.path, function(result) { //pass in image from Multer above - 'req.file.path' is name of file
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url; //grabs the secure URL from cloudinary
      // add author to campground
      req.body.campground.author = { //set the author
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) { //pass in the req.body.campground
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id); //redirect back to this specific campground
      });
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});


//IMPORTANT: Variable routes must go last, lset outher routes be treated as variables!

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the coampground with teh proivded ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err || !foundCampground){
          req.flash("error", "Camground not found");
          res.redirect("back");
      }  else {
            //render show template with that coampground
            // console.log(foundCampground);
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
      }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", { campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res){
    //find and upadte the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(show page, so user can see changes)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;