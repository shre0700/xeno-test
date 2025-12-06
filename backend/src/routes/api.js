const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

// Overview metrics
router.get("/metrics/:tenantId", async (req, res) => {
  const tenantId = +req.params.tenantId;

  const customers = await prisma.customer.count({ where: { tenantId } });
  const orders = await prisma.order.count({ where: { tenantId } });

  const revenue = await prisma.order.aggregate({
    where: { tenantId },
    _sum: { totalPrice: true },
  });

  res.json({
    customers,
    orders,
    revenue: revenue._sum.totalPrice || 0,
  });
});

module.exports = { apiRouter: router };
