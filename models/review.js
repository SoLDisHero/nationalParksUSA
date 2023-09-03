const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
    {url: String, filename: String}
)

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_400,h_300/q_auto/f_auto")
})
const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },    
    photos: [ImageSchema],
})
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;