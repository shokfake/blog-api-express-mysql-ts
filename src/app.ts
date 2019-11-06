import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OK } from 'http-status-codes';
import { respond } from './utils';
import usersRoutes from './routes/users.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/hello', (req: Request, res: Response) => {
  respond(res, OK, { message: 'Hello, world!' });
});

app.use('/api/v1/users', usersRoutes);

export default app;
