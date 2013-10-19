var broker = require('./broker');

module.exports.create = function(commandStore) {
  return new CommandService(commandStore);
};

var CommandService = function(commandStore) {
  return {
    registerHandler: broker.registerHandler,
    getAvailableCommands: broker.getAvailableCommands,
    getCommand: commandStore.get
  };
};
