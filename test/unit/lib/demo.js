'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const rewire = require('rewire');
const sinon = require('sinon');

const demo = require('../../../lib/demo');
const errorHandler = require('../../../helpers/errorHandler');

describe('simpleFunction', () => {
  it('should throw an error when id is undefined', () => {
    const output = demo.simpleFunction();
    expect(output).to.equal('Invalid input');
  });

  it('should throw an error when string is passed as id', () => {
    const output = demo.simpleFunction('foo');
    expect(output).to.equal('Invalid input');
  });

  it('should return formatted error if id is 0', () => {
    const sandbox = sinon.sandbox.create();
    const errorHandlerStub = sandbox.stub(errorHandler, 'format');
    errorHandlerStub
      .withArgs({
        message: 'Zero value for id is not acceptable'
      })
      .returns('Dummy error response from external module');
    
    const output = demo.simpleFunction(0);
    expect(output).to.equal('Dummy error response from external module')
    sandbox.restore();
  });

  it('should return correct response from upstream for valid id', () => {
    nock('https://jsonplaceholder.typicode.com')
    .get('/comments')
    .query({
      id: 123
    })
    .reply(200, {
      id: 123,
      comment: 'Such demo much wow!'
    });

    return demo.simpleFunction(123)
      .then(output => {
        expect(output).to.deep.equal({
          id: 123,
          comment: 'Such demo much wow!'
        });
      });
    nock.cleanAll();
  });

  it('should return cached response if it exists and not hit the upstream', () => {
    const demoStub = rewire('../../../lib/demo');
    demoStub.__set__('cachedResponse', {
      123: {
        id: 123,
        comment: 'rewired response!'
      }
    })

    return demoStub.simpleFunction(123)
      .then(output => {
        expect(output).to.deep.equal({
          id: 123,
          comment: 'rewired response!'
        });
      });
  });
});