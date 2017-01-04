'use strict';

global.Config = require('nconf');
global.Config.use('memory');
global.Log = {
  log: () => { }
};

const request = require('supertest');
const expect = require('expect');
const should = require('should');
const unseal = require('../lib/control/v1/unseal');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

const good = {token: '12345678-abcd-1234-!@#$-123456789abc'};
const bad = 'thisisabadbitofposteddata';

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

describe('unseal API v1', function() {
  it('global.Config does not have a vault token', function() {
    should(global.Config.get('vault:token')).is.undefined();
  });

  let server = null;

  beforeEach(function() {
    server = makeServer();
  });

  afterEach(function(done) {
    server.close(done);
  });

  it('responds to a malformed request to the /unseal endpoint', function(done) {
    request(server)
      .post('/v1/unseal')
      .send(bad)
      .expect(HTTP_BAD_REQUEST)
      .end(done);
  });

  it('Vault:token is set after call', function(done) {
    request(server)
      .post('/v1/unseal')
      .send(good)
      .expect(HTTP_OK)
      .end(() => {
        expect(global.Config.get('vault:token')).toExist();
        done();
      });
  });
});
