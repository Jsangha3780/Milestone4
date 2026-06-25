import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

// GET one user
router.get("/:id", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `User ${req.params.id} not found` });
  }
  res.json(rows[0]);
});

// POST new user
router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({
      error: "name and email are required"
    });
    return;
  }

  const [result]: any = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  res.status(201).json({
    id: result.insertId,
    name,
    email
  });
});

// UPDATE user
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const userId = req.params.id;

  const [existingRows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
  if (!existingRows || existingRows.length === 0) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const existing = existingRows[0];
  const updatedName = name ?? existing.name;
  const updatedEmail = email ?? existing.email;

  await pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [updatedName, updatedEmail, userId]
  );

  res.json({ message: `User ${userId} updated` });
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  const [result]: any = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: `User ${req.params.id} not found` });
  }
  res.json({ message: `User ${req.params.id} deleted` });
});

export default router;
