'use strict';

const FORBIDDEN = 403;

const server = require('../v1/signature');

exports.isValidsignature = function(req, res, next) {

  signatureServer.validate({
    signature: req.body.signature,
    data: req.body.document
  },
  function(err, status) {
    if (err) { return next(err) }
    if (!status.valid) {
      return res.status(FORBIDDEN).json({
        code: FORBIDDEN,
        status: status,
        error: 'Signature is not valid'
      });
    }
    return next();
  });
};
