import { saleService } from "../services/saleService.js";

export const saleController = {
  async getAll(req, res, next) {
    try {
      const sales = await saleService.getAll(req.query);
      res.json(sales);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const sale = await saleService.getById(req.params.id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const newSale = await saleService.create(req.body);
      res.status(201).json(newSale);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await saleService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await saleService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await saleService.getSalesStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};
