// express and mongoose setup
var express         = require('express'),
    app             = express(),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrat      = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// require routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

// passport configuration
app.use(require("express-session")({
    secret: "runescape is the most fun",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// db configuration
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true});

// app configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// make available in ALL templates
// otherwise, you'd have to add { user: req.user } to each res.render() in
// every single route...
app.use(function(req, res, next) {
   res.locals.user = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// use the routes we required, using prefixes to make our routes easier
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// start server
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("yelpcamp server is a go"); 
});