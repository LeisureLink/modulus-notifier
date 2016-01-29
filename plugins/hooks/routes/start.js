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

    // Timeout used to ensure modulus has finished starting the container before requesting routes.
    setTimeout(() => {
      Wreck.request('GET', `https://${caller}/healthcheck`, { rejectUnauthorized: false }, (err, response) => {
        if(err) {
          req.server.log(['error'], err);
          return reply(err);
        }

        Wreck.read(response, null, (e, body) =>{
          if(e) {
            req.server.log(['error'], e);
            return reply(e);
          }
          let principalId = req.payload.project.name;
          let keyId = req.payload.project.id;

          let authClient = req.server.plugins['authentic-client'].client;
          req.server.log(['info'], `Creating endpoint: ${principalId} ${keyId}\n${body.key}`);
          return authClient.createEndpointAsync('en-US', principalId)
            .then(() => {
              req.server.log(['info'], `Creating endpoint key: ${principalId} ${keyId}\n${body.key}`);
              authClient.addEndpointKeyAsync('en-US', principalId, keyId, body.key)
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

      });
    }, process.env.WAIT_TIMEOUT);
  }
};
