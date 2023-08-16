import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { User } from '../models';

export async function getUsers(req: Request, res: Response) {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) res.sendStatus(404);
  else res.json(user);
}

export async function addUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });
  res.status(201).json(newUser);
}

export async function updateUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) res.sendStatus(404);
  else {
    const { name, email, password } = req.body;
    await user.update({ name, email, password });
    res.json(user);
  }
}

export async function deleteUser(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) res.sendStatus(404);
  else {
    await user?.destroy();
    res.sendStatus(204);
  }
}
