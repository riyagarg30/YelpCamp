var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
//var mongoose=require("mongoose");
var middleware=require("../middleware/index");

//Comments routes

router.get('/new',middleware.isLoggedIn, (req, res) => {
    //console.log("entered");
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            //res.send("new page");
            res.render("comments/new",{campground: campground});
        }
    });
});

router.post('/',middleware.isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("campground");
            Comment.create(
                {
                    text: req.body.comment.text,
                    author: req.body.comment.author
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        comment.author.id= req.user._id;
                        comment.author.username= req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                        req.flash("success","Comment Added");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
        }
    })
    
});

//Edit route

router.get('/:comment_id/edit',middleware.checkCommentOwnership,(req, res) => {

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("/campgrounds/" + req.params.id);
                }else{
                    res.render("comments/edit",{comment: foundComment, campground: foundCampground});
                    //res.send("this will be edit page");
                }
            });
        }
    });
});

//Update Route

router.put('/:comment_id',middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Comment Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DeleteRoute

router.delete('/:comment_id',middleware.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            //var x=(Campground.findById(req.params.id));
            //console.log(x.comments.type);
            Campground.findByIdAndUpdate(req.params.id,
                {
                    $pull: {
                        comments: req.params.comment_id
                    }
                }, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        req.flash("success","Comment Deleted");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
            
        }
    });
});

module.exports=router;