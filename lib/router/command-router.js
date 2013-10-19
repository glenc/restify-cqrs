var async           = require('async');
var restify         = require('restify');
var errors          = require('../errors');

module.exports.create = function(commandService) {
  return new CommandRouter(commandService);
};

var CommandRouter = function(commandService) {

  var mapError = function(err) {
    if (err instanceof errors.NotFoundError) {
      return new restify.ResourceNotFoundError();
    }
    return err;
  };

  var listCommands = function(req, res, next) {
    res.send(200, commandService.getAvailableCommands());
    next();
  };

  var handleCommand = function(req, res, next) {
    var command = req.params.command;
    var commands = commandService.getAvailableCommands();
    if (commands.indexOf(command) < 0) {
      return next(new restify.ResourceNotFoundError('Unknown command'));
    };

    commandService.handle(command, req.body, function(err, result) {
      if (err) return next(mapError(err));
      res.send(200, { id: result });
      return next();
    });

  };

  var getCommand = function(req, res, next) {
    commandService.getCommand(req.params.id, function(err, cmd) {
      if (err) return next(mapError(err));
      res.send(200, cmd);
      next();
    });
  };

  var registerRoutes = function(server) {
    server.get ('/commands', listCommands);
    server.post('/commands/:command', handleCommand);
    server.get ('/commands/:id', getCommand);
  };

  return {
    registerRoutes: registerRoutes
  };

};
