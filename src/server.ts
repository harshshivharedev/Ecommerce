
import "dotenv/config";
import app from "./app.js";
import rootRouter from "./routes/index.js";

const PORT = process.env.PORT || 5000;

app.use('./api',rootRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});