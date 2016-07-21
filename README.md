# Warden [![Build Status](https://travis-ci.org/rapid7/warden.svg?branch=master)](https://travis-ci.org/rapid7/warden)
## Description

Warden is an authentication middleware service that runs on each node in the vault
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
6. acquire a token for vault that grants access to the specific secrets
7. return the token to the instance requesting a token

## Usage

First insure that ruby 2.2.4 and node 4.4.0 are installed on your vault servers.
Then ensure that the settings in /config/defaults.json are correct for your needs.

to launch the warden server, be in the root directory and call ```node bin/server.js```
This will launch both warden and the Sinatra app to verify signatures of requests.

## Configuration

TODO



[Node.js]: https://nodejs.org/en/
[tokend]: https://github.com/rapid7/tokend
