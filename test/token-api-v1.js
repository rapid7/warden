/* eslint-env mocha */
'use strict';

const should = require('should');
const nock = require('nock');
const token = require('../lib/control/validation/token');

const HTTP_OK = 200;
const FORBIDDEN = 403;
const HTTP_BAD_REQUEST = 400;
const PORT = 8200;

const valid = {document: '{\n  \"privateIp\" : \"10.11.12.13\",\n  \"devpayProductCodes\" : null,\n  \"availabilityZone\" : \"us-east-1c\",\n  \"version\" : \"2010-08-31\",\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"billingProducts\" : null,\n  \"instanceType\" : \"t2.small\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"pendingTime\" : \"2014-10-18T19:01:04Z\",\n  \"kernelId\" : null,\n  \"ramdiskId\" : null,\n  \"architecture\" : \"x86_64\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len

const goodResponse = {
  auth: {
    accessor: 'UUID',
    client_token: 'UUID',
    lease_duration: 300,
    renewable: true
  }
};

const accessorResponse = {
  data: {
    accessor: 'UUID',
    creation_time: Date.now(),
    explicit_max_ttl: 0
  }
};

const badResponse = JSON.stringify({"code":400,"status":"BAD_REQUEST","errors":"connect ECONNREFUSED 127.0.0.1:8200"});

const req = {};
const res = {
  status() {
    return this;
  },
  json(any) {
    return JSON.stringify(any);
  }
};
const next = () => {return true};
const vault = {port: PORT, hostname: 'localhost', token: '3e5f8293-eb83-37be-2ed3-03e4324c5e53'};

describe.only('Validate getting a token from vault', () => {
  beforeEach(function() {
    nock('http://localhost:8200')
      .post('/v1/auth/token/create')
      .reply(HTTP_OK, goodResponse)
      .post('/v1/auth/token/lookup-accessor/UUID')
      .reply(HTTP_OK, accessorResponse)
      .get('/v1/sys/mounts/auth/token/tune')
      .reply(HTTP_OK, {
        default_lease_ttl: 360,
        max_lease_ttl: 360
      });
  });
  it('responds correctly to a properly formated request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);
    return token.create(req, res, next, vault).should.be.eventually.true();
  });

  it('sets token creation time on the request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);
    return token.create(req, res, next, vault).then(() => {
      req.should.have.ownProperty('auth');
      req.auth.should.have.ownProperty('creation_time');
      new Date(req.auth.creation_time).should.be.a.Date(); // If it's a date, the ISO string was parseable
    });
  });

  it('sets token expiration time on the request', function() {
    req.body = valid;
    req.document = JSON.parse(valid.document);
    return token.create(req, res, next, vault).then(() => {
      req.should.have.ownProperty('auth');
      req.auth.should.have.ownProperty('expiration_time');
      new Date(req.auth.expiration_time).should.be.a.Date(); // If it's a date, the ISO string was parseable
    });
  });

  it('returns an error if one is encountered', function() {
    nock.cleanAll();
    req.body = valid;
    req.document = JSON.parse(valid.document);
    return token.create(req, res, next, vault).should.eventually.equal(badResponse);
  });
});
