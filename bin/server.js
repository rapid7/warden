#!/usr/bin/env node

/* global Config, Log */
'use strict';

const args = require('yargs')
  .usage('Usage: $0 [args]')
  .option('c', {
    alias: 'config',
    describe: 'Load configuration from file',
    type: 'string'
  })
  .option('colorize', {
    describe: 'Colorize log output',
    type: 'boolean',
    default: false
  })
  .help('help')
  .argv;

const express = require('express');
const http = require('http');
const Path = require('path');
const Logger = require('../lib/logger');
const SigServer = require('../lib/control/v1/signature');

const signatureServer = new SigServer.Server();
const app = express();

// Load nconf into the global namespace
global.Config = require('nconf')
    .env()
    .argv();

if (args.c) {
  global.Config.file(Path.resolve(process.cwd(), args.c));
}
global.Config.defaults(require('../config/defaults.json'));
global.Config.use('memory');

// Set up logging
global.Log = Logger.attach(global.Config.get('log:level'));

// Add request logging middleware
if (Config.get('log:requests')) {
  app.use(Logger.requests(Log, Config.get('log:level')));
}

// Register endpoints
require('../lib/control/v1/health').attach(app);
require('../lib/control/v1/unseal').attach(app);
require('../lib/control/v1/authenticate').attach(app, signatureServer);

// Instantiate server and start it
const host = Config.get('service:hostname');
const port = Config.get('service:port');
const server = http.createServer(app);

signatureServer.start();

process.on('exit', function() {
  signatureServer.stop();
});

server.on('error', (err) => {
  global.Log.log('ERROR', err);
});

server.listen(port, host, () => {
  Log.log('INFO', `Listening on ${host}:${port}`);
});
