'use strict';

const bad = require('../validation/badRequest');

exports.signatureValidate = function(req, res, next, server) {
  return server.validate({
    signature: req.body.signature,
    data: req.body.document
  }).then((status) => {
    if (!status.valid) {
      return bad.request(res, ['Signature is not valid']);
    }

    return next();
  }).catch((err) => {
    return next(err);
  });
};
