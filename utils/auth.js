const Review = require("../models/review");
module.exports.isLoggedIn = async (req,res,next) => {
    if(!req.isAuthenticated()){
        // req.session.returnTo = req.originalUrl;
        req.flash("error", "You must sign in");
        return res.redirect("/login");
    }
    next();
};
// module.exports.storeReturnTo = (req, res, next) => {
//     if (req.session.returnTo) {
//         res.locals.returnTo = req.session.returnTo;
//     }
//     next();
// } //for keeping user on the same page after log in
module.exports.isReviewAuthor = async(req,res,next) => {
const {id,reviewID} = req.params;
const review = await Review.findById(reviewID);
if(!review.author.equals(req.user._id)){
    req.flash("error", "You are not YOU");
    return res.redirect(`/parks/${id}`);
}
next();
}