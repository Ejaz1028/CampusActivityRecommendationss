const express = require("express");
const router = express.Router();
const {
    setAdmin,
    adminAuth,
    adminDetails,
    getAdminStats,
    getAllUsers,
    publishRabbitMQ,
    adminStream,
    getAllPublishers,
    updateUserRole,
    getEventsByPublisher,
    getPendingPublishers,
    verifyPublisher,
} = require("../controllers/adminController");

router.route("/setadmin").post(setAdmin);
router.route("/admin/auth").post(adminAuth);
router.route("/admin/details").post(adminDetails);
router.route("/admin/stats").get(getAdminStats);
router.route("/admin/users").get(getAllUsers);
router.route("/admin/publishers").get(getAllPublishers);
router.route("/admin/pending-publishers").get(getPendingPublishers);
router.route("/admin/verify-publisher").post(verifyPublisher);
router.route("/admin/update-role").post(updateUserRole);
router.route("/admin/events-by-publisher/:publisherId").get(getEventsByPublisher);
router.route("/admin/rabbitmq/publish").post(publishRabbitMQ);
router.route("/admin/rabbitmq/stream").get(adminStream);

module.exports = router;
