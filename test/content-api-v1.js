/* eslint-env mocha */
'use strict';

const content = require('../lib/control/validation/content');
const should = require('should');

const nothing_wrong = {document: '{\n  \"privateIp\" : \"10.11.12.13\",\n  \"devpayProductCodes\" : null,\n  \"availabilityZone\" : \"us-east-1c\",\n  \"version\" : \"2010-08-31\",\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"billingProducts\" : null,\n  \"instanceType\" : \"t2.small\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"pendingTime\" : \"2014-10-18T19:01:04Z\",\n  \"kernelId\" : null,\n  \"ramdiskId\" : null,\n  \"architecture\" : \"x86_64\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
const no_region = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"UK-Northeast-SouthWest-7\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
const no_instance = {document: '{\n  \"instanceId\" : \"i-a9aza\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
const no_account = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"abcdefg\",\n  \"imageId\" : \"ami-abcdeaf2\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
const no_ami = {document: '{\n  \"instanceId\" : \"i-aaaaaaaa\",\n  \"accountId\" : \"123456789012\",\n  \"imageId\" : \"ami-1qaz@WSX\",\n  \"region\" : \"us-east-2\"\n }', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len
const four_wrong = {document: '{\n  \"instanceId\" : \"im-aazaaaaa\",\n  \"accountId\" : \"123456z89012\",\n  \"imageId\" : \"i-abcdzaf2\",\n  \"region\" : \"uk-Northeast-Southwest-12\"\n}', signature: '-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAaCAJIAEggGmewog\nICJwcml2YXRlSXAiIDogIjEwLjE5Ni4yNC42MyIsCiAgImRldnBheVByb2R1Y3RDb2RlcyIgOiBu\ndWxsLAogICJhdmFpbGFiaWxpdHlab25lIiA6ICJ1cy1lYXN0LTFhIiwKICAidmVyc2lvbiIgOiAi\nMjAxMC0wOC0zMSIsCiAgImluc3RhbmNlSWQiIDagImktYWFhZjJkMWEiLAogICJiaWxsaW5nUHJv\nZHVjdHMiIDogbnVsbCwKICAiaW5zdGFuY2VUeXBlIiA6ICJ0Mi5zbWFsbCIsCiAgImFjY291bnRJ\nZCIgOiAiNzE2NzU2MTk5NTYyIiwKICAiaW1hZ2VJZCIgOiAiYW2pLWJjYmZmYWQ2IiwKICAicGVu\nZGluZ1RpbWUiIDogIjIwMTUtMTEtMThUMTk6MDE6MDRaIiwKICAia2VybmVsSWQiIDogbnVsbCwK\nICAicmFtZGlza0lkIiA6IG51bGwsCiAgImFyY2hpdGVjdHVyZSIgOiAgeDg2XzY0IiwKICAicmVn\naW9uIiA6ICJ1cy1lYXN0LTEiCn0AAAAAAAAxggEYMIIBFAIBATBpMFwxCzAJBgNVBAYTAlVTMRkw\nFwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6\nb24gV2ViIFNlcnZpY2VzIExMQwIJAJa6SNnlXhpnMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx\nCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTExMTgxOTAxMThaMCMGCSqGSIb3DQEJBDEW\nBBRl2oC56YzkPa83VvQzeoMUqMElUzAJBgcqhkjOOAQDBC8wLQIUC/Ab91UXE/K7obsWxdj3DNx2\nKEsCFQCkBRpQBr8yeJQAzUx3Kd8VhwGyhQAAAAAAAA==\n-----END PKCS7-----\n'}; // eslint-disable-line max-len

describe('Validate the Document\'s contents v1', () => {
  const req = {};
  const res = {status() {return this}, json(any) {return any}};
  const next = function() {return true};

  it('responds with the correct error for a document without a Region', function () {
    req.body = no_region;
    should(content.document(req, res, next)).have.property('errors', [ 'Region parameter is not valid' ]);
  });

  it('responds with the correct error for a document without an Instance', function () {
    req.body = no_instance;
    should(content.document(req, res, next)).have.property('errors', [ 'Instance-ID parameter is not valid' ]);
  });

  it('responds with the correct error for a document without an Account', function () {
    req.body = no_account;
    should(content.document(req, res, next)).have.property('errors', ['Account-ID parameter is not valid']);
  });

  it('responds with the correct error for a document without an AMI', function () {
    req.body = no_ami;
    should(content.document(req, res, next)).have.property('errors', [ 'AMI-ID parameter is not valid' ]);
  });

  it('responds with the correct error for a document without a any of the criteria', function () {
    req.body = four_wrong;
    should(content.document(req, res, next)).have.property('errors',
      [ 'AMI-ID parameter is not valid',
        'Instance-ID parameter is not valid',
        'Account-ID parameter is not valid',
        'Region parameter is not valid' ]);
  });

  it('responds correctly to a properly formated request', function () {
    req.body = nothing_wrong;
    should(content.document(req, res, next)).true;
  });

});
