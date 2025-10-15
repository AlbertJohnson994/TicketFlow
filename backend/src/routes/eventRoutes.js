import express from "express";
import { eventController } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", eventController.getAll);
router.get("/stats", eventController.getStats);
router.get("/:id", eventController.getById);
router.post("/", eventController.create);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.remove);

export default router;
