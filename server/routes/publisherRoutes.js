const express = require("express");
const router = express.Router();
const {
    getPublisherEvents,
    sendEventMessage,
} = require("../controllers/publisherController");

router.route("/publisher/events/:publisherId").get(getPublisherEvents);
router.route("/publisher/send-message").post(sendEventMessage);

module.exports = router;
