var context = require('../../context');

module.exports = {
  name: 'new-file',
  handler: function(payload, callback) {
    context.trackCommandHandled('new-file');
    callback(null, { success: true });
  }
}
