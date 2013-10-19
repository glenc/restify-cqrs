module.exports = {
  name: 'rename-file',
  handler: function(payload, callback) {
    console.log('handled rename file');
    callback(null, {});
  }
}
