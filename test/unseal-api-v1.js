/* eslint-env mocha */
'use strict';

global.Config = require('nconf')
global.Config.use('memory');

const request = require('supertest');

const should = require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;

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

  require('../lib/control/v1/unseal').attach(app);
  return app.listen(testServerPort);
};

describe('unseal API v1', () => {

  it('global.Config does not have flag unseal', function () {
    should(global.Config.get('vault:unseal')).not.exist;
  });

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

  it('responds correctly to a request to the /unseal endpoint', (done) => {
    request(server)
      .post('/v1/unseal')
      .expect(HTTP_OK)
      .end(done);
  });

});
