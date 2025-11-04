import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
