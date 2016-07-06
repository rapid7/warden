'use strict';

const FORBIDDEN = 403;

exports.signatureValidate = function (req, res, next, server) {
  server.validate({
    signature: req.body.signature,
    data: req.body.document
  },
  function(err, status) {
    if (err) { return next(err) }
    if (!status.valid) {
      console.log('\n\n\n')
      console.log('status.valid = false')
      console.log('\n')
      console.log(status)
      console.log('\n')
      console.log('res is: ')
      console.log(res)
      console.log('\n\n\n')
      return res.status(FORBIDDEN).json({
        code: FORBIDDEN,
        status: 'FORBIDDEN',
        error: 'Signature is not valid'
      });
    }
    return next();
  })
}
