/* eslint-env mocha */
'use strict';

const should = require('should');
const nock = require('nock');
const token = require('../lib/control/validation/token');

const HTTP_OK = 200;
const FORBIDDEN = 403;
const PORT = 8200;

//TODO

describe('Validate getting a token from vault', () => {
  const nothing_wrong = {document: '{\n  \"privateIp\" : \"10.11.12.13\",\n  \"devpayProductCodes\" : null,\n  \"availabilityZone\" : \"us-east-1c\",\n  \"version\" : \"2010-08-31\",\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"billingProducts\" : null,\n  \"instanceType\" : \"t2.small\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"pendingTime\" : \"2014-10-18T19:01:04Z\",\n  \"kernelId\" : null,\n  \"ramdiskId\" : null,\n  \"architecture\" : \"x86_64\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
  const docs = '{\n  \"privateIp\" : \"10.11.12.13\",\n  \"devpayProductCodes\" : null,\n  \"availabilityZone\" : \"us-east-1c\",\n  \"version\" : \"2010-08-31\",\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"billingProducts\" : null,\n  \"instanceType\" : \"t2.small\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"pendingTime\" : \"2014-10-18T19:01:04Z\",\n  \"kernelId\" : null,\n  \"ramdiskId\" : null,\n  \"architecture\" : \"x86_64\",\n  \"region\" : \"us-east-2\"\n }' // eslint-disable-line max-len

  const goodResponse = {first: '1st', auth: {client_token:'UUID',lease_duration:'300',renewable:true}};
  const badResponse = {res:{statusCode:2},req:{url:'/v1/authenticate',headers:{host:'localhost:8080','user-agent':'curl/7.43.0',accept:'*/*','content-type':'application/json','content-length':'1621',expect:'100-continue'},method:'POST',httpVersion:'1.1',originalUrl:'/v1/authenticate',query:{}},responseTime:2,source:'request',type:'request',level:'info',message:'\u001b[90mPOST /v1/authenticate\u001b[39m \u001b[33m400\u001b[39m \u001b[90m28ms\u001b[39m',timestamp:'2016-07-19T14:00:38.368Z'} // eslint-disable-line max-len

  const req = {};
  const res = {status() {return this}, json(any) {return any}};
  const next = function() {return true};
  const vault = {port: PORT, hostname: 'localhost', token: '3e5f8293-eb83-37be-2ed3-03e4324c5e53'};

  it('responds correctly to a properly formated request', function () {
    req.body = nothing_wrong;
    req.document = docs;
    nock('http://localhost:8200')
                .post('/v1/auth/token/create')
                .reply(HTTP_OK, {
                  goodResponse
                });
    should(token.create(req, res, next, vault)).true;
  });

  nock.cleanAll();

});