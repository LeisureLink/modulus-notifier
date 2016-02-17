'use strict';

const Promise = require('bluebird');
const nock = require('nock');
const sinon = require('sinon');
const HooksPlugin = require('../');

describe('crash', () => {

  let server;
  const deleteEndpointKeySpy = sinon.spy((lang, principalId, keyId, key) => Promise.resolve());
  let authenticClient = {
    deleteEndpointKeyAsync: deleteEndpointKeySpy
  };

  before(() => {
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

  it('deletes an endpoint key on crash webhook', done => {
    let payload = {
      project: {
        id: 'keyId',
        name: 'principalId',
        domain: 'webhook-test.com'
      }
    };
    server.inject({ method: 'POST', url: '/v1/hooks/crash', payload }, () => {
      expect(deleteEndpointKeySpy.calledWith('en-US', 'principalId', 'keyId')).to.be.true();
      done();
    });
  });

});
