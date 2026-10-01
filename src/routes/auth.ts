import { Router } from "express";
import {signup, login, me} from "../controllers/auth.js";
import { errorHandler } from "../error.handler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"


export const authRoutes:Router = Router();

authRoutes.post('/signup',errorHandler(signup));
authRoutes.post('/login', errorHandler(login));
authRoutes.get('/me', [authMiddleware], errorHandler(me))