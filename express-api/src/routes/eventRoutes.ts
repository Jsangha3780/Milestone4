import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all events
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM events");
  res.json(rows);
});

// GET one event
router.get("/:id", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query(
    "SELECT * FROM events WHERE event_id = ?",
    [req.params.id]
  );

  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }

  res.json(rows[0]);
});

// POST new event
router.post("/", async (req: Request, res: Response) => {
  const { college_id, title } = req.body;

  if (!college_id || !title) {
    res.status(400).json({
      error: "college_id and title are required"
    });
    return;
  }

  const [result]: any = await pool.query(
    "INSERT INTO events (college_id, title) VALUES (?, ?)",
    [college_id, title]
  );

  res.status(201).json({
    id: result.insertId,
    college_id,
    title
  });
});

// PUT update event
router.put("/:id", async (req: Request, res: Response) => {
  const { college_id, title } = req.body;

  const [result]: any = await pool.query(
    "UPDATE events SET college_id = ?, title = ? WHERE event_id = ?",
    [college_id, title, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }

  res.json({
    message: `Event ${req.params.id} updated`,
    college_id,
    title
  });
});

// DELETE event
router.delete("/:id", async (req: Request, res: Response) => {
  const [result]: any = await pool.query(
    "DELETE FROM events WHERE event_id = ?",
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }

  res.json({ message: `Event ${req.params.id} deleted` });
});

// UPDATE interest (remove unless needed for Milestone 5)
router.put("/:id/interested", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query(
    "SELECT * FROM events WHERE event_id = ?",
    [req.params.id]
  );

  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }

  res.json({ message: `Interest updated for event ${req.params.id}` });
});

export default router;
