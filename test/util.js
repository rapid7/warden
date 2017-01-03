/* eslint-env mocha */
'use strict';

const request = require('supertest');
const nock = require('nock');

require('should');

const vaultRequest = require('../lib/control/util').vaultRequest;

const vault = {
  port: 8200,
  hostname: "localhost",
  renewable: true,
  ttl: "300s",
  token: "kali"
};

nock(`http://${vault.hostname}:${vault.port}`)
  .post('/v1/valid/endpoint')
  .reply(200, {valid: true})
  .post('/v1/valid/endpoint/with/bad/data')
  .reply(200, '{not valid json');

describe('Util#send', function() {
  it('sends an http request to the specified endpoint and returns a promise', function() {
    return vaultRequest(vault, '/v1/auth/token/create', 'POST').should.be.Promise();
  });

  it('returns a resolved promise when the http request returns valid data', function() {
    return vaultRequest(vault, '/v1/valid/endpoint', 'POST').then((status) => {
      status.should.have.keys('valid');
      status.valid.should.be.true();
    }).should.be.fulfilled();
  });

  it('returns a rejected promise when the http request returns invalid data', function() {
    return vaultRequest(vault, '/v1/valid/endpoint/with/bad/data', 'POST')
      .should.be.rejected(new SyntaxError('Unexpected token n'));
  });

  it('returns a rejected promise when the http request is invalid', function() {
    return vaultRequest(vault, '/v1/not/a/real/endpoint', 'POST')
      .should.be.rejected(new Error('connect ECONNREFUSED 127.0.0.1:8200'));
  });
});
