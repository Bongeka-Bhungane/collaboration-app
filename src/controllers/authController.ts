import { Request, Response } from "express";
import { pool } from "../config/db";
import { generateToken } from "../utility/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password_hash, role } = req.body

        if (!name || !email || !password_hash || !role) 
            return res.status(400).json({message: "All fields are required!!"})

        const existing = await pool.query("SELECT * FRPM users WHERE email = $1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({message: "Email already in use!!"});

        const result = await pool.query(
          `INSERT INTO users (name, email, password_hash , role) VALUES ($1, $2, $3, $4) RETURNING *`,
          [name, email, password_hash, role]
        );

        res.status(200).json({user: result.rows[0]});

    } catch (error) {
        res.status(500).json({ error: "Registration failed" })
    }
}