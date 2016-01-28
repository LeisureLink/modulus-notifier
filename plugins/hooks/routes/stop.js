'use strict';

const Joi = require('joi');
const request = require('request');

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
    req.server.log(['info'], `Removing authentic registration for ${caller}`);

    return request.get(`https://${caller}/healthcheck`, (err, response, body) => {
      if(err) {
        req.server.log(['error'], err);
        return reply(err);
      }
      let authClient = req.server.plugins['authentic-client'];
      req.server.log(['info'], `Deleting endpoint key: ${body.principalId} ${body.keyId}\n${body.key}`);
      return authClient.deleteEndpointKeyAsync('en-US', body.principalId, body.keyId, body.key)
        .then(() => {
          req.server.log(['info'], 'Endpoint key deleted');
          return reply({ status: 'OK' });
        })
        .catch(e => {
          req.server.log(['error'], `Error while deleting endpoint key ${e.stack}`);
          return reply(e);
        });
    });
  }
};
