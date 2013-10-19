var context = require('../../context');

module.exports = {
  name: 'move-file',
  handler: function(payload, callback) {
    context.trackCommandHandled('move-file');
    callback(null, {});
  }
}
