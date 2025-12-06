const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { authRouter } = require("./routes/auth");
const { apiRouter } = require("./routes/api");
const { webhookRouter } = require("./webhooks/webhookRouter");
const { startScheduledSync } = require("./jobs/syncJob");

const app = express();

app.use(cors({ 
    origin: ['http://localhost:3000', process.env.HOST], // Allow React Dev Server and your HOST (ngrok)
    credentials: true 
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/webhooks", webhookRouter);

startScheduledSync();

module.exports = app;
