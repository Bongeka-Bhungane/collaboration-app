import { Request, Response } from "express";
import { pool } from "../config/db";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const result = await pool.query(
      `SELECT * 
       FROM notifications
       WHERE userId = $1
       ORDER BY createdAt DESC
       LIMIT 50`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
