'use strict';

const fetch = require('../lib/control/validation/fetch');
const should = require('should');
const consts = require('./_consts');

describe('Validate the S3 data of the request v1', function() {
  it('responds correctly to a properly formated request', function() {
    consts.req.body = consts.nothing_wrong;
    should(fetch.metadata(consts.req, consts.res, consts.next)).be.true();
  });
});
