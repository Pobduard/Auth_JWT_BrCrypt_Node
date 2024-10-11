import express from "express";
import { login, register } from "../controllers/authController";

export const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
