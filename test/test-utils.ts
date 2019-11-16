import sinon, { SinonStub } from 'sinon';

// eslint-disable-next-line import/prefer-default-export
export class MockConsole {
  private log: SinonStub<[any?, ...any[]], void>;

  private info: SinonStub<[any?, ...any[]], void>;

  private warn: SinonStub<[any?, ...any[]], void>;

  private error: SinonStub<[any?, ...any[]], void>;

  constructor() {
    this.log = sinon.stub(console, 'log');
    this.info = sinon.stub(console, 'info');
    this.warn = sinon.stub(console, 'warn');
    this.error = sinon.stub(console, 'error');
  }

  public restore(): void {
    this.log.restore();
    this.info.restore();
    this.warn.restore();
    this.error.restore();
  }
}
