'use strict';

const Hapi = require('hapi');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  setup(plugins) {
    plugins = _.flattenDeep([require('hapi-async-handler'), require('hapi-plugin-router'), plugins]);

    const server = new Hapi.Server();
    server.connection();
    return new Promise((resolve, reject) => {
      server.register(plugins, (err) => {
        return err ? reject(err) : resolve(server);
      });
    });
  }
};
