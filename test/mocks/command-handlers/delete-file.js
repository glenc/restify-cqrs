module.exports = {
  name: 'delete-file',
  handler: function(payload, callback) {
    console.log('handled delete file');
    callback(null, {});
  }
}
