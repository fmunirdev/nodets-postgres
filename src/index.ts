import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';

import sequelize from './db';
import apiRoutes from './routes';
import { seedSuperuser } from './utils/seeder';
import './utils/auth';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(passport.initialize());

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.use('/api/v1', apiRoutes());

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://${host}:${port}`);

      seedSuperuser(); // creates first user record in db if doesn't exist
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
