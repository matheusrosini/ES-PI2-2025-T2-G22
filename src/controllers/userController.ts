import { Request, Response } from "express";
import { db } from "../database/db";

export const getUsers = (req: Request, res: Response) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const createUser = (req: Request, res: Response) => {
  const { nome, email, telefone } = req.body;
  db.query(
    "INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)",
    [nome, email, telefone],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    }
  );
};
