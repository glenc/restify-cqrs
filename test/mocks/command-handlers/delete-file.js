var context = require('../../context');

module.exports = {
  name: 'delete-file',
  handler: function(payload, callback) {
    context.trackCommandHandled('delete-file');
    callback(null, { success: true });
  }
}
