import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Resolve __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/vite-project/dist")));

  app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/vite-project/dist/index.html"));
  })
}

// Start server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// import authRoutes from "./routes/auth.route.js";
// import userRoutes from "./routes/user.route.js";
// import chatRoutes from "./routes/chat.route.js";
// import { connectDB } from "./lib/db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Resolve __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirnamePath = path.dirname(__filename);

// // ------------------ MIDDLEWARE ------------------ //

// // CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173", // React dev server
//     credentials: true,
//   })
// );

// // JSON and cookies
// app.use(express.json());
// app.use(cookieParser());

// // Serve static files (e.g., favicon) from public
// app.use(express.static(path.join(__dirnamePath, "public")));

// // Content Security Policy for development
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; connect-src 'self' http://localhost:5001 http://localhost:5173; img-src 'self' https://flagcdn.com"
//   );
//   next();
// });


// // ------------------ API ROUTES ------------------ //

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/chat", chatRoutes);

// // Test API route
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is working!" });
// });

// // ------------------ ROOT ROUTE ------------------ //

// // Development root route to avoid 404
// if (process.env.NODE_ENV !== "production") {
//   app.get("/", (req, res) => {
//     res.send("Backend is running!");
//   });
// }

// // ------------------ SERVE REACT FRONTEND IN PRODUCTION ------------------ //
// if (process.env.NODE_ENV === "production") {
//   const frontendDist = path.join(__dirnamePath, "../../frontend/vite-project/dist");
//   const indexFile = path.join(frontendDist, "index.html");

//   if (fs.existsSync(indexFile)) {
//     app.use(express.static(frontendDist));

//     app.get("*", (req, res) => {
//       res.sendFile(indexFile);
//     });
//   } else {
//     console.warn(
//       "Warning: Frontend build not found. Run `npm run build --prefix frontend/vite-project` first."
//     );
//   }
// }

// // ------------------ START SERVER ------------------ //
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   connectDB();
// });
