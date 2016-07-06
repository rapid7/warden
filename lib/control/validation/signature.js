'use strict';

const FORBIDDEN = 403;

exports.signatureValidate = function (req, res, next, server) {
  server.validate({
    signature: req.body.signature,
    data: req.body.document
  },
  function(err, status) {
    console.log('error is: ')
    console.log(err)
    console.log('\n\n\n')
    console.log('status is: ');
    console.log(status);
    console.log('\n\n\n')
    console.log('valid is: ');
    console.log(status.valid);
    if (err) { return next(err) }
    if (!status.valid) {
      return res.status(FORBIDDEN).json({
        code: FORBIDDEN,
        error: 'Signature is not valid'
      });
    }
    return next();
  })
}
