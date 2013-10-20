var natural       = require('natural');

module.exports.create = function(queryService) {
  return new QueryRouter(queryService);
};

var QueryRouter = function(queryService) {

  var queryHandler = function(model, query) {
    return function(req, res, next) {
      res.send(200, {});
      next();
    };
  };

  var registerRoutes = function(server) {
    var nounInflector = new natural.NounInflector();
    var models = queryService.getRegisteredQueries();

    Object.keys(models).forEach(function(model) {
      var routeBase = '/' + nounInflector.pluralize(model);
      var queries = models[model];

      var hasGetter = false;
      queries.forEach(function(query) {
        if (query == 'get') {
          hasGetter = true;
        } else {
          var route = routeBase + '/' + query;
          server.get(route, new queryHandler(model, query));
        }
      });

      // do getter last so that named queries are picked up first
      if (hasGetter) {
        var route = routeBase + '/:id';
        server.get(route, new queryHandler(model, 'get'));
      }

    });
  };

  return {
    registerRoutes: registerRoutes
  };
};
