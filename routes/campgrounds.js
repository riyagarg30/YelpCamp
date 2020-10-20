var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index");
var Comment=require("../models/comment");
//index page
router.get('/', (req, res) => {
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
            //console.log(allCampgrounds.length);
        }
    });
});

//create
router.post('/',middleware.isLoggedIn,(req, res) => {
    var campName=req.body.campName;
    var image=req.body.image;
    var description=req.body.description;
    var price=req.body.price;
    var author={
        id: req.user._id,
        username:req.user.username
    }
    var newCampground= {name:campName,image:image,price:price,description:description,author:author};
    //campgrounds.push(newCampground);
    Campground.create(newCampground);
    req.flash("success","Campground Added");
    res.redirect("/campgrounds");
});

//new
router.get('/new',middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// app.get('/campgrounds/:id', (req, res) => {
//     Campground.findById(req.params.id,function(err,foundCampground){
//         if(err){
//             console.log(err);
//         }else{
//             //res.send("hello");
//             res.render("show",{campground: foundCampground});
//         }
//     })
// });


//show
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
});

//edit campground
router.get('/:id/edit',middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            }else{
                res.render("campgrounds/edit",{campground:foundCampground});
            }
        });    
});


//update campground

router.put('/:id',middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete campground
router.delete('/:id',middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, function(err,campgroundRemoved){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }
                req.flash("success","Campground Deleted");
                res.redirect("/campgrounds");
            });
            
            
        }
    });
});

module.exports=router;