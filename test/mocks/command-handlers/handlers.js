var context = require('../../context');

function simpleHandler(name) {
  return {
    name: name,
    handler: function(payload, callback) {
      context.trackCommandHandled(name);
      callback(null, { success: true });
    }
  };
};

function erroringHandler(name) {
  return {
    name: name,
    handler: function(payload, callback) {
      context.trackCommandHandled(name);
      callback(new Error('oops'));
    }
  };
};

module.exports = [
  simpleHandler('delete-file'),
  simpleHandler('move-file'),
  simpleHandler('new-file'),
  simpleHandler('rename-file'),
  erroringHandler('throw-error')
];
