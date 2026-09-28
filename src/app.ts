import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

app.use(express.json());

//  import routes 
import authRouter from "./routes/user.routes.js"

export default app;