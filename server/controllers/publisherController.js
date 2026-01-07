const { Event } = require("../models/event");
const { publishToEvent } = require("../utils/rabbitmqClient");

const getPublisherEvents = async (req, res) => {
    const { publisherId } = req.params;
    try {
        const events = await Event.find({ publisher_id: publisherId });
        res.status(200).send(events);
    } catch (error) {
        console.error("GetPublisherEvents Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const sendEventMessage = async (req, res) => {
    const { eventId, message } = req.body;
    try {
        await publishToEvent(eventId, {
            type: "PUBLISHER_ANNOUNCEMENT",
            eventId,
            message,
            timestamp: new Date()
        });
        res.status(200).send({ msg: "Notification sent successfully" });
    } catch (error) {
        console.error("SendEventMessage Error:", error);
        res.status(500).send({ msg: "Failed to send notification" });
    }
};

module.exports = {
    getPublisherEvents,
    sendEventMessage
};
