'use strict';

const Promise = require('bluebird');
const nock = require('nock');
const sinon = require('sinon');
const HooksPlugin = require('../');

describe('stop', () => {

  let server;
  const deleteEndpointKeySpy = sinon.spy((lang, principalId, keyId, key) => Promise.resolve());
  const authenticClient = {
    deleteEndpointKeyAsync: deleteEndpointKeySpy
  };

  before(() => {
    return hapi.setup([HooksPlugin])
      .then((_server) => {
        server = _server;
        server.plugins['authentic-client'] = { client: authenticClient };
      });
  });

  after((done) => {
    server.stop(done);
  });

  it('deletes an endpoint key on stop webhook', done => {
    const payload = {
      project: {
        id: 'keyId',
        name: 'principalId',
        domain: 'webhook-test.com'
      }
    };
    server.inject({ method: 'POST', url: '/v1/hooks/stop', payload }, () => {
      expect(deleteEndpointKeySpy.calledWith('en-US', 'principalId', 'keyId')).to.be.true();
      done();
    });
  });

});
