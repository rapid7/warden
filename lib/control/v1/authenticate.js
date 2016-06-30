/* eslint-disable max-nested-callbacks */

'use strict';

const CP = require('child_process');
const Path = require('path');
const HTTP = require('http');
const bodyParser = require('body-parser');

const FORBIDDEN = 403;
const defaultPort = 9806;
const defaultMaxRetires = 5;

class Server {
  constructor(port, path, options) {
    options = options || {};

    this.port = Number(port) || defaultPort;
    this.path = path || Path.resolve(__dirname, '../../../pkcs7/bin/server');
    this.retries = 0;
    this.maxRetires = Number(options.maxRetires) || defaultMaxRetires;
  }

  start() {
    this.process = CP.spawn(this.path, [`-p ${this.port}`]);
    Log.info(`PKCS7 helper started. PID ${process.pid}. Port ${this.port}`);

    // Crash/respawn handler
    this.process.on('exit', (code, signal) => {
      if (this.stopped) {
        Log.info('PKCS7 helper shutdown');
        return;
      }

      this.retries += 1;
      Log.info('retry attempt '+this.retries);
      if (this.retries > this.maxRetires) {
        Log.error('PKCS7 helper restart max-retries have been exceeded!');
        return;
      }

      Log.warn(`PKCS7 helper exited unexpectedly with code ${code}`);
      this.start();
    });

    // Capture logging
    this.process.stdout.on('data', (data) => Log.info(`PKCS7 helper: ${data}`));
  }

  stop() {
    this.stopped = true;

    if (this.process) {
      this.process.kill();
      delete this.process;
    }
  }

  validate(params, callback) {
    const request = new Buffer(JSON.stringify(params, null, 2));

    const req = HTTP.request({
      hostname: 'localhost',
      port: this.port,
      method: 'POST',
      path: '/validate',
      headers: {
        'content-type': 'application/json',
        'content-length': request.length
      }
    });

    const chunks = [];

    req.on('response', function(res) {
      res.on('end', function ended(chunk) {
        if (chunk) { chunks.push(chunk); }
        console.log(chunks)
        try {
          const response = JSON.parse(Buffer.concat(chunks).toString('utf8'));

          callback(null, response);
        } catch(e) {
          callback(e);
        }
      });
      res.on('data', (chunk) => chunks.push(chunk));
    });

    req.on('error', callback);

    req.write(request);
    req.end();
  }
}

exports.Server = Server;

function Authenticate(app) {
  const server = new Server();

  const HTTP_OK = 200;
  const leaseDuration = 300;
  const BAD_REQUEST = 400;
  const FORBIDDEN = 403;

  const valid = require('../validation/valid');
  const content = require('../validation/content');

  //const fetch = require('../validation/fetch');
  const reject = require('../validation/methodNotAllowed');

  process.on('exit', function() {
    server.stop();
  });

  app.use(bodyParser.json());

  app.post('/v1/authenticate',
    (req, res, next) => {
      console.log('authenticate request recieved');
      next();
    },

    valid.request,

    function(req, res, next) {
      server.validate({
        signature: req.body.signature,
        data: req.body.document
      },
      function(err, status) {
        console.log(status);
        if (err) { return next(err) }
        if (!status.valid) {
          return res.status(FORBIDDEN).json({
            code: FORBIDDEN,
            error: 'Signature is not valid'
          });
        }
        return next();
      })
    },

    content.document,

    function(req, res, next) {
      console.log('Server authenticated, giving token back\n');
      res.status(HTTP_OK);
      res.json({
        lease_duration: leaseDuration,
        renewable: true,
        data: {
          token: 'toekn-UUID'
        }
      });
    },

    function(err, req, res, next) {
      res.status(BAD_REQUEST);
      res.json({
        code: BAD_REQUEST,
        error: err,
        stack: err.stack,
        message: err.message
      });
    }
  );

  // Reject anything else e.g. DELETE, TRACE, etc.
  app.all('/v1/authenticate', reject.methodNotAllowed('POST'));

  //server.start();
};

exports.attach = Authenticate;
