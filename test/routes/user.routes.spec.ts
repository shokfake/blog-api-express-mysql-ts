import expect from 'expect';
import sinon, { SinonStubbedInstance, SinonStub } from 'sinon';
import request, { Response } from 'supertest';
import { Connection, SaveOptions } from 'typeorm';
import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  OK
} from 'http-status-codes';
import app from '../../src/app';
import * as utils from '../../src/utils';
import User from '../../src/entities/User';

const fakeId = 1;

const userData = {
  username: 'jdoe',
  displayName: 'John Doe',
  bio: 'Lorem ipsum dolor sit amet.',
  birthDate: '1991-12-16'
};

describe('user routes tests', () => {
  describe('POST /api/v1/users', () => {
    let getConnectionStub: SinonStub<[], Promise<Connection>>;
    let connectionStub: SinonStubbedInstance<Connection>;
    let userSaveStub: SinonStub<[(SaveOptions | undefined)?], Promise<User>>;

    beforeEach(() => {
      connectionStub = sinon.createStubInstance(Connection);

      getConnectionStub = sinon.stub(utils, 'getConnection');
      getConnectionStub.returns(Promise.resolve(connectionStub as any));

      userSaveStub = sinon.stub(User.prototype, 'save');
    });

    afterEach(() => {
      getConnectionStub.restore();
      userSaveStub.restore();
    });

    it('should be able to POST a user', done => {
      const fakeUser = new User(
        userData.username,
        userData.displayName,
        userData.bio,
        userData.birthDate
      );
      fakeUser.id = fakeId;
      userSaveStub.returns(Promise.resolve(fakeUser));
      request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual({
              ...userData,
              id: fakeId
            });
            expect(getConnectionStub.called).toBeTruthy();
            expect(getConnectionStub.callCount).toBe(1);
            expect(userSaveStub.called).toBeTruthy();
            expect(userSaveStub.callCount).toBe(1);
            done();
          }
        });
    });

    it('should respond 409 Conflict if "Username is already taken."', done => {
      const error = { code: 'ER_DUP_ENTRY' };
      userSaveStub.throws(error);

      request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(CONFLICT)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual({ message: 'Username is already taken.' });
            done();
          }
        });
    });

    it('should respond 500 Internal Server Error if unknown error is thrown', done => {
      const error = { code: 'FAKE-CODE' };
      userSaveStub.throws(error);

      request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual({ message: 'Unknown error.' });
            done();
          }
        });
    });

    it("shouldn't call close in connection if failed to establish connection", done => {
      getConnectionStub.throws({ fake: 'error' });
      request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual({ message: 'Unknown error.' });
            done();
          }
        });
    });

    it('should return bad request if body is incomplete', done => {
      getConnectionStub.throws({ fake: 'error' });
      request(app)
        .post('/api/v1/users')
        .send({})
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body.messages).toBeDefined();
            expect(body.messages).toContain(
              'Parameter "username" is required.'
            );
            expect(body.messages).toContain(
              'Parameter "username" length must be between 1 and 16 characters.'
            );
            expect(body.messages).toContain(
              'Parameter "displayName" is required.'
            );
            expect(body.messages).toContain(
              'Parameter "displayName" length must be between 1 and 16 characters.'
            );
            expect(body.messages).toContain(
              'Parameter "birthDate" is required.'
            );
            done();
          }
        });
    });

    it('should return bad request if birthDate is greater than today', done => {
      getConnectionStub.throws({ fake: 'error' });
      request(app)
        .post('/api/v1/users')
        .send({ ...userData, birthDate: new Date().addDays(1) })
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body.messages).toBeDefined();
            done();
          }
        });
    });
  });
});
