# How to use warden #

The warden service is the core process in warden. It's responsible for
providing a way to grant vault tokens to [tokend][tokend]. warden is designed to run on every vault server that stores secrets.

## Running warden ##

The warden service is started by running the `bin/server.js` binary. The binary
can be found in the folder where [warden is installed][installation]. The
service blocks, running forever or until it's told to quit. The binary supports
several [configuration options][Configuration].

When starting warden you should see output similar to this:

~~~text
{"level":"info","message":"PKCS7 helper started. PID 10027. Port 9806","timestamp":"2016-09-06T14:31:20.421Z"}
{"level":"info","message":"Listening on localhost:8080","timestamp":"2016-09-06T14:31:20.428Z"}
~~~

When running warden you should see output similar to this:

~~~text
authenticate request recieved
{"res":{"statusCode":200},"req":{"url":"/v1/authenticate","headers":{"host":"localhost:8080","user-agent":"curl/7.43.0","accept":"*/*","content-type":"application/json","content-length":"1621","expect":"100-continue"},"method":"POST","httpVersion":"1.1","originalUrl":"/v1/authenticate","query":{}},"responseTime":76,"source":"request","type":"request","level":"info","message":"POST /v1/authenticate 200 76ms","timestamp":"2016-09-06T17:23:00.991Z"}
~~~

## Stopping warden ##

Warden can be stopped by sending it an interrupt signal. This is usually done
by sending `Ctrl-C` from a terminal or by running `kill -INT $warden_pid`.

## Monitoring warden ##

Warden provides an HTTP endpoint for monitoring its status. The endpoint that
provides basic information about warden. Issue a GET request to `/v1/health` and
you'll see output similar to this:

~~~json
{
  "status": "okay",
  "uptime": 1222101
}
~~~

[installation]: "./Installation.md"
[configuration]: "./Configuration.md"
[tokend]: https://github.com/rapid7/tokend