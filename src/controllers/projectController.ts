import { Request, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/checkAuth";

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

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.log("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project!!"})
    
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(`SELECT p.* u.name AS owner_name FROM projects p JOIN users u ON p.userId = u.id ORDER by p.createdAt DESC`)

        res.json(result.rows)
    } catch (error) {
        console.log("Error fetching projects: ", error);
      res.status(500).json({ message: "Failed to fetch projects" })  
    }
}