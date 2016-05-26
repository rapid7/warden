'use strict';

const HTTP_METHOD_NOT_ALLOWED = 405;

exports.methodNotAllowed = function(methods) {
  return function handler(req, res) {
    res.set('Allow', methods);
    res.status(HTTP_METHOD_NOT_ALLOWED);
    res.end();
  };
};
