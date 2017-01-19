'use strict';

const bad = require('../validation/badRequest');

/**
 * Test if a string is valid JSON
 * @param {string} string
 * @return {boolean}
 */
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
  Log.log('DEBUG', 'Validating payload structure');

  const failures = [];

  if (!req.body.hasOwnProperty('signature')) {
    failures.push('Missing S/MIME signature request parameter');
  }

  if (!req.body.hasOwnProperty('document')) {
    failures.push('Missing identity document request parameter');
  } else if (!isJson(req.body['document'])) {
    failures.push('Document request parameter is not valid JSON');
  }

  if (failures.length === 0) {
    Log.log('DEBUG', 'Payload structure is valid');

    return next();
  }

  return bad.request(res, failures);
};
