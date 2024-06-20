import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"; // Import cors
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// Get the current file name (__filename) and the directory name (__dirname)
// of the current module in an ES module context.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure environment variables, set up an Express application,
// parse JSON requests, secure the app with Helmet, and configure Helmet to allow
// cross-origin resource sharing.
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Use Morgan middleware for logging HTTP requests in the "common" format.
// Use Body-Parser middleware to parse JSON requests with a size limit of
// 30mb and extended syntax.
// Use Body-Parser middleware to parse URL-encoded requests with a size limit
// of 30mb and extended syntax.
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
 
// Use CORS middleware to enable Cross-Origin Resource Sharing, allowing the server
// to handle requests from different origins.
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve static files from the "public/assets" directory when the "/assets" route is accessed.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
// this come from multer documentation on github
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), verifyToken, register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    // ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
