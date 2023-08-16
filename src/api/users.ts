import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

import { User } from '../models';
import {
  idValidation,
  nameValidation,
  emailValidation,
  passwordValidation,
} from '../utils/validations';

const router = Router();

// Request validations
const userCreateValidations = () => {
  return [
    nameValidation(),
    emailValidation().custom(async (input) => {
      const count = await User.count({ where: { email: input } });
      if (count) throw new Error('Email already in use');
    }),
    passwordValidation(),
  ];
};

const userUpdateValidations = () => {
  return [
    idValidation(),
    nameValidation(),
    emailValidation().custom(async (input, { req }) => {
      const count = await User.count({
        where: { id: { [Op.ne]: req?.params?.id }, email: input },
      });
      if (count) throw new Error('Email already in use');
    }),
    passwordValidation(),
  ];
};

export default () => {
  router.get('/', async (req: Request, res: Response) => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  });

  router.post(
    '/',
    userCreateValidations(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      const newUser = await User.create({ name, email, password });
      res.status(201).json(newUser);
    },
  );

  router.get('/:id', idValidation(), async (req: Request, res: Response) => {
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
  });

  router.put(
    '/:id',
    userUpdateValidations(),
    async (req: Request, res: Response) => {
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
    },
  );

  router.delete('/:id', idValidation(), async (req: Request, res: Response) => {
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
  });

  return router;
};
