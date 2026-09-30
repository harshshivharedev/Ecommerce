import { Router } from "express";
import {signup, login} from "../controllers/auth.js";
import { errorHandler } from "../error.handler.js";


export const authRoutes:Router = Router();

authRoutes.post('/signup',errorHandler(signup));
authRoutes.post('/login', errorHandler(login));