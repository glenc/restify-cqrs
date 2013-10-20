var Context = module.exports = (function() {
  var testCommands = [
    'new-file',
    'rename-file',
    'delete-file',
    'move-file',
    'throw-error'
  ];

  var testModels = {
    file: {
      plural: 'files',
      hasDefaultQuery: true,
      hasGetter: true,
      namedQueries: [ 'large-files', 'small-files' ],
      views: []
    },
    secret: {
      plural: 'secrets',
      hasDefaultQuery: false,
      hasGetter: true,
      namedQueries: [],
      views: []
    }
  };

  var handledCommands = {};

  var trackCommandHandled = function(command) {
    if (!handledCommands[command])
      handledCommands[command] = 0;

    handledCommands[command]++;
  };

  var reset = function() {
    Object.keys(handledCommands).forEach(function(k) {
      delete handledCommands[k];
    });
  };

  return {
    testCommands: testCommands,
    testModels: testModels,
    handledCommands: handledCommands,
    trackCommandHandled: trackCommandHandled,
    reset: reset
  };

})();
