/* eslint-env mocha */
'use strict';

const request = require('supertest');

require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
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

describe('Validate the body of the request v1', () => {
  let server = null;

  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('responds with the correct error for a request without a document', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({docs: '{\n  \"region\" : \"us-east-2\"\n }', signiture: '-----BEGIN PKC-----'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('errors');
        res.body.should.have.property('status');
        res.body.code.should.equal(HTTP_BAD_REQUEST);
        res.body.errors.length.should.equal(1);
        done();
      });
  });

  it('responds with the correct error for a request with maleformed json in the document', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({docs: 'us-east-2', signiture: '-----BEGIN PKC-----'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('errors');
        res.body.should.have.property('status');
        res.body.code.should.equal(HTTP_BAD_REQUEST);
        res.body.errors.length.should.equal(1);
        done();
      });
  });

  it('responds with the correct error for a request without a signiture', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({document: '{\n  \"region\" : \"us-east-2\"\n }', sig: '-----BEGIN PKC-----'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('errors');
        res.body.should.have.property('status');
        res.body.code.should.equal(HTTP_BAD_REQUEST);
        res.body.errors.length.should.equal(1);
        done();
      });
  });

  it('responds with the correct error for a request without both a document and a signiture', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({docs: '{\n  \"region\" : \"us-east-2\"\n }', sig: '-----BEGIN PKC-----'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('errors');
        res.body.should.have.property('status');
        res.body.code.should.equal(HTTP_BAD_REQUEST);
        res.body.errors.length.should.equal(2);
        done();
      });
  });

});
