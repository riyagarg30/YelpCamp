var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get('/', (req, res) => {
    res.render('landing');
});

//authentication routes

//register
router.get('/register', (req, res) => {
    res.render("register");    
});

router.post('/register', (req, res) => {
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            //e=err;
            req.flash("error", err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds");
            });
        }       
        
    });
    //res.redirect("/campgrounds");
});

//login
router.get('/login', (req, res) => {
    res.render("login");    
});

router.post('/login',passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res) => {
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Logged Out Sucsessfully");
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next;
    }
    else{
        res.redirect("back");
    }
}

module.exports=router;