import { Router } from 'express';
import { Op } from 'sequelize';

import { User } from '../models';
import {
  idValidation,
  nameValidation,
  emailValidation,
  passwordValidation,
} from '../utils/validations';
import {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user';

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
  router.get('/', getUsers);

  router.post('/', userCreateValidations(), addUser);

  router.get('/:id', idValidation(), getUser);

  router.put('/:id', userUpdateValidations(), updateUser);

  router.delete('/:id', idValidation(), deleteUser);

  return router;
};
