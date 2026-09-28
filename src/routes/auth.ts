import { Router } from "express";
import { login } from "../controllers/auth.js";

export const authRoutes:Router = Router();

authRoutes.get('/login', login);