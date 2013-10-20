var expect  = require('chai').expect;
var restify = require('restify');
var async   = require('async');
var config  = require('../config');
var context  = require('../context');
var db      = require('../mocks/db');

describe('routing', function() {

  describe('commands', function() {

    var client = restify.createJsonClient({
      url: 'http://localhost:' + config.web.port
    });

    beforeEach(function(done) {
      db.CommandStore.reset(done);
    });

    it('returns a list of available commands at the root', function(done) {
      client.get('/commands', function(err, req, res, obj) {
        expect(err).not.to.exist;
        expect(res.statusCode).to.equal(200);
        expect(obj).to.exist;
        expect(obj).to.have.length(context.testCommands.length);
        context.testCommands.forEach(function(c) {
          expect(obj).to.contain(c);
        });
        done();
      });
    });

    it('has a route for each registered command', function(done) {
      var testCommandRoute = function(command, callback) {
        client.post('/commands/' + command, function(err, req, res) {
          expect(res.statusCode).to.equal(200);
          expect(err).not.to.exist;
          callback();
        });
      };

      async.each(context.testCommands, testCommandRoute, done);
    });

    it('returns a 404 when posting an unknown command', function(done) {
      client.post('/commands/unknown-command', function(err, req, res, obj) {
        expect(res.statusCode).to.equal(404);
        expect(err).to.exist;
        done();
      });
    });

    it('returns an individual command by id', function(done) {
      // create a command in our storage
      db.CommandStore.commands.push({ id:123, command:'test', payload:{} });

      client.get('/commands/123', function(err, req, res, obj) {
        expect(res.statusCode).to.equal(200);
        expect(err).not.to.exist;
        expect(obj).to.exist;
        expect(obj.id).to.equal(123);
        expect(obj.command).to.equal('test');
        done();
      });
    });

    it('returns a 404 for an unknown command id', function(done) {
      client.get('/commands/456', function(err, req, res, obj) {
        expect(res.statusCode).to.equal(404);
        expect(err).to.exist;
        done();
      });
    });

  });

  describe('queries', function() {

    var client = restify.createJsonClient({
      url: 'http://localhost:' + config.web.port
    });

    // test each scenario we have
    var models = Object.keys(context.testModels);
    models.forEach(function(name) {
      var model = context.testModels[name];
      var expectedRoutes = [];

      if (model.hasDefaultQuery) expectedRoutes.push('/' + model.plural);
      if (model.hasGetter) expectedRoutes.push('/' + model.plural + '/1');
      model.namedQueries.forEach(function(q) {
        expectedRoutes.push('/' + model.plural + '/' + q);
      });

      expectedRoutes.forEach(function(route) {
        describe('GET ' + route, function() {
          it('returns status code 200', function(done) {
            client.get(root, function(err, req, res, obj) {
              expect(res.statusCode).to.equal(200);
              expect(err).not.to.exist;
              done();
            });
          });
        });
      });

    });


  });

});
