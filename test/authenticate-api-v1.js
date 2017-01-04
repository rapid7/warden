'use strict';

const request = require('supertest');
const nock = require('nock');

require('should');

const testServerPort = 3000;
const HTTP_BAD_REQUEST = 400;
const HTTP_METHOD_NOT_ALLOWED = 405;

const sig = require('../lib/control/v1/signature');
const server = new sig.Server();

/**
 * Create a new Express server for testing
 *
 * @return {http.Server}
 */
const makeServer = () => {
  const app = require('express')();

  require('../lib/control/v1/authenticate').attach(app, server);

  return app.listen(testServerPort);
};

describe('Authenticate API v1', function() {
  let server = null;

  beforeEach(function() {
    server = makeServer();
  });

  afterEach(function(done) {
    server.close(done);
  });

  it('acknowledges POST requests to the /v1/authenticate endpoint', function(done) {
    request(server)
      .post('/v1/authenticate')
      .send('nb dvmn dv sdv sv')
      .expect(HTTP_BAD_REQUEST)
      .end(done);
  });

  it('rejects all other request types to the /v1/authenticate endpoint', function(done) {
    request(server)
      .delete('/v1/authenticate')
      .expect('Allow', 'POST')
      .expect(HTTP_METHOD_NOT_ALLOWED);

    request(server)
      .put('/v1/authenticate')
      .expect('Allow', 'POST')
      .expect(HTTP_METHOD_NOT_ALLOWED);

    request(server)
      .get('/v1/authenticate')
      .expect('Allow', 'POST')
      .expect(HTTP_METHOD_NOT_ALLOWED)
      .end(done);
  });
});
