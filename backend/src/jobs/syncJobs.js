const cron = require("node-cron");
const prisma = require("../prismaClient");
const { syncProducts, syncCustomers, syncOrders } = require("../services/shopifySync");

function startScheduledSync() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("⏱ Running 30-minute sync...");

    const tenants = await prisma.tenant.findMany();

    for (const t of tenants) {
      try {
        await syncProducts(t.shop, t.accessToken, t.id);
        await syncCustomers(t.shop, t.accessToken, t.id);
        await syncOrders(t.shop, t.accessToken, t.id);
        console.log(`Synced: ${t.shop}`);
      } catch (err) {
        console.error("Sync error:", err);
      }
    }
  });
}

module.exports = { startScheduledSync };
