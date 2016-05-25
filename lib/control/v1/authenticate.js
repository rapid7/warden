'use strict';

const valid = require('../validation/valid');

const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;

const leaseDuration = 300;
const bodyParser = require('body-parser');

function Authenticate(app) {
  const route = app.use(bodyParser.json()).route('/v1/authenticate');
  const allowedMethods = 'POST';

  function methodNotAllowed(req, res) {
    res.set('Allow', allowedMethods);
    res.status(HTTP_METHOD_NOT_ALLOWED);
    res.end();
  };

  // Express defaults to using the GET route for HEAD requests.
  // So we need to explicitly reject HEAD request.
  route.head(methodNotAllowed);

  route.post((req, res, next) => {
    console.log('authenticate request recieved');
    next();
  },

  function(req, res, next) {
    valid.request(req, res, next);
  },

  function(req, res, next) {
    console.log('Server authenticated, giving token back\n');
    res.status(HTTP_OK);
    res.json({
      lease_duration: leaseDuration,
      renewable: true,
      data: {
        token: 'toekn-UUID'
      }
    });
  });

  // Reject anything else e.g. DELETE, TRACE, etc.
  route.all(methodNotAllowed);
}

exports.attach = Authenticate;
