import { Request, Response } from "express";

let users: string[] = [];

export function getUsers(req: Request, res: Response) {
  res.json(users);
}

export function createUser(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }
  users.push(name);
  res.status(201).json({ message: "Usuário criado com sucesso!" });
}
