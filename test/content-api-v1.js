/* eslint-env mocha */
'use strict';

const request = require('supertest');

require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

const no_region = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"UK-Northeast-SouthWest-7\"\n }', signiture: '-----BEGIN PKCS7-----END PKCS7-----\n'};
const no_instance = {document: '{\n  \"instanceId\" : \"i-a9aza\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"us-east-2\"\n }', signiture: '-----BEGIN PKCS7-----END PKCS7-----\n'};
const no_account = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"abcdefg\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"us-east-2\"\n }', signiture: '-----BEGIN PKCS7-----END PKCS7-----\n'};
const no_ami = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-1qaz@WSX\",\n  \"region\" : \"us-east-2\"\n }', signiture: '-----BEGIN PKCS7-----END PKCS7-----\n'};
const four_wrong = {document: '{\n  \"instanceId\" : \"im-aazaaaaa\",\n  \"accountId\" : \"123456z89012\",\n  \"imageId\" : \"i-abcdzaf2\",\n  \"region\" : \"uk-Northeast-Southwest-12\"\n}', signiture: '-----BEGIN PKCS7-----END PKCS7-----\n'};

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

describe('Validate the Document\'s contents v1', () => {
  let server = null;

  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('responds with the correct error for a request without a region', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send(no_region)
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

  it('responds with the correct error for a request without an instance ID', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send(no_instance)
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

  it('responds with the correct error for a request without an Account ID', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send(no_account)
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

  it('responds with the correct error for a request without an AMI ID', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send(no_ami)
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

  it('responds with the correct error for a request without any of the 4 requirements', (done) => {
    request(server)
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send(four_wrong)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(HTTP_OK)
      .end((err, res) => {
        res.body.should.have.properties('errors');
        res.body.should.have.property('status');
        res.body.code.should.equal(HTTP_BAD_REQUEST);
        res.body.errors.length.should.equal(4);
        done();
      });
  });

});
