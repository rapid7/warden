'use strict';

const FORBIDDEN = 403;

exports.signatureValidate = function (req, res, next, server) {
  server.validate({
    signature: req.body.signature,
    data: req.body.document
  },
  function(err, status) {
    if (err) { return next(err) }
    if (!status.valid) {
      return res.status(FORBIDDEN).json({
        code: FORBIDDEN,
        status: 'FORBIDDEN',
        error: 'Signature is not valid'
      });
    }
    return next();
  })
}
