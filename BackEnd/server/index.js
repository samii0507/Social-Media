import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

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
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));