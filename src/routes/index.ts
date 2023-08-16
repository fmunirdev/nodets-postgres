import { Router, Request, Response } from 'express';
import passport from 'passport';

import sequelize from '../db';
import authRoute from './auth';
import usersRoute from './users';

const router = Router();

export default () => {
  const securedRoute = passport.authenticate('jwt', { session: false });

  router.get('/health', async (req: Request, res: Response) => {
    let dbStatus = '';

    await sequelize.authenticate().then(() => {
      dbStatus = 'OK';
    });

    const health = {
      state: 'up',
      dbStatus,
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
    res.json(health);
  });

  router.use('/', authRoute());
  router.use('/users', securedRoute, usersRoute());

  return router;
};
