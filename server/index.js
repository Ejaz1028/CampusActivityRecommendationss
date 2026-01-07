const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRouter = require("./routes/authRoutes");
const dashboardRouter = require("./routes/userDashboardRoutes");
const paymentRouter = require("./routes/paymentRoute");
const adminRouter = require("./routes/adminRoutes");
const eventRouter = require("./routes/eventRoutes");
const wss = require("./utils/webSocketServer");

dotenv.config();
console.log("in index - ", process.env.MONGO_ATLAS_URI);

mongoose
    .connect(process.env.MONGO_ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {})
    .catch((err) => {
        console.log(err);
    });

require("./models/otpAuth");
require("./models/user");
require("./models/admin");
require("./models/event");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());

app.use("/", paymentRouter);
app.use("/user", userRouter);
app.use("/user", dashboardRouter);
app.use("/", adminRouter);
app.use("/", eventRouter);

app.get("/", (req, res) => {
    res.send("Event Management micro services API.");
});

// Include the event subscriber
require('./subscribers/eventSubscriber');

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server Running on🚀: ${process.env.PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});