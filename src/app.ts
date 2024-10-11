import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";

export const app = express();

app.use(express.json());

// Routes endpoint
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
