const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://127.0.0.1:27017/eventsystem";

const inspectDB = async () => {
    try {
        console.log(`⏳ Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected!");

        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log("\n📁 Databases:");
        dbs.databases.forEach(db => console.log(`   - ${db.name}`));

        console.log(`\n📂 Collections in ${mongoose.connection.db.databaseName}:`);
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(col => console.log(`   - ${col.name}`));

        process.exit(0);
    } catch (err) {
        console.error("❌ Inspection failed:", err);
        process.exit(1);
    }
};

inspectDB();
