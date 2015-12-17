'use strict';

exports.register = (server, options, next) => {
  const router = server.plugins['hapi-plugin-router'];
  router.setup('routes/**/*');

  return next();
};

exports.register.attributes = {
  pkg: require('./package')
};


