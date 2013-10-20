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
  var executedQueries = {};

  var trackCommandHandled = function(command) {
    if (!handledCommands[command])
      handledCommands[command] = 0;

    handledCommands[command]++;
  };

  var trackExecutedQuery = function(model, query, view, parameters) {
    var key = model + ':' + query;
    if (!executedQueries[key])
      executedQueries[key] = [];

    executedQueries[key].push({view: view, parameters: parameters});
  };

  var reset = function() {
    Object.keys(handledCommands).forEach(function(k) {
      delete handledCommands[k];
    });
    Object.keys(executedQueries).forEach(function(k) {
      delete executedQueries[k];
    });
  };

  return {
    testCommands: testCommands,
    testModels: testModels,
    handledCommands: handledCommands,
    executedQueries: executedQueries,
    trackCommandHandled: trackCommandHandled,
    trackExecutedQuery: trackExecutedQuery,
    reset: reset
  };

})();
