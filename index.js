var async   = require('async');
var loader  = require('glob-module-loader');

var RestifyCqrs = module.exports = (function() {
  var loadModules = function(config, callback) {
    console.log('load modules');
    async.parallel([
      function(cb) { console.log('handlers'); loader.loadAsync(config.searchPaths.commandHandlers, function(module) { console.log('loaded handler'); }, cb); },
      function(cb) { console.log('queries'); loader.loadAsync(config.searchPaths.queries, function(module) { console.log('loaded query'); }, cb); },
      function(cb) { console.log('projections'); loader.loadAsync(config.searchPaths.projections, function(module) { console.log('loaded projection'); }, cb); }
    ], callback);
  };

  var registerRoutes = function(server, callback) {
    console.log('register routes');
    callback();
  };

  var init = function(server, config, callback) {
    console.log('init');
    async.waterfall([
      function(cb) { loadModules(config, cb); },
      function(cb) { registerRoutes(server, cb); }
    ], callback);
  };

  return {
    init: init
  };
})();
