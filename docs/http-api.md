# HTTP API #

The main interface to warden is a HTTP API. The API can be used to retrieve
vault tokens to authorized nodes. The endpoints are versioned to enable
changes without breaking backwards compatibility.

Each endpoint manages a different aspect of propsd:

* health - Basic health check
* authenticate - Authenticates with vault to retrieve a token

## Health ##

The health endpoint is used to validate propsd is running. The endpoint responds
to GET requests with a JSON body and a response code. Any other type of
request returns a 405 (Method Not Allowed) response code and includes an
`Allow: GET` header.

### /v1/health ###

An example response from the health API is:

~~~json
{
  "status": "okay",
  "uptime": 1222101
}
~~~

The status field is a string with one of the following values: "okay",
or "fail". The okay status means that warden is available. The fail
status means that warden is not available.

The uptime field is an integer representing the number of milliseconds warden
has been running.

Response codes are compatible with Consul HTTP health checks. A 200 (OK) is
returned with an okay status. A 500 (Internal Server Error) is returned with a
fail status.

## Authenticate ##

The authenticate endpoint provides a way for servers to authenticate and receive
a token from vault. The endpoint responds to POST requests that contain metadata
about the server and a signed  with either a 200 (OK) response and token from
vault, or a 403 (Forbidden) response code with a header of POST.

Example token of a successful request. It should look exactly like a response
directly from vault
```js
{ lease_id: '',
  renewable: false,
  lease_duration: 0,
  data: null,
  warnings: null,
  auth:
   { client_token: '9fcc202c-366b-9614-50a6-25ad4f78691d',
     accessor: '1bf0a7cb-7400-298d-d39b-3f1a9946fdea',
     policies: [ 'root' ],
     metadata: null,
     lease_duration: 60,
     renewable: true } }
```

### /v1/authenticate ###

POST requests return a vault token and a 200 (OK) response code, or a 403 response
code when the data sent is not enough to authenticate.

Any other type of request returns a 405 (Method Not Allowed) response code with
a header of `Allow: POST` header.
