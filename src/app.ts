import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OK } from 'http-status-codes';
import respond from './utils/response';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/hello', (req: Request, res: Response) => {
  respond(res, OK, { message: 'Hello, world!' });
});

export default app;
