'use strict';

const CP = require('child_process');
const Path = require('path');

const FORBIDDEN = 403;
const defaultPort = 9909;
const defaultMaxRetires = 5;

class Server {
  constructor(port, path, options) {
    options = options || {};

    this.port = Number(port) || defaultPort;
    this.path = path || Path.resolve(__dirname, '../../pkcs7/bin/server');

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

exports.startServer = function(app) {
  const server = new Server();

  process.on('exit', function() {
    server.stop();
  });

  server.start();
};
