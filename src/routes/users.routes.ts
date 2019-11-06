import { Connection } from 'typeorm';
import { Router, Request, Response } from 'express';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import User from '../entities/User';
import { getConnection, respond } from '../utils';

const router: Router = new Router();

// todo: add api docs
// todo: add request validator
router.post('/', async (req: Request, res: Response) => {
  const { username, displayName, bio, birthDate } = req.body;
  let connection: Connection;
  try {
    connection = await getConnection();
    const user = new User(username, displayName, bio, birthDate);
    const result = await connection.manager.save(user);
    respond(res, OK, result);
  } catch (e) {
    console.error(e);
    respond(res, INTERNAL_SERVER_ERROR);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

export default router;
