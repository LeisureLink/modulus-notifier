'use strict';

const Joi = require('joi');
const util = require('util');

module.exports = {
  path: '/v1/hooks/hey',
  method: 'POST',
  config: {
    description: 'Route used for debugging the payload that is sent on the request',
    tags: ['api'],
    validate: {
      query: {
        routePrefix: Joi.string().regex(/[a-z]+/i)
      }
    },
  },
  handler: (req, reply) => {
    req.server.log(['info'], util.inspect(req.payload, { showHidden: true, depth: null, colors: true }));
    const url = `https://something.mod.evc${req.query.routePrefix ? `/${req.query.routePrefix}` : ''}/healthcheck`;
    req.server.log(['debug'], url);
    return reply();
  }
};
