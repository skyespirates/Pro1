const express = require("express");
const router  = express.Router();
var Content = require("../models/content");
var Comment = require("../models/comment");
var middleware = require("../middleware");


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
router.get("/contents/new", middleware.isLogin, (req, res) => {
    res.render("contents/new");
})
//  CREATE NEW CONTENT/LOGIC
router.post("/contents", middleware.isLogin, (req, res) => {
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
router.get("/contents/:id/edit", middleware.checkContentOwnership, (req, res) => {
        Content.findById(req.params.id, (err, found) => {
                res.render("contents/edit", {edit: found});
        });
});
//  UPDATE/EDIT A CONTENT/LOGIC
router.put("/contents/:id", middleware.checkContentOwnership, (req, res) => {
    Content.findByIdAndUpdate(req.params.id, req.body.form, (err, result) => {
        if(err) {
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
        }
    })
})
//  DELETE/DESTROY A CONTENT
router.delete("/contents/:id", middleware.checkContentOwnership, (req, res) => {
    Content.findByIdAndRemove(req.params.id, (err, success) => {
        if(err){
            res.redirect("/")
        } else {
            res.redirect("/contents");
        }
    })
})



module.exports = router;