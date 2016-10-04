/* eslint-env mocha */
'use strict';

global.Config = require('nconf')
global.Config.use('memory');

const request = require('supertest');
const expect = require('expect')
const should = require('should');

const unseal = require('../lib/control/v1/unseal');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;
const ERROR = 500;

const good = {token: '12345678-abcd-1234-!@#$-123456789abc'};
const res = {status() {return this}, json(any) {return any}};
const next = function() {return true};

const endpoints = {
  unseal: '/v1/unseal'
};

/**
 * Create a new Express server for testing
 *
 * @return {http.Server}
 */
const makeServer = () => {
  const app = require('express')();

  unseal.attach(app);
  return app.listen(testServerPort);
};

describe('unseal API v1', () => {

  it('global.Config does not have a vault token', function () {
    should(global.Config.get('vault:token')).not.exist;
  });

  let server = null;

  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('responds to a malformed request to the /unseal endpoint', (done) => {
    request(server)
      .post('/v1/unseal')
      .expect(ERROR)
      .end(done);
  });

  it('Vault:token is set after call', (done) => {
    request(server)
      .post('/v1/unseal')
      .send(good)
      .expect(HTTP_OK)
      .end(function(){
        expect(global.Config.get('vault:token')).toExist();
        done();
      });
  });

});
