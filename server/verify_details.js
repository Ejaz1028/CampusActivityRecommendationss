const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/admin");
const User = require("./models/user");
const { Event } = require("./models/event");

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://127.0.0.1:27017/eventsystem";

const verifyDetails = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const admins = await Admin.find({});
        console.log("\n--- ADMINS ---");
        console.log(JSON.stringify(admins, null, 2));

        const users = await User.find({});
        console.log("\n--- USERS ---");
        console.log(JSON.stringify(users, null, 2));

        const events = await Event.find({});
        console.log("\n--- EVENTS ---");
        console.log(JSON.stringify(events, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
};

verifyDetails();
