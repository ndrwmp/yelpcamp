var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all middleware goes here
var middlewareObj = {};

middlewareObj.isCampgroundAuthor = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, foundCampground) {
            // errors will not catch if the foundCampground returns null
            if (error || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // can't do === because foundCampground.author.id isn't a string
                // so it'll be comparing an object with a string, always returning false
                if (foundCampground.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "You must be the OP of this campground to edit or delete it");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

middlewareObj.isCommentAuthor = function(req, res, next) {
    // user logged in?
    if (req.isAuthenticated()) {
        // find the comment
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            // if there's an error or the comment wasn't found
            if (error || !foundComment) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                // if the logged-in user is the author of this comment, continue
                if (foundComment.author.id.equals(req.user._id))
                    next();
                // otherwise, send error message and redirect back
                else {
                    req.flash("error", "You must be the OP of this campground to edit or delete it");
                    res.redirect("back");
                }
            }
        });
    // require user to log in
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;