var _      = require('underscore');
var errors = require('../errors');

module.exports.create = function() {
  return new QueryService();
};

var QueryService = function(config) {
  var models = {};

  var registerQuery = function(query) {
    var model = models[query.model] || {};
    model.queries = model.queries || [];
    model.queries.push(query);
    models[query.model] = model;
  };

  var registerProjection = function(projection) {
    var model = models[projection.model] || {};
    model.projections = model.projections || [];
    model.projections.push(projection);
    models[projection.model] = model;
  };

  var getRegisteredModels = function() {
    return Object.keys(models);
  };

  var getRegisteredQueries = function(model) {
    if (!models[model]) return [];
    return models[model].queries.map(function(q) { return q.name; });
  };

  var execute = function(model, query, projection, parameters, callback) {
    if (!models[model]) return callback(new errors.UnknownModelError());

    var q = _.find(models[model].queries, function(q) { return q.name == query; });
    if (!q) return callback(new errors.UnknownQueryError());

    var p = _.find(models[model].projections, function(p) { return p.name == projection; });
    if (!p) p = { select: '' };

    q.execute(parameters, p, callback);
  };

  var get = function(model, id, projection, callback) {
    if (!models[model]) return callback(new errors.UnknownModelError());

    var q = _.find(models[model].queries, function(q) { return q.name == 'get'; });
    if (!q) return callback(new errors.UnknownQueryError());

    var p = _.find(models[model].projections, function(p) { return p.name == projection; });
    if (!p) p = { };

    q.execute(id, p, callback);
  };

  return {
    registerProjection: registerProjection,
    registerQuery: registerQuery,
    getRegisteredModels: getRegisteredModels,
    getRegisteredQueries: getRegisteredQueries,
    execute: execute,
    get: get
  };
};
