'use strict';

const valid = require('../validation/valid');
const signature = require('../validation/signature');
const content = require('../validation/content');

//const content = require('../validation/fetch');
const reject = require('../validation/methodNotAllowed');
const bodyParser = require('body-parser');

const HTTP_OK = 200;

const leaseDuration = 300;

function Authenticate(app) {

  app.use(bodyParser.json());

  app.post('/v1/authenticate',
    (req, res, next) => {
      console.log('authenticate request recieved');
      next();
    },

    valid.request,

    signature.isValidSigniture,

    content.document,

    //fetch.metadata,

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
    }
  );

  // Reject anything else e.g. DELETE, TRACE, etc.
  app.all('/v1/authenticate', reject.methodNotAllowed('POST'));
}

exports.attach = Authenticate;
