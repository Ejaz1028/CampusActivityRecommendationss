const Admin = require("../models/admin");
const User = require("../models/user");
const { Event } = require("../models/event");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "1234567890";

const setAdmin = async (req, res) => {
    try {
        const secret = JWT_SECRET;
        const payload = {
            email: req.body.email,
        };

        const token = jwt.sign(payload, secret);

        const new_admin = new Admin({
            admin_id: token,
            email: req.body.email,
            name: req.body.name,
            pass: req.body.password,
        });

        await new_admin.save();
        console.log("Saved::New Admin::credentials.");
        res.status(200).send({ msg: "Credentials Added" });
    } catch (error) {
        console.error("SetAdmin Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const adminAuth = async (req, res) => {
    const Email = req.body.email;
    const Pass = req.body.password;

    try {
        const docs = await Admin.find({ email: Email });
        if (docs.length === 0) {
            return res.status(400).send({ msg: "Admin access denied" });
        } else if (Pass === docs[0].pass) {
            res.status(200).send({
                msg: "Success",
                admin_token: docs[0].admin_id,
            });
        } else {
            return res.status(400).send({ msg: "Email or Password is wrong" });
        }
    } catch (error) {
        console.error("AdminAuth Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const adminDetails = async (req, res) => {
    const admin_token = req.body.admin_id;

    try {
        const docs = await Admin.find({ admin_id: admin_token });
        if (docs.length === 0) {
            res.status(400).send({ msg: "No such admin exists" });
        } else {
            res.status(200).send(docs[0]);
        }
    } catch (err) {
        console.log("AdminDetails Error:", err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();

        const events = await Event.find({});
        const totalRevenue = events.reduce((sum, event) => sum + (event.price || 0), 0);

        // Count registrations across all events
        const totalRegistrations = events.reduce((sum, event) => sum + (event.participants ? event.participants.length : 0), 0);

        res.status(200).send({
            totalUsers,
            totalEvents,
            totalRevenue,
            totalRegistrations
        });
    } catch (error) {
        console.error("GetAdminStats Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords for safety
        res.status(200).send(users);
    } catch (error) {
        console.error("GetAllUsers Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    setAdmin,
    adminAuth,
    adminDetails,
    getAdminStats,
    getAllUsers
};
