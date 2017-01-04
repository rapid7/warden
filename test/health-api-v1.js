'use strict';

const request = require('supertest');

require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;

const endpoints = {
  health: '/v1/health'
};

/**
 * Create a new Express server for testing
 *
 * @return {http.Server}
 */
const makeServer = () => {
  const app = require('express')();

  require('../lib/control/v1/health').attach(app);
  return app.listen(testServerPort);
};

describe('Health API v1', () => {
  let server = null;

  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('acknowledges GET requests to the /v1/health endpoint', (done) => {
    request(server)
      .get('/v1/health')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end(done);
  });

  it('rejects all other request types to the /v1/health endpoint', (done) => {
    request(server)
      .delete('/v1/health')
      .expect('Allow', 'GET')
      .expect(HTTP_METHOD_NOT_ALLOWED);

    request(server)
      .put('/v1/health')
      .expect('Allow', 'GET')
      .expect(HTTP_METHOD_NOT_ALLOWED);

    request(server)
      .post('/v1/health')
      .expect('Allow', 'GET')
      .expect(HTTP_METHOD_NOT_ALLOWED)
      .end(done);
  });

  it('responds correctly to a request to the /health endpoint', (done) => {
    request(server)
      .get('/v1/health')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('status');
        res.body.should.have.property('uptime');
        res.body.should.have.property('unsealed');
        done();
      });
  });

});
