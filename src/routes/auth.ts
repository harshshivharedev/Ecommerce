import { Router } from "express";
import {signup} from "../controllers/auth.js";

export const authRoutes:Router = Router();

authRoutes.post('/signup', signup);