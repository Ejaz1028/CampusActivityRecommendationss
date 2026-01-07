const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/admin");
const User = require("./models/user");
const { Event } = require("./models/event");

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://127.0.0.1:27017/eventsystem";

const verifyData = async () => {
    try {
        console.log(`⏳ Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected!");

        const adminCount = await Admin.countDocuments({});
        const userCount = await User.countDocuments({});
        const eventCount = await Event.countDocuments({});

        console.log(`📊 Statistics:`);
        console.log(`   - Admins: ${adminCount}`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Events: ${eventCount}`);

        if (adminCount > 0) {
            const admin = await Admin.findOne({});
            console.log(` نمونه Admin: ${admin.email}`);
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Verification failed:", err);
        process.exit(1);
    }
};

verifyData();
