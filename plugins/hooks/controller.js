const Promise = require('bluebird');
const util = require('util');
const Wreck = require('wreck');

module.exports = (authClient, logger) => {
  const controller = {
    requestHealthcheck: (caller, routePrefix) => {
      const url = `https://${caller}${routePrefix ? `/${routePrefix}` : ''}/healthcheck`;
      logger.log(['info'], url);
      return new Promise((resolve, reject) => {
        Wreck.get(url, { rejectUnauthorized: false, json: true }, (err, _, payload) => {
          if(err) {
            return reject(err);
          }
          logger.log(['info'], `Got payload ${util.inspect(payload)}`);
          return resolve(payload);
        });
      });
    },
    registerApplication: (principalId, keyId, key) => {
      logger.log(['info'], `Creating endpoint: ${principalId} ${keyId}\n${key}`);
      return authClient.createEndpointAsync('en-US', principalId)
        .then(() => {
          logger.log(['info'], 'Creating endpoint key');
          return authClient.addEndpointKeyAsync('en-US', principalId, keyId, key);
        })
    },
    unregisterApplication: (principalId, keyId) => {
      logger.log(['info'], `Deleting endpoint key: ${principalId}/${keyId}`);
      return authClient.deleteEndpointKeyAsync('en-US', principalId, keyId);
    },
    // NOTE: Workflow function to orchestrate steps necessary to add application to authentic
    addApplication: (caller, routePrefix, principalId, keyId) => {
      return Promise.delay(process.env.WAIT_TIMEOUT)
        .then(() => controller.requestHealthcheck(caller, routePrefix))
        .then(payload => controller.registerApplication(principalId, keyId, payload.key));
    },

  };
  return controller;
};
