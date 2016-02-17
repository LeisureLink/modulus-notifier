'use strict';

const Joi = require('joi');

const controllerFunc = require('../controller');

module.exports = {
  path: '/v1/hooks/stop',
  method: 'POST',
  config: {
    description: 'Webhook endpoint for the stop event',
    tags: ['api', 'v1', 'stop'],
    plugins: {
      'hapi-swaggered': {
        responses: {
          default: {
            description: 'OK',
            schema: Joi.object({ status: 'OK' })
          },
          500: {
            description: 'Internal Server Error',
            schema: Joi.object({
              statusCode: Joi.number(),
              error: Joi.string(),
              message: Joi.string()
            })
          },
          503: {
            description: 'Server Timeout',
            schema: Joi.object({
              statusCode: Joi.number(),
              error: Joi.string(),
              message: Joi.string()
            })
          }
        }
      }
    }
  },
  handler: (req, reply) => {
    const caller = req.payload.project.domain;
    const authClient = req.server.plugins['authentic-client'].client;
    const controller = controllerFunc(authClient, req);
    let principalId = req.payload.project.name;
    let keyId = req.payload.project.id;

    req.log(['info'], `Removing authentic registration for ${caller}`);
    return controller.unregisterApplication(principalId, keyId)
      .then(() => {
        req.log(['info'], 'Endpoint key deleted');
        return reply({ status: 'OK' });
      })
      .catch(e => {
        req.log(['error'], `Error while deleting endpoint key ${e.stack}`);
        return reply(e);
      });
  }
};
