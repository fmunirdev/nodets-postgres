import { Router, Request, Response } from 'express';

import { User } from '../models';

const router = Router();

export default () => {
  router.get('/', async (req: Request, res: Response) => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  });

  router.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) res.sendStatus(404);
    else res.json(user);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) res.sendStatus(404);
    else {
      const { name, email, password } = req.body;
      await user.update({ name, email, password });
      res.json(user);
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) res.sendStatus(404);
    else {
      await user?.destroy();
      res.sendStatus(204);
    }
  });

  return router;
};
