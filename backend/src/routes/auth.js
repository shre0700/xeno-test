const express = require("express");
const prisma = require("../prismaClient");
// 1. Import the new API and Node adapter
const { shopifyApi, LATEST_API_VERSION, ApiVersion } = require("@shopify/shopify-api");
require("@shopify/shopify-api/adapters/node");

const router = express.Router();
const scopes = process.env.SCOPES ? process.env.SCOPES.split(",") : [];
// 2. Initialize the library (Replaces Shopify.Context.initialize)
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes,
  hostName: process.env.HOST.replace(/https:\/\//, ""),
  isEmbeddedApp: false,
  apiVersion: ApiVersion.October24,
});

// STEP 1 — App installation
router.get("/install", async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop parameter");

  try {
    // 3. New 'begin' syntax
    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(shop, true),
      callbackPath: "/auth/callback",
      isOnline: false, // false for offline access token (background jobs), true for online (user session)
      rawRequest: req,
      rawResponse: res,
    });
  } catch (e) {
    console.error(`Failed to begin auth: ${e.message}`);
    res.status(500).send("Failed to begin auth");
  }
});

// STEP 2 — OAuth Callback
router.get("/callback", async (req, res) => {
  try {
    // 4. New 'callback' syntax
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;

    // Save to Database using Prisma
    await prisma.tenant.upsert({
      where: { shop: session.shop },
      update: { accessToken: session.accessToken },
      create: { shop: session.shop, accessToken: session.accessToken },
    });

    // Redirect to app home or confirmation page
    res.send("Shopify App Installed Successfully! You can close this tab.");
    
  } catch (e) {
    console.error(`Failed to complete auth: ${e.message}`);
    res.status(500).send("OAuth error");
  }
});

module.exports = { authRouter: router };