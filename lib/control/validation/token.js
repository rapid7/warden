'use strict';

const HTTP = require('http');
const bad = require('../validation/badRequest');

function send(body, ami, path, vault, callback) {
  return new Promise((resolve, reject) => {
    const request = new Buffer(JSON.stringify(body, null, 2));

    const req = HTTP.request({
      hostname: vault.hostname,
      port: vault.port,
      method: 'POST',
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

exports.create = function(req, res, next, vault) {
  const tokenParams = {
    renewable: Config.get('vault:renewable'),
    ttl: Config.get('vault:ttl'),
    explicit_max_ttl: Config.get('vault:max_ttl'),
    no_parent: true
  };

  // If any of the tunables don't exist in Config
  // and return `undefined`, delete them
  Object.keys(tokenParams).forEach((k) => {
    if (typeof tokenParams[k] === 'undefined') {
      delete tokenParams[k];
    }
  });

  return send(tokenParams, req.document.imageId, '/v1/auth/token/create', vault).then((status) => {
    if (!status.hasOwnProperty('auth')) {
      return bad.request(res, 'Token Error');
    }
    req.auth = status.auth;
    return next();
  }).catch((err) => {
    return next(err);
  });
};
