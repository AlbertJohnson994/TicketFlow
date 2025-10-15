import { Sale, Event } from "../models/index.js";
import { Op } from "sequelize";

export const saleService = {
  async getAll(filters = {}) {
    const where = {};

    if (filters.saleStatus) where.saleStatus = filters.saleStatus;
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.dateFrom || filters.dateTo) {
      where.saleDate = {};
      if (filters.dateFrom) where.saleDate[Op.gte] = new Date(filters.dateFrom);
      if (filters.dateTo) where.saleDate[Op.lte] = new Date(filters.dateTo);
    }

    return await Sale.findAll({
      where,
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "description", "date", "price"],
        },
      ],
      order: [["saleDate", "DESC"]],
    });
  },

  async getById(id) {
    return await Sale.findByPk(id, {
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "description", "date", "price"],
        },
      ],
    });
  },

  async create(data) {
    const event = await Event.findByPk(data.event_id);
    if (!event) throw new Error("Event not found");

    // Validate sales period
    const now = new Date();
    if (event.startSales && now < event.startSales) {
      throw new Error("Sales have not started for this event");
    }
    if (event.endSales && now > event.endSales) {
      throw new Error("Sales period has ended for this event");
    }

    // Validate ticket availability
    const quantity = data.quantity || 1;
    if (event.availableTickets < quantity) {
      throw new Error("Not enough tickets available");
    }

    // Calculate total amount
    const totalAmount = event.price * quantity;

    const sale = await Sale.create({
      ...data,
      totalAmount,
      quantity,
    });

    // Update event ticket counts if paid
    if (sale.saleStatus === "paid") {
      await event.update({
        soldTickets: event.soldTickets + quantity,
        availableTickets: event.availableTickets - quantity,
      });
    }

    return await this.getById(sale.id);
  },

  async update(id, data) {
    const sale = await Sale.findByPk(id);
    if (!sale) throw new Error("Sale not found");

    const oldStatus = sale.saleStatus;
    const updatedSale = await sale.update(data);

    // Handle status change to paid
    if (oldStatus !== "paid" && data.saleStatus === "paid") {
      const event = await Event.findByPk(sale.event_id);
      if (event) {
        await event.update({
          soldTickets: event.soldTickets + sale.quantity,
          availableTickets: event.availableTickets - sale.quantity,
        });
      }
    }

    return updatedSale;
  },

  async remove(id) {
    const sale = await Sale.findByPk(id);
    if (!sale) throw new Error("Sale not found");

    // Revert ticket counts if paid
    if (sale.saleStatus === "paid") {
      const event = await Event.findByPk(sale.event_id);
      if (event) {
        await event.update({
          soldTickets: Math.max(0, event.soldTickets - sale.quantity),
          availableTickets: event.availableTickets + sale.quantity,
        });
      }
    }

    await sale.destroy();
  },

  async getSalesStats() {
    const totalSales = await Sale.count();
    const paidSales = await Sale.count({ where: { saleStatus: "paid" } });

    const revenueResult = await Sale.findAll({
      where: { saleStatus: "paid" },
      attributes: [
        [
          Sale.sequelize.fn("SUM", Sale.sequelize.col("totalAmount")),
          "totalRevenue",
        ],
      ],
      raw: true,
    });

    const salesByStatus = await Sale.findAll({
      attributes: ["saleStatus", [Sale.sequelize.fn("COUNT", "id"), "count"]],
      group: ["saleStatus"],
      raw: true,
    });

    return {
      totalSales,
      paidSales,
      totalRevenue: parseFloat(revenueResult[0]?.totalRevenue || 0),
      salesByStatus: salesByStatus.reduce((acc, item) => {
        acc[item.saleStatus] = item.count;
        return acc;
      }, {}),
    };
  },
};
