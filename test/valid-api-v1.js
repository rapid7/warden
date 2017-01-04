'use strict';

const valid = require('../lib/control/validation/valid');
const should = require('should');
const consts = require('./_consts');
const req = consts.req;
const res = consts.res;
const next = consts.next;

describe('Validate the body of the request v1', function() {
  it('responds with the correct error for a request without a signature', function() {
    req.body = consts.no_sig;
    should(valid.request(req, res, next)).have.property('errors', ['Missing S/MIME signature request parameter']);
  });

  it('responds with the correct error for a request without a document', function() {
    req.body = consts.no_doc;
    should(valid.request(req, res, next)).have.property('errors', ['Missing identity document request parameter']);
  });

  it('responds with the correct error for a request with a malformed document', function() {
    req.body = consts.bad_json;
    should(valid.request(req, res, next)).have.property('errors', ['Document request parameter is not valid JSON']);
  });

  it('responds with the correct error for a request without a document or signature', function() {
    req.body = consts.neither_doc_nor_sig;
    should(valid.request(req, res, next)).have.property('errors',
      ['Missing S/MIME signature request parameter',
        'Missing identity document request parameter']);
  });

  it('responds correctly to a properly formated request', function() {
    req.body = consts.nothing_wrong;
    should(valid.request(req, res, next)).be.true();
  });
});
