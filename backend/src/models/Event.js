import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Event description is required" },
        len: { args: [3, 255], msg: "Description must be 3-255 characters" },
      },
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Type must be at least 1" },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Event date must be valid" },
      },
    },
    startSales: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Start sales date must be valid" },
      },
    },
    endSales: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "End sales date must be valid" },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Price cannot be negative" },
      },
    },
    availableTickets: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: {
        min: { args: [0], msg: "Available tickets cannot be negative" },
      },
    },
    soldTickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Sold tickets cannot be negative" },
      },
    },
    status: {
      type: DataTypes.ENUM("upcoming", "active", "cancelled", "completed"),
      defaultValue: "upcoming",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        const now = new Date();
        if (event.date && new Date(event.date) < now) {
          event.status = "completed";
        } else if (event.date && new Date(event.date) > now) {
          event.status = "upcoming";
        }
      },
    },
  }
);

export default Event;
