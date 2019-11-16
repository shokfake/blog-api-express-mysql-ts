import { Connection, Like } from 'typeorm';
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
  getPostUserValidators,
  getFindAllUserValidators
} from '../utils';

const router = Router();

/**
 * @api {POST} /api/v1/users
 * @apiName Create a new user
 * @apiGroup Users
 *
 * @apiDescription Adds a new user to the database. Returns the new user in JSON format.
 *
 * @apiParam  username    {string}  Username of the user, should be unique.
 * @apiParam  displayName {string}  Name of the user to show in the application.
 * @apiParam  bio         {string}  (Optional) Short biography of the user.
 * @apiParam  birthDate   {string}  Birth date of the user, should be in yyyy-mm-dd format.
 *
 * @apiParamExample {json} Example request.
 *  HTTP/1.1 /api/v1/users
 *  {
 *    "username": "jorgehdzg1991",
 *    "displayName": "Jorge Hernandez",
 *    "bio": "Lorem ipsum dolor sit amet.",
 *    "birthDate": "1991-12-16"
 *  }
 *
 * @apiSuccess  id          {number}  ID of the user.
 * @apiSuccess  username    {string}  Username of the user.
 * @apiSuccess  displayName {string}  Name of the user to show in the application.
 * @apiSuccess  bio         {string}  Short biography of the user.
 * @apiSuccess  birthDate   {string}  Birth date of the user, should be in yyyy-mm-dd format.
 * @apiSuccess  createDate  {string}  Creation date of the user, should be in yyyy-mm-dd hh:ii:ss format.
 * @apiSuccess  lastUpdated {string}  Date on which the user was last updated, should be in yyyy-mm-dd hh:ii:ss format.
 * @apiSuccess  status      {boolean} Indicator if the user is active or not.
 *
 * @apiSuccessExample {json} Success response
 *  HTTP/1.1 200 OK
 *  {
 *    "username": "jorgehdzg1991",
 *    "displayName": "Jorge Hernandez",
 *    "bio": "Lorem ipsum dolor sit amet.",
 *    "birthDate": "1991-12-16",
 *    "id": 1,
 *    "createDate": "2019-11-13T18:23:13.000Z",
 *    "lastUpdated": "2019-11-13T18:23:13.000Z",
 *    "status": true
 *  }
 *
 * @apiError  (4xx) BadRequest          The request body is malformed.
 * @apiError  (4xx) Conflict            The specified username is already taken.
 * @apiError  (5xx) InternalServerError Unknown error occurred.
 */
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
      const result = await user.save();
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

/**
 * @api {GET} /api/v1/users
 * @apiName Search for users
 * @apiGroup Users
 *
 * @apiDescription Searches the database for users. Returns a list of users.
 *
 * @apiParam  search  {string}  Search text that gets applied to the query.
 *                              It's setup to work on two columns: username & displayName.
 *
 * @apiParamExample {json} Example request: query the whole table.
 *  HTTP/1.1 /api/v1/users
 *
 * @apiParamExample {json} Example request: query the users table filtering by a value.
 *  HTTP/1.1 /api/v1/users?search=jorge
 *
 * @apiSuccess  users             {Object[]}  List of users.
 * @apiSuccess  users.id          {number}    ID of the user.
 * @apiSuccess  users.username    {string}    Username of the user.
 * @apiSuccess  users.displayName {string}    Name of the user to show in the application.
 * @apiSuccess  users.bio         {string}    Short biography of the user.
 * @apiSuccess  users.birthDate   {string}    Birth date of the user, should be in yyyy-mm-dd format.
 * @apiSuccess  users.createDate  {string}    Creation date of the user, should be in yyyy-mm-dd hh:ii:ss format.
 * @apiSuccess  users.lastUpdated {string}    Date on which the user was last updated, should be in yyyy-mm-dd hh:ii:ss format.
 * @apiSuccess  users.status      {boolean}   Indicator if the user is active or not.
 *
 * @apiSuccessExample {json} Success response for full table search
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "username": "jorgehdzg1991",
 *      "displayName": "Jorge Hernandez",
 *      "bio": "Lorem ipsum dolor sit amet.",
 *      "birthDate": "1991-12-16",
 *      "id": 1,
 *      "createDate": "2019-11-13T18:23:13.000Z",
 *      "lastUpdated": "2019-11-13T18:23:13.000Z",
 *      "status": true
 *    },
 *    {
 *      "username": "peluca",
 *      "displayName": "Perla Campos",
 *      "bio": "Lorem ipsum dolor sit amet.",
 *      "birthDate": "1993-11-20",
 *      "id": 4,
 *      "createDate": "2019-11-16T03:39:02.000Z",
 *      "lastUpdated": "2019-11-16T03:39:02.000Z",
 *      "status": true
 *    }
 *  ]
 *
 * @apiSuccessExample {json} Success response filtered by ?search=jorge
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "username": "jorgehdzg1991",
 *      "displayName": "Jorge Hernandez",
 *      "bio": "Lorem ipsum dolor sit amet.",
 *      "birthDate": "1991-12-16",
 *      "id": 1,
 *      "createDate": "2019-11-13T18:23:13.000Z",
 *      "lastUpdated": "2019-11-13T18:23:13.000Z",
 *      "status": true
 *    }
 *  ]
 *
 * @apiError  (4xx) BadRequest          The request query params are incorrect.
 * @apiError  (5xx) InternalServerError Unknown error occurred.
 */
router.get(
  '/',
  getFindAllUserValidators(),
  async (req: Request, res: Response) => {
    const validationErrors = getValidationErrors(req);

    if (validationErrors.length > 0) {
      respond(res, BAD_REQUEST, { messages: validationErrors });
      return;
    }

    const queryOptions: any = {};

    if (req.query.search) {
      const searchText = Like(`%${req.query.search}%`);
      queryOptions.where = [
        { username: searchText },
        { displayName: searchText }
      ];
    }

    let connection: Connection | undefined;

    try {
      connection = await getConnection();
      const users = await User.find(queryOptions);
      respond(res, OK, users);
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR, { message: 'Unknown error.' });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
);

export default router;
