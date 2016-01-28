'use strict';

const Promise = require('bluebird');
const nock = require('nock');
const sinon = require('sinon');
const HooksPlugin = require('../');

describe('start', () => {

  let server;
  const deleteEndpointKeySpy = sinon.spy((lang, principalId, keyId, key) => Promise.resolve());
  let authenticClient = {
    deleteEndpointKeyAsync: deleteEndpointKeySpy
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

  it('deletes an endpoint key on stop webhook', done => {
    let payload = {
      project: {
        domain: 'webhook-test.com'
      }
    };
    server.inject({ method: 'POST', url: '/v1/hooks/stop', payload }, () => {
      expect(deleteEndpointKeySpy.called).to.be.true();
      done();
    });
  });

});
