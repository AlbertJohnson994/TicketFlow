import { sequelize } from "../config/database.js";
import Event from "../models/Event.js";
import Sale from "../models/Sale.js";
import { faker } from "@faker-js/faker";

const EVENT_TYPES = [
  { id: 1, name: "Concert", emoji: "🎵" },
  { id: 2, name: "Theater", emoji: "🎭" },
  { id: 3, name: "Sports", emoji: "⚽" },
  { id: 4, name: "Conference", emoji: "📊" },
  { id: 5, name: "Workshop", emoji: "🔧" },
  { id: 6, name: "Festival", emoji: "🎪" },
];

const SALE_STATUSES = ["pending", "paid", "cancelled", "refunded"];
const PAYMENT_METHODS = ["credit_card", "debit_card", "pix", "cash"];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    await sequelize.sync({ force: true });
    console.log("✅ Database synchronized");

    // Create events
    const events = [];
    for (let i = 0; i < 12; i++) {
      const eventDate = faker.date.future({ days: 60 });
      const startSales = faker.date.recent({ days: 10 });
      const endSales = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before event

      const event = await Event.create({
        description: `${EVENT_TYPES[i % EVENT_TYPES.length].name} - ${faker.commerce.productName()}`,
        type: (i % EVENT_TYPES.length) + 1,
        date: eventDate,
        startSales: startSales,
        endSales: endSales,
        price: parseFloat(faker.commerce.price(50, 300, 2)),
        availableTickets: faker.number.int({ min: 50, max: 500 }),
        soldTickets: 0,
        status: "upcoming",
      });
      events.push(event);
      console.log(`✅ Created event: ${event.description}`);
    }

    // Create sales
    const sales = [];
    for (let i = 0; i < 50; i++) {
      const event = faker.helpers.arrayElement(events);
      const status = faker.helpers.arrayElement(SALE_STATUSES);
      const quantity = faker.number.int({ min: 1, max: 4 });

      const sale = await Sale.create({
        user_id: faker.string.uuid(),
        event_id: event.id,
        saleDate: faker.date.recent({ days: 30 }),
        saleStatus: status,
        quantity: quantity,
        totalAmount: event.price * quantity,
        paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
        transactionId: `TXN${faker.string.alphanumeric(10).toUpperCase()}`,
      });
      sales.push(sale);
    }
    console.log(`✅ Created ${sales.length} sales`);

    // Update event statistics
    for (const event of events) {
      const eventSales = await Sale.findAll({
        where: {
          event_id: event.id,
          saleStatus: "paid",
        },
      });

      const soldTickets = eventSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );

      await event.update({
        soldTickets: soldTickets,
        availableTickets: Math.max(0, event.availableTickets - soldTickets),
      });
    }

    console.log("🎉 Seed completed successfully!");
    console.log(`📅 ${events.length} events created`);
    console.log(`💰 ${sales.length} sales created`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("✅ Seed process finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed process failed:", error);
      process.exit(1);
    });
}

export { seed };
