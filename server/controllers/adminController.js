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

const EventEmitter = require('events');
const adminEventEmitter = new EventEmitter();

// Initialize RabbitMQ Consumer for Admin Console
const initAdminSubscriber = async () => {
    try {
        const { getChannel } = require("../utils/rabbitmqClient");
        const channel = await getChannel();
        if (!channel) return;

        // Create an exclusive temporary queue for this admin session
        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'event_exchange', '');

        console.log(`📡 Admin Subscriber listening on queue: ${q.queue}`);

        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                const content = msg.content.toString();
                adminEventEmitter.emit('message', content);
            }
        }, { noAck: true });
    } catch (error) {
        console.error("Failed to init Admin Subscriber:", error);
    }
};

// Start subscriber
initAdminSubscriber();

const publishRabbitMQ = async (req, res) => {
    const { message } = req.body;
    try {
        const { getChannel } = require("../utils/rabbitmqClient");
        const channel = await getChannel();
        if (channel) {
            channel.publish('event_exchange', '', Buffer.from(message));
            console.log(`✅ Admin published test message:`, message);
            res.status(200).send({ msg: "Message published" });
        } else {
            res.status(500).send({ msg: "RabbitMQ channel not available" });
        }
    } catch (error) {
        console.error("RabbitMQ Publish Error:", error);
        res.status(500).send({ msg: "Error publishing message", error });
    }
};

// Real-time SSE stream for admin logs (hooked into RabbitMQ)
const adminStream = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendLog = (message) => {
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
    };

    const messageHandler = (content) => {
        sendLog(content);
    };

    adminEventEmitter.on('message', messageHandler);
    sendLog("Connected to System Log Stream");

    req.on('close', () => {
        adminEventEmitter.removeListener('message', messageHandler);
    });
};

module.exports = {
    setAdmin,
    adminAuth,
    adminDetails,
    getAdminStats,
    getAllUsers,
    publishRabbitMQ,
    adminStream
};
