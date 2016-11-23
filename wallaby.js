

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
    bootstrap: function () {
      process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled promise rejection', reason)
      })
    }
  }
}
