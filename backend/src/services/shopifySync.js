// src/services/shopifySync.js

const prisma = require("../prismaClient");
const { 
    shopifyApi, 
    LATEST_API_VERSION,
    ApiVersion // Use ApiVersion for the client constructor fix
} = require("@shopify/shopify-api"); 
require("@shopify/shopify-api/adapters/node"); 


// 1. RE-INITIALIZE the shopify API instance here (using specific version for robustness)
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","),
  hostName: process.env.HOST.replace(/https:\/\//, ""),
  isEmbeddedApp: false,
  apiVersion: ApiVersion.October24, // Use the specific version that worked previously
});


// 2. Use the new syntax: 'shopify.clients.Rest'

// Fetch Products
async function syncProducts(shop, token, tenantId) {
  // 💡 NEW SYNTAX: Use shopify.clients.Rest
  const client = new shopify.clients.Rest({ session: { shop, accessToken: token } });

  const res = await client.get({ path: "products", query: { limit: 250 } });
  const products = res.body.products;

  // ... (rest of the Prisma logic remains the same)
}

// Fetch Customers
async function syncCustomers(shop, token, tenantId) {
  // 💡 NEW SYNTAX: Use shopify.clients.Rest
  const client = new shopify.clients.Rest({ session: { shop, accessToken: token } });

  const res = await client.get({ path: "customers", query: { limit: 250 } });
  const customers = res.body.customers;

  // ... (rest of the Prisma logic remains the same)
}

// Fetch Orders
async function syncOrders(shop, token, tenantId) {
  // 💡 NEW SYNTAX: Use shopify.clients.Rest
  const client = new shopify.clients.Rest({ session: { shop, accessToken: token } });

  const res = await client.get({ path: "orders", query: { limit: 250 } });
  const orders = res.body.orders;

  // ... (rest of the Prisma logic remains the same)
}

module.exports = { syncProducts, syncCustomers, syncOrders };