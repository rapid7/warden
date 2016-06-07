'use strict';

const HTTP_BAD_REQUEST = 400;
const validateSigniture = require('../validation/validateSigniture');

exports.isValidSigniture = function(req, res, next) {

  //if (validateSigniture(req.body.signature)) {
  if (req.body.signiture.length > 200) {
    return next();
  } else {
    res.status(HTTP_BAD_REQUEST).json({
      code: HTTP_BAD_REQUEST,
      status: 'BAD_REQUEST',
      errors: 'Signatureis not valid'
    });
  }
};
