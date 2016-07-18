'use strict';

const HTTP_BAD_REQUEST = 400;

exports.metadata = function(req, res, next) {

  // const s3 = new AWS.S3();
  // const params = {Bucket: 'Bucket', Key: req.document.imageId.toString()};
  // const data = s3.getObject(params);
  //
  // if (data.is.error) {
  //   return res.status(HTTP_BAD_REQUEST).json({
  //     code: HTTP_BAD_REQUEST,
  //     status: 'BAD_REQUEST',
  //     errors: data
  //   });
  // };

  next();

};
