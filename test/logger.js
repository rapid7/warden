'use strict';

require('should');
const Winston = require('winston');

class ConfigLike {
  constructor(data) {
    this.data = data;
  }

  get(str) {
    return this.data[str];
  }
}

describe('Logging', function() {
  const config = new ConfigLike({
    'log:level': 'INFO'
  });
  const log = require('../lib/logger').attach(config.get('log:level'));

  it('returns a WINSTON object', function() {
    log.should.be.an.instanceOf(Winston.Logger);
  });

  it('sets the log level correctly', function() {
    log.level.should.be.exactly('INFO');
  });
});
