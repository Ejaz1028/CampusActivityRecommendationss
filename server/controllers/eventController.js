const { Event } = require("../models/event");
const Admin = require("../models/admin");
const User = require("../models/user");
const dotenv = require("dotenv");
const { getChannel } = require("../utils/rabbitmqClient");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Send check-in email with better error handling
async function sendCheckInMail(data) {
    // Implementation here...
}

const postEvent = async (req, res) => {
    const { name, venue, date, time, description, price, profile, cover, organizer, admin_id } = req.body;

    const payload = { email: name };
    const token = jwt.sign(payload, JWT_SECRET);

    const newEvent = new Event({
        event_id: token,
        name,
        venue,
        date,
        time,
        description,
        price,
        profile,
        cover,
        organizer,
    });

    try {
        await newEvent.save();
        console.log("Saved::New Event::created.");

        // Publish event to RabbitMQ exchange
        const channel = await getChannel();
        if (channel) {
            setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    channel.publish('event_exchange', '', Buffer.from(JSON.stringify(newEvent)));
                    console.log(`✅ Event ${i + 1} published to exchange:`, newEvent);
                }, i * 5000); // 5s delay between each publish
            }
            }, 5000);
        } else {
            console.error("❌ RabbitMQ channel is not available.");
        }

        // Update Admin's eventCreated array
        await Admin.updateOne(
            { admin_id },
            {
                $push: {
                    eventCreated: {
                        event_id: token,
                        name,
                        venue,
                        date,
                        time,
                        description,
                        price,
                        profile: profile || "https://i.etsystatic.com/15907303/r/il/c8acad/1940223106/il_794xN.1940223106_9tfg.jpg",
                        cover: cover || "https://eventplanning24x7.files.wordpress.com/2018/04/events.png",
                        organizer,
                    },
                },
            }
        );

        res.status(200).send({ msg: "Event created", event_id: token });
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).send({ msg: "Error creating event", error: err });
    }
};

const allEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).send(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(400).send({ msg: "Error fetching data", error: err });
    }
};

const sseHandler = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log("✅ SSE connection established");

        // Handle client disconnect
        req.on('close', () => {
            console.log("🔌 SSE connection closed");
        });

    } catch (error) {
        console.error("❌ Error in SSE Handler:", error);
    }
};

const particularEvent = async (req, res) => {
    const { event_id } = req.body;
    try {
        const event = await Event.findOne({ event_id });
        res.status(200).send(event);
    } catch (err) {
        console.error("Error fetching event:", err);
        res.status(400).send({ msg: "Error fetching event", error: err });
    }
};

const deleteEvent = async (req, res) => {
    const { event_id, admin_id } = req.body;

    try {
        await Event.deleteOne({ event_id });

        // Remove event from Admin's eventCreated array
        await Admin.updateOne(
            { admin_id },
            { $pull: { eventCreated: { event_id } } }
        );

        res.status(200).send({ msg: "Event deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).send({ msg: "Error deleting event", error: err });
    }
};

const checkin = async (req, res) => {
    const { event_id, checkInList } = req.body;

    let eventName = "";

    try {
        const event = await Event.findOne({ event_id });
        eventName = event.name;

        // Implementation here...
    } catch (err) {
        console.error("Error checking in:", err);
        res.status(500).send({ msg: "Error checking in", error: err });
    }
};

module.exports = {
    postEvent,
    allEvents,
    sseHandler,
    particularEvent,
    deleteEvent,
    checkin,
};