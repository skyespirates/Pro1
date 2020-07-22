const express = require("express");
const router  = express.Router();
const passport = require("passport");
var User = require("../models/user");

//  LANDING PAGE
router.get("/", (req, res) => {
    res.render("home");
});
//=========================================================================================================
// AUTHENTICATION ROUTES
router.get("/register", (req, res) => {
    res.render("register");
})
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/contents");
        })
    })
})
router.get("/login", (req, res) => {
    res.render("login");
})
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/contents",
    failureRedirect: "/login"
    }), function(req, res){}
);
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;