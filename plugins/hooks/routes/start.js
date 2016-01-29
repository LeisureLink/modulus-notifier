'use strict';

const Joi = require('joi');
const request = require('request');
const https = require('https');

module.exports = {
  path: '/v1/hooks/start',
  method: 'POST',
  config: {
    description: 'Webhook endpoint for the start event',
    tags: ['api', 'v1', 'start'],
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
    const agent = new https.Agent({
      host: caller,
      port: 443,
      path: '/',
      rejectUnauthorized: false
    });
    req.server.log(['info'], `Creating authentic registration for ${caller}`);

    request({ url: `https://${caller}/healthcheck`, method: 'GET', agent }, (err, response, body) => {
      if(err) {
        req.server.log(['error'], err);
        return reply(err);
      }
      let authClient = req.server.plugins['authentic-client'];
      req.server.log(['info'], `Creating endpoint: ${body.principalId} ${body.keyId}\n${body.key}`);
      return authClient.createEndpointAsync('en-US', body.principalId)
        .then(() => {
          req.server.log(['info'], `Creating endpoint key: ${body.principalId} ${body.keyId}\n${body.key}`);
          authClient.addEndpointKeyAsync('en-US', body.principalId, body.keyId, body.key)
        })
        .then(() => {
          req.server.log(['info'], `Endpoint and endpoint key created`);
          return reply({ status: 'OK' })
        })
        .catch(e => {
          req.server.log(['error'], `Error while deleting endpoint key ${e.stack}`);
          return reply(e);
        });
    });
  }
};
