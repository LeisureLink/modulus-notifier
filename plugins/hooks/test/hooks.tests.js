'use strict';

const HooksPlugin = require('../');

describe('Hooks Plugin', () => {

  let server;

  before(() => {
    return hapi.setup([HooksPlugin])
      .then((_server) => {
        server = _server;
      });
  });

  after((done) => {
    server.stop(done);
  });

});


