'use strict';

const HTTP_OK = 200;
const started = Date.now();
const reject = require('../validation/methodNotAllowed');

/**
 * Health middlware
 * @param {Express} app
 * @constructor
 */
function Health(app) {
  app.get('/v1/health', (req, res) => {
    res.status(HTTP_OK).json({
      status: 'okay',
      uptime: Date.now() - started,
      unsealed: !!Config.get('vault:token')
    });
  });

  app.all('/v1/health', reject.methodNotAllowed('GET'));
}

exports.attach = Health;
