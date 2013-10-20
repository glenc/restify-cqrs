var _      = require('underscore');
var errors = require('../errors');

module.exports.create = function() {
  return new QueryService();
};

var QueryService = function(config) {
  var _models = {};

  var initModel = function(model) {
    if (!_models[model]) {
      _models[model] = {
        queries: [],
        views: []
      };
    };
    return _models[model];
  }

  var registerQueries = function(queries) {
    if (!Array.isArray(queries)) queries = [queries];
    queries.forEach(function(query) {
      initModel(query.model).queries.push(query);
    });
  };

  var registerViews = function(views) {
    if (!Array.isArray(views)) views = [views];
    views.forEach(function(view) {
      initModel(view.model).views.push(view);
    });
  };

  var getRegisteredQueries = function() {
    return Object.keys(_models).reduce(function(obj, model) {
      obj[model] = _models[model].queries.map(function(q) { return q.name; });
      return obj;
    }, {});
  };

  var execute = function(model, query, view, parameters, callback) {
    if (!_models[model]) return callback(new errors.UnknownModelError());

    var q = _.find(_models[model].queries, function(x) { return x.name == query; });
    if (!q) return callback(new errors.UnknownQueryError());

    var v = _.find(_models[model].views, function(x) { return x.name == view; });
    if (!v) v = {}; // unknown view

    q.execute(parameters, v, callback);
  };

  return {
    registerViews: registerViews,
    registerQueries: registerQueries,
    getRegisteredQueries: getRegisteredQueries,
    execute: execute
  };
};
