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
} = require("../controllers/adminController");

router.route("/setadmin").post(setAdmin);
router.route("/admin/auth").post(adminAuth);
router.route("/admin/details").post(adminDetails);
router.route("/admin/stats").get(getAdminStats);
router.route("/admin/users").get(getAllUsers);
router.route("/admin/rabbitmq/publish").post(publishRabbitMQ);
router.route("/admin/rabbitmq/stream").get(adminStream);

module.exports = router;
