'use strict';

const path = require('path');

module.exports = {
  authenticUrl: process.env.MODULUS_NOTIFIER_AUTHENTIC_URL || 'authentic-api.leisurelink.ka/',
  keyfile: process.env.MODULUS_NOTIFIER_KEYFILE || path.resolve(__dirname, 'modulus-notifier.pem'),
  keyId: process.env.MODULUS_NOTIFIER_KEY_ID || 'modulus-notifier/self'
};
