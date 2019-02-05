// campgrounds routes

var express = require("express");
var router = express.Router({ mergeParams: true});
var middleware = require("../middleware");
var Campground = require("../models/campground");

// INDEX: show all campgrounds
// looks like we're going to / but really it's /comments/ because of our
// router stuff and app.use() in app.js
router.get("/", function(req, res) {
    Campground.find({}, function(error, allCampgrounds) {
       if (error) {
           console.log(error);
       } else {
           res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

// CREATE: add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form, add to campground model in db
    var author = { id: req.user._id, username: req.user.username };
    var newCampground = { name: req.body.name, image: req.body.image, 
        desc: req.body.desc, author: author };
    Campground.create(newCampground, function(error, newCampground) {
        if (error) {
            console.log(error);
        } else {
            // redirect back to campgrounds page
            console.log("created a new campground");
            console.log(newCampground);
            res.redirect("/campgrounds");
        }
    });
});

// NEW: show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW: show the page for a specific campground
// be sure to place this AFTER the /campgrounds/new route
router.get("/:id", function(req, res) {
    // find the campground, change its array of references to comments
    // to an array of actual comments, then run the same code as you did before
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        // if there's an error OR there's no campground with that ID
        if (error || !foundCampground) {
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground});
    });
});

// UPDATE
router.put("/:id", middleware.isCampgroundAuthor, function(req, res) {
    // find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
        if (error)
            res.redirect("/campgrounds");
        else
            res.redirect("/campgrounds/" + req.params.id);
    });
    
    // redirect somewhere (to show page)
});

// DESTROY
router.delete("/:id", middleware.isCampgroundAuthor, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(error) {
        if (error) {
            console.log("error in deleting");
            res.redirect("/campgrounds/" + req.params.id);
        } else
            res.redirect("/campgrounds");
    }); 
});

module.exports = router;