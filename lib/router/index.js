var commandRouter = require('./command-router');
var queryRouter = require('./query-router');

module.exports.create = function(commandService, queryService) {
  return new Router(commandService, queryService);
};

var Router = function(commandService, queryService) {
  var queryRt = queryRouter.create(queryService);
  var commandRt = commandRouter.create(commandService);

  var registerRoutes = function(server) {
    commandRt.registerRoutes(server);
    queryRt.registerRoutes(server);
  };

  return {
    registerRoutes: registerRoutes
  };
};
