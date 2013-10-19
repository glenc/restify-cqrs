var async  = require('async');

module.exports.create = function(commandStore) {
  return new CommandService(commandStore);
};

var CommandService = function(commandStore) {
  var handlers = {};

  var registerHandler = function(handler) {
    handlers[handler.name] = handler.handler;
  };

  var getAvailableCommands = function() {
    return Object.keys(handlers);
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
    var handler = handlers[command];
    if (handler) {
      handler(payload, callback);
    } else {
      callback(new errors.UnknownCommandError());
    }
  };

  var storeResult = function(id, err, result, callback) {
    commandStore.get(id, function(err, cmd) {
      if (err) return callback(err);
      cmd.result = result;
      cmd.error = err;
      cmd.completedAt = new Date();
      cmdStore.update(cmd, callback);
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
    registerHandler: registerHandler,
    getAvailableCommands: getAvailableCommands,
    handle: handleCommand,
    getCommand: commandStore.get
  };
};
