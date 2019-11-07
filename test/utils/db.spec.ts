import expect from 'expect';
import sinon, { SinonStub } from 'sinon';
import * as typeorm from 'typeorm';
import { getConnection, getConnectionOptions } from '../../src/utils';

describe('db util tests', () => {
  let createConnectionStub: SinonStub<
    [typeorm.ConnectionOptions],
    Promise<typeorm.Connection>
  >;

  beforeEach(() => {
    createConnectionStub = sinon.stub(typeorm, 'createConnection');
  });

  afterEach(() => {
    createConnectionStub.restore();
  });

  it('should be able to return a connection', async () => {
    await getConnection();
    expect(createConnectionStub.called).toBeTruthy();
    expect(createConnectionStub.callCount).toBe(1);
    const call = createConnectionStub.getCall(0);
    expect(call.args.length).toBe(1);
    expect(call.args[0]).toEqual(getConnectionOptions());
  });
});
