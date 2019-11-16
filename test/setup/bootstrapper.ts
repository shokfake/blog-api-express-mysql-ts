import sinon from 'sinon';
import 'datejs';

// suppress console.log using sinon
sinon.stub(console, 'log');
sinon.stub(console, 'info');
sinon.stub(console, 'warn');
sinon.stub(console, 'error');
