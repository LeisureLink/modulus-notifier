'use strict';

const Promise = require('bluebird');
const nock = require('nock');
const sinon = require('sinon');
const HooksPlugin = require('../');

describe('restart', () => {

  let server;
  const deleteEndpointKeySpy = sinon.spy((lang, principalId, keyId) => Promise.resolve());
  const createEndpointSpy = sinon.spy((lang, principalId) => Promise.resolve());
  const addEndpointKeySpy = sinon.spy((lang, principalId, keyId, key) => Promise.resolve());
  const authenticClient = {
    deleteEndpointKeyAsync: deleteEndpointKeySpy,
    createEndpointAsync: createEndpointSpy,
    addEndpointKeyAsync: addEndpointKeySpy
  };

  before(() => {
    process.env.WAIT_TIMEOUT = 0;
    return hapi.setup([HooksPlugin])
      .then((_server) => {
        server = _server;
        server.plugins['authentic-client'] = { client: authenticClient };
      });
  });

  beforeEach(() => {
    nock('https://webhook-test.com')
      .get('/healthcheck')
      .reply(200, {
        key: 'key'
      });
  });

  after((done) => {
    server.stop(done);
  });

  it('deletes the existing endpoint key on restart webhook', () => {
    const payload = {
      project: {
        id: 'keyId',
        name: 'principalId',
        domain: 'webhook-test.com'
      }
    };

    return server.inject({ method: 'POST', url: '/v1/hooks/restart', payload }).then(response => {
      expect(response.statusCode).to.equal(200);
      expect(deleteEndpointKeySpy.calledWith('en-US', 'principalId', 'keyId')).to.be.true();
    });
  });

  it('creates an endpoint on restart webhook', () => {
    const payload = {
      project: {
        id: 'keyId',
        name: 'principalId',
        domain: 'webhook-test.com'
      }
    };
    return server.inject({ method: 'POST', url: '/v1/hooks/restart', payload }).then(response => {
      expect(response.statusCode).to.equal(200);
      expect(createEndpointSpy.calledWith('en-US', 'principalId')).to.be.true();
    });
  });

  it('adds an endpoint key on restart webhook', () => {
    const payload = {
      project: {
        id: 'keyId',
        name: 'principalId',
        domain: 'webhook-test.com'
      }
    };
    return server.inject({ method: 'POST', url: '/v1/hooks/restart', payload }).then(response => {
      expect(response.statusCode).to.equal(200);
      expect(addEndpointKeySpy.calledWith('en-US', 'principalId', 'keyId', 'key')).to.be.true();
    });
  });

});

