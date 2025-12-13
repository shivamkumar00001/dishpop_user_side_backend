import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.config.js";

dotenv.config();

// Connect DB
connectDB();

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ✅ MAKE SOCKET AVAILABLE IN CONTROLLERS
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connection logs (optional)
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("join-restaurant", (username) => {
    socket.join(username);
    console.log(`Joined restaurant room: ${username}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
