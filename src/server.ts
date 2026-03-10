import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { log } from "console";
import e = require("express");
import path = require("path");
import bodyParser from "body-parser";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";

/* NEW */
import submissionRoutes from "./routes/submissionRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

/* NEW ROUTES */
app.use("/api/submissions", submissionRoutes);
app.use("/api", commentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
