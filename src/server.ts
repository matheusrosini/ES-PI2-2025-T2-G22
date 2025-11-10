import express from "express";
import dotenv from "dotenv";
import { db } from "./database/db";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API NotaDez rodando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
