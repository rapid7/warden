'use strict';

const HTTP = require('http');

/**
 * Wrap a HTTP request in a Promise
 * @param {string} hostname
 * @param {Number} port
 * @param {string} path - request URI
 * @param {string} method - HTTP request method
 * @param {Object} [body] - Body to be sent with request
 * @param {Object} [headers] - Headers to be sent with request
 * @return {Promise}
 */
function send(hostname, port, path, method, body, headers) {
  body = body || {};
  headers = headers || {};

  return new Promise((resolve, reject) => {
    const request = new Buffer(JSON.stringify(body, null, 2));

    const req = HTTP.request({
      hostname,
      port,
      method,
      path,
      headers: Object.assign(headers, {'content-length': request.length})
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

  return send(vault.hostname, vault.port, path, method, body, {
    'X-Vault-Token': vault.token
  });
}

module.exports = {
  vaultRequest,
  send
};
