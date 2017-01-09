'use strict';

const bad = require('../validation/badRequest');
const vaultRequest = require('../util').vaultRequest;

/**
 * Get token timing information
 * @param {string} accessor
 * @param {Object} vault
 * @return {Promise}
 */
function getTokenTiming(accessor, vault) {
  let creation_time = null,
    explicit_max_ttl = null;

  return vaultRequest(vault, `/v1/auth/token/lookup-accessor/${accessor}`, 'POST').then((resp) => {
    creation_time = resp.data.creation_time * 1000;
    explicit_max_ttl = resp.data.explicit_max_ttl * 1000;
  }).then(() => {
    if (explicit_max_ttl === 0) {
      // We have to query the /sys/mounts/auth/token/tune endpoint
      return vaultRequest(vault, '/v1/sys/mounts/auth/token/tune', 'GET').then((resp) => {
        explicit_max_ttl = resp.max_lease_ttl * 1000;
      });
    }
  }).then(() => { // eslint-disable-line arrow-body-style
    return {
      creation_time: new Date(creation_time).toISOString(),
      expiration_time: new Date(creation_time + explicit_max_ttl).toISOString()
    };
  });
}

exports.create = function(req, res, next, vault) {
  let ttl = Config.get('vault:ttl'),
    explicit_max_ttl = Config.get('vault:explicit_max_ttl');

  if (typeof ttl !== 'undefined') {
    ttl = `${ttl}s`;
  }

  if (typeof explicit_max_ttl !== 'undefined') {
    explicit_max_ttl = `${explicit_max_ttl}s`;
  }

  const tokenParams = {
    renewable: Config.get('vault:renewable'),
    ttl,
    explicit_max_ttl,
    no_parent: true
  };

  // If any of the tunables don't exist in Config
  // and return `undefined`, delete them
  Object.keys(tokenParams).forEach((k) => {
    if (typeof tokenParams[k] === 'undefined') {
      delete tokenParams[k];
    }
  });

  return vaultRequest(vault, '/v1/auth/token/create', 'POST', tokenParams, {imageId: req.document.imageId}).then((status) => {
    if (!status.hasOwnProperty('auth')) {
      throw Error('Token Error');
    }
    req.auth = status.auth;

    return getTokenTiming(status.auth.accessor, vault);
  }).then((data) => {
    if (data.expiration_time <= data.creation_time) {
      throw new Error('Token has already expired');
    }

    req.auth = Object.assign(req.auth, data);

    return next();
  }).catch((err) => bad.request(res, err.message));
};
