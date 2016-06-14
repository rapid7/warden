'use strict';

const FORBIDDEN = 403;

exports.isValidSigniture = function(req, res, next) {

  if (req.body.signiture.length >= 200) {
    return next();
  }

  res.status(FORBIDDEN).json({
    code: FORBIDDEN,
    status: 'Forbidden',
    errors: 'Signature is not valid'
  });
};
