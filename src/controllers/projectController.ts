import { Request, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/checkAuth";
import { log } from "console";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const userId = req.user?.id;

    if (!name)
      return res.status(400).json({ message: "Project name required!" });

    const result = await pool.query(
      `INSERT INTO projects (name, userId) VALUES ($1, $2) RETURNING *`,
      [name, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project!!" });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name
       FROM projects p
       JOIN users u ON p.userId = u.id
       ORDER BY p.createdAt DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching projects: ", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};


export const addMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { userId, role } = req.body;

    if (!userId || !role)
      return res.status(400).json({ message: "userId and role required" });

    const projectExists = await pool.query(`SELECT * FROM projects WHERE id = $1`, [id]);
    if (!projectExists.rows.length)
        return res.status(404).json({ message: "Project not found"})
    
    const result = await pool.query(
      `INSERT INTO reviewers (projectId, userId, role) VALUES ($1, $2, $3) ON CONFLICT (projectId, userId) DO NOTHING RETURNING *`,
      [id, userId, role]
    );

    if (result.rows.length === 0)
        return res.status(400).json({ message: "User already assigned to the project"})

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member"})
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
    try {
    const { id, userId } = req.params;

    const result = await pool.query(
      "DELETE FROM reviewers WHERE projectId = $1 AND userId = $2 RETURNING *",
      [id, userId]
    );

    if (!result.rows.length)
      return res
        .status(404)
        .json({ message: "Member not found in this project" });

    res.json({ message: "Member removed successfully" });
        
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: "Failed to remove member" })
        
    }
}