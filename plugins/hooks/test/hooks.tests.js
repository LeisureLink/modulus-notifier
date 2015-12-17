'use strict';

const HooksPlugin = require('../');

describe('Hooks Plugin', () => {

  let server;
  before((done) => {
    hapi.setup([HooksPlugin])
      .then((_server) => {
        server = _server;
        done()
      })
      .catch(done);
  });

  after((done) => {
    server.stop((err) => {
      if (err) return done(err);
      done();
    })
  });

  it('registers', () => {
    expect(true).to.be.true();
  });
});


