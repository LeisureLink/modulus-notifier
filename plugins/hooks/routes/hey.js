'use strict';

const util = require('util');

module.exports = {
  path: '/v1/hooks/hey',
  method: 'POST',
  config: {
    tags: ['api'],
  },
  handler: (req, reply) => {
    req.server.log(['info'], util.inspect(req.payload, { showHidden: true, depth: null, colors: true }));
    return reply();
  }
};
