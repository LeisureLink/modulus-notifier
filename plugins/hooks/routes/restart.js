'use strict';

const Boom = require('boom');
const Joi = require('joi');

const controllerFunc = require('../controller');

module.exports = {
  path: '/v1/hooks/restart',
  method: 'POST',
  config: {
    description: 'Webhook endpoint for the restart event',
    tags: ['api', 'v1', 'restart'],
    validate: {
      query: {
        routePrefix: Joi.string().regex(/[a-z-]/i)
      }
    },
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

    req.log(['info'], `Re-adding authentic registration for ${caller}`);
    return controller.unregisterApplication(principalId, keyId)
      .then(() => controller.addApplication(caller, req.query.routePrefix, principalId, keyId))
      .then(() => {
        req.log(['info'], 'Endpoint key re-added');
        return reply({ status: 'OK' });
      })
      .catch(e => {
        req.log(['error'], `Error while re-adding endpoint key ${e.stack}`);
        return reply(Boom.wrap(e));
      });
  }
};
