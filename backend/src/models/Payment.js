import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sale_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "debit_card", "pix", "cash"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded"
      ),
      defaultValue: "pending",
    },
    // Credit/Debit Card Fields
    cardNumber: {
      type: DataTypes.STRING,
    },
    cardHolder: {
      type: DataTypes.STRING,
    },
    cardExpiry: {
      type: DataTypes.STRING,
    },
    cardCvv: {
      type: DataTypes.STRING,
    },
    // PIX Fields
    pixKey: {
      type: DataTypes.STRING,
    },
    pixQrCode: {
      type: DataTypes.TEXT,
    },
    pixExpiration: {
      type: DataTypes.DATE,
    },
    // Transaction Details
    transactionId: {
      type: DataTypes.STRING,
      unique: true,
    },
    gatewayResponse: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

// NOTE: associations are defined centrally in src/models/index.js
export default Payment;
