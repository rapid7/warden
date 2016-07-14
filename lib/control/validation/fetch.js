'use strict';

const HTTP_BAD_REQUEST = 400;

exports.metadata = function(req, res, next) {

  var params = {
    AMI_ID: [ req.document.imageId.toString() ]
  };

  // ec2.describeInstances(params, function(err, data) {
  //   if (err){
  //     console.log(err, err.stack);
  //     return res.status(HTTP_BAD_REQUEST).json({
  //       code: HTTP_BAD_REQUEST,
  //       status: 'BAD_REQUEST',
  //       errors: failures
  //     });
  //   } else {
  //     console.log(data);
  //     next();
  //   }
  // });

  next();

};
