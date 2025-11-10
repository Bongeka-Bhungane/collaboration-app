import express, {Express, Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import { log } from "console";
import e = require("express");
import path = require("path");
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });