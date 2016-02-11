'use strict';

const Joi = require('joi');
const Wreck = require('wreck');
const https = require('https');

module.exports = {
  path: '/v1/hooks/start',
  method: 'POST',
  config: {
    description: 'Webhook endpoint for the start event',
    tags: ['api', 'v1', 'start'],
    validate: {
      query: {
        routePrefix: Joi.string().regex(/[a-z-]+/i)
      }
    },
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
    req.server.log(['info'], `Creating authentic registration for ${caller}`);

    // Timeout used to ensure modulus has finished starting the container before requesting routes.
    setTimeout(() => {
      const url = `https://${caller}${req.query.routePrefix ? `/${req.query.routePrefix}` : ''}/healthcheck`;
      Wreck.get(url, { rejectUnauthorized: false, json: true }, (err, response, payload) => {

        if(err) {
          req.server.log(['error'], err);
          return reply(err);
        }

        let principalId = req.payload.project.name;
        let keyId = req.payload.project.id;

        let authClient = req.server.plugins['authentic-client'].client;
        req.server.log(['info'], `Creating endpoint: ${principalId} ${keyId}\n${payload.key}`);
        return authClient.createEndpointAsync('en-US', principalId)
          .then(() => {
            req.server.log(['info'], 'Creating endpoint key');
            return authClient.addEndpointKeyAsync('en-US', principalId, keyId, payload.key);
          })
          .then(() => {
            req.server.log(['info'], `Endpoint and endpoint key created`);
            return reply({ status: 'OK' });
          })
          .catch(ex => {
            req.server.log(['error'], `Error while deleting endpoint key ${ex.stack}`);
            return reply(ex);
          });
      });
    }, process.env.WAIT_TIMEOUT);
  }
};
