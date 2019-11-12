import { Connection } from 'typeorm';
import { Router, Request, Response } from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  BAD_REQUEST
} from 'http-status-codes';
import User from '../entities/User';
import {
  getConnection,
  respond,
  getValidationErrors,
  getPostUserValidators
} from '../utils';

const router = Router();

// todo: add api docs
router.post(
  '/',
  getPostUserValidators(),
  async (req: Request, res: Response): Promise<void> => {
    const validationErrors = getValidationErrors(req);

    if (validationErrors.length > 0) {
      respond(res, BAD_REQUEST, { messages: validationErrors });
      return;
    }

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
