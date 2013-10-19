var natural       = require('natural');
var queryService  = require('../query-service');

var QueryAdapter = module.exports = (function() {
  var queryHandler = function(query) {
    return function(req, res, next) {
      console.log('received command %s', query.name);
      res.send(200, {});
      next();
    };
  };

  var getCommand = function(req, res, next) {
    console.log('getting command');
  };

  var registerRoutes = function(server) {
    var nounInflector = new natural.NounInflector();
    var models = queryService.getRegisteredModels();

    models.forEach(function(model) {
      var routeBase = '/' + nounInflector.pluralize(model);

      // queries
      var queries = queryService.getRegisteredQueries(model);
      var hasGetter = false;
      queries.forEach(function(query) {
        if (query == 'get') {
          hasGetter = true;
        } else {
          var route = routeBase + '/' + query;
          console.log('GET  %s', route);
          //server.get(route, new queryHandler(model, query));
        }
      });

      // do getter last so named queries get execited first
      if (hasGetter) {
        var route = routeBase + '/:id';
        console.log('GET  %s', route);
        //server.get(route, new getHandler(model));
      }
    });
  };

  return {
    registerRoutes: registerRoutes
  };
})();
