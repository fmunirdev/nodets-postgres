import { Router, Request, Response } from 'express';

const router = Router();

export default () => {
  router.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ id: 'dsa' });
  });

  return router;
};
