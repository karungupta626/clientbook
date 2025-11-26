import { Router, Request, Response, NextFunction } from "express";
import clientService from "../services/client";

const router = Router();

/**
 * POST /client
 * Create a new client record
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const created = await clientService.createClient(payload);
    res.json({ success: true, data: created });
  } catch (err: any) {
    next(err);
  }
});

/**
 * GET /client
 * Get all clients
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await clientService.getClients();
    res.json({ success: true, data: list });
  } catch (err: any) {
    next(err);
  }
});

/**
 * GET /client/:id
 * Get a single client by id
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const client = await clientService.getClientById(id);
    if (!client) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: client });
  } catch (err: any) {
    next(err);
  }
});

/**
 * PUT /client/:id
 * Update client
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const updated = await clientService.updateClient(id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    next(err);
  }
});

/**
 * DELETE /client/:id
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const removed = await clientService.deleteClient(id);
    res.json({ success: true, data: removed });
  } catch (err: any) {
    next(err);
  }
});

export default router;
