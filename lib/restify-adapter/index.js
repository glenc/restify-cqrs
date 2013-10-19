var commandAdapter = require('./command-adapter');
var queryAdapter = require('./query-adapter');

module.exports.registerRoutes = function(server) {
  commandAdapter.registerRoutes(server);
  queryAdapter.registerRoutes(server);
}
