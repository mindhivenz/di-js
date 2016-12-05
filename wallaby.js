

module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
      '!src/**/*.spec.js',
    ],
    tests: [
      'src/**/*.spec.js',
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    env: {
      type: 'node',
    },
    testFramework: 'mocha',
    reportConsoleErrorAsError: true,
    bootstrap: function () {
      process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled promise rejection', reason)
      })
    }
  }
}
