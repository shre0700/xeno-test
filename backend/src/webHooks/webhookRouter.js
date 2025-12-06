const express = require("express");
const crypto = require("crypto");
const { handleOrderCreate } = require("./handlers");

const router = express.Router();

function verifyHmac(req) {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = JSON.stringify(req.body);

  const hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(body, "utf8")
    .digest("base64");

  return hmac === hash;
}

router.post("/orders/create", (req, res) => {
  if (!verifyHmac(req)) return res.status(401).send("Invalid HMAC");

  handleOrderCreate(req.body)
    .then(() => res.status(200).send("OK"))
    .catch((e) => res.status(500).send("Error"));
});

module.exports = { webhookRouter: router };
