var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware");

//INDEX - show all books
router.get("/", function(req, res){
	
	Book.find({}, function(err, allBooks ){
		if(err){
			console.log(err);
		} else {
			res.render("books/index",{books:allBooks });
		}
	});
	

});


//Filter books
router.post("/filter", function(req, res){
	
	Book.find({department: req.body.department, sem: req.body.semester}, function(err, foundBooks){
		if(err){
			req.flash("error", err);
			console.log(err);
		} else {
			if(foundBooks.length == 0){
				req.flash("error", "Sorry, No book found in the selected catagory!");
				res.redirect("/books");
			}
			res.render("books/index", {books: foundBooks});
		}
	});
});

// NEW - show form to create new book
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("books/new");
});

// CREATE- add a new book
router.post("/", middleware.isLoggedIn, function(req,res){
	var title = req.body.title;
	var author = req.body.author;
	var subject = req.body.subject;
    var department = req.body.department;
    var sem = req.body.sem;
    var price = req.body.price;
	var owner = {
		id: req.user._id,
		username: req.user.username,
        phone: req.user.phone
	}
    console.log(owner);
	var newBook = {title: title, author: author, subject: subject, department: department, sem: semester, owner: owner, price: price}

	// Create a new book and save to db
	Book.create(newBook, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Book posted successfully");
			console.log(newlyCreated);
			res.redirect("/books");
		}
	});
});

// SHOW - shows more info about one book
router.get("/:id", middleware.isLoggedIn, function(req, res){

	// find the book with provided id
	Book.findById(req.params.id, function(err, foundBook){
		if(err){
			console.log(err);
		} else {
			// render show template with that book
			console.log(foundBook.owner);
			res.render("books/show", {book: foundBook});
		}
	});
	
});

//EDIT BOOK ROUTE
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
	Book.findById(req.params.id, function(err, foundBook){
		if(err){
			req.flash("error", "Book not found");
			res.redirect("back");
		}  else {
			res.render("books/edit", {book: foundBook});
		}
	});	
});

//UPDATE BOOK ROUTE
router.put("/:id", middleware.checkBookOwnership, function(req, res){
	//find and update the book
	Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
		if(err){
			res.redirect("/books");
		} else {
			req.flash("success", "Book successfully updated");
			res.redirect("/books/" + req.params.id);
		}
	});
});

//DESTROY BOOK ROUTE
router.delete("/:id", middleware.checkBookOwnership, function(req, res){
	Book.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Book not found");
			res.redirect("/books");
		} else {
			req.flash("success", "Book Deleted");
			res.redirect("/books");
		}
	})
});

module.exports = router;