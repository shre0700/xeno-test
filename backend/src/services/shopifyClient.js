const { Shopify } = require("@shopify/shopify-api");

function getRestClient(shop, accessToken) {
  return new Shopify.Clients.Rest(shop, accessToken);
}

module.exports = { getRestClient };
