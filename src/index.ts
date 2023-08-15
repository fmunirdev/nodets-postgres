import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from './db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
