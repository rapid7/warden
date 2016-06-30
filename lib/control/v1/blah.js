'use strict';

app.use(require('body-parser').json()),

route.use(function(err, req, res, next) {
  console.log(err);

  return res.status(HTTP_BAD_REQUEST).json( {
    status: 'You done fucked up your json, son',
    error: err.message
  });
});

console.log(req.rawBody.toString('utf8'));

// Jon's function
app.use(function(req, res, next) {
  server.validate({
    signature: req.body.signature,
    data: req.body
  },
  function(err, status) {
    if (err) { return next(err); }
    if (!status.valid) {
      return res.status(FORBIDDEN).json({
        code: FORBIDDEN,
        status: 'FORBIDDEN',
        error: 'Signature is not valid'
      });
    }

    next();
  });
});
