import { Request, Response } from "express";
import { pool } from "pg";
import { AuthRequest } from "../middleware/checkAuth";

export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, fileName, content, status } = req.body;
    const userId = req.user?.id;

    if (!projectId || !fileName || !content)
      return res.status(400).json({ message: "all fields required!!" });

    const projectCheck = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId]
    );
    if (!projectCheck.rows.length)
      return res.status(404).json({ message: "Project not found" });

    const result = await pool.query(
      `INSERT INTO submissions (projectId, userId, fileName, content, status ) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [projectId, userId, fileName || null, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("Error creating submission", error);
   res.status(500).json({ message: "Failed creating submission"}) 
  }
};
