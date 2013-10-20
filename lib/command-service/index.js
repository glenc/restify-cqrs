var async  = require('async');

module.exports.create = function(commandStore) {
  return new CommandService(commandStore);
};

var CommandService = function(commandStore) {
  var _handlers = {};

  var registerHandlers = function(handlers) {
    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }
    handlers.forEach(function(h) {
      _handlers[h.name] = h.handler;
    });
  };

  var getAvailableCommands = function() {
    return Object.keys(_handlers);
  };

  var storeCommand = function(command, payload, callback) {
    var cmd = {
      command: command,
      payload: payload,
      submittedAt: new Date()
    };
    commandStore.save(cmd, callback);
  };

  var callHandler = function(command, payload, callback) {
    var handler = _handlers[command];
    if (handler) {
      handler(payload, callback);
    } else {
      callback(new errors.UnknownCommandError());
    }
  };

  var storeResult = function(id, error, result, callback) {
    commandStore.get(id, function(err, cmd) {
      if (err) return callback(err);
      cmd.result = result;
      cmd.error = error ? error.toString() : null;
      cmd.completedAt = new Date();
      commandStore.update(cmd, callback);
    });
  };

  var handleCommand = function(command, payload, callback) {

    var callbackCalled = false;
    async.waterfall([
      // store command in command store
      function(cb) { storeCommand(command, payload, cb); },

      // return id to caller
      function(id, cb) { callback(null, id); callbackCalled = true; cb(null, id); },

      // call handler
      function(id, cb) { callHandler(command, payload, function(err, result) { cb(null, id, err, result); }); },

      // update command in command store
      storeResult

    ], function(err) {
      if (err) {
        if (!callbackCalled) callback(err);
      }
    });
  };

  return {
    registerHandlers: registerHandlers,
    getAvailableCommands: getAvailableCommands,
    handle: handleCommand,
    getCommand: commandStore.get
  };
};
