'use strict';

const Promise = require('bluebird');
const Glue = require('glue');
const manifest = {
  connections: [{ port: process.env.PORT || 55000 }],
  plugins: {
    'inert': {},
    'vision': {},
    'blipp': {},
    'hapi-async-handler': {},
    'hapi-plugin-router': {},
    'good': {
      requestPayload: true,
      responsePayload: true,
      reporters: [
        {
          reporter: require('good-console'),
          events: { request: '*', response: '*', log: '*', error: '*' }
        }
      ]
    },
    'hapi-swaggered': {
      tags: {},
      info: {
        title: 'Modulus Slack Notifier',
        description: 'Modulus Slack Notifier',
        version: require('../package').version
      }
    },
    'hapi-swaggered-ui': {
      title: 'Modulus Slack Notifier',
      swaggerOptions: {
        docExpansion: 'list'
      }
    },
    './hooks': {},
    './authentic-client': {}
  }
};

module.exports = () => {
  return new Promise((resolve, reject) => {

    Glue.compose(manifest, {
      relativeTo: __dirname
    }, (err, server) => {

      if (err) return reject(err);
      return resolve(server);

    });

  });
};


