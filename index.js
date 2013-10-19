var async           = require('async');
var loader          = require('glob-module-loader');
var commandService  = require('./lib/command-service');
var queryService    = require('./lib/query-service');
var restifyAdapter  = require('./lib/restify-adapter');

var RestifyCqrs = module.exports = (function() {
  var loadModules = function(config, callback) {
    async.parallel([
      function(cb) { loader.loadAsync(config.searchPaths.commandHandlers, commandService.registerHandler, cb); },
      function(cb) { loader.loadAsync(config.searchPaths.queries, queryService.registerQuery, cb); },
      function(cb) { loader.loadAsync(config.searchPaths.projections, queryService.registerProjection, cb); }
    ], function(err) {
      if (err) return callback(err);
      return callback();
    });
  };

  var registerRoutes = function(server, callback) {
    restifyAdapter.registerRoutes(server);
    callback();
  };

  var init = function(server, config, callback) {
    async.waterfall([
      function(cb) { loadModules(config, cb); },
      function(cb) { registerRoutes(server, cb); }
    ], callback);
  };

  return {
    init: init
  };
})();
