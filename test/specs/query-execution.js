var expect  = require('chai').expect;
var async   = require('async');
var restify = require('restify');
var config  = require('../config');
var helper  = require('../helper');
var context = require('../context');

describe('query execution', function() {

  var client = restify.createJsonClient({
    url: 'http://localhost:' + config.web.port
  });

  describe('named query', function() {

    describe('without parameters or view', function() {
      before(function(done) {
        context.reset();
        client.get('/files/large-files', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:large-files'];
        expect(tracked).to.have.length(1);
      });

      it('passes the default view to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('');
      });

      it('passes no parameters to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.be.empty;
      });

    });

    describe('with parameters', function() {
      before(function(done) {
        context.reset();
        client.get('/files/large-files?p1=v1&p2=v2', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:large-files'];
        expect(tracked).to.have.length(1);
      });

      it('passes the default view to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('');
      });

      it('passes parameters to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.deep.equal({p1:'v1',p2:'v2'});
      });

    });

    describe('with view', function() {
      before(function(done) {
        context.reset();
        client.get('/files/large-files?view=detail', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:large-files'];
        expect(tracked).to.have.length(1);
      });

      it('passes the named view to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('detail');
      });

      it('does not pass view as a parameter to the query', function() {
        var tracked = context.executedQueries['file:large-files'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.be.empty;
      });
    });

  });

  describe('default query', function() {

    ['/files', '/files/'].forEach(function(path) {

      describe('without parameters or view (' + path + ')', function() {
        before(function(done) {
          context.reset();
          client.get(path, done);
        });

        it('executes the proper query once', function() {
          var tracked = context.executedQueries['file:'];
          expect(tracked).to.have.length(1);
        });

        it('passes the default view to the query', function() {
          var tracked = context.executedQueries['file:'][0];
          expect(tracked.view).to.exist;
          expect(tracked.view.name).to.equal('');
        });

        it('passes no parameters to the query', function() {
          var tracked = context.executedQueries['file:'][0];
          expect(tracked.parameters).to.exist;
          expect(tracked.parameters).to.be.empty;
        });

      });
    });

    describe('with parameters', function() {
      before(function(done) {
        context.reset();
        client.get('/files?p1=v1&p2=v2', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:'];
        expect(tracked).to.have.length(1);
      });

      it('passes the default view to the query', function() {
        var tracked = context.executedQueries['file:'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('');
      });

      it('passes parameters to the query', function() {
        var tracked = context.executedQueries['file:'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.deep.equal({p1:'v1',p2:'v2'});
      });

    });

    describe('with view', function() {
      before(function(done) {
        context.reset();
        client.get('/files?view=detail', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:'];
        expect(tracked).to.have.length(1);
      });

      it('passes the named view to the query', function() {
        var tracked = context.executedQueries['file:'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('detail');
      });

      it('does not pass view as a parameter to the query', function() {
        var tracked = context.executedQueries['file:'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.be.empty;
      });
    });

  });

  describe('response with custom sender', function() {
    // the query app has been configured to do a custom
    // res.send when the view has a customResponse property.
    // in this case the 'export' view has a customResponse
    // property so it should send the hard coded text in
    // the response
    var result = {};
    before(function(done) {
      context.reset();
      client.get('/files/large-files?view=export', new helper.responseHandler(result, done));
    });

    it('passes the named view to the query', function() {
      var tracked = context.executedQueries['file:large-files'][0];
      expect(tracked.view).to.exist;
      expect(tracked.view.name).to.equal('export');
    });

    it('sets the content type in the response', function() {
      var tracked = context.executedQueries['file:large-files'][0];
      expect(result.obj).to.equal(tracked.view.customResponse);
    });
  });

  describe('getter', function() {

    ['/files/1', '/files/1/'].forEach(function(path) {

      describe('without parameters or view (' + path + ')', function() {
        before(function(done) {
          context.reset();
          client.get(path, done);
        });

        it('executes the proper query once', function() {
          var tracked = context.executedQueries['file:get'];
          expect(tracked).to.have.length(1);
        });

        it('passes the default view to the query', function() {
          var tracked = context.executedQueries['file:get'][0];
          expect(tracked.view).to.exist;
          expect(tracked.view.name).to.equal('');
        });

        it('passes the id as the only parameter', function() {
          var tracked = context.executedQueries['file:get'][0];
          expect(tracked.parameters).to.exist;
          expect(tracked.parameters).to.deep.equal({id:'1'});
        });

      });

    });

    describe('with parameters', function() {
      before(function(done) {
        context.reset();
        client.get('/files/1?p1=v1&p2=v2', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:get'];
        expect(tracked).to.have.length(1);
      });

      it('passes the default view to the query', function() {
        var tracked = context.executedQueries['file:get'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('');
      });

      it('passes the id in addition to other parameters', function() {
        var tracked = context.executedQueries['file:get'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.deep.equal({id:'1',p1:'v1',p2:'v2'});
      });

    });

    describe('with view', function() {
      before(function(done) {
        context.reset();
        client.get('/files/1?view=detail', done);
      });

      it('executes the proper query once', function() {
        var tracked = context.executedQueries['file:get'];
        expect(tracked).to.have.length(1);
      });

      it('passes the named view to the query', function() {
        var tracked = context.executedQueries['file:get'][0];
        expect(tracked.view).to.exist;
        expect(tracked.view.name).to.equal('detail');
      });

      it('does not pass view as a parameter to the query', function() {
        var tracked = context.executedQueries['file:get'][0];
        expect(tracked.parameters).to.exist;
        expect(tracked.parameters).to.deep.equal({id:'1'});
      });
    });

  });

});
