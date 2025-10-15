// backend/src/routes/paymentRoutes.js
import express from "express";
import { paymentController } from "../controllers/paymentController.js";

const router = express.Router();

// Card Payments
router.post("/credit-card", paymentController.processCreditCard);
router.post("/debit-card", paymentController.processDebitCard);

// PIX Payments
router.post("/pix/generate", paymentController.generatePix);
router.get("/pix/status/:paymentId", paymentController.checkPixStatus);

// Payment Management
router.post("/refund/:paymentId", paymentController.refund);
router.get("/", paymentController.getAll);
router.get("/:paymentId", paymentController.getPayment);
router.get("/sale/:saleId", paymentController.getPaymentBySale);

export default router;
