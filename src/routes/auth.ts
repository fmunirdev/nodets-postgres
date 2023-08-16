import { Router, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';

import { UserModel } from '../models';
import { usernameValidation, passwordValidation } from '../utils/validations';

const router = Router();

const loginValidations = [usernameValidation(), passwordValidation()];

export default () => {
  router.post(
    '/login',
    loginValidations,
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      passport.authenticate(
        'local',
        // eslint-disable-next-line
        async function (err: any, user: UserModel, info: object) {
          try {
            if (err || !user) {
              return res.status(400).json(info);
            }
            req.login(user, { session: false }, async (error) => {
              if (error) return next(error);
              const accessToken = user.generateToken();
              return res.json({ accessToken });
            });
          } catch (error) {
            return next(error);
          }
        },
      )(req, res, next);
    },
  );

  return router;
};
