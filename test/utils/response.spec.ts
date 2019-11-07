import { SinonStub } from 'sinon';
import expect from 'expect';
import { mockRes } from 'sinon-express-mock';
import { OK } from 'http-status-codes';
import { respond } from '../../src/utils';

describe('response util tests', () => {
  it('should be able to respond', () => {
    const res = mockRes();

    // make te call to respond
    respond(res, OK);

    // check that writeHead was called properly
    const writeHead = res.writeHead as SinonStub;
    expect(writeHead.called).toBeTruthy();
    expect(writeHead.callCount).toBe(1);
    const writeHeadCall = writeHead.getCall(0);
    expect(writeHeadCall.args.length).toBe(2);
    expect(writeHeadCall.args[0]).toBe(OK);
    expect(writeHeadCall.args[1]).toEqual({
      'Content-Type': 'application/json'
    });

    // check that the response was ended properly
    const end = res.end as SinonStub;
    expect(end.called).toBeTruthy();
    expect(end.callCount).toBe(1);
    const endCall = end.getCall(0);
    expect(endCall.args.length).toEqual(1);
    expect(endCall.args[0]).toBeUndefined();
  });

  it('should be able to respond with a body', () => {
    const res = mockRes();
    const data = { fake: 'fakest fake in the world' };

    // call respond
    respond(res, OK, data);

    // check response call, data sent to end should match data sent to respond
    const end = res.end as SinonStub;
    expect(end.called).toBeTruthy();
    expect(end.callCount).toBe(1);
    const endCall = end.getCall(0);
    expect(endCall.args.length).toEqual(1);
    expect(endCall.args[0]).toEqual(JSON.stringify(data));
  });
});
