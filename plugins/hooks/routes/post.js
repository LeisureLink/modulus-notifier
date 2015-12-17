'use strict';

const Joi = require('joi');

module.exports = {
  path: '/v1/hooks',
  method: 'POST',
  config: {
    description: 'Webhook endpoint',
    tags: ['api', 'v1'],
    //notes: 'These are my notes',

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
  handler: (request, reply) => {
    return reply(request.payload);
  }
};
