const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/admin");
const User = require("./models/user");
const { Event } = require("./models/event");

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://127.0.0.1:27017/eventsystem";

const seedData = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected!");

        // 1. Clear existing data
        console.log("🧹 Clearing existing data...");
        await Admin.deleteMany({});
        await User.deleteMany({});
        await Event.deleteMany({});
        console.log("✅ Data cleared!");

        // 2. Seed Admin
        console.log("👤 Seeding Admin...");
        const admin = await Admin.create({
            admin_id: "admin_12345",
            email: "admin@gmail.com",
            pass: "12345678",
            name: "Default Admin",
            eventCreated: []
        });

        // 3. Seed Events
        console.log("📅 Seeding Events...");
        const events = await Event.insertMany([
            {
                event_id: "evt_001",
                name: "Web Development Workshop",
                venue: "Main Hall, Engineering Block",
                date: "2026-02-15",
                time: "10:00 AM",
                description: "Deep dive into React and Node.js.",
                price: 500,
                organizer: admin.name
            },
            {
                event_id: "evt_002",
                name: "AI & ML Seminar",
                venue: "Auditorium 1",
                date: "2026-03-10",
                time: "02:00 PM",
                description: "Introduction to Artificial Intelligence and Machine Learning.",
                price: 0,
                organizer: admin.name
            },
            {
                event_id: "evt_003",
                name: "Campus Hackathon 2026",
                venue: "Innovation Center",
                date: "2026-04-20",
                time: "09:00 AM",
                description: "48-hour coding marathon with prizes!",
                price: 1000,
                organizer: admin.name
            }
        ]);

        // Update admin with created events
        admin.eventCreated = events.map(e => ({ event_id: e.event_id, name: e.name }));
        await admin.save();

        // 4. Seed Users
        console.log("👥 Seeding Users...");
        await User.insertMany([
            {
                user_token: "user_tok_1",
                reg_number: "BCS2021001",
                username: "alice_doe",
                email: "user@gmail.com",
                contactNumber: "1234567890",
                registeredEvents: [events[0], events[1]]
            },
            {
                user_token: "user_tok_2",
                reg_number: "BCS2021002",
                username: "bob_smith",
                email: "bob@example.com",
                contactNumber: "0987654321",
                registeredEvents: [events[1]]
            }
        ]);

        console.log("✨ Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
