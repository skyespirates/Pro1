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

const contentRoutes = require("./routes/contents"),
      commentRoutes = require("./routes/comments"),
      indexRoutes   = require("./routes/index");

mongoose.connect("mongodb+srv://skyes07:bmwb1gtr@cluster0.tec2n.mongodb.net/pro1?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(console.log("connected to mongoDB"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// seedDB();
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
app.use(indexRoutes);
app.use(contentRoutes);
app.use(commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});