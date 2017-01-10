'use strict';

global.Log = {
  log() {}
};

global.Config = require('nconf')
    .argv()
    .env()
    .defaults(require('../config/defaults.json'))
    .use('memory');
