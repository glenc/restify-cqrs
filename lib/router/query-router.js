var natural       = require('natural');
var restify       = require('restify');
var errors        = require('../errors');

module.exports.create = function(queryService) {
  return new QueryRouter(queryService);
};

var QueryRouter = function(queryService) {

  var mapError = function(err) {
    if (err instanceof errors.NotFoundError) {
      return new restify.ResourceNotFoundError();
    }
    if (err instanceof errors.UnknownQueryError) {
      return new restify.ResourceNotFoundError();
    }
    if (err instanceof errors.UnknownModelError) {
      return new restify.ResourceNotFoundError();
    }
    return err;
  };

  var queryHandler = function(model, query) {
    return function(req, res, next) {
      var view = req.params.view || '';
      delete req.params.view;

      queryService.execute(model, query, view, req.params, function(err, results) {
        if (err) return next(mapError(err));
        res.send(200, results);
        next();
      });
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
