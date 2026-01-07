 









// // // import dotenv from "dotenv";
// // // import http from "http";
// // // import { Server } from "socket.io";
// // // import app from "./app.js";
// // // import connectDB from "./config/db.config.js";
// // // import { initRedisPublisher } from "./config/redisPublisher.js";
// // // import restaurantSocketService from "./services/restaurantSocket.services.js"; // 🆕 ADDED

// // // dotenv.config();

// // // /* ===============================
// // //    DATABASE
// // // =============================== */
// // // await connectDB();

// // // /* ===============================
// // //    HTTP SERVER
// // // =============================== */
// // // const server = http.createServer(app);
// // // initRedisPublisher(); // 🔥 ONLY ONCE

// // // /* ===============================
// // //    SOCKET.IO SERVER (for your customers)
// // // =============================== */
// // // export const io = new Server(server, {
// // //   cors: {
// // //     origin: "*", // tighten this in production
// // //     methods: ["GET", "POST"],
// // //     credentials: true,
// // //   },
// // //   transports: ["websocket"],
// // // });

// // // /* ===============================
// // //    MAKE SOCKET AVAILABLE
// // // =============================== */
// // // app.use((req, res, next) => {
// // //   req.io = io;
// // //   next();
// // // });

// // // /* ===============================
// // //    SOCKET EVENTS (for your customers)
// // // =============================== */
// // // io.on("connection", (socket) => {
// // //   console.log("🟢 Client connected:", socket.id);

// // //   socket.on("join-restaurant", (username) => {
// // //     if (!username) return;
// // //     socket.join(username);
// // //     console.log(`🏠 Joined restaurant room: ${username}`);
// // //   });

// // //   socket.on("disconnect", () => {
// // //     console.log("🔴 Client disconnected:", socket.id);
// // //   });
// // // });

// // // /* ===============================
// // //    START SERVER
// // // =============================== */
// // // const PORT = process.env.PORT || 3000;

// // // server.listen(PORT, "0.0.0.0", () => {
// // //   console.log(`🚀 Customer backend running on port ${PORT}`);

// // //   // 🆕 CONNECT TO RESTAURANT BACKEND (for real-time dashboard updates)
// // //   try {
// // //     const restaurantBackendUrl = process.env.RESTAURANT_BACKEND_URL;
    
// // //     if (restaurantBackendUrl) {
// // //       restaurantSocketService.connect();
// // //       console.log(`🔌 Connecting to restaurant backend: ${restaurantBackendUrl}`);
// // //       console.log("📡 Restaurant dashboard will receive real-time order updates");
// // //     } else {
// // //       console.log("⚠️  RESTAURANT_BACKEND_URL not set in .env");
// // //       console.log("📝 Orders will save, but restaurant dashboard needs manual refresh");
// // //     }
// // //   } catch (error) {
// // //     console.error("⚠️  Failed to connect to restaurant backend:", error.message);
// // //     console.log("📝 Orders will still save, but restaurant dashboard needs manual refresh");
// // //   }
// // // });

// // // /* ===============================
// // //    🆕 GRACEFUL SHUTDOWN
// // // =============================== */
// // // const gracefulShutdown = () => {
// // //   console.log("\n🛑 Shutting down gracefully...");
  
// // //   // Disconnect from restaurant backend
// // //   restaurantSocketService.disconnect();
// // //   console.log("✅ Disconnected from restaurant backend");
  
// // //   // Close Socket.IO server
// // //   io.close(() => {
// // //     console.log("✅ Socket.IO server closed");
// // //   });
  
// // //   // Close HTTP server
// // //   server.close(() => {
// // //     console.log("✅ HTTP server closed");
// // //     process.exit(0);
// // //   });
  
// // //   // Force close after 10 seconds
// // //   setTimeout(() => {
// // //     console.error("⚠️  Forced shutdown after timeout");
// // //     process.exit(1);
// // //   }, 10000);
// // // };

// // // process.on("SIGTERM", gracefulShutdown);
// // // process.on("SIGINT", gracefulShutdown);

// // // /* ===============================
// // //    ERROR HANDLING
// // // =============================== */
// // // process.on("unhandledRejection", (err) => {
// // //   console.error("❌ Unhandled Rejection:", err);
// // // });

// // // process.on("uncaughtException", (err) => {
// // //   console.error("❌ Uncaught Exception:", err);
// // //   gracefulShutdown();
// // // });// ===============================
// // // ENV SETUP (ES MODULE SAFE)
// // // ===============================
// // import dotenv from "dotenv";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // dotenv.config({
// //   path: path.resolve(__dirname, "../.env"),
// // });

// // // ===============================
// // // CORE IMPORTS
// // // ===============================
// // import http from "http";
// // import { Server } from "socket.io";
// // import app from "./app.js";
// // import connectDB from "./config/db.config.js";
// // import { initRedisPublisher } from "./config/redisPublisher.js";
// // import restaurantSocketService from "./services/restaurantSocket.services.js";

// // // ===============================
// // // ENV VALIDATION (FAIL FAST)
// // // ===============================
// // if (!process.env.MONGO_URI) {
// //   throw new Error("❌ MONGO_URI not found. Check .env file location");
// // }

// // // ===============================
// // // DATABASE
// // // ===============================
// // await connectDB();

// // // ===============================
// // // HTTP SERVER
// // // ===============================
// // const server = http.createServer(app);

// // // Init Redis publisher ONCE
// // initRedisPublisher();

// // // ===============================
// // // SOCKET.IO SERVER (Customer Side)
// // // ===============================
// // export const io = new Server(server, {
// //   cors: {
// //     origin: "*", // tighten in production
// //     methods: ["GET", "POST"],
// //     credentials: true,
// //   },
// //   // transports: ["websocket"],
// // });

// // // ===============================
// // // MAKE SOCKET AVAILABLE IN ROUTES
// // // ===============================
// // app.use((req, res, next) => {
// //   req.io = io;
// //   next();
// // });

// // // ===============================
// // // SOCKET EVENTS
// // // ===============================
// // io.on("connection", (socket) => {
// //   console.log("🟢 Client connected:", socket.id);

// //   socket.on("join-restaurant", (username) => {
// //     if (!username) return;
// //     socket.join(username);
// //     console.log(`🏠 Joined restaurant room: ${username}`);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("🔴 Client disconnected:", socket.id);
// //   });
// // });

// // // ===============================
// // // START SERVER
// // // ===============================
// // const PORT = process.env.PORT || 3000;

// // server.listen(PORT, "0.0.0.0", () => {
// //   console.log(`🚀 Customer backend running on port ${PORT}`);

// //   try {
// //     const restaurantBackendUrl = process.env.RESTAURANT_BACKEND_URL;

// //     if (restaurantBackendUrl) {
// //       restaurantSocketService.connect();
// //       console.log(`🔌 Connected to restaurant backend: ${restaurantBackendUrl}`);
// //       console.log("📡 Real-time restaurant dashboard enabled");
// //     } else {
// //       console.log("⚠️ RESTAURANT_BACKEND_URL not set");
// //       console.log("📝 Orders save, dashboard needs refresh");
// //     }
// //   } catch (error) {
// //     console.error("⚠️ Restaurant backend connection failed:", error.message);
// //   }
// // });

// // // ===============================
// // // GRACEFUL SHUTDOWN
// // // ===============================
// // const gracefulShutdown = () => {
// //   console.log("\n🛑 Shutting down gracefully...");

// //   restaurantSocketService.disconnect();

// //   io.close(() => {
// //     console.log("✅ Socket.IO closed");
// //   });

// //   server.close(() => {
// //     console.log("✅ HTTP server closed");
// //     process.exit(0);
// //   });

// //   setTimeout(() => {
// //     console.error("⚠️ Forced shutdown");
// //     process.exit(1);
// //   }, 10000);
// // };

// // process.on("SIGINT", gracefulShutdown);
// // process.on("SIGTERM", gracefulShutdown);

// // // ===============================
// // // ERROR HANDLING
// // // ===============================
// // process.on("unhandledRejection", (err) => {
// //   console.error("❌ Unhandled Rejection:", err);
// // });

// // process.on("uncaughtException", (err) => {
// //   console.error("❌ Uncaught Exception:", err);
// //   gracefulShutdown();
// // });
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });

// // ===============================
// // CORE IMPORTS
// // ===============================
// import http from "http";
// import { Server } from "socket.io";
// import app from "./app.js";
// import connectDB from "./config/db.config.js";
// import { initRedisPublisher } from "./config/redisPublisher.js";
// import restaurantSocketService from "./services/restaurantSocket.services.js";
// import legacyProxyRoutes from "./routes/legacyProxy.routes.js";

// app.use("/api", legacyProxyRoutes);


// // ===============================
// // ENV VALIDATION (FAIL FAST)
// // ===============================
// if (!process.env.MONGO_URI) {
//   throw new Error("❌ MONGO_URI not found. Check .env file location");
// }

// // ===============================
// // DATABASE
// // ===============================
// await connectDB();

// // ===============================
// // HTTP SERVER
// // ===============================
// const server = http.createServer(app);

// // Init Redis publisher ONCE
// initRedisPublisher();

// // ===============================
// // SOCKET.IO SERVER (Customer Side)
// // ===============================
// export const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // ===============================
// // MAKE SOCKET AVAILABLE IN ROUTES
// // ===============================
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ===============================
// // SOCKET EVENTS
// // ===============================
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   socket.on("join-restaurant", (username) => {
//     if (!username) return;
//     socket.join(username);
//     console.log(`🏠 Joined restaurant room: ${username}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // ===============================
// // START SERVER
// // ===============================
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`🚀 Customer backend running on http://localhost:${PORT}`);

//   const restaurantBackendUrl = process.env.RESTAURANT_BACKEND_URL;

//   if (restaurantBackendUrl) {
//     restaurantSocketService.connect(); // real connection handled inside service
//   } else {
//     console.log("⚠️ RESTAURANT_BACKEND_URL not set");
//     console.log("📝 Orders save, dashboard needs refresh");
//   }
// });

// // ===============================
// // GRACEFUL SHUTDOWN
// // ===============================
// const gracefulShutdown = () => {
//   console.log("\n🛑 Shutting down gracefully...");

//   restaurantSocketService.disconnect();

//   io.close(() => {
//     console.log("✅ Socket.IO closed");
//   });

//   server.close(() => {
//     console.log("✅ HTTP server closed");
//     process.exit(0);
//   });

//   setTimeout(() => {
//     console.error("⚠️ Forced shutdown");
//     process.exit(1);
//   }, 10000);
// };

// process.on("SIGINT", gracefulShutdown);
// process.on("SIGTERM", gracefulShutdown);

// // ===============================
// // ERROR HANDLING
// // ===============================
// process.on("unhandledRejection", (err) => {
//   console.error("❌ Unhandled Rejection:", err);
// });

// process.on("uncaughtException", (err) => {
//   console.error("❌ Uncaught Exception:", err);
//   gracefulShutdown();
// });
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
    override: true,

});
console.log("ENV CHECK:", process.env.RESTAURANT_BACKEND_URL);

// ===============================
// CORE IMPORTS
// ===============================
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import { initRedisPublisher } from "./config/redisPublisher.js";
import restaurantSocketService from "./services/restaurantSocket.services.js";
import legacyProxyRoutes from "./routes/legacyProxy.routes.js";

// ===============================
// ENV VALIDATION (FAIL FAST)
// ===============================
if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI not found. Check .env file location");
}

if (!process.env.RESTAURANT_BACKEND_URL) {
  console.warn("⚠️ RESTAURANT_BACKEND_URL not set");
  console.warn("⚠️ /api/restaurants & /api/menu will return 404");
}

// ===============================
// DATABASE
// ===============================
await connectDB();

// ===============================
// API ROUTES (PROXY)
// ===============================
app.use("/api", legacyProxyRoutes);

// ===============================
// HTTP SERVER
// ===============================
const server = http.createServer(app);

// Init Redis publisher ONCE
initRedisPublisher();

// ===============================
// SOCKET.IO SERVER (Customer Side)
// ===============================
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ===============================
// MAKE SOCKET AVAILABLE IN ROUTES
// ===============================
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ===============================
// SOCKET EVENTS
// ===============================
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join-restaurant", (username) => {
    if (!username) return;
    socket.join(username);
    console.log(`🏠 Joined restaurant room: ${username}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Customer backend running on http://localhost:${PORT}`);

  if (process.env.RESTAURANT_BACKEND_URL) {
    restaurantSocketService.connect();
  } else {
    console.log("📝 Orders save locally, dashboard requires refresh");
  }
});

// ===============================
// GRACEFUL SHUTDOWN
// ===============================
const gracefulShutdown = () => {
  console.log("\n🛑 Shutting down gracefully...");

  restaurantSocketService.disconnect();

  io.close(() => {
    console.log("✅ Socket.IO closed");
  });

  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("⚠️ Forced shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// ===============================
// ERROR HANDLING
// ===============================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown();
});
