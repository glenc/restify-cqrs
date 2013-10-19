var broker = require('./broker');

var CommandService = module.exports = (function(config) {
  return {
    registerHandler: broker.registerHandler,
    getAvailableCommands: broker.getAvailableCommands
  }
})();
