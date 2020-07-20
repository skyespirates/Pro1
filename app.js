const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      Content = require("./models/content"),
      Comment = require("./models/comment"),
      User = require("./models/user");
      seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/pro1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(console.log("connected to mongoDB"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//  AUTHENTICATION CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
//  LANDING PAGE
app.get("/", (req, res) => {
    res.render("home");
});
//  CONTENTS ROUTE
app.get("/contents", (req, res) => {
    Content.find({}, function (err, cont) {
        if(err){
            console.log(err);
        } else {
            res.render("contents", {content: cont})
        }
    })
})
//  CREATE NEW CONTENT/FORM
app.get("/contents/new", (req, res) => {
    res.render("new");
})
//  CREATE NEW CONTENT/LOGIC
app.post("/contents", (req, res) => {
    Content.create(req.body.content, (err, cont) => {
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/contents");
        }
    })
})
//  SHOW/READ A CONTENT
app.get("/contents/:id", (req, res) => {
    Content.findById(req.params.id).populate("comments").exec((err, find) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("show", {content: find});
        }
    })
})
//  UPDATE/EDIT A CONTENT/FORM
app.get("/contents/:id/edit", (req, res) => {
    Content.findById(req.params.id, (err, found) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("edit", {edit: found});
        }
    })
})
//  UPDATE/EDIT A CONTENT/LOGIC
app.put("/contents/:id", (req, res) => {
    Content.findByIdAndUpdate(req.params.id, req.body.form, (err, result) => {
        if(err) {
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
        }
    })
})
//  DELETE/DESTROY A CONTENT
app.delete("/contents/:id", (req, res) => {
    Content.findByIdAndDelete(req.params.id, (err, success) => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/contents");
        }
    })
})

//  CREATE NEW COMMENT/FORM
app.get("/contents/:id/comments/new", (req, res) => {
    Content.findById(req.params.id, (err, get) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.render("newcomment", {content: get});
        }
    })
})
//  CREATE NEW COMMENT/LOGIC
app.post("/contents/:id/comments", (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, commnt) => {
                if(err){
                    console.log(err);
                } else {
                    content.comments.push(commnt);
                    content.save();
                    res.redirect("/contents/" + req.params.id);
                }
            })
        }
    })
});
//  UPDATE/EDIT COMMENT/FORM
app.get("/contents/:id/comments/:cid/edit", (req, res) => {
    Comment.findById(req.params.cid, (err, comment) => {
        if(err){
            console.log(err);
        } else {
            res.render("editcomment", {content: req.params.id, comment: comment})
        }
    })
})
//  UPDATE/EDIT COMMENT/LOGIC
app.put("/contents/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, commentUpdated) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/contents/" + req.params.id)
        }
    })
})
//  DESTROY/DELETE COMMENT
app.delete("/contents/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if(err){
            res.redirect("/contents");
        } else {
            res.redirect("/contents/" + req.params.id);
        }
    })
})

// AUTHENTICATION ROUTES
app.get("/register", (req, res) => {
    res.render("register");
})
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/contents",
    failureRedirect: "/login"
    }), function(req, res){}
);
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
app.listen(3000, () => {
    console.log("connected..");
})