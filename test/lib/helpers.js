'use strict';

/* eslint-env mocha */
/* global Config, Log */
/* eslint-disable rapid7/static-magic-numbers, max-nested-callbacks */
global.Log = new (require('winston').Logger);
global.Config = require('nconf');
