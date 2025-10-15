import { Event, Sale } from "../models/index.js";
import { Op } from "sequelize";

export const eventService = {
  async getAll(filters = {}) {
    const where = {};

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.search) {
      where.description = { [Op.like]: `%${filters.search}%` };
    }

    return await Event.findAll({
      where,
      order: [["date", "ASC"]],
      include: [
        {
          model: Sale,
          as: "sales",
          attributes: ["id", "saleStatus", "quantity"],
        },
      ],
    });
  },

  async getById(id) {
    return await Event.findByPk(id, {
      include: [
        {
          model: Sale,
          as: "sales",
          attributes: ["id", "user_id", "saleStatus", "quantity", "saleDate"],
        },
      ],
    });
  },

  async create(data) {
    // Validate dates
    const startSales = new Date(data.startSales);
    const endSales = new Date(data.endSales);
    const eventDate = new Date(data.date);

    if (startSales >= endSales) {
      throw new Error("Sales start date must be before end date");
    }

    if (endSales >= eventDate) {
      throw new Error("Sales period must end before event date");
    }

    return await Event.create(data);
  },

  async update(id, data) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    return await event.update(data);
  },

  async remove(id) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    // Check for associated sales
    const salesCount = await Sale.count({ where: { event_id: id } });
    if (salesCount > 0) {
      throw new Error("Cannot delete event with associated sales");
    }

    await event.destroy();
  },

  async getStats() {
    const totalEvents = await Event.count();
    const upcomingEvents = await Event.count({
      where: { date: { [Op.gt]: new Date() } },
    });
    const totalTicketsSold = await Sale.sum("quantity", {
      where: { saleStatus: "paid" },
    });

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

    return {
      totalEvents,
      upcomingEvents,
      totalTicketsSold: totalTicketsSold || 0,
      totalRevenue: parseFloat(revenueResult[0]?.totalRevenue || 0),
    };
  },
};
