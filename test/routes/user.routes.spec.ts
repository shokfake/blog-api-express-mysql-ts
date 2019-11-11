import expect from 'expect';
import sinon, { SinonStubbedInstance, SinonStub } from 'sinon';
import request, { Response } from 'supertest';
import { Connection, EntityManager } from 'typeorm';
import {CONFLICT, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
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
  let getConnectionStub: SinonStub<[], Promise<Connection>>;
  let connectionStub: SinonStubbedInstance<Connection>;

  beforeEach(() => {
    connectionStub = sinon.createStubInstance(Connection);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    connectionStub.manager = sinon.createStubInstance(EntityManager);

    getConnectionStub = sinon.stub(utils, 'getConnection');
    getConnectionStub.returns(Promise.resolve(connectionStub as any));
  });

  afterEach(() => {
    getConnectionStub.restore();
  });

  it('should be able to POST a user', done => {
    (connectionStub.manager.save as SinonStub).returns({
      ...userData,
      id: fakeId
    });

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
          const saveMethod = ((connectionStub.manager as any) as SinonStubbedInstance<
            EntityManager
          >).save;
          expect(saveMethod.called).toBeTruthy();
          expect(saveMethod.callCount).toBe(1);
          const saveCall = saveMethod.getCall(0);
          expect(saveCall.args.length).toBe(1);
          expect(saveCall.args[0]).toEqual(
            new User(
              userData.username,
              userData.displayName,
              userData.bio,
              userData.birthDate
            )
          );
          done();
        }
      });
  });

  it('should respond 409 Conflict if "Username is already taken."', done => {
    const error = { code: 'ER_DUP_ENTRY' };
    (connectionStub.manager.save as SinonStub).throws(error);

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
    (connectionStub.manager.save as SinonStub).throws(error);

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
});
