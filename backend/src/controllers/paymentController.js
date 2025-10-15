// backend/src/controllers/paymentController.js
import { paymentService } from "../services/paymentService.js";
import Payment from "../models/Payment.js";

export const paymentController = {
  async processCreditCard(req, res, next) {
    try {
      const { saleId, cardData } = req.body;
      const payment = await paymentService.processCardPayment(
        saleId,
        cardData,
        true
      );
      res.json({
        success: payment.status === "completed",
        payment,
        message:
          payment.status === "completed"
            ? "Payment completed successfully"
            : "Payment failed",
      });
    } catch (error) {
      next(error);
    }
  },

  async processDebitCard(req, res, next) {
    try {
      const { saleId, cardData } = req.body;
      const payment = await paymentService.processCardPayment(
        saleId,
        cardData,
        false
      );
      res.json({
        success: payment.status === "completed",
        payment,
        message:
          payment.status === "completed"
            ? "Payment completed successfully"
            : "Payment failed",
      });
    } catch (error) {
      next(error);
    }
  },

  async generatePix(req, res, next) {
    try {
      const { saleId, pixKey } = req.body;
      const payment = await paymentService.generatePixPayment(saleId, pixKey);
      res.json({
        success: true,
        payment,
        message: "PIX QR Code generated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async checkPixStatus(req, res, next) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.checkPixStatus(paymentId);
      res.json({
        success: payment.status === "completed",
        payment,
        message:
          payment.status === "completed"
            ? "PIX payment confirmed"
            : "Payment still pending",
      });
    } catch (error) {
      next(error);
    }
  },

  async refund(req, res, next) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.refundPayment(paymentId);
      res.json({
        success: true,
        payment,
        message: "Payment refunded successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getPayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: Sale,
            as: "sale",
            include: ["event"],
          },
        ],
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  },

  async getPaymentBySale(req, res, next) {
    try {
      const { saleId } = req.params;
      const payment = await paymentService.getPaymentBySaleId(saleId);

      if (!payment) {
        return res
          .status(404)
          .json({ message: "No payment found for this sale" });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const payments = await paymentService.getAllPayments(req.query);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  },
};
