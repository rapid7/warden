/* eslint-disable max-nested-callbacks */

'use strict';

const spawn = require('child_process').spawn;
const Path = require('path');
const send = require('../util').send;

const defaultPort = 9806;
const defaultMaxRetires = 5;

/**
 * @class Server
 */
class Server {
  /**
   * Constructor
   * @param {Number} port
   * @param {string}path
   * @param {Object} options
   */
  constructor(port, path, options) {
    options = options || {};

    this.port = Number(port) || defaultPort;
    this.path = path || Path.resolve(__dirname, '../../../pkcs7/bin/server');
    this.retries = 0;
    this.maxRetires = Number(options.maxRetires) || defaultMaxRetires;
  }

  /**
   * Start the server
   */
  start() {
    this.process = spawn(this.path, ['-p', this.port]);
    Log.log('INFO', `PKCS7 helper started. PID ${process.pid}. Port ${this.port}`);

    // Crash/respawn handler
    this.process.on('exit', (code, signal) => { // eslint-disable-line no-unused-vars
      if (this.stopped) {
        Log.log('INFO', 'PKCS7 helper shutdown');

        return;
      }

      this.retries += 1;
      Log.log('INFO', `retry attempt ${this.retries}`);
      if (this.retries > this.maxRetires) {
        Log.log('ERROR', 'PKCS7 helper restart max-retries have been exceeded!');

        return;
      }

      Log.log('WARN', `PKCS7 helper exited unexpectedly with code ${code}`);
      this.start();
    });

    // Capture logging
    this.process.stdout.on('data', (data) => Log.log('INFO', `PKCS7 helper: ${data}`));
  }

  /**
   * Stop the server
   */
  stop() {
    this.stopped = true;

    if (this.process) {
      this.process.kill();
      delete this.process;
    }
  }

  /**
   * Issue a request to the validation endpoint
   * @param {Object} params
   * @return {Promise}
   */
  validate(params) {
    return send('localhost', this.port, '/validate', 'POST', params, {
      'content-type': 'application/json'
    });
  }
}

exports.Server = Server;
