  var express 	  = require("express"),
	app			  = express(),
	bodyParser 	  = require("body-parser"),
	mongoose 	  = require("mongoose"),
	flash		  = require("connect-flash"),
	passport 	  = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Book 	  = require("./models/book"),
	User   		  = require("./models/user");

// requiring routes
var bookRoutes = require("./routes/books"),
	indexRoutes = require("./routes/index"),
	profileRoutes = require("./routes/profile");

var port = process.env.PORT || 8080;

var DB = process.env.DBURL || "mongodb://localhost/booklegacy3";
// mongodb://admin:admin4115@ds133291.mlab.com:33291/booklegacy

mongoose.connect(DB);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "learning mean development",
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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/profile", profileRoutes);

app.listen(port, process.env.IP, function(){
	console.log("Server has Started !");
});