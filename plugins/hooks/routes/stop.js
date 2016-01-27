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
    return request.get(`${req.payload.project.domain}/healthcheck`, (err, response, body) => {
      if(err) {
        return reply(err);
      }
      let authClient = req.server.plugins['authentic-client'];
      return authClient.deleteEndpointKeyAsync('en-US', body.principalId, body.keyId, body.key)
        .then(() => reply({ status: 'OK' }))
        .catch(reply);
    });
  }
};
