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
a token from vault. The endpoint responds to GET requests that contain metadata
about the server and a signed  with either a 200 (OK) response and token from
vault, or a 403 (Forbidden) response code.

### /v1/authenticate ###

An example response from the Conqueso API is:

~~~text
aws.metrics.enabled=false
fitness.value=88.33
web.url.private=http://localhost:2600/
conqueso.frontend.ips=10.0.0.1,10.0.0.2
~~~

GET requests return a vault token and a 200 (OK) response code, or a 403 response
code when the data sent is not enough to authenticate.

Any other type of request returns a 405 (Method Not Allowed) response code.
