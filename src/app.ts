import express from "express";
import rootRouter from "./routes/index.js";

const app = express();

app.use(express.json());

//  import routes 


app.use('/api',rootRouter);

export { app };