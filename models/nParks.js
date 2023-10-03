const mongoose = require("mongoose");
const opts = {toJSON  : {virtuals: true}};
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
    ],
    geometry:{
        type: {type: String, enum: ["Point"], required: true},
        coordinates: {type: [Number], required: true},
    }
}, opts)

ParkSchema.virtual("properties.popUpMarkup").get(function() {
    return `<a href=/parks/${this._id}>${this.title}</a>
    <p>${this.directions.substring(0,100)} ... </p>`
})
const Park = mongoose.model("Park", ParkSchema);
module.exports = Park;