import { Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utility/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) 
            return res.status(400).json({message: "All fields are required!!"})

        const existing = await pool.query("SELECT * FRPM users WHERE email = $1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({message: "Email already in use!!"});
        
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query(
          `INSERT INTO users (name, email, password_hash , role) VALUES ($1, $2, $3, $4) RETURNING *`,
          [name, email, hashed, role]
        );

        res.status(200).json({user: result.rows[0]});

    } catch (error) {
        res.status(500).json({ error: "Registration failed" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userQuery.rows[0];
        if(!user) return res.status(404).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password_hash);
        if(!isValid) return res.status(401).json({message: "Invalid password!!"});

        const token = generateToken(user.id, user.role);
        res.json({ token, user: {id: user.id, name: user.name, email: user.email, role: user.role } })

    } catch (error) {
        res.status(500).json({ error: "Login failed" })
    }
}

