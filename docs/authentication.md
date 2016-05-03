# Verification #

The data sent in the request is verified to ensure that the server making the
request should receive a token.

## Methods ##

* `verifyBody(data)`
  * Does the body contain two strings?


* `verifySignature(signature)`
  * Is the PKCS7 signature valid?


* `verifyJson(data)`
  * Does the data contain valid json that can be interpreted?


* `verifyIdentity(data)`
  * Is the json an identity document from EC2 that contains AWS account, region,
  instance identifier, and AMI identifier?


* `fetchMetaData(data)`
  * Fetches meta data about the requesting server for additional verification.


* `verifyData(object, version)`
  * The identity document and data recieved from fetchMetaData will be used to
  grant or reject a vault token for the server.


* `getToken(ttl maybe)`
  * Get a token from vault for response if request is successful


* `respond(responseCode, token)`
  * Crafts the response with the given response code as well as token (which can
    be null on fail)
