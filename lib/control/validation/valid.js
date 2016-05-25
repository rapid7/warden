'use strict';

const HTTP_BAD_REQUEST = 400;

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

  if (!req.body.hasOwnProperty('signiture')) {
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

  console.log('\n\n');
  console.log(failures)
  console.log('\n\n');

  res.status(HTTP_BAD_REQUEST).json({
    code: HTTP_BAD_REQUEST,
    status: 'BAD_REQUEST',
    errors: failures
  });
};
