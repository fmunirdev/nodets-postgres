import { Router, Request, Response } from 'express';

import sequelize from '../db';
import usersRoute from './users';

const router = Router();

export default () => {
  // const securedRoute = passport.authenticate('jwt', { session: false })

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

  // router.use('/users', securedRoute, usersRoute());
  router.use('/users', usersRoute());

  return router;
};
