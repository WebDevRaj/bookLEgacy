var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var randomstring = require("randomstring");
var middleware = require("../middleware");


//root route
router.get("/", function(req, res){
	res.render("landing");
});

//show register page
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    if(req.body.password === req.body.confirmpassword){
        if(req.body.phone.length === 10){
            var pl = req.body.username.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();
            var token = randomstring.generate({
                            length: 64
                            });
            var newUser = new User({
                name: req.body.name, 
                email: req.body.email, 
                phone: req.body.phone, 
                username: req.body.username,
                permalink: pl,
                verify_token: token
                 });
            sendVerification(req, newUser.email, pl, token);
            User.register(newUser, req.body.password, function(err, user){
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/register");
                } else {
                    passport.authenticate("local")(req, res, function(){
                            
                            req.flash("success", "Welcome to bookLEgacy " + user.username + "! Please Verify your email address!");
                            res.redirect("/books");
                    });
                }	
            });
        } else {
            req.flash("error", "Please enter a valid mobile number");
            res.redirect("back");
        }
        
    } else {
        req.flash("error", "Password and Confirm Password doesn't match");
        res.redirect("back");
    }
	
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});

//  Handling login logic
router.post("/login", passport.authenticate("local",
	{	
		successFlash: true,
		successRedirect: "/books",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You out");
	res.redirect("/books");
});

// About
router.get("/about", function(req, res){
    res.render("about");
});

//Help
router.get("/help", function(req, res){
    res.render("help");
});

// send verification mail
var sendVerification = function(req, email,  permalink, token){
    link=req.get("host") + "/verify/"+permalink+"/"+token;
    message= "Welcome to bookLEgacy. Please click on the link to verify your email address " + link;
    middleware.sendMail(email, message);
}


//verify email
router.get('/verify/:permaink/:token', function (req, res) {
        var permalink = req.params.permaink;
        var token = req.params.token;

        User.findOne({'permalink': permalink}, function (err, user) {
            if (user.verify_token == token) {
                console.log('that token is correct! Verify the user');
                req.flash("success", "Email Verified! Please log-in to continue")
                User.findOneAndUpdate({'permalink': permalink }, {'verified': true}, function (err, resp) {
                    console.log('The user has been verified!');
                });

                res.redirect('/login');
            } else {
                console.log('The token is wrong! Reject the user. token should be: ' + user.local.verify_token);
            }
        });
    });

module.exports = router;