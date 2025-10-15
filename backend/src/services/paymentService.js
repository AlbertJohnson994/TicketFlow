// backend/src/services/paymentService.js
import Payment from "../models/Payment.js";
import Sale from "../models/Sale.js";
import QRCode from "qrcode";

export const paymentService = {
  async processCardPayment(saleId, cardData, isCreditCard = true) {
    try {
      const sale = await Sale.findByPk(saleId, {
        include: ["event"],
      });

      if (!sale) throw new Error("Sale not found");

      // Validate card data
      if (!this.validateCardData(cardData)) {
        throw new Error("Invalid card data");
      }

      // Simulate payment processing with gateway
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // In real application, integrate with payment gateway like:
      // Stripe, Pagar.me, PayPal, Mercado Pago, etc.
      const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

      const payment = await Payment.create({
        sale_id: saleId,
        paymentMethod: isCreditCard ? "credit_card" : "debit_card",
        amount: sale.totalAmount,
        status: paymentSuccess ? "completed" : "failed",
        cardNumber: this.maskCardNumber(cardData.cardNumber),
        cardHolder: cardData.cardHolder,
        cardExpiry: cardData.cardExpiry,
        transactionId: transactionId,
        gatewayResponse: JSON.stringify({
          status: paymentSuccess ? "approved" : "declined",
          code: paymentSuccess ? "200" : "400",
        }),
      });

      // Update sale status if payment successful
      if (paymentSuccess) {
        await sale.update({ saleStatus: "paid" });

        // Update event ticket counts
        if (sale.event) {
          const event = sale.event;
          await event.update({
            soldTickets: event.soldTickets + sale.quantity,
            availableTickets: Math.max(
              0,
              event.availableTickets - sale.quantity
            ),
          });
        }
      }

      return payment;
    } catch (error) {
      throw new Error(`Card payment processing failed: ${error.message}`);
    }
  },

  async generatePixPayment(saleId, pixKey = null) {
    try {
      const sale = await Sale.findByPk(saleId, {
        include: ["event"],
      });

      if (!sale) throw new Error("Sale not found");

      const transactionId = `PIX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Generate PIX payload (BR Code format)
      const pixPayload = this.generatePixPayload({
        key: pixKey || this.generateRandomPixKey(),
        amount: sale.totalAmount,
        transactionId: transactionId,
        description: `Ingresso: ${sale.event?.description || "Event"}`,
        merchant: "TicketFlow Events",
        city: "São Paulo",
      });

      // Generate QR Code
      const qrCode = await QRCode.toDataURL(pixPayload);

      const payment = await Payment.create({
        sale_id: saleId,
        paymentMethod: "pix",
        amount: sale.totalAmount,
        status: "pending",
        pixKey: pixKey || this.generateRandomPixKey(),
        pixQrCode: qrCode,
        pixExpiration: expirationDate,
        transactionId: transactionId,
        gatewayResponse: JSON.stringify({ status: "pending", code: "201" }),
      });

      return payment;
    } catch (error) {
      throw new Error(`PIX generation failed: ${error.message}`);
    }
  },

  async checkPixStatus(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [{ model: Sale, as: "sale", include: ["event"] }],
    });

    if (!payment) throw new Error("Payment not found");

    // Simulate PIX confirmation (in real app, check with bank API)
    if (payment.status === "pending") {
      // 70% chance of payment confirmation for demo
      const isConfirmed = Math.random() > 0.3;

      if (isConfirmed) {
        await payment.update({ status: "completed" });
        await Sale.update(
          { saleStatus: "paid" },
          { where: { id: payment.sale_id } }
        );

        // Update event ticket counts
        if (payment.sale && payment.sale.event) {
          const event = payment.sale.event;
          await event.update({
            soldTickets: event.soldTickets + payment.sale.quantity,
            availableTickets: Math.max(
              0,
              event.availableTickets - payment.sale.quantity
            ),
          });
        }
      }
    }

    return payment;
  },

  async refundPayment(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [{ model: Sale, as: "sale" }],
    });

    if (!payment) throw new Error("Payment not found");

    if (payment.status !== "completed") {
      throw new Error("Only completed payments can be refunded");
    }

    // Process refund
    await payment.update({ status: "refunded" });

    // Update sale status
    await Sale.update(
      { saleStatus: "refunded" },
      { where: { id: payment.sale_id } }
    );

    // Restore event ticket counts
    if (payment.sale && payment.sale.event_id) {
      const sale = payment.sale;
      const event = await sale.getEvent();
      if (event) {
        await event.update({
          soldTickets: Math.max(0, event.soldTickets - sale.quantity),
          availableTickets: event.availableTickets + sale.quantity,
        });
      }
    }

    return payment;
  },

  validateCardData(cardData) {
    const { cardNumber, cardHolder, cardExpiry, cardCvv } = cardData;

    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16)
      return false;
    if (!cardHolder || cardHolder.trim().length < 3) return false;
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) return false;
    if (!cardCvv || (cardCvv.length !== 3 && cardCvv.length !== 4))
      return false;

    // Validate expiry date
    const [month, year] = cardExpiry.split("/");
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiryDate < new Date()) return false;

    return true;
  },

  maskCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");
    return cleaned.replace(/(\d{4})(\d{8})(\d{4})/, "$1********$3");
  },

  generatePixPayload(data) {
    // Simplified PIX payload for demonstration
    // In production, follow Central Bank of Brazil specifications
    return `00020126580014br.gov.bcb.pix0136${data.key}520400005303986540${data.amount.toFixed(2)}5802BR590${data.merchant}600${data.city}6214${data.transactionId}6304`;
  },

  generateRandomPixKey() {
    // Generate a random PIX key (in real app, use proper key generation)
    return `ticketflow${Date.now()}${Math.random().toString(36).substr(2, 6)}@ticketflow.com`;
  },

  async getPaymentBySaleId(saleId) {
    return await Payment.findOne({
      where: { sale_id: saleId },
      include: [{ model: Sale, as: "sale" }],
    });
  },

  async getAllPayments(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;

    return await Payment.findAll({
      where,
      include: [
        {
          model: Sale,
          as: "sale",
          include: ["event"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },
};
