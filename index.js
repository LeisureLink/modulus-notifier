'use strict';

const Plugins = require('./plugins');

Plugins()
  .then((server) => {
    server.start(() => {});
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
