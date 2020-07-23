const express = require("express");
const router  = express.Router();
var Content = require("../models/content");
var Comment = require("../models/comment");


//  CONTENTS ROUTE
router.get("/contents", (req, res) => {
    Content.find({}, function (err, cont) {
        if(err){
            console.log(err);
        } else {
            res.render("contents", {content: cont})
        }
    })
})
//=====================================================================================================
//  CREATE NEW CONTENT/FORM
router.get("/contents/new", isLogin, (req, res) => {
    res.render("contents/new");
})
//  CREATE NEW CONTENT/LOGIC
router.post("/contents", isLogin, (req, res) => {
    Content.create(req.body.content, (err, cont) => {
        if(err){
            console.log(err);
        } else {
            cont.author.id = req.user._id;
            cont.author.username = req.user.username;
            cont.save();
            res.redirect("/contents");
        }
    })
})
//  SHOW/READ A CONTENT
router.get("/contents/:id", (req, res) => {
    Content.findById(req.params.id).populate("comments").exec((err, find) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("contents/show", {content: find});
        }
    })
})
//  UPDATE/EDIT A CONTENT/FORM
router.get("/contents/:id/edit", checkContentOwnership, (req, res) => {
        Content.findById(req.params.id, (err, found) => {
                res.render("contents/edit", {edit: found});
        });
});
//  UPDATE/EDIT A CONTENT/LOGIC
router.put("/contents/:id", checkContentOwnership, (req, res) => {
    Content.findByIdAndUpdate(req.params.id, req.body.form, (err, result) => {
        if(err) {
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
        }
    })
})
//  DELETE/DESTROY A CONTENT
router.delete("/contents/:id", checkContentOwnership, (req, res) => {
    Content.findByIdAndRemove(req.params.id, (err, success) => {
        if(err){
            res.redirect("/")
        } else {
            res.redirect("/contents");
        }
    })
})

function isLogin(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
}

function checkContentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Content.findById(req.params.id, (err, found) => {
            if(err){
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("/login");
    }
}

module.exports = router;