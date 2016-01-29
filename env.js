'use strict';

const path = require('path');

process.env.WAIT_TIMEOUT = 10;

module.exports = {
  authenticUrl: process.env.MODULUS_NOTIFIER_AUTHENTIC_URL || 'http://authentic-api.leisurelink.ka/',
  keyfile: process.env.MODULUS_NOTIFIER_KEYFILE || path.resolve(__dirname, 'modulus-notifier.pem'),
  keyId: process.env.MODULUS_NOTIFIER_KEY_ID || 'registrar/self',
};
