import { Request, Response } from "express";
import { pool } from "../config/db";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id =$1", [id]);
    if (!user.rows.length)
      return res.status(404).json({ message: "User not found" });
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, updatedAt = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [name, email, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user."})
  }
};

export const deleteUSer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id =$1", [id]);
    res.json({ message: "User deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user!" });
  }
};
