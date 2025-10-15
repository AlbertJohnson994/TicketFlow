import Event from "./Event.js";
import Sale from "./Sale.js";
import Payment from "./Payment.js";

// Define associations centrally (only here)
Event.hasMany(Sale, { foreignKey: "event_id", as: "sales" });
Sale.belongsTo(Event, { foreignKey: "event_id", as: "event" });

Sale.hasMany(Payment, { foreignKey: "sale_id", as: "payments" });
Payment.belongsTo(Sale, { foreignKey: "sale_id", as: "sale" });

export { Event, Sale, Payment };
