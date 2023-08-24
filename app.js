const express = require("express");
const app = express();
const path = require("path");
const Park = require("./models/nParks.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const {isLoggedIn, isReviewAuthor} = require("./utils/auth.js");
const ejsMate = require("ejs-mate");
const catchAsync= require("./utils/catchAsync.js");
const methodOverride = require("method-override");
const session = require("express-session");
const sessionOptions = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 *60*60*24*7,
        maxAge: 1000*60*60*7*24,
        httpOnly: true,
    }
};
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/nationalParkUSA");
mongoose.connection.on("error", console.error.bind(console, "error: "));
mongoose.connection.once("open", () => {
    console.log("DB connected")
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.engine("ejs", ejsMate);

//HOME ROUTE

app.get("/", (req,res) => {
    res.render("home.ejs")
});

//ALL PARKS

app.get("/parks", catchAsync(async(req,res) => {
    const parks = await Park.find();
    res.render("parks.ejs", {parks})
}));

//ONE PARK

app.get("/parks/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id).populate({
        path: "reviews",
        options: { sort: { _id: -1 } }, // Sort reviews by ID in descending order        
        populate:{path: "author"},
    }).populate("author");
    res.render("show.ejs", { park });
}));

//REVIEWS

app.post("/parks/:id/reviews", isLoggedIn, catchAsync(async(req,res,next) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    park.reviews.push(review);
    await review.save();
    await park.save();    
    req.flash("success", "You've posted a review!");
    res.redirect(`/parks/${park._id}`);
}));

app.delete("/parks/:id/reviews/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(async(req,res,next) => {
    const {id, reviewID} = req.params;
    await Park.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "You've deleted a review!");
    res.redirect(`/parks/${id}`)
}));

//USER

app.get("/register", catchAsync(async(req,res) => {
    res.render("register.ejs");
}));

app.post("/register", catchAsync(async(req,res,next) => {
    try{
    const {username, email, password} = req.body;
    const user = new User ({username, email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, function(err) {
        if(err) return next(err);
    });
    req.flash("success", "Welcome!");
    res.redirect("/parks");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register")
    }
}));

app.get("/login", catchAsync(async(req,res) => {
    res.render("login.ejs");
}));

app.post("/login", passport.authenticate("local", {
    failureFlash:true,
    failureRedirect: "/login"
}),
 catchAsync(async(req,res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = res.locals.returnTo || "/parks";
    res.redirect(redirectUrl);
}));

app.get("/logout", (req,res,next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "Have a good one!");
        res.redirect("/parks");
    })
})

//NO ROUTES & ERRORS

app.use((req,res,next) => {
    const err = new Error("The page is not found.")
    err.status = 404;
    next(err);
});

app.use((err,req,res,next) => {
    const {status = 500, message = "Oops"} = err;
    if(!err.message) err.message = "Something went wrong. Go back, please"
    res.status(status).render("error.ejs", {err});
});

//PORT

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`You're on port ${port}`);
})