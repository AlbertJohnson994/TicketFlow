import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: { msg: "User ID is required" },
      },
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Event ID is required" },
      },
    },
    saleDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    saleStatus: {
      type: DataTypes.ENUM("pending", "paid", "cancelled", "refunded"),
      defaultValue: "pending",
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: "Quantity must be at least 1" },
        max: { args: [10], msg: "Maximum 10 tickets per sale" },
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
    },
    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "debit_card", "pix", "cash"),
      defaultValue: "credit_card",
    },
    transactionId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

// NOTE: associations are defined centrally in src/models/index.js
export default Sale;
