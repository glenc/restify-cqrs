var expect  = require('chai').expect;
var async   = require('async');
var restify = require('restify');
var config  = require('../config');
var helper  = require('../helper');
var context = require('../context');
var db      = require('../mocks/db');

describe('command handling', function() {

  var result = {};

  before(function(done) {

    var doTest = function() {
      var client = restify.createJsonClient({
        url: 'http://localhost:' + config.web.port
      });

      client.post(
        '/commands/new-file',
        { contents: 'hello' },
        new helper.responseHandler(result, done));
    }

    async.parallel([
      function(cb) { db.CommandStore.reset(cb); },
      function(cb) { context.reset(); cb(); }
    ], doTest);
  });

  it('should store the command in the commandStore', function() {
    expect(db.CommandStore.commands).to.have.length(1);
    var storedCommand = db.CommandStore.commands[0];
    expect(storedCommand.id).to.equal(result.obj.id);
    expect(storedCommand.payload).to.deep.equal({ contents: 'hello' });
    expect(storedCommand.submittedAt).to.exist;
  });

  it('should return a command id', function() {
    expect(result.obj).to.exist;
    expect(result.obj.id).to.exist;
  });

  it('should call the appropriate handler', function() {
    expect(context.handledCommands['new-file']).to.equal(1);
  });

});

describe('command resolution', function() {

  describe('success', function() {

    it('should store the result on the command in the commandStore');
    it('should set the completedAt time on the command in the commandStore');

  });

  describe('failure', function() {

    it('should store the error on the command in the commandStore');
    it('should set the completedAt time on the command in the commandStore');

  });

});
