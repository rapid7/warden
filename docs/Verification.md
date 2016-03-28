# Verification #

The criteria checked to ensure the server making the request should receive a token.

## Methods ##
* `verifySignature(signature)`
  * Immediately verify the signature is valid.


* `verifyData(object)`
  * Next, the data sent with the request will be checked against the criteria,
  set by warden's admin, to decide if a token should be returned.
    * Pass: response code of 200 (ok)
    * Fail: response code of 403 (Forbidden)


* `getToken(ttl maybe)`
  * Get a token from vault for response if request is successful


* `respond(responseCode, token)`
  * Crafts the response with the given response code as well as token (which can
    be null on fail)
