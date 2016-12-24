'use strict';

const HTTP = require('http');
const bad = require('../validation/badRequest');

function send(body, ami, path, method, vault) {
  return new Promise((resolve, reject) => {
    const request = new Buffer(JSON.stringify(body, null, 2));

    const req = HTTP.request({
      hostname: vault.hostname,
      port: vault.port,
      method,
      path,
      headers: {
        'X-Vault-Token': vault.token,
        'content-length': request.length
      }
    });

    const chunks = [];

    req.on('response', function (res) {
      res.on('end', function ended(chunk) {
        if (chunk) {
          chunks.push(chunk);
        }
        try {
          const response = JSON.parse(Buffer.concat(chunks)
              .toString('utf8'));

          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
      res.on('data', (chunk) => chunks.push(chunk));
    });

    req.on('error', (err) => reject(err));

    req.write(request);
    req.end();
  });
}

function getTokenTiming(accessor, vault) {
  return send({}, '', `/v1/auth/token/lookup-accessor/${accessor}`, 'POST', vault).then((resp) => {
    const creation_time = resp.data.creation_time * 1000;
    const explicit_max_ttl = resp.data.explicit_max_ttl * 1000;

    return {
      creation_time: new Date(creation_time).toISOString(),
      expiration_time: new Date(creation_time + explicit_max_ttl).toISOString()
    };
  });
}

exports.create = function(req, res, next, vault) {
  const tokenParams = {
    renewable: Config.get('vault:renewable'),
    ttl: Config.get('vault:ttl'),
    explicit_max_ttl: Config.get('vault:explicit_max_ttl'),
    no_parent: true
  };

  // If any of the tunables don't exist in Config
  // and return `undefined`, delete them
  Object.keys(tokenParams).forEach((k) => {
    if (typeof tokenParams[k] === 'undefined') {
      delete tokenParams[k];
    }
  });

  return send(tokenParams, req.document.imageId, '/v1/auth/token/create', 'POST', vault).then((status) => {
    if (!status.hasOwnProperty('auth')) {
      throw Error('Token Error');
    }
    req.auth = status.auth;
    return getTokenTiming(status.auth.accessor, vault);
  }).then((data) => {
    req.auth = Object.assign(req.auth, data);
    return next();
  }).catch((err) => {
    return bad.request(res, err.message);
  });
};
