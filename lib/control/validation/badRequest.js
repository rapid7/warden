'use strict';

const HTTP_BAD_REQUEST = 400;

exports.request = function(res, failures) {
  return res.status(HTTP_BAD_REQUEST).json({
    code: HTTP_BAD_REQUEST,
    status: 'BAD_REQUEST',
    errors: failures
  });
};
