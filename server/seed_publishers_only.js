const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://127.0.0.1:27017/eventsystem";

const seedPublishers = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected!");

        const publishers = [
            {
                user_token: "pub_manual_1",
                reg_number: "PUB_M001",
                username: "Tech Club",
                email: "tech@campus.com",
                contactNumber: "9988776655",
                password: "password123",
                role: "publisher",
                isVerified: true,
            },
            {
                user_token: "pub_manual_2",
                reg_number: "PUB_M002",
                username: "Drama Society",
                email: "drama@campus.com",
                contactNumber: "1122334455",
                password: "password123",
                role: "publisher",
                isVerified: false,
            }
        ];

        console.log("📢 Seeding Manual Publishers...");
        for (const pub of publishers) {
            const existing = await User.findOne({ email: pub.email });
            if (!existing) {
                await User.create(pub);
                console.log(`✅ Added: ${pub.username}`);
            } else {
                console.log(`➖ Swapped/Skipped (Exists): ${pub.username}`);
            }
        }

        console.log("✨ Seeding completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedPublishers();
