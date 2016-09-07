# Warden

[![Build Status](https://travis-ci.org/rapid7/warden.svg?branch=master)](https://travis-ci.org/rapid7/warden)
[![Coverage Status](https://coveralls.io/repos/github/rapid7/warden/badge.svg?branch=master)](https://coveralls.io/github/rapid7/warden?branch=master)

## Description

Warden is an authentication middleware service that runs on each node in the Vault
cluster. It uses a privileged Vault token to provision orphaned tokens for [tokend][].
the orphaned token has a specific role that grats it access to other services.

Warden runs on [Node.js][].

Warden is implemented as chains of middleware functions that either validate
request parameters or fetch more data using previously validated parameters as
inputs. Data sources such as the S3 and the EC2 describeInstance APIs are trusted
and presumed to be valid, while data in the request body as well as from various
AWS Tags APIs is not, and must be subjected to a validation process before it can
be relied upon as a part of the request's chain of authentication.

Every layer in the middleware chain may either respond immediately to the request
with an error, or pass the request to the next layer. Layers must respond
immediately with an error if a verification task fails.

The steps to validate the request for a token are:
1. receive request for token
2. validate body of request contains a signature and a json document of EC2 instance data
3. validate the the signature is from an EC2 instance
4. Validate the document has all of the necessary information to proceed
5. Fetch metadata from S3 that matches data from the json document
6. acquire a token for Vault that grants access to the specific secrets
7. return the token to the instance requesting a token

## Usage

See the [getting started guide][gsg] for help installing, configuring, and
using Warden.

First ensure that ruby 2.2.4 and node 4.4.x are installed on your Vault servers.
Then ensure that the settings in /config/defaults.json are correct for your needs.

to launch the Warden server, be in the root directory and call ```node bin/server.js```
This will launch both Warden and the Sinatra app to verify signatures of requests.

## Releasing
Steps to release new version:
1. [increment the version][npm-version]
2. Build and upload a package
3. Create a new release on [github.com]

To increment version, run:
~~~bash
npm version minor
rake
~~~

Then following the steps to create the release on [github.com]

## Configuration

TODO



[Node.js]: https://nodejs.org/en/
[tokend]: https://github.com/rapid7/tokend
[gsg]: ./docs/getting-started/
[npm-version]: https://docs.npmjs.com/cli/version
[github.com]: https://www.github.com
