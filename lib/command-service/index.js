var async  = require('async');
var broker = require('./broker');

module.exports.create = function(commandStore) {
  return new CommandService(commandStore);
};

var CommandService = function(commandStore) {

  var storeCommand = function(command, payload, callback) {
    var cmd = {
      command: command,
      payload: payload,
      submittedAt: new Date()
    };
    commandStore.save(cmd, callback);
  }

  var handleCommand = function(command, payload, callback) {

    async.waterfall([
      // store command in command store
      function(cb) { storeCommand(command, payload, cb); },

      // return id to caller
      function(id, cb) { callback(null, id); cb(); }

      // call handler
      // capture response
      // update command in command store
    ], function(err) {
      if (err) callback(err);
    });
  };

  return {
    registerHandler: broker.registerHandler,
    getAvailableCommands: broker.getAvailableCommands,
    handle: handleCommand,
    getCommand: commandStore.get
  };
};
