import express from "express";
import { saleController } from "../controllers/saleController.js";

const router = express.Router();

router.get("/", saleController.getAll);
router.get("/stats", saleController.getStats);
router.get("/:id", saleController.getById);
router.post("/", saleController.create);
router.put("/:id", saleController.update);
router.delete("/:id", saleController.remove);

export default router;
