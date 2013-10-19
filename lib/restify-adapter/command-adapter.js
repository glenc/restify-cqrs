var async           = require('async');
var restify         = require('restify');
var errors          = require('../errors');
var commandService  = require('../command-service');

var CommandAdapter = module.exports = (function() {
  var commandHandler = function(command) {
    return function(req, res, next) {
      console.log('received command %s', command.name);
      res.send(200, {});
      next();
    };
  };

  var getCommand = function(req, res, next) {
    console.log('getting command');
  };

  var registerRoutes = function(server) {
    var commands = commandService.getAvailableCommands();
    commands.forEach(function(c) {
      console.log('POST /commands/%s', c.name);
    });
    console.log('GET  /commands/:id');
  };

  return {
    registerRoutes: registerRoutes
  };
})();
