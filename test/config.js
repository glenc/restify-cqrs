var config = {};

config.cqrs = {
  searchPaths: {
    queries: 'test/mocks/queries/**/*.js',
    commandHandlers: 'test/mocks/command-handlers/**/*.js',
    views: 'test/mocks/views/**/*.js'
  },
  commandStore: require('./mocks/db').CommandStore
};

config.web = {
  port: 9000
};

module.exports = config;
