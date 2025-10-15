import { eventService } from "../services/eventService.js";

export const eventController = {
  async getAll(req, res, next) {
    try {
      const events = await eventService.getAll(req.query);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const event = await eventService.getById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const newEvent = await eventService.create(req.body);
      res.status(201).json(newEvent);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await eventService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await eventService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await eventService.getStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};
