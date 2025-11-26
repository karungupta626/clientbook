import express from "express";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./db";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/v1", routes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
