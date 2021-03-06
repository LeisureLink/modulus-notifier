'use strict';

const Boom = require('boom');
const Joi = require('joi');

const controllerFunc = require('../controller');

module.exports = {
  path: '/v1/hooks/stop',
  method: 'POST',
  config: {
    description: 'Webhook endpoint for the stop event',
    tags: ['api', 'v1', 'stop'],
    response: {
      schema: Joi.object({ status: 'OK' })
    }
  },
  handler: (req, reply) => {
    const caller = req.payload.project.domain;
    const authClient = req.server.plugins['authentic-client'].client;
    const controller = controllerFunc(authClient, req);
    const principalId = req.payload.project.name;
    const keyId = req.payload.project.id;

    req.log(['info'], `Removing authentic registration for ${caller}`);
    return controller.unregisterApplication(principalId, keyId)
      .then(() => {
        req.log(['info'], 'Endpoint key deleted');
        return reply({ status: 'OK' });
      })
      .catch(e => {
        req.log(['error'], `Error while deleting endpoint key ${e.stack}`);
        return reply(Boom.wrap(e));
      });
  }
};
