var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

// Login
router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failedRedirect: "/login"
}) ,function(req, res){
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;