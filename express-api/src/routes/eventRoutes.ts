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
  const [rows]: any = await pool.query("SELECT * FROM events WHERE id = ?", [req.params.id]);
  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }
  res.json(rows[0]);
});

// POST new event
router.post("/", async (req: Request, res: Response) => {
  const { title, event_date, location } = req.body;

  if (!title || !event_date || !location) {
    res.status(400).json({
      error: "title, event_date and location are required"
    });
    return;
  }

  const [result]: any = await pool.query(
    "INSERT INTO events (title, event_date, location) VALUES (?, ?, ?)",
    [title, event_date, location]
  );

  res.status(201).json({
    id: result.insertId,
    title,
    event_date,
    location
  });
});

// UPDATE event
router.put("/:id", async (req: Request, res: Response) => {
  const { title, event_date, location } = req.body;
  const eventId = req.params.id;

  const [existingRows]: any = await pool.query("SELECT * FROM events WHERE id = ?", [eventId]);
  if (!existingRows || existingRows.length === 0) {
    return res.status(404).json({ message: `Event ${eventId} not found` });
  }

  const existing = existingRows[0];
  const updatedTitle = title ?? existing.title;
  const updatedDate = event_date ?? existing.event_date;
  const updatedLocation = location ?? existing.location;

  await pool.query(
    "UPDATE events SET title = ?, event_date = ?, location = ? WHERE id = ?",
    [updatedTitle, updatedDate, updatedLocation, eventId]
  );

  res.json({ message: `Event ${eventId} updated` });
});

// DELETE event
router.delete("/:id", async (req: Request, res: Response) => {
  const [result]: any = await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }
  res.json({ message: `Event ${req.params.id} deleted` });
});

// UPDATE interest
router.put("/:id/interested", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM events WHERE id = ?", [req.params.id]);
  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `Event ${req.params.id} not found` });
  }

  res.json({ message: `Interest updated for event ${req.params.id}` });
});

export default router;
