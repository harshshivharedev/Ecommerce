import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

app.use(express.json());

app.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    message: "Ecommerce API is running",
    users,
  });
});

export default app;