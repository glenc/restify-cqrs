var async           = require('async');
var loader          = require('glob-module-loader');
var commandService  = require('./lib/command-service');
var queryService    = require('./lib/query-service');
var router          = require('./lib/router');

var RestifyCqrs = function(server, config, callback) {
  var querySvc = queryService.create();
  var cmdSvc = commandService.create(config.commandStore);
  var routes = router.create(cmdSvc, querySvc);

  // TODO - this is kinda messy
  async.waterfall([
    function(cb) { loadModules(config, cb); },
    function(cb) { registerRoutes(server, cb); }
  ], callback);

  var loadModules = function(config, callback) {
    async.parallel([
      function(cb) { loader.loadAsync(config.searchPaths.commandHandlers, cmdSvc.registerHandlers, cb); },
      function(cb) { loader.loadAsync(config.searchPaths.queries, querySvc.registerQueries, cb); },
      function(cb) { loader.loadAsync(config.searchPaths.views, querySvc.registerViews, cb); }
    ], function(err) {
      if (err) return callback(err);
      return callback();
    });
  };

  var registerRoutes = function(server, callback) {
    routes.registerRoutes(server);
    callback();
  };

};

module.exports = {
  errors: require('./lib/errors'),
  init: function(server, config, callback) {
    new RestifyCqrs(server, config, callback);
  }
};
