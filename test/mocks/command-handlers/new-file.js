module.exports = {
  name: 'new-file',
  handler: function(payload, callback) {
    console.log('handled new file');
    callback(null, {});
  }
}
