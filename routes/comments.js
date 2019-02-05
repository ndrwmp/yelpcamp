// comments routes

var express = require("express");
// option mergeParams makes sure your parameters from previous templates
// are visible. ex: the { campground: campground } in previous templates
// that lead to this new comment template will be null unless this
// mergeParams option is set to true
var router = express.Router({ mergeParams: true }); 
var middleware = require("../middleware");
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});

// CREATE
router.post("", middleware.isLoggedIn, function(req, res) {
    // look up campground by id
    Campground.findById(req.params.id, function(error, campground) {
       if (error) {
           console.log(error);
           res.redirect("/campgrounds");
       } else {
           // create new comment
           Comment.create(req.body.comment, function(error, comment) {
               if (error) {
                   req.flash("error", "Something went wrong.");
               } else {
                   // add username and ID to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   
                   // associate the comment with the campground
                   campground.comments.push(comment);
                   campground.save();
                   console.log(comment);
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

// EDIT
// we don't actually need to do Campground.findById because we already have
// the ID due to our nested routes: it's stored in req.params.id
router.get("/:comment_id/edit", middleware.isCommentAuthor, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found.");
            return res.redirect("back");
        }
        
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            if (error || !foundComment) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
        });
    });
    
});

// UPDATE
router.put("/:comment_id", middleware.isCommentAuthor, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment) {
        if (error)
            res.direct("back");
        else
            res.redirect("/campgrounds/" + req.params.id);
    });
});

// DESTROY
router.delete("/:comment_id", middleware.isCommentAuthor, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(error) {
        if (error) {
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else
            res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;