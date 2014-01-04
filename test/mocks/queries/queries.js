var context = require('../../context');

function simpleQuery(model, name) {
  return {
    model: model,
    name: name,
    execute: function(view, parameters, callback) {
      context.trackExecutedQuery(model, name, view, parameters);
      if (view.customResponse) {
        callback(null, function(res) {
          res.send(200, view.customResponse);
        });
      } else {
        callback(null, {});
      }
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
