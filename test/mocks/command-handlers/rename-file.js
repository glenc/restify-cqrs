var context = require('../../context');

module.exports = {
  name: 'rename-file',
  handler: function(payload, callback) {
    context.trackCommandHandled('rename-file');
    callback(null, { success: true });
  }
}
