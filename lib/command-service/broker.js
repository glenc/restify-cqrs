var errors = require('../errors');

var Broker = module.exports = (function() {
  var handlers = {};

  var registerHandler = function(handler) {
    handlers[handler.name] = handler.handler;
  };

  var send = function(command, payload, callback) {
    var handler = handlers[command];
    if (handler) {
      handler(payload, callback);
    } else {
      callback(new errors.UnknownCommandError());
    }
  };

  var getAvailableCommands = function() {
    return Object.keys(handlers);
  };

  return {
    registerHandler: registerHandler,
    getAvailableCommands: getAvailableCommands,
    send: send
  };
})();
