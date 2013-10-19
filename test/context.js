var Context = module.exports = (function() {
  var testCommands = [
    'new-file',
    'rename-file',
    'delete-file',
    'move-file'
  ];

  var handledCommands = {};

  var trackCommandHandled = function(command) {
    if (!handledCommands[command])
      handledCommands[command] = 0;

    handledCommands[command]++;
  };

  var reset = function() {
    handledCommands = {};
  };

  return {
    testCommands: testCommands,
    handledCommands: handledCommands,
    trackCommandHandled: trackCommandHandled,
    reset: reset
  };

})();
