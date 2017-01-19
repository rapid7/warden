'use strict';

const bodyParser = require('body-parser');

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

/**
 * Unseal middleware
 * @param {Express} app
 * @constructor
 */
function Unseal(app) {
  app.use(bodyParser.json());

  app.post('/v1/unseal',
    (req, res, next) => { // eslint-disable-line no-unused-vars
      if (req.body && req.body.hasOwnProperty('token')) {
        Config.set('vault:token', req.body.token);

        return res.status(HTTP_OK).json({
          code: HTTP_OK,
          status: `Warden token updated to be: ${req.body.token}`
        });
      }

      return res.status(HTTP_BAD_REQUEST).end();
    });
}

exports.attach = Unseal;
