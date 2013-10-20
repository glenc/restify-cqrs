var context = require('../../context');

module.exports = {
  name: 'throw-error',
  handler: function(payload, callback) {
    context.trackCommandHandled('throw-error');
    callback(new Error('ooops'));
  }
}
