'use strict';

function Authenticate(app, server) {
  const HTTP_OK = 200;
  const BAD_REQUEST = 400;

  const validate = require('../validation/valid');
  const signature = require('../validation/signature');
  const content = require('../validation/content');
  const fetch = require('../validation/fetch');
  const token = require('../validation/token');
  const reject = require('../validation/methodNotAllowed');
  const bad = require('../validation/badRequest');

  const bodyParser = require('body-parser');

  app.use(bodyParser.json());

  app.post('/v1/authenticate',
    (req, res, next) => {
      Log.debug('authenticate request recieved');
      if (!Config.get('vault:token')){
        return bad.request(res, 'Vault is sealed! Use the /v1/unseal API.');
      };
      next();
    },

    validate.request,

    function (req, res, next) {
      signature.signatureValidate(req, res, next, server);
    },

    content.document,

    fetch.metadata,

    function (req, res, next) {
      token.create(req, res, next, Config.get('vault'));
    },

    function(req, res, next) {
      res.status(HTTP_OK);
      res.send(req.auth);
    },

    function(err, req, res, next) {
      res.status(BAD_REQUEST);
      res.json({
        code: BAD_REQUEST,
        error: err,
        stack: err.stack,
        message: err.message
      });
    }
  );

  // Reject anything else e.g. DELETE, TRACE, etc.
  app.all('/v1/authenticate', reject.methodNotAllowed('POST'));

};

exports.attach = Authenticate;
