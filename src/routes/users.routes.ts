import { Connection } from 'typeorm';
import { Router, Request, Response } from 'express';
import { OK, INTERNAL_SERVER_ERROR, CONFLICT } from 'http-status-codes';
import User from '../entities/User';
import { getConnection, respond } from '../utils';

const router = Router();

// todo: add api docs
// todo: add request validator
router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const { username, displayName, bio, birthDate } = req.body;
    let connection: Connection | undefined;
    try {
      connection = await getConnection();
      const user = new User(username, displayName, bio, birthDate);
      const result = await connection.manager.save(user);
      respond(res, OK, result);
    } catch (e) {
      console.error(e);
      if (e.code === 'ER_DUP_ENTRY') {
        respond(res, CONFLICT, { message: 'Username is already taken.' });
      } else {
        respond(res, INTERNAL_SERVER_ERROR, { message: 'Unknown error.' });
      }
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
);

export default router;
