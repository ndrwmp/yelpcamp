var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// basically adds a bunch of functions to the User model, including
// those for authorization (serialize(), etc)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);