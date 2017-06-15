var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Book = require("../models/book");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
	Book.find({'owner.id': req.user.id}, function(err, foundBooks){
		if(err){
			console.log(err);
		}
		console.log(foundBooks);
		res.render("profile/index", {books: foundBooks});
	});
	
});

router.get("/edit", middleware.isLoggedIn, function(req, res){
    res.render("profile/edit");
});

//UPDATE Profile ROUTE
router.put("/", middleware.isLoggedIn, function(req, res){
    if(req.body.user.phone.length === 10){
        User.findByIdAndUpdate(req.user.id, req.body.user, function(err, updatedUser){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Profile Updated");
                res.redirect("/profile");
            }
        });
    } else {
        req.flash("error", "Please enter a valid mobile number");
        res.redirect("back");
    }
	
});

router.get("/cp", middleware.isLoggedIn, function(req, res){
   	Book.findOne({"owner.id":req.user.id}).populate("owner.id").exec(function(err, foundBook){
		if(err){
			console.log(err);
		} else {
			// render show template with that book
			console.log(foundBook.owner.id);
			res.send(foundBook.owner.id);
		}
	});
});


module.exports = router;