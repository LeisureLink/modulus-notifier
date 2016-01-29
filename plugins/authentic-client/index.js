'use strict';

const AuthenticClient = require('@leisurelink/authentic-client');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

let plugin = {
  register: (server, options, next) => {
    let config = require('../../env');

    let privateKeyfile = path.resolve(config.keyfile);
    let privateKey = fs.readFileSync(privateKeyfile);

    let client = new AuthenticClient(config.authenticUrl, config.keyId, privateKey);
    server.expose({ client: Promise.promisifyAll(client) });
    next();
  }
};

plugin.register.attributes = require('./package');

module.exports = plugin;
