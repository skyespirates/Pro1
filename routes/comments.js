const express = require("express");
const router  = express.Router();
var Content = require("../models/content");
var Comment = require("../models/comment");
const comment = require("../models/comment");

//==============================================================================================
//  CREATE NEW COMMENT/FORM
router.get("/contents/:id/comments/new", isLogin, (req, res) => {
    Content.findById(req.params.id, (err, get) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("comments/newcomment", {content: get});
        }
    })
})
//  CREATE NEW COMMENT/LOGIC
router.post("/contents/:id/comments", (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, commnt) => {
                if(err){
                    console.log(err);
                } else {
                    commnt.author.id = req.user._id;
                    commnt.author.username = req.user.username;
                    commnt.save();
                    content.comments.push(commnt);
                    content.save();
                    res.redirect("/contents/" + req.params.id);
                }
            })
        }
    })
});
//  UPDATE/EDIT COMMENT/FORM
router.get("/contents/:id/comments/:cid/edit", (req, res) => {
    Comment.findById(req.params.cid, (err, comment) => {
        if(err){
            console.log(err);
        } else {
            res.render("editcomment", {content: req.params.id, comment: comment})
        }
    })
})
//  UPDATE/EDIT COMMENT/LOGIC
router.put("/contents/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, commentUpdated) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/contents/" + req.params.id)
        }
    })
})
//  DESTROY/DELETE COMMENT
router.delete("/contents/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
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

module.exports = router;