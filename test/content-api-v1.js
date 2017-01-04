'use strict';

const content = require('../lib/control/validation/content');
const should = require('should');
const consts = require('./_consts');

describe('Validate the Document\'s contents v1', function() {
  const req = consts.req;
  const res = consts.res;
  const next = consts.next;

  it('responds with the correct error for a document without a Region', function() {
    req.body = consts.no_region;
    should(content.document(req, res, next)).have.property('errors', ['Region parameter is not valid']);
  });

  it('responds with the correct error for a document without an Instance', function() {
    req.body = consts.no_instance;
    should(content.document(req, res, next)).have.property('errors', ['Instance-ID parameter is not valid']);
  });

  it('responds with the correct error for a document without an Account', function() {
    req.body = consts.no_account;
    should(content.document(req, res, next)).have.property('errors', ['Account-ID parameter is not valid']);
  });

  it('responds with the correct error for a document without an AMI', function() {
    req.body = consts.no_ami;
    should(content.document(req, res, next)).have.property('errors', ['AMI-ID parameter is not valid']);
  });

  it('responds with the correct error for a document without a any of the criteria', function() {
    req.body = consts.four_wrong;
    should(content.document(req, res, next)).have.property('errors',
      ['AMI-ID parameter is not valid',
        'Instance-ID parameter is not valid',
        'Account-ID parameter is not valid',
        'Region parameter is not valid']);
  });

  it('responds correctly to a properly formated request', function() {
    req.body = consts.nothing_wrong;
    should(content.document(req, res, next)).be.true();
  });
});
