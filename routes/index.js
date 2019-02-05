// index/authorization routes

var express = require("express");
var router = express.Router({ mergeParams: true});
var User = require("../models/user");
var middleware = require("../middleware");
var passport = require("passport");

// ========================= ROOT ROUTE =========================
router.get("/", function(req, res) {
   res.render("landing"); 
});

// ========================= AUTH ROUTES =========================

// show registration form
router.get("/register", function(req, res) {
   res.render("register"); 
});

// handle registration logic
// User.register() is from passport-local-mongoose
router.post("/register", function(req, res) {
    // create the new user, add to DB
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user) {
        if (error) {
            req.flash("error", error.message + ".");
            return res.redirect("/register");
        }
        // then log the user in
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, " + user.username + ".");
            res.redirect("/");
        });
    }); 
});

// show login form
router.get("/login", function(req, res) {
   res.render("login"); 
});

// handle log in logic - use passport.authenticate() middleware
router.post("/login", passport.authenticate("local", { 
    successRedirect: "/campgrounds",
    failureRedirect: "/login" }), function(req, res) {
        // doesn't really do anything because the middleware redirects
        // delete if you want to
});

// handle log out logic - use code from package
router.get("/logout", middleware.isLoggedIn, function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;