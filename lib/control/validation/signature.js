'use strict';

const bad = require('../validation/badRequest');

exports.signatureValidate = function (req, res, next, server) {
  server.validate({
    signature: req.body.signature,
    data: req.body.document
  },
  function(err, status) {
    if (err) { return next(err) }
    if (!status.valid) {
      return bad.request(res, 'Signature is not valid');
    }
    return next();
  })
}
