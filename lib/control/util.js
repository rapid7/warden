'use strict';

const HTTP = require('http');

/**
 * Send a request to a Vault endpoint
 * @param {Object} vault - Vault config object
 * @param {string} path - request URI
 * @param {string} method - HTTP request method
 * @param {Object} [body] - Body to be sent with request
 * @param {Object} [data] - arbitrary data to send (implementation TBD)
 * @return {Promise}
 */
function vaultRequest(vault, path, method, body, data) {
  body = body || {};
  data = data || {};

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

module.exports = {
  vaultRequest
};
