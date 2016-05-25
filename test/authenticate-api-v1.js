/* eslint-env mocha */
'use strict';

const request = require('supertest');

require('should');

const testServerPort = 3000;
const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_METHOD_NOT_ALLOWED = 405;

const Real_string = {document: '{\n  \"privateIp\" : \"10.11.12.13\",\n  \"devpayProductCodes\" : null,\n  \"availabilityZone\" : \"us-east-1c\",\n  \"version\" : \"2010-08-31\",\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"billingProducts\" : null,\n  \"instanceType\" : \"t2.small\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"pendingTime\" : \"2014-10-18T19:01:04Z\",\n  \"kernelId\" : null,\n  \"ramdiskId\" : null,\n  \"architecture\" : \"x86_64\",\n  \"region\" : \"us-east-2\"\n }', signiture: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'};

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
      .type('json')
      .set('Accept', 'application/json')
      .send(Real_string)
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

  it('responds correctly to a request to the /v1/authenticate endpoint', (done) => {
    request(server)
      .post('/v1/authenticate')
      .type('json')
      .set('Accept', 'application/json')
      .send(Real_string)
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
