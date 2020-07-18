const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/pro1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(console.log("connected to mongoDB"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var contentSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String
});
var Content = mongoose.model("Content", contentSchema);
// Content.create({
//     title: "Stars in the sky",
//     image: "https://images.unsplash.com/photo-1508402476522-c77c2fa4479d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//     description: "This is description"
// }, (err, content) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log("content created");   
//     }
// })

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/contents", (req, res) => {
    Content.find({}, function (err, cont) {
        if(err){
            console.log(err);
        } else {
            res.render("contents", {content: cont})
        }
    })
})
app.get("/contents/new", (req, res) => {
    res.render("new");
})
app.post("/contents", (req, res) => {
    Content.create(req.body.content, (err, cont) => {
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/contents");
        }
    })
})

app.get("/contents/:id", (req, res) => {
    Content.findById(req.params.id, (err, find) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("show", {content: find});
        }
    })
})
app.get("/contents/:id/edit", (req, res) => {
    Content.findById(req.params.id, (err, found) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("edit", {edit: found});
        }
    })
})
app.put("/contents/:id", (req, res) => {
    Content.findByIdAndUpdate(req.params.id, req.body.form, (err, result) => {
        if(err) {
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
        }
    })
})
app.listen(3000, () => {
    console.log("connected..");
})