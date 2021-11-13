const {colors } = require('mocha/lib/reporters/base');
colors.pass = 32;

module.exports = {
    diff: true,
    extension: ['js'],
    package: './package.json',
    reporter: 'spec',
    slow: 75,
    timeout: 2000,
    ui: 'bdd',
    'watch-files': ['test/**/*.js'],
    'watch-ignore': ['node_modules']
  };
