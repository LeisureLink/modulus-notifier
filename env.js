'use strict';

const path = require('path');

// Because modulus fires the start event hook long before the application is actually started, we need a way to wait for the application to start up.
process.env.WAIT_TIMEOUT = process.env.WAIT_TIMEOUT || 10000;

module.exports = {
  authenticUrl: process.env.MODULUS_NOTIFIER_AUTHENTIC_URL || 'http://authentic-api.leisurelink.ka/',
  keyfile: process.env.MODULUS_NOTIFIER_KEYFILE || path.resolve(__dirname, 'modulus-notifier.pem'),
  keyId: process.env.MODULUS_NOTIFIER_KEY_ID || 'registrar/self',
};
