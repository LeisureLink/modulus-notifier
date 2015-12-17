'use strict';

const Hapi = require('hapi');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  setup(plugins) {
    if (!_.isArray(plugins)) {
      plugins = [plugins];
    }
    plugins = _.flatten([require('hapi-async-handler'), require('hapi-plugin-router'), plugins], true);

    const server = new Hapi.Server();
    server.connection();
    return new Promise((resolve, reject) => {
      server.register(plugins, (err) => {
        if (err) return reject(err);
        return resolve(server);
      });
    });
  }
};
