'use strict';

const validate = require('../validation/valid');
const signature = require('../validation/signature');
const content = require('../validation/content');
const fetch = require('../validation/fetch');
const token = require('../validation/token');
const reject = require('../validation/methodNotAllowed');
const bad = require('../validation/badRequest');

const bodyParser = require('body-parser');

const HTTP_OK = 200;
const BAD_REQUEST = 400;

/**
 * Authenticate middleware
 * @param {Express} app
 * @param {Server} server
 * @constructor
 */
function Authenticate(app, server) {
  app.use(bodyParser.json());

  app.post('/v1/authenticate', (req, res, next) => {
    Log.log('DEBUG', 'authenticate request received');
    if (!Config.get('vault:token')) {
      return bad.request(res, ['Vault is sealed! Use the /v1/unseal API.']);
    }
    next();
  },
  validate.request,
  (req, res, next) => {
    signature.signatureValidate(req, res, next, server);
  },
  content.document,
  fetch.metadata,
  (req, res, next) => {
    token.create(req, res, next, Config.get('vault'));
  },
  (req, res, next) => { // eslint-disable-line no-unused-vars
    Log.log('DEBUG', 'Sending token data');
    res.status(HTTP_OK);
    res.send(req.auth);
  },
  (err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(BAD_REQUEST);
    res.json({
      code: BAD_REQUEST,
      error: err,
      stack: err.stack,
      message: err.message
    });
  });

  // Reject anything else e.g. DELETE, TRACE, etc.
  app.all('/v1/authenticate', reject.methodNotAllowed('POST'));
}

exports.attach = Authenticate;
