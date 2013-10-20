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

    var tmp = {};
    extend(tmp, cmd);
    return callback(null, tmp);
  };

  self.save = function(command, callback) {
    command.id = self.commands.length+1;
    self.commands.push(command);
    return callback(null, command.id);
  };

  self.update = function(command, callback) {
    var idx = -1;
    for(var i=0; i<self.commands.length; i++) {
      if (self.commands[i].id == command.id) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return callback(new cqrs.errors.NotFoundError('Command with id ' + command.id + ' does not exist.'));

    self.commands[idx] = command;
    callback();
  };

  function extend(dest, from) {
    var props = Object.getOwnPropertyNames(from), destination;

    props.forEach(function (name) {
      if (typeof from[name] === 'object') {
        if (typeof dest[name] !== 'object') {
          dest[name] = {}
        }
        extend(dest[name],from[name]);
      } else {
        destination = Object.getOwnPropertyDescriptor(from, name);
        Object.defineProperty(dest, name, destination);
      }
    });
  };

};

var Db = module.exports = (function() {
  return {
    CommandStore: new CommandStore()
  };
})();
