const mongoose = require("mongoose");
const ParkSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    directions: String,
    image: String,
    imageAPI: [String],
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }
    ],
    author:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})

const Park = mongoose.model("Park", ParkSchema);
module.exports = Park;