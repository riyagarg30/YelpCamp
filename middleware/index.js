var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership= function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    console.log(err);
                    req.flash("error","Try Again");
                    res.redirect("back");
                }else{
                    if(req.user._id.equals(foundCampground.author.id)){
                        next();
                    }
                    else{
                        req.flash("warning","You're not authorized to make changes to this campground");
                        res.redirect("/campgrounds");
                        
                    }
                }
            })
        }else{
            req.flash("error","Please LogIn First");
            res.redirect("back");
        }
    }

middlewareObj.checkCommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                req.flash("error","Try Again");
                res.redirect("back");
            }else{
                if(req.user._id.equals(foundComment.author.id)){
                    next();
                }
                else{
                    req.flash("warning","You're not authorized to access this comment");
                    res.redirect("back");
                    
                }
            }
        })
    }else{
        req.flash("error","Please LogIn First");
        res.redirect("back");
    }
}
 middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Please LogIn First");
        res.redirect("back");
    }
}

module.exports= middlewareObj;