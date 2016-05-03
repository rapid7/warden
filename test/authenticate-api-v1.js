/* eslint-env mocha */
'use strict';

const request = require('supertest');

require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;

/**
 * Create a new Express server for testing
 *
 * @return {http.Server}
 */
const makeServer = () => {
  const app = require('express')();

  require('../lib/control/v1/authenticate').attach(app);
  return app.listen(testServerPort);
};

describe('Authenticate API v1', () => {
  let server = null;

  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('acknowledges POST requests to the /v1/authenticate endpoint', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end(done);
  });

  it('rejects all other request types to the /v1/authenticate endpoint', (done) => {
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

  it('responds correctly to a request to the /health endpoint', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('lease_duration');
        res.body.should.have.property('renewable');
        res.body.should.have.property('data');
        done();
      });
  });

});
