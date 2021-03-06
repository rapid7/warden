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

    return signature.signatureValidate(req, res, () => true, server).should.eventually.be.true();
  });

  it('returns a 400 error if the request is good but the response is invalid', function() {
    req.body = consts.nothing_wrong;
    nock('http://localhost:9806')
      .post('/validate')
      .reply(HTTP_OK, {
        valid: false
      });

    return signature.signatureValidate(req, res, () => true, server).should.eventually.eql({
      code: 400,
      status: 'BAD_REQUEST',
      errors: ['Signature is not valid']
    });
  });

  it('rejects if the response is an Error', function() {
    req.body = consts.bad_signature;
    nock('http://localhost:9806')
      .post('/validate')
      .replyWithError('Malformed request');

    return signature.signatureValidate(req, res, (err) => {throw err;}, server).should.be.rejectedWith(Error);
  });
});
