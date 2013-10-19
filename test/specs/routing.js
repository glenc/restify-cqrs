var expect  = require('chai').expect;
var restify = require('restify');
var config  = require('../config');

describe('routing', function() {

  describe('commands', function() {
    var client = restify.createJsonClient({
      url: 'http://localhost:' + config.web.port
    });

    it('has a route for each registered command', function(done) {
      client.head('/commands/test', function(err, req, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });

});
