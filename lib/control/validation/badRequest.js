'use strict';

const HTTP_BAD_REQUEST = 400;

/**
 * Send a 400 response with errors
 *
 * @param {Express.Response} res Express response object
 * @param {Array} failures An array of errors
 * @return {Express.Response} A completed Express response with error info
 */
exports.request = function(res, failures) {
  Log.log('ERROR', 'Bad request', failures);

  return res.status(HTTP_BAD_REQUEST).json({
    code: HTTP_BAD_REQUEST,
    status: 'BAD_REQUEST',
    errors: failures
  });
};
