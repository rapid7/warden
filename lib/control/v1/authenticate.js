'use strict';

const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;
const leaseDuration = 300;

function Authenticate(app) {
  const route = app.route('/v1/authenticate');
  const allowedMethods = 'POST';

  function methodNotAllowed(req, res) {
    res.set('Allow', allowedMethods);
    res.status(HTTP_METHOD_NOT_ALLOWED);
    res.end();
  }

  // Express defaults to using the GET route for HEAD requests.
  // So we need to explicitly reject HEAD request.
  route.head(methodNotAllowed);

  route.post((req, res, next) => {
    console.log('FIRST VALIDATION');
    console.log(req.body);
    console.log(req.query);

    // Validate that the request body contains two strings: identity document and PKCS7 signature.
    // if(the.first.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('SECOND VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('THIRD VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('FOURTH VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('FITH VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('SIXTH VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

  function(req, res, next) {
    console.log('SEVENTH VALIDATION');

    // if(the.second.test.fails) {
    //   res.status(403)json(An.error.reponse);
    //   return;
    // }

    next();
  },

    // require('../lib/contol/validation/valadJson.js')

  function(req, res, next) {
    console.log('Server authenticated, giving token back');
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
