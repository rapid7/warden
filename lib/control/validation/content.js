'use strict';

const HTTP_BAD_REQUEST = 400;

const M_INSTANCE_ID = /^i-[a-f0-9]{8,}$/;
const M_AMI_ID = /^ami-[a-f0-9]{8,}$/;
const M_ACCOUNT_ID = /^[0-9]{12,}/;
const M_REGION = /^[a-z]{2,}-[a-z]{4,}-[1-2]$/;

exports.document = function(req,res,next) {

  req.document = JSON.parse(req.body.document);

  const failures = [];

  if (!req.document.imageId.match(M_AMI_ID)) {
    failures.push('AMI-ID parameter is not valid');
  }

  if (!req.document.instanceId.match(M_INSTANCE_ID)) {
    failures.push('Instance-ID parameter is not valid');
  }

  if (!req.document.accountId.match(M_ACCOUNT_ID)) {
    failures.push('Account-ID parameter is not valid');
  }

  if (!req.document.region.match(M_REGION)) {
    failures.push('Region parameter is not valid');
  }

  if (failures.length === 0) {
    return next();
  }

  return res.status(HTTP_BAD_REQUEST).json({
    code: HTTP_BAD_REQUEST,
    status: 'BAD_REQUEST',
    errors: failures
  });
};
