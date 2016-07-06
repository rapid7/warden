'use strict';

function Authenticate(app, server) {
  const HTTP_OK = 200;
  const leaseDuration = 300;
  const BAD_REQUEST = 400;

  const valid = require('../validation/valid');
  const signature = require('../validation/signature');
  const content = require('../validation/content');
  const reject = require('../validation/methodNotAllowed');

  const bodyParser = require('body-parser');

  app.use(bodyParser.json());

  app.post('/v1/authenticate',
    (req, res, next) => {
      console.log('authenticate request recieved');
      next();
    },

    valid.request,

    function (req, res, next) {
      signature.signatureValidate(req, res, next, server);
    },

    content.document,

    function(req, res, next) {
      res.status(HTTP_OK);
      res.json({
        lease_duration: leaseDuration,
        renewable: true,
        data: {
          token: 'toekn-UUID'
        }
      });
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
