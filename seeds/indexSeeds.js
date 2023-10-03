const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/nationalParkUSA");
mongoose.connection.on("error", console.error.bind(console, "error: "));
mongoose.connection.once("open", () => {
    console.log("DB connected")
})
const dataPark = require("./npData.js");
const Park = require("../models/nParks.js");

const seedDB = async () => {
    try {
        const data = await dataPark();
        await Park.deleteMany({});
        const re = /National Park/g;
        let x = 0;
        for (let i = 0; i < data.length; i++) {
            if(data[i].fullName.match(re)){      
            const imagesAllApi = data[i].images.map(image => image.url);      
            const picNP = `/pictures/DowngradeNP/park${x++}.jpg`;
            const park = new Park({
                title: data[i].fullName,
                description: data[i].description,
                location: data[i].addresses[0].stateCode,
                directions: data[i].directionsInfo,
                image: picNP,
                imageAPI: imagesAllApi,
                geometry: {type: "Point", coordinates: [data[i].longitude, data[i].latitude]},
                });
            await park.save();
            }            
        }
    } catch (error) {
        console.error("Error while seeding database:", error);
    }
};
seedDB();