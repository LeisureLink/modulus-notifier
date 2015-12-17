'use strict';

//const Fs = require('fs');
//const Path = require('path');
//
//const babelConfiguration = JSON.parse(Fs.readFileSync(Path.join(__dirname, '.babelrc')));
//babelConfiguration.babel = require('babel-core');

module.exports = (wallaby) => {
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
    //compilers: {
    //  '**/*.js': wallaby.compilers.babel(babelConfiguration)
    //}
  }
};
