'use strict';

const bad = require('../validation/badRequest');

function isJson(string) {
  try {
    JSON.parse(string);
    return true;
  } catch (_) {
    return false;
  }
}

exports.isJson = isJson;

exports.request = function(req, res, next) {
  const failures = [];

  if (!req.body.hasOwnProperty('signature')) {
    failures.push('Missing S/MIME signature request parameter');
  }

  if (!req.body.hasOwnProperty('document')) {
    failures.push('Missing idnetity document request parameter');
  } else if (!isJson(req.body['document'])) {
    failures.push('Document request parameter is not valid JSON');
  }

  if (failures.length === 0) {
    return next();
  }

  return bad.request(res, failures);
};
