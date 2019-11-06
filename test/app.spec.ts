import expect from 'expect';
import request, { Response } from 'supertest';
import { OK } from 'http-status-codes';
import app from '../src/app';

describe('app.ts tests', () => {
  it('should respond "Hello, world!"', done => {
    request(app)
      .get('/hello')
      .expect('Content-Type', /json/)
      .expect(OK)
      .end((err, res: Response) => {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          expect(body.message).toEqual('Hello, world!');
          done();
        }
      });
  });
});
