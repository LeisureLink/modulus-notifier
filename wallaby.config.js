'use strict';

module.exports = () => {
  return {
    files: [
      'test/**/*',
      'plugins/**/*',
      { pattern: '**/*.tests.js', ignore: true }
    ],
    tests: [
      '**/*.tests.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    bootstrap: () => {
      require('./test/helpers');
    }
  }
};
