'use strict';

const bad = require('../validation/badRequest');

exports.signatureValidate = function(req, res, next, server) {
  Log.log('DEBUG', 'Validating signature');

  return server.validate({
    signature: req.body.signature,
    data: req.body.document
  }).then((status) => {
    if (!status.valid) {
      return bad.request(res, ['Signature is not valid']);
    }
    Log.log('DEBUG', 'Signature is valid');

    return next();
  }).catch((err) => next(err));
};
