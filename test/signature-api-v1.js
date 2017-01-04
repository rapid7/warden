'use strict';

const should = require('should');
const nock = require('nock');
const sig = require('../lib/control/v1/signature');
const server = new sig.Server();
const signature = require('../lib/control/validation/signature');
const consts = require('./_consts');
const req = consts.req;
const res = consts.res;

const HTTP_OK = 200;
const FORBIDDEN = 403;

describe('Validate the Signature\'s contents v1', function() {
  beforeEach(function() {
    nock.cleanAll();
  });

  it('responds correctly to a properly formatted request', function() {
    req.body = consts.nothing_wrong;
    nock('http://localhost:9806')
                .post('/validate')
                .reply(HTTP_OK, {
                  valid: true
                });
    should(signature.signatureValidate(req, res, () => true, server)).eventually.be.true();
  });

  it('responds correctly to a properly malformed request', function() {
    req.body = consts.bad_signature;
    nock('http://localhost:9806')
                .post('/validate')
                .reply(FORBIDDEN, {
                  valid: false
                });
    should(signature.signatureValidate(req, res, () => false, server)).eventually.not.be.true();
  });
});
