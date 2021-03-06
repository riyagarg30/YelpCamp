var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user.js");
var seedDB=require("./seeds");
var mongoose = require('mongoose');
var methodOverride=require('method-override');
var flash=require("connect-flash");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

app.use(methodOverride("_method"));
app.use(flash());
//Passport Config

app.use(require("express-session")({
    secret: "Welcome to YelpCamp Website",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology : true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//seedDB();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.warning=req.flash("warning");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});