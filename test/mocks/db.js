var _ = require('underscore');
var cqrs = require('../../index');

var CommandStore = function() {
  var self = this;
  self.commands = [];

  self.reset = function(callback) {
    self.commands = [];
    callback();
  };

  self.get = function(id, callback) {
    var cmd = _.find(self.commands, function(c) { return c.id == id; });
    if (!cmd) return callback(new cqrs.errors.NotFoundError('Command with id ' + id + ' does not exist.'));
    return callback(null, cmd);
  };

  self.save = function(command, callback) {
    command.id = self.commands.length+1;
    self.commands.push(command);
    return callback(null, command.id);
  }
};

var Db = module.exports = (function() {
  return {
    CommandStore: new CommandStore()
  };
})();
