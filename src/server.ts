import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import commentRoutes from "./routes/commentRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import projectStatsRoutes from "./routes/projectStatsRoutes";

/* Socket.IO */
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api", commentRoutes);
app.use("/api", reviewRoutes);
app.use("/api", notificationRoutes);
app.use("/api", projectStatsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

/* Create HTTP server for Express + Socket.IO */
const server = http.createServer(app);

/* Socket.IO setup */
const io = new Server(server, {
  cors: { origin: "*" }, // adjust to your frontend URL in production
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined project_${projectId}`);
  });

  socket.on("newComment", (data) => {
    io.to(`project_${data.projectId}`).emit("commentAdded", data);
  });

  socket.on("reviewUpdate", (data) => {
    io.to(`project_${data.projectId}`).emit("reviewUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* Start server */
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
