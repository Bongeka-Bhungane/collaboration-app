import { Request, Response } from "express";
import { pool } from "../config/db";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id =$1", [id]);
    if (!user.rows.length) return res.status(404).json({ message: "User not found"})
        res.json(user.rows[0])
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" })
  }
};
