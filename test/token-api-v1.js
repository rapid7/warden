'use strict';

const should = require('should');
const nock = require('nock');
const token = require('../lib/control/validation/token');
const consts = require('./_consts');

const HTTP_OK = 200;
const PORT = 8200;

const valid = consts.nothing_wrong;

const goodResponse = {
  auth: {
    accessor: 'UUID',
    client_token: 'UUID',
    lease_duration: 300,
    renewable: true
  }
};

const accessorResponse = {
  data: {
    accessor: 'UUID',
    creation_time: Date.now(),
    explicit_max_ttl: 0
  }
};

const badResponse = JSON.stringify({code: 400, status: 'BAD_REQUEST', errors: ['connect ECONNREFUSED 127.0.0.1:8200']});

const req = {};
const res = {
  status() {
    return this;
  },
  json(any) {
    return JSON.stringify(any);
  }
};
const next = () => true;
const vault = {port: PORT, hostname: 'localhost', token: '3e5f8293-eb83-37be-2ed3-03e4324c5e53'};

describe('Validate getting a token from vault', function() {
  beforeEach(function() {
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, goodResponse)
      .post('/v1/auth/token/lookup-accessor/UUID')
      .reply(HTTP_OK, accessorResponse)
      .get('/v1/sys/mounts/auth/token/tune')
      .reply(HTTP_OK, {
        default_lease_ttl: 360,
        max_lease_ttl: 360
      });
  });
  it('responds correctly to a properly formated request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);

    return token.create(req, res, next, vault).should.be.eventually.true();
  });

  it('sets token creation time on the request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);

    return token.create(req, res, next, vault).then(() => {
      req.should.have.ownProperty('auth');
      req.auth.should.have.ownProperty('creation_time');
      new Date(req.auth.creation_time).should.be.a.Date(); // If it's a date, the ISO string was parseable
    });
  });

  it('sets token expiration time on the request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);

    return token.create(req, res, next, vault).then(() => {
      req.should.have.ownProperty('auth');
      req.auth.should.have.ownProperty('expiration_time');
      new Date(req.auth.expiration_time).should.be.a.Date(); // If it's a date, the ISO string was parseable
    });
  });

  it('returns an error if the `auth` object is not included in the Vault response', function() {
    nock.cleanAll();
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, {});

    req.body = valid;
    req.document = JSON.parse(valid.document);
    const resp = JSON.stringify({code: 400, status: 'BAD_REQUEST', errors: ['Token Error']});

    return token.create(req, res, next, vault).should.eventually.eql(resp);
  });

  it('returns an error if explicit_max_ttl is not set', function() {
    nock.cleanAll();
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, goodResponse)
      .post('/v1/auth/token/lookup-accessor/UUID')
      .reply(HTTP_OK, {data: {accessor: 'UUID', creation_time: Date.now()}});

    req.body = valid;
    req.document = JSON.parse(valid.document);
    const resp = JSON.stringify({code: 400, status: 'BAD_REQUEST', errors: ['Invalid time value']});

    return token.create(req, res, next, vault).should.eventually.eql(resp);
  });

  it('returns an error if explicit_max_ttl is negative', function() {
    nock.cleanAll();
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, goodResponse)
      .post('/v1/auth/token/lookup-accessor/UUID')
      .reply(HTTP_OK, {data: {accessor: 'UUID', creation_time: Date.now(), explicit_max_ttl: -5}});

    req.body = valid;
    req.document = JSON.parse(valid.document);
    const resp = JSON.stringify({code: 400, status: 'BAD_REQUEST', errors: ['Token has already expired']});

    return token.create(req, res, next, vault).should.eventually.eql(resp);
  });

  it('returns an error if explicit_max_ttl is 0', function() {
    nock.cleanAll();
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, goodResponse)
      .post('/v1/auth/token/lookup-accessor/UUID')
      .reply(HTTP_OK, {data: {accessor: 'UUID', creation_time: Date.now(), explicit_max_ttl: 0}})
      .get('/v1/sys/mounts/auth/token/tune')
      .reply(HTTP_OK, {max_lease_ttl: 0});

    req.body = valid;
    req.document = JSON.parse(valid.document);
    const resp = JSON.stringify({code: 400, status: 'BAD_REQUEST', errors: ['Token has already expired']});

    return token.create(req, res, next, vault).should.eventually.eql(resp);
  });

  it('returns an error if one is encountered', function() {
    nock.cleanAll();
    req.body = valid;
    req.document = JSON.parse(valid.document);

    return token.create(req, res, next, vault).should.eventually.equal(badResponse);
  });
});
