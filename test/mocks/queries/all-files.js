function simpleQuery(model, name) {
  return {
    model: model,
    name: name,
    execute: function(parameters, view, callback) {
      callback();
    }
  };
};

module.exports = [
  simpleQuery('file', ''),
  simpleQuery('file', 'get'),
  simpleQuery('file', 'large-files'),
  simpleQuery('file', 'small-files'),
  simpleQuery('secret', 'get')
];
