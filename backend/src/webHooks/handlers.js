const prisma = require("../prismaClient");

async function handleOrderCreate(order) {
  const shop = order?.shop_domain;

  const tenant = await prisma.tenant.findUnique({ where: { shop } });
  if (!tenant) return;

  await prisma.order.upsert({
    where: { shopifyId: String(order.id) },
    update: {
      totalPrice: parseFloat(order.total_price),
      createdAt: new Date(order.created_at),
      rawJson: order,
    },
    create: {
      shopifyId: String(order.id),
      tenantId: tenant.id,
      totalPrice: parseFloat(order.total_price),
      createdAt: new Date(order.created_at),
      rawJson: order,
    },
  });
}

module.exports = { handleOrderCreate };
