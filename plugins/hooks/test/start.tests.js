'use strict';

const Promise = require('bluebird');
const nock = require('nock');
const sinon = require('sinon');
const HooksPlugin = require('../');

describe('start', () => {

  let server;
  const createEndpointSpy = sinon.spy((lang, principalId) => Promise.resolve());
  const addEndpointKeySpy = sinon.spy((lang, principalId, keyId, key) => Promise.resolve());
  let authenticClient = {
    createEndpointAsync: createEndpointSpy,
    addEndpointKeyAsync: addEndpointKeySpy
  };

  before(() => {
    nock('https://webhook-test.com')
      .get('/healthcheck')
      .reply(200, {
        principalId: 'principalId',
        keyId: 'keyId',
        key: 'key'
      });
    return hapi.setup([HooksPlugin])
      .then((_server) => {
        server = _server;
        server.plugins['authentic-client'] = authenticClient;
      });
  });

  after((done) => {
    server.stop(done);
  });

  it('creates an endpoint on start webhook', done => {
    let payload = {
      project: {
        domain: 'webhook-test.com'
      }
    };
    server.inject({ method: 'POST', url: '/v1/hooks/start', payload }, () => {
      expect(createEndpointSpy.called).to.be.true();
      done();
    });
  });

  it('adds an endpoint key on start webhook', done => {
    let payload = {
      project: {
        domain: 'webhook-test.com'
      }
    };
    server.inject({ method: 'POST', url: '/v1/hooks/start', payload }, () => {
      expect(addEndpointKeySpy.called).to.be.true();
      done();
    });
  });

});

